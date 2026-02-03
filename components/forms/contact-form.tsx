"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ContactFormData } from "@/types/contact-form";
import { ContactFormSchema } from "@/types/contact-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Service options for the dropdown
 */
const SERVICE_OPTIONS = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "ai-agents", label: "AI Agents" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "other", label: "Other" },
] as const;

/**
 * Contact Form Component
 *
 * Features:
 * - Zod validation for all fields
 * - Inline error display
 * - Success message on valid submission
 * - Preserves entered data on validation failure
 * - Accessible form with proper labels and ARIA
 *
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onBlur", // Validate on field blur
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "web-development",
      message: "",
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      // Success
      setSubmitStatus({
        type: "success",
        message:
          result.message ||
          "Thank you for your message! We'll get back to you soon.",
      });
      reset(); // Clear form on success
    } catch (error) {
      // Error - log to console for frontend error logging (NFR-009)
      console.error("Contact form submission error:", error);

      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate // Disable browser validation to use Zod
    >
      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
          role="alert"
          aria-live="polite"
        >
          {submitStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Name Field (Required) */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Your full name"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(
            errors.name &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
          )}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p
            id="name-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field (Required, Validated) */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(
            errors.email &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
          )}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Phone <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          {...register("phone")}
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Company Field (Optional) */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Company <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="company"
          type="text"
          placeholder="Your company name"
          {...register("company")}
          aria-invalid={errors.company ? "true" : "false"}
          aria-describedby={errors.company ? "company-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.company && (
          <p
            id="company-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.company.message}
          </p>
        )}
      </div>

      {/* Service Field (Dropdown) */}
      <div>
        <label
          htmlFor="service"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Service <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="service"
          {...register("service")}
          aria-invalid={errors.service ? "true" : "false"}
          aria-describedby={errors.service ? "service-error" : undefined}
          className={cn(
            "w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors",
            errors.service &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
          )}
          disabled={isSubmitting}
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service && (
          <p
            id="service-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.service.message}
          </p>
        )}
      </div>

      {/* Message Field (Required, max 5000 chars) */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-surface-foreground mb-2"
        >
          Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          maxLength={5000}
          {...register("message")}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className={cn(
            "w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-y",
            errors.message &&
              "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
          )}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message ? (
            <p
              id="message-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {errors.message.message}
            </p>
          ) : (
            <p id="message-hint" className="text-sm text-muted-foreground">
              Please provide at least 10 characters
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      {/* Form Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to our privacy policy. We'll only
        contact you regarding your inquiry.
      </p>
    </form>
  );
}

export default ContactForm;
