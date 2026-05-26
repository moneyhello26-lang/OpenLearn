import { findUniversities } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { gpa, sat, ielts, specialization, countryPreference } = body;

    // Validate required fields
    if (!gpa || !specialization) {
      return NextResponse.json(
        { error: "GPA and specialization are required" },
        { status: 400 }
      );
    }

    // Validate GPA range
    if (gpa < 0 || gpa > 4.0) {
      return NextResponse.json(
        { error: "GPA must be between 0 and 4.0" },
        { status: 400 }
      );
    }

    const recommendations = await findUniversities({
      gpa,
      sat,
      ielts,
      specialization,
      countryPreference,
    });

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Error in university recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
