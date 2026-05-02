export function isSpam(data: { name: string; email: string; message: string }): boolean {
  // 1. Minimum word count in message
  const wordCount = data.message.trim().split(/\s+/).length;
  if (wordCount < 3) return true;

  // 2. Name entropy / randomness check
  
  // Check for numbers in name (real names rarely contain numbers)
  if (/\d/.test(data.name)) return true;
  
  // Check for lack of vowels (e.g. 'wgjrg')
  const hasNoVowels = !/[aeiouy]/i.test(data.name);
  if (hasNoVowels && data.name.length >= 3) return true;
  
  // Check for 4 or more consecutive consonants
  const consecutiveConsonants = /[bcdfghjklmnpqrstvwxz]{4,}/i.test(data.name);
  if (consecutiveConsonants) return true;

  // Specific check for bots generating 4-8 char single-word names with mixed cases
  if (/^[a-zA-Z0-9]{4,8}$/.test(data.name) && data.name.indexOf(' ') === -1) {
     // Count upper and lower cases
     const upperCount = (data.name.match(/[A-Z]/g) || []).length;
     const lowerCount = (data.name.match(/[a-z]/g) || []).length;
     
     // Bots often use random mixed cases like 'RLoM', 'ksDAn'
     // A valid single-word name usually has 1 uppercase (at start) or 0.
     // Some valid names might have 2 (e.g. MacDonald), but they are longer.
     if (upperCount >= 2 && lowerCount >= 1) {
        // Allow common patterns like MacDonald, O'Connor (though single word wouldn't have quotes)
        const isMac = /^Mac[A-Z][a-z]+$/.test(data.name);
        const isMc = /^Mc[A-Z][a-z]+$/.test(data.name);
        if (!isMac && !isMc) {
           return true;
        }
     }
  }

  // 3. Blocklist of disposable email domains
  const disposableDomains = [
    "mailinator.com", "guerrillamail.com", "10minutemail.com", 
    "tempmail.com", "yopmail.com", "throwawaymail.com", "temp-mail.org"
  ];
  const emailDomain = data.email.split('@')[1]?.toLowerCase();
  if (emailDomain && disposableDomains.includes(emailDomain)) return true;

  // 4. Keyword filter in message (if multiple spammy keywords are found)
  const spamKeywords = [
    "seo", "marketing", "rank", "page 1", "traffic", "leads", 
    "crypto", "bitcoin", "investment", "guaranteed", "casino"
  ];
  const lowerMessage = data.message.toLowerCase();
  const keywordHits = spamKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  // If we hit 2 or more spam keywords in a very short message, likely spam
  if (keywordHits >= 2 && wordCount < 30) return true;
  if (keywordHits >= 3) return true;

  return false;
}
