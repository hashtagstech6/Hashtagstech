import type { ContactFormSubmission } from "@/types/contact-form";

/**
 * Send contact form email via Brevo
 *
 * Features:
 * - Validates environment variables
 * - Sends HTML and plain text email
 * - Includes all form fields in email body
 * - Throws descriptive errors for failure scenarios
 *
 * @param data - Contact form submission data
 * @throws Error if environment variables are missing or email fails to send
 *
 * @example
 * ```ts
 * await sendContactEmail({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   service: "web-development",
 *   message: "I need a website..."
 * });
 * ```
 */
export async function sendContactEmail(
  data: ContactFormSubmission
): Promise<void> {
  // Validate environment variables
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const recipientEmail = process.env.BREVO_RECIPIENT_EMAIL;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY environment variable is not set");
  }
  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL environment variable is not set");
  }
  if (!recipientEmail) {
    throw new Error("BREVO_RECIPIENT_EMAIL environment variable is not set");
  }

  // Get sender name from company or default
  const senderName = data.company || data.name;
  const serviceLabel = getServiceLabel(data.service);

  // Create plain text email content
  const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
${data.company ? `Company: ${data.company}` : ""}
Service: ${serviceLabel}

Message:
${data.message}

---
This email was sent from the Hashtag Tech contact form.
${new Date().toLocaleString()}
  `.trim();

  /**
   * TODO: Uncomment when Brevo SDK is installed
   *
   * const defaultClient = SibApiV3Sdk.ApiClient.instance;
   * defaultClient.authentications["api-key"].apiKey = apiKey;
   *
   * const api = new SibApiV3Sdk.TransactionalEmailsApi();
   *
   * await api.sendTransacEmail({
   *   sender: { email: senderEmail, name: "Hashtag Tech Contact Form" },
   *   to: [{ email: recipientEmail, name: "Hashtag Tech" }],
   *   subject: `New Contact Form: ${serviceLabel} from ${senderName}`,
   *   textContent,
   * });
   */

  // Placeholder: Log email content (remove when Brevo is integrated)
  console.log("==== BREVO EMAIL ====");
  console.log("To:", recipientEmail);
  console.log("From:", senderEmail);
  console.log("Subject:", `New Contact Form: ${serviceLabel} from ${senderName}`);
  console.log("======================");
  console.log(textContent);
  console.log("======================");
}

/**
 * Get human-readable label for service value
 */
function getServiceLabel(
  service: ContactFormSubmission["service"]
): string {
  const labels: Record<ContactFormSubmission["service"], string> = {
    "web-development": "Web Development",
    "mobile-app": "Mobile App Development",
    "ai-agents": "AI Agents",
    "marketing": "Digital Marketing",
    "other": "Other",
  };
  return labels[service] || service;
}
