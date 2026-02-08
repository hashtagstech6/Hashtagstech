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

  // Initialize Brevo API client
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(0, apiKey);

  // Send Admin Notification
  await sendAdminNotification(apiInstance, data, senderEmail, recipientEmail);

  // Send Customer Confirmation
  await sendCustomerConfirmation(apiInstance, data, senderEmail);
}

async function sendAdminNotification(
  apiInstance: TransactionalEmailsApi,
  data: ContactFormSubmission,
  senderEmail: string,
  recipientEmail: string
) {
  const senderName = data.company || data.name;
  const serviceLabel = getServiceLabel(data.service);

  // Admin Email Content (Full Details)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #BE3B43; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #BE3B43; }
        .message { margin-top: 20px; padding: 15px; background: white; border-left: 4px solid #BE3B43; }
        .footer { margin-top: 20px; padding: 10px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Lead: ${escapeHtml(serviceLabel)}</h2>
        </div>
        <div class="content">
          <div class="field"><span class="label">Name:</span> ${escapeHtml(data.name)}</div>
          <div class="field"><span class="label">Email:</span> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
          ${data.phone ? `<div class="field"><span class="label">Phone:</span> ${escapeHtml(data.phone)}</div>` : ""}
          ${data.company ? `<div class="field"><span class="label">Company:</span> ${escapeHtml(data.company)}</div>` : ""}
          <div class="field"><span class="label">Service:</span> ${escapeHtml(serviceLabel)}</div>
          <div class="message">
            <span class="label">Message:</span>
            <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p>Sent from Hashtag Tech Website • ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const smtpEmail = new SendSmtpEmail();
  smtpEmail.subject = `New Lead: ${serviceLabel} from ${senderName}`;
  smtpEmail.sender = { email: senderEmail, name: "Hashtag Tech Website" };
  smtpEmail.to = [{ email: recipientEmail, name: "Hashtag Tech Admin" }];
  smtpEmail.htmlContent = htmlContent;
  smtpEmail.replyTo = { email: data.email, name: data.name };

  try {
    await apiInstance.sendTransacEmail(smtpEmail);
    console.log("Admin notification sent successfully");
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    // Continue execution to try sending customer email even if admin fails (or throw depending on preference. usually better to log admin failure but ensure user gets feedback or vice versa. here we let it bubble if needed, but separate try/catch allows partial success if we wanted, but for now I'll let it throw to validat failure)
    throw error; 
  }
}

async function sendCustomerConfirmation(
  apiInstance: TransactionalEmailsApi,
  data: ContactFormSubmission,
  senderEmail: string
) {
  const serviceLabel = getServiceLabel(data.service);

  // Customer Email Content (Polite Confirmation)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #BE3B43; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #ffffff; text-align: center; }
        .button { display: inline-block; padding: 12px 24px; background-color: #BE3B43; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
        .footer { margin-top: 20px; padding: 10px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Message Received</h2>
        </div>
        <div class="content">
          <p>Hi <strong>${escapeHtml(data.name)}</strong>,</p>
          <p>Thank you for reaching out to Hashtag Tech regarding <strong>${escapeHtml(serviceLabel)}</strong>.</p>
          <p>We have received your message and our team will review it shortly. You can expect to hear from us within 24 hours.</p>
          <br>
          <p>Best regards,<br>The Hashtag Tech Team</p>
          <a href="https://hashtag-tech.vercel.app" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Hashtag Tech. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const smtpEmail = new SendSmtpEmail();
  smtpEmail.subject = `We've received your message - Hashtag Tech`;
  smtpEmail.sender = { email: senderEmail, name: "Hashtag Tech" };
  smtpEmail.to = [{ email: data.email, name: data.name }];
  smtpEmail.htmlContent = htmlContent;

  try {
    await apiInstance.sendTransacEmail(smtpEmail);
    console.log("Customer confirmation sent successfully");
  } catch (error) {
    console.error("Failed to send customer confirmation:", error);
    // valid to suppress this error so admin doesn't think the whole flow failed if just customer email bounced?
    // for now we will log it.
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
