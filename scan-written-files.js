const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name.includes('write')) {
            console.log('Keys:', Object.keys(tc.arguments), JSON.stringify(tc.arguments).slice(0, 120));
            return;
          }
        }
      }
    } catch(e) {}
  }
}

processLineByLine();
