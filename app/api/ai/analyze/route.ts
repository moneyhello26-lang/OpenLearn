
import { analyzeContent } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface AnalyzeRequest {
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeContent(content);

    if (analysis.error) {
      return NextResponse.json(
        { error: analysis.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing content:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
