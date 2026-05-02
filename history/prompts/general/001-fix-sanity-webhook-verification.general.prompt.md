---
# Prompt History Record

**ID:** 001
**TITLE:** Fix Sanity webhook signature verification
**STAGE:** general
**DATE_ISO:** 2026-02-09
**SURFACE:** agent
**MODEL:** claude-opus-4-6
**FEATURE:** none
**BRANCH:** master
**USER:** (user)

## COMMAND
Fix Sanity webhook 401 signature verification error

## LABELS
- webhook
- sanity
- signature-verification

## LINKS
- SPEC: null
- TICKET: null
- ADR: null
- PR: null

## FILES_YAML
- app/api/revalidate/route.ts
- package.json

## TESTS_YAML
- Deploy to Vercel and test webhook signature verification

## PROMPT_TEXT
User reported Sanity webhook failures with 401 errors. After confirming the secret matches in both Sanity dashboard and Vercel environment variables (IJXDibfilmZ3rCRFxYbkOTKSM7W2w37x7LfBto2FmbQ=), user asked to "search for the correct implementation using context 7 and tavily mcp" to find the proper signature verification pattern.

## RESPONSE_TEXT
Researched using Tavily MCP and found that Sanity provides an official @sanity/webhook package that should be used instead of manual HMAC verification. Updated the webhook route to:
1. Install @sanity/webhook package
2. Import isValidSignature and SIGNATURE_HEADER_NAME
3. Add readBody function for proper raw body reading
4. Use official isValidSignature() for verification

## OUTCOME
Updated app/api/revalidate/route.ts to use Sanity's official webhook package. Changed from manual HMAC-SHA256 verification to official package implementation. Pending deployment to Vercel for testing.

## EVALUATION
- Research completed using Tavily MCP
- Implementation pattern found from official Sanity documentation
- Code updated to use @sanity/webhook package
- Deployment required for validation
