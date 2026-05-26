import { answerQuestion } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface QuestionRequest {
  question: string;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuestionRequest = await request.json();

    const { question, context } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (question.length < 5) {
      return NextResponse.json(
        { error: "Question must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (question.length > 5000) {
      return NextResponse.json(
        { error: "Question must be less than 5000 characters" },
        { status: 400 }
      );
    }

    const answer = await answerQuestion(question, context);

    return NextResponse.json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    console.error("Error answering question:", error);
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
}
