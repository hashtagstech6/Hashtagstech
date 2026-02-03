import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/types/contact-form";
import type { ContactFormResponse, ContactFormError } from "@/types/contact-form";
import { sendContactEmail } from "@/lib/brevo";

/**
 * POST /api/contact
 *
 * Contact form submission endpoint with Zod validation and Brevo email integration.
 *
 * Request Body:
 * {
 *   name: string (min 2 chars)
 *   email: string (valid email)
 *   phone?: string
 *   company?: string
 *   service: "web-development" | "mobile-app" | "ai-agents" | "marketing" | "other"
 *   message: string (10-5000 chars)
 * }
 *
 * Responses:
 * - 200: Success
 * - 400: Validation error
 * - 500: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = ContactFormSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors with proper structure
      const errors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const path = error.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      });

      const errorResponse: ContactFormError = {
        error: "Validation failed",
        details: errors,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const data = validationResult.data;

    // Send email via Brevo
    await sendContactEmail(data);

    // Success response
    const successResponse: ContactFormResponse = {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    // Log error for frontend error logging (NFR-009)
    console.error("Contact form API error:", error);

    const errorResponse: ContactFormError = {
      error: "Internal server error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
