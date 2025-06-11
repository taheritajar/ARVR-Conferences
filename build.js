const fs = require('fs');

// Get the API key from environment variables
const apiKey = process.env.NEWSAPI_KEY;

if (!apiKey) {
    console.error('ERROR: NEWSAPI_KEY environment variable is not set');
    process.exit(1);
}

// Read the original script.js
const originalScript = fs.readFileSync('script.js', 'utf8');

// Replace the placeholder with the actual API key
const updatedScript = originalScript.replace('YOUR_NEWSAPI_KEY', apiKey);

// Write the updated script
fs.writeFileSync('script.js', updatedScript);
console.log('Script updated with API key');
