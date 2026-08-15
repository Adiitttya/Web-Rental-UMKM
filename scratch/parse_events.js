const fs = require('fs');
const raw = fs.readFileSync('C:\\Users\\Aditya\\.gemini\\antigravity-ide\\brain\\d32e8e0c-3159-4ef7-b3b6-53bf227f350e\\.system_generated\\steps\\1663\\content.md', 'utf-8');
const jsonStart = raw.indexOf('{');
const json = raw.substring(jsonStart);
try {
  const data = JSON.parse(json);
  if (data.events) {
    console.log('📊 Verified API Response for Events:');
    data.events.forEach(e => {
      console.log(`Title: ${e.title}`);
      console.log(`  startDate: ${e.startDate ?? 'NULL'}`);
      console.log(`  endDate:   ${e.endDate ?? 'NULL'}`);
      console.log(`  linkUrl:   ${e.linkUrl ?? 'NULL'}`);
      console.log(`  eventDate: ${e.eventDate ?? 'NULL'}`);
      console.log('');
    });
  }
} catch(err) {
  console.error('Parse error:', err.message);
}
