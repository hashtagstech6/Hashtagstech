---
name: brevo-email
description: |
  Set up and integrate Brevo email service for transactional emails, marketing campaigns,
  and contact forms. This skill should be used when users ask to implement email functionality,
  configure Brevo, create email templates, set up webhooks, or authenticate sender domains.
---

# Brevo Email Setup

Comprehensive guide for implementing Brevo email service with TypeScript/Node.js.

## Version Compatibility

| Package | Tested Version | Minimum Version | Notes |
|---------|----------------|-----------------|-------|
| `@getbrevo/brevo` | 2.5.0 | 2.0.0 | Breaking changes before v2.0 |
| Node.js | 20.x | 18.x | Uses `crypto` for webhook verification |
| Next.js | 14.2.0 | 13.x | App Router patterns |
| TypeScript | 5.x | 5.x | Uses `Record<string, any>` type |

> **Note**: This skill was developed and tested with the current project stack. Other versions may require adjustments.

## What This Skill Does
- Set up Brevo API integration with proper authentication
- Configure sender domain authentication (SPF, DKIM, DMARC)
- Implement transactional emails with templates
- Create marketing campaign integrations
- Build contact form email handlers
- Configure webhook event tracking
- Generate production-ready email code

## What This Skill Does NOT Do
- Create Brevo account (user must sign up at app.brevo.com)
- Design email HTML templates visually (use Brevo dashboard)
- Handle email marketing strategy/strategy consulting
- Replace dedicated email marketing platforms for complex campaigns
- Manage Brevo billing/credits

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing email implementations, environment patterns, API route structure |
| **Conversation** | Email type (transactional/marketing), recipient volume, template needs |
| **Skill References** | Brevo API patterns, best practices, anti-patterns from `references/` |
| **User Guidelines** | Project environment variables, sender domain, compliance requirements |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

---

## Required Clarifications

Ask about USER'S context (not domain knowledge):

1. **Email types**: "Which email types do YOU need - transactional (order confirmations, password resets), marketing (newsletters, promotions), contact form, or all?"

2. **Tech stack**: "What's YOUR environment - Next.js API routes, FastAPI backend, serverless functions, or other?"

3. **Existing setup**: "Do YOU already have a Brevo account, API key, and verified sender domain?"

4. **Volume**: "What's YOUR expected email volume - under 300/day (free tier), or higher?"

---

## External Setup Guide

Follow these steps in the Brevo dashboard before code implementation:

### Step 1: Create Brevo Account

1. Go to https://app.brevo.com and sign up
2. Verify your email address
3. Complete account setup

### Step 2: Generate API Key

1. Click your profile dropdown (top-right)
2. Navigate to **Settings > SMTP & API > API Keys**
3. Click **Generate a new API key**
4. Name it descriptively (e.g., "Production - MyApp")
5. Copy and store securely - **you won't see it again**
6. Add to your environment variables:

```bash
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
```

### Step 3: Register and Verify Sender Domain

**Critical**: As of Feb 2024, Gmail/Yahoo require domain authentication for all bulk senders.

1. Go to **Settings > Senders > Senders & Domains**
2. Click **New Sender** > **Domain**
3. Enter your domain (e.g., `hashtagstech.com`)
4. Add DNS records to your domain provider:
   - **SPF record**: Authorizes Brevo to send for your domain
   - **DKIM 1 & DKIM 2**: Digital signatures for email verification
   - **Brevo Code**: Additional verification

**Your DNS records should look like:**
```
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all

Type: TXT
Name: brevo._domainkey
Value: [DKIM 1 value from Brevo]

Type: TXT
Name: brevo2._domainkey
Value: [DKIM 2 value from Brevo]
```

5. Click **Verify** in Brevo dashboard (may take 15-60 minutes to propagate)

### Step 4: Create Email Templates (Optional but Recommended)

1. Go to **Campaigns > Transactional > Templates**
2. Click **Create Template**
3. Design your email or start with a template
4. Add personalization variables using `{{variable}}` syntax:
   - `{{params.firstname}}` - First name
   - `{{params.order_id}}` - Order ID
   - `{{params.confirmation_link}}` - Action links
5. Click **Save & Activate**
6. Note the **Template ID** for API usage

### Step 5: Configure Webhooks (Optional)

1. Go to **Campaigns > Transactional > Settings > Webhooks**
2. Click **Add a New Webhook**
3. Enter your webhook endpoint URL
4. Select events to track:
   - `delivered` - Email reached inbox
   - `opened` - Recipient opened email
   - `clicked` - Link clicked
   - `bounce` - Email bounced
   - `spam` - Marked as spam
5. Click **Save**

---

## Implementation Workflow

### 1. Install SDK [Beginner]

```bash
npm install @getbrevo/brevo
```

### 2. Configure Environment Variables [Beginner]

```bash
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Your Company
```

### 3. Create Brevo Client Module [Beginner]

```typescript
// lib/brevo.ts
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

const apiInstance = new TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) throw new Error('BREVO_API_KEY not set');
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
export { apiInstance, SendSmtpEmail };
```

### 4. Send Email Patterns [Beginner]

**Direct HTML:**
```typescript
export async function sendDirectEmail(to: string, subject: string, html: string) {
  const email = new SendSmtpEmail();
  email.sender = { email: process.env.BREVO_SENDER_EMAIL!, name: process.env.BREVO_SENDER_NAME! };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;
  return await apiInstance.sendTransacEmail(email);
}
```

**Template-Based:**
```typescript
export async function sendTemplateEmail(to: string, templateId: number, params: Record<string, any>) {
  const email = new SendSmtpEmail();
  email.to = [{ email: to }];
  email.templateId = templateId;
  email.params = params;
  return await apiInstance.sendTransacEmail(email);
}
```

### 5. Next.js API Route [Beginner]

```typescript
// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const { email, templateId, params } = await request.json();
    const messageId = await sendTemplateEmail(email, templateId, params);
    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

---

## Common Scenarios

### Contact Form with Auto-Reply [Intermediate]

```typescript
export async function handleContactForm(data: { name: string; email: string; message: string }) {
  const adminEmail = new SendSmtpEmail();
  adminEmail.sender = { email: process.env.BREVO_SENDER_EMAIL! };
  adminEmail.to = [{ email: process.env.ADMIN_EMAIL! }];
  adminEmail.subject = `Contact: ${data.name}`;
  adminEmail.htmlContent = `<h2>New Submission</h2><p>From: ${data.name}</p><p>${data.message}</p>`;

  const autoReply = new SendSmtpEmail();
  autoReply.sender = { email: process.env.BREVO_SENDER_EMAIL! };
  autoReply.to = [{ email: data.email, name: data.name }];
  autoReply.subject = 'Thanks for reaching out!';
  autoReply.htmlContent = `<h2>Thanks ${data.name}!</h2><p>We'll respond within 24 hours.</p>`;

  await Promise.all([apiInstance.sendTransacEmail(adminEmail), apiInstance.sendTransacEmail(autoReply)]);
}
```

### Email with Attachments [Intermediate]

```typescript
export async function sendWithAttachment(to: string, subject: string, html: string, attachmentUrl: string) {
  const email = new SendSmtpEmail();
  email.sender = { email: process.env.BREVO_SENDER_EMAIL! };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;
  email.attachment = [{ url: attachmentUrl, name: 'document.pdf' }];
  await apiInstance.sendTransacEmail(email);
}
```

### Batch Sending with Scheduling [Advanced]

```typescript
export async function scheduleBatchEmails(recipients: Array<{ email: string; name?: string }>, templateId: number, scheduledAt: Date) {
  const email = new SendSmtpEmail();
  email.templateId = templateId;
  email.scheduledAt = scheduledAt.toISOString();
  email.messageVersions = recipients.map(r => ({ to: [{ email: r.email, name: r.name }] }));
  await apiInstance.sendTransacEmail(email);
}
```

---

## Email Templates Reference

**Template Variables:** Use `{{params.key}}` for personalization

**Welcome Email:** `{{params.firstname}}`, `{{params.company_name}}`, `{{params.confirmation_url}}`

**Order Confirmation:** `{{params.order_id}}`, `{{params.customer_name}}`, `{{params.total}}`, `{{params.tracking_url}}`

**Password Reset:** `{{params.firstname}}`, `{{params.reset_link}}`

**Contact Notification:** `{{params.name}}`, `{{params.email}}`, `{{params.subject}}`, `{{params.message}}`

> Full HTML templates available in `assets/templates/`

---

## Domain Standards

### Must Follow

- **Domain Authentication**: Set up SPF, DKIM, DMARC records (mandatory since Feb 2024)
- **API Key Security**: Never commit API keys, use environment variables
- **HTML Escaping**: Escape user-provided content to prevent XSS in emails
- **Error Handling**: Always wrap email calls in try/catch and log errors
- **Reply-To**: Set proper reply-to addresses for transactional emails
- **Unsubscribe**: Include unsubscribe links in marketing emails

### Must Avoid

- ❌ Using free email domains (Gmail, Yahoo) as senders
- ❌ Hardcoding API keys in source code
- ❌ Sending unescaped user content in HTML emails
- ❌ Ignoring bounce/complaint webhooks
- ❌ Sending marketing emails without unsubscribe links
- ❌ Exceeding rate limits (300/day free tier)

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct Approach |
|--------------|----------------|------------------|
| Sending synchronous during request | Blocks response, timeout risk | Queue/background job |
| No error handling | Silent failures, no retry logic | Try/catch with logging |
| Reusing API client incorrectly | Memory leaks, stale auth | Singleton pattern |
| HTML without text version | Spam filters flag it | Include `textContent` |
| Not validating emails | Bounces hurt reputation | Validate before sending |
| Missing domain authentication | Emails go to spam | Set up SPF/DKIM/DMARC |

---

## Error Handling

```typescript
export async function sendEmailWithErrorHandling(to: string, subject: string, html: string) {
  try {
    const result = await apiInstance.sendTransacEmail({
      sender: { email: process.env.BREVO_SENDER_EMAIL! },
      to: [{ email: to }],
      subject,
      htmlContent: html
    });
    return { success: true, messageId: result.body.messageId };
  } catch (error: any) {
    // Brevo API error structure
    if (error.response?.body) {
      console.error('Brevo API error:', error.response.body);
      return {
        success: false,
        error: error.response.body.message,
        code: error.response.body.code
      };
    }
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unknown error' };
  }
}
```

---

## Testing Email Sending

```typescript
// Test endpoint for development
// app/api/test-email/route.ts
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const result = await apiInstance.sendTransacEmail({
      sender: { email: process.env.BREVO_SENDER_EMAIL! },
      to: [{ email: 'test@example.com' }],
      subject: 'Test Email from Brevo',
      htmlContent: '<h1>Success!</h1><p>If you see this, Brevo is working.</p>'
    });

    return NextResponse.json({ success: true, messageId: result.body.messageId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
```

---

## Known Working Configurations

### Configuration 1: Next.js 14 App Router (Current Project)
```bash
# package.json dependencies
"@getbrevo/brevo": "^2.5.0"
"next": "^14.2.0"
"typescript": "^5"
```

```typescript
// lib/brevo.ts - Verified working pattern
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

const apiInstance = new TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) throw new Error('BREVO_API_KEY not set');
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
export { apiInstance, SendSmtpEmail };
```

### Configuration 2: Environment Variables (Verified)
```bash
# .env.local or .env.production
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=noreply@hashtagstech.com
BREVO_SENDER_NAME=Hashtag Tech
BREVO_RECIPIENT_EMAIL=admin@hashtagstech.com
```

### Configuration 3: DNS Records (Brevo-specific)
```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all

# DKIM 1
Type: TXT
Name: brevo._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...

# DKIM 2
Type: TXT
Name: brevo2._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

---

## Output Checklist

Before delivering Brevo email integration, verify:

- [ ] Brevo account created and API key generated
- [ ] Environment variables configured (BREVO_API_KEY, BREVO_SENDER_EMAIL)
- [ ] Sender domain authenticated (SPF, DKIM, DMARC records added)
- [ ] @getbrevo/brevo package installed (verified: ^2.5.0)
- [ ] Brevo client module created with proper error handling
- [ ] Email templates created in Brevo dashboard (if using templates)
- [ ] API routes implemented for email sending
- [ ] HTML content escaped for user-provided data
- [ ] Test endpoint created for development verification
- [ ] Webhook endpoint configured (if tracking events)
- [ ] Reply-to addresses set correctly
- [ ] Marketing emails include unsubscribe links
- [ ] Rate limits considered in implementation

---

## Acceptance Tests

Verify integration with these test cases:

### Test 1: Basic Email Send [Beginner]
```typescript
// app/api/test-email/route.ts
import { apiInstance } from '@/lib/brevo';

export async function GET() {
  const result = await apiInstance.sendTransacEmail({
    sender: { email: process.env.BREVO_SENDER_EMAIL! },
    to: [{ email: 'test@example.com' }],
    subject: 'Test Email',
    htmlContent: '<h1>Success!</h1>'
  });

  // Assert: messageId is returned
  if (!result.body.messageId) {
    throw new Error('No messageId returned');
  }
  return Response.json({ success: true, messageId: result.body.messageId });
}
```

### Test 2: Template Email Send [Intermediate]
```typescript
async function testTemplateEmail() {
  const result = await apiInstance.sendTransacEmail({
    to: [{ email: 'test@example.com' }],
    templateId: 1, // Use your template ID
    params: { firstname: 'Test', company: 'Test Company' }
  });

  // Assert: messageId exists, params are replaced
  console.assert(result.body.messageId, 'Template send failed');
}
```

### Test 3: Error Handling [Intermediate]
```typescript
async function testErrorHandling() {
  try {
    await apiInstance.sendTransacEmail({
      sender: { email: 'invalid@example.com' }, // Unverified sender
      to: [{ email: 'test@example.com' }],
      subject: 'Test'
    });
  } catch (error: any) {
    // Assert: Proper error structure
    console.assert(
      error.response?.body?.code || error.response?.body?.message,
      'Error should have Brevo structure'
    );
  }
}
```

### Test 4: Batch Send [Advanced]
```typescript
async function testBatchSend() {
  const recipients = [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
    { email: 'user3@example.com' }
  ];

  const result = await apiInstance.sendTransacEmail({
    templateId: 1,
    messageVersions: recipients.map(r => ({
      to: [{ email: r.email }]
    }))
  });

  // Assert: Batch processed
  console.assert(result.body.messageId, 'Batch send failed');
}
```

---

## Related Skills

Connect these skills for complete email functionality:

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **frontend-designer** | Design email HTML templates with responsive layouts | Creating custom email designs |
| **deployment-engineer** | Deploy email API routes to production (Vercel, Docker) | Going live with email integration |
| **sanity-integration** | Store email templates/content in CMS | Dynamic email content management |
| **web-design-guidelines** | Review email HTML for accessibility/compliance | Ensuring email compatibility |
| **ux-evaluator** | Evaluate email user experience and readability | Improving engagement rates |

---

## Complexity Indicators

- **[Beginner]** - Basic setup, single email send, environment configuration
- **[Intermediate]** - Templates, error handling, contact forms, attachments
- **[Advanced]** - Batch sending, webhooks, scheduling, custom authentication

Look for these markers to gauge implementation complexity.

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/api-endpoints.md` | API reference for all Brevo email endpoints |
| `references/best-practices.md` | Deliverability, security, and performance guidelines |
| `references/webhooks.md` | Webhook event types and payload structures |
| `references/troubleshooting.md` | Common errors and solutions |
| `assets/templates/` | Ready-to-use email HTML templates |

---

## Official Documentation

| Resource | URL | Use For |
|----------|-----|---------|
| API Documentation | https://developers.brevo.com | Complete API reference |
| Email Templates Guide | https://help.brevo.com/hc/en-us/articles/360000946299 | Personalization variables |
| Domain Authentication | https://help.brevo.com/hc/en-us/articles/12163873383186 | SPF/DKIM/DMARC setup |
| Webhooks Guide | https://developers.brevo.com/docs/how-to-use-webhooks | Event tracking |
| Node.js SDK | https://github.com/getbrevo/brevo-node | TypeScript examples |
