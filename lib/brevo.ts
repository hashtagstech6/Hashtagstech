import type { ContactFormSubmission } from "@/types/contact-form";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

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

  // Create HTML email content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F26B6B; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #F26B6B; }
    .message { margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #F26B6B; }
    .footer { margin-top: 20px; padding: 10px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${escapeHtml(data.name)}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
      </div>
      ${data.phone ? `
      <div class="field">
        <span class="label">Phone:</span> ${escapeHtml(data.phone)}
      </div>
      ` : ""}
      ${data.company ? `
      <div class="field">
        <span class="label">Company:</span> ${escapeHtml(data.company)}
      </div>
      ` : ""}
      <div class="field">
        <span class="label">Service:</span> ${escapeHtml(serviceLabel)}
      </div>
      <div class="message">
        <span class="label">Message:</span>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent from the Hashtag Tech contact form.</p>
      <p>${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Initialize Brevo API client
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(0, apiKey);

  // Create email message
  const smtpEmail = new SendSmtpEmail();
  smtpEmail.subject = `New Contact Form: ${serviceLabel} from ${senderName}`;
  smtpEmail.sender = { email: senderEmail, name: "Hashtag Tech Contact Form" };
  smtpEmail.to = [{ email: recipientEmail, name: "Hashtag Tech" }];
  smtpEmail.textContent = textContent;
  smtpEmail.htmlContent = htmlContent;
  smtpEmail.replyTo = { email: data.email, name: data.name };

  // Add sender's email to CC for notification
  smtpEmail.cc = [{ email: data.email, name: data.name }];

  // Send the email
  try {
    await apiInstance.sendTransacEmail(smtpEmail);
    console.log("Email sent successfully via Brevo");
  } catch (error) {
    console.error("Brevo API error:", error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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
