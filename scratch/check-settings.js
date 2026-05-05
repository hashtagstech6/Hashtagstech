const { getClient } = require("./sanity/lib/client");

async function checkSiteSettings() {
  const client = getClient();
  const docs = await client.fetch('*[_type == "siteSettings"]');
  console.log("Found siteSettings documents:", docs.length);
  docs.forEach(doc => {
    console.log(`ID: ${doc._id}, Platform:`, doc.socialLinks?.map(s => s.platform));
  });
}

checkSiteSettings();
