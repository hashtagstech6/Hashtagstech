import { z } from "zod";

/**
 * Contact form submission interface
 */
export interface ContactFormSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: "web-development" | "mobile-app" | "ai-agents" | "marketing" | "other";
  message: string;
}

/**
 * Zod validation schema for contact form
 * Runtime validation for form submissions
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.enum(
    ["web-development", "mobile-app", "ai-agents", "marketing", "other"],
    {
      errorMap: () => ({ message: "Please select a service" }),
    }
  ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),
});

/**
 * Infer TypeScript type from Zod schema
 */
export type ContactFormData = z.infer<typeof ContactFormSchema>;

/**
 * API response interface for contact form submission
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * API error response interface
 */
export interface ContactFormError {
  error: string;
  details?: Record<string, string[]>;
}
