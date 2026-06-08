/**
 * Central AI response cleaner.
 * Removes thinking blocks, chain-of-thought artifacts, planning outlines,
 * self-corrections, checklists, and formatting junk from AI model outputs.
 * 
 * Works with: Gemma, Gemini, and other models that leak reasoning into output.
 * No external dependencies — safe to import client-side and server-side.
 */

export function cleanAIResponse(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: XML-STYLE THINKING BLOCKS
  // ═══════════════════════════════════════════════════════════════
  const xmlTags = [
    'think', 'thinking', 'reasoning', 'scratchpad',
    'internal', 'reflection', 'thought', 'draft',
    'inner_monologue', 'planning', 'analysis',
  ];
  for (const tag of xmlTags) {
    cleaned = cleaned.replace(new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>\\s*`, 'gi'), '');
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: FENCED CODE BLOCK THINKING
  // ═══════════════════════════════════════════════════════════════
  cleaned = cleaned.replace(
    /```(?:thinking|reasoning|scratchpad|internal_monologue|planning|draft)[\s\S]*?```\s*/gi,
    ''
  );

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: FULL-SECTION MARKERS (cut everything before marker)
  // ═══════════════════════════════════════════════════════════════

  // "---FINAL_ANSWER---" — take only what's after
  if (cleaned.includes('---FINAL_ANSWER---')) {
    cleaned = cleaned.split('---FINAL_ANSWER---').pop()!.trim();
  }

  // "(Proceed to output)" / "(Output)" / "(Begin output)" — take only what's after
  const proceedMatch = cleaned.match(
    /\((?:Proceed to output|Output|Begin output|Start output|Final output|Начать вывод|Вывод)\)\.?\s*/i
  );
  if (proceedMatch && proceedMatch.index !== undefined) {
    cleaned = cleaned.slice(proceedMatch.index + proceedMatch[0].length);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: GEMMA PLAIN-TEXT THINKING PATTERNS
  // These models dump chain-of-thought as plain text without tags
  // ═══════════════════════════════════════════════════════════════

  // "Constraint Checklist & Confidence Score: ..." block (may span multiple lines)
  cleaned = cleaned.replace(
    /Constraint Checklist[\s\S]*?Confidence Score:\s*\d+\/\d+\.?\s*/gi,
    ''
  );

  // "User asks: ..." meta-description lines
  cleaned = cleaned.replace(/^User asks:.*$/gim, '');

  // Self-correction / self-assessment lines
  cleaned = cleaned.replace(/^Self-Correction[^]*?$/gim, '');
  cleaned = cleaned.replace(/^Self-Assessment[^]*?$/gim, '');

  // Standalone "Confidence Score: N/N" lines
  cleaned = cleaned.replace(/^\s*Confidence Score:\s*\d+\/\d+.*$/gim, '');

  // Verification checklist lines: "No internal thoughts? Check." etc.
  cleaned = cleaned.replace(
    /^\s*(?:No\s+(?:internal\s+thoughts|scratchpad|bullet\s+points|English|drafting))\??\s*(?:Check|Yes|✓|✔)\.?\s*$/gim,
    ''
  );
  cleaned = cleaned.replace(
    /^\s*(?:Direct\s+output|Start\s+immediately|Only\s+final\s+response)\??\s*(?:Check|Yes|✓|✔)\.?\s*$/gim,
    ''
  );

  // Numbered meta-checklist items:
  // "1. No internal thoughts/reasoning? Yes."
  // "5. Direct output ONLY the final response? Yes."
  cleaned = cleaned.replace(
    /^\s*\d+\.\s*(?:No\s+(?:internal|scratchpad|bullet|English)|Direct\s+output|Start\s+immediately|Only\s+final).*?(?:Yes|No|Check|✓|✔)\.?\s*$/gim,
    ''
  );

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: PLANNING / OUTLINE ARTIFACTS
  // Short single-line labels that are part of draft outlines
  // ═══════════════════════════════════════════════════════════════

  // Essay planning labels: "Introduction: ...", "Body Paragraph 1: ...", "Conclusion: ..."
  cleaned = cleaned.replace(
    /^\s*(?:Body Paragraph\s*\d*|Introduction|Conclusion|Summary|Thesis Statement)\s*:\s*.{0,300}$/gim,
    ''
  );

  // Draft outline labels when they appear as short single-line annotations
  // (only match short lines <200 chars to avoid removing legitimate content)
  cleaned = cleaned.replace(
    /^\s*(?:Definition|Evolution|Function|Metaphorical meaning|Key (?:points|ideas|themes)|Outline|Structure|Plan|Draft|Notes)\s*:\s*.{0,200}$/gim,
    ''
  );

  // "Title: ..." when it's a planning label (followed by parenthetical English translation)
  cleaned = cleaned.replace(
    /^\s*Title\s*:\s*.+\(.+\)\s*\.?\s*$/gim,
    ''
  );

  // "Text: " prefix at the start of content (model labels its own output)
  cleaned = cleaned.replace(/^\s*Text:\s*/im, '');

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: COMMON THINKING PREFIXES
  // ═══════════════════════════════════════════════════════════════
  cleaned = cleaned.replace(
    /^(?:Thinking:|Reasoning:|Let me think|Hmm,\s|Wait,\s|Actually,\s|Internal thought:|My reasoning:|Draft:|Let me analyze|Let me consider|I need to|First,?\s+(?:I'll|let me)|OK(?:ay)?,?\s+(?:so|let me)).*$/gim,
    ''
  );

  // ═══════════════════════════════════════════════════════════════
  // PHASE 7: FORMATTING CLEANUP
  // ═══════════════════════════════════════════════════════════════

  // Excessive asterisks (*** or more)
  cleaned = cleaned.replace(/\*{3,}/g, '');

  // Lines with only "**"
  cleaned = cleaned.replace(/^\*\*\s*$/gm, '');

  // Emoji-only thinking indicator lines
  cleaned = cleaned.replace(/^[🤔💭🧠⚙️🔄✅☑️]+\s*$/gm, '');

  // Normalize excessive blank lines (3+ → 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim
  cleaned = cleaned.trim();

  return cleaned;
}
