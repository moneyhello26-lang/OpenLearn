import { generateDescription } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

interface DescriptionRequest {
  title: string;
  subject: string;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DescriptionRequest = await request.json();

    const { title, subject, context } = body;

    if (!title || !subject) {
      return NextResponse.json(
        { error: "Title and subject are required" },
        { status: 400 }
      );
    }

    const description = await generateDescription(title, subject, context);

    return NextResponse.json({
      success: true,
      data: {
        title,
        subject,
        description,
      },
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
