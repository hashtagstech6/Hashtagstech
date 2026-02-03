"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Zod Schema for Booking Form
 */
const BookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;

/**
 * Booking Form Component (Short Form)
 *
 * Simplified form for quick lead capture in the modal.
 * Fields: Name, Email, Phone.
 */
export default function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "+1 ",
    },
  });

  const phoneValue = watch("phone");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Re-use the existing contact API route for simplicity, 
      // or create a new endpoint if different handling is needed.
      // We'll append a flag or note that this came from the "Booking" modal.
      const payload = {
        ...data,
        message: `[Quick Booking Request] Phone: ${data.phone}`,
        service: "other", // Default/Fallback
        company: "Not Provided",
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Submission failed");

      setSubmitStatus({
        type: "success",
        message: "Request received! We'll call you shortly.",
      });
      reset();
      
      // Optional callback to close modal after delay
      if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
      }

    } catch (error) {
      console.error("Booking error:", error);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={cn(
            "flex items-start gap-3 p-3 rounded-md text-sm",
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5" />
          )}
          <p>{submitStatus.message}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium mb-1.5">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="booking-name"
          placeholder="Full Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium mb-1.5">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="booking-email"
          type="email"
          placeholder="name@company.com"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Phone with Country Code */}
      <div>
        <label htmlFor="booking-phone" className="block text-sm font-medium mb-1.5">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          id="booking-phone"
          value={phoneValue}
          onChange={(val) => setValue("phone", val || "", { shouldValidate: true })}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Book Now"
        )}
      </Button>
      
      <p className="text-[10px] text-center text-muted-foreground">
        We respect your privacy. No spam.
      </p>
    </form>
  );
}
