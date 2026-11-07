const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('github.com') || line.includes('git clone') || line.includes('vercel') || line.includes('git remote')) {
      const parsed = JSON.parse(line);
      console.log('STEP', parsed.step_index, parsed.type);
      if (parsed.content) {
        const matches = parsed.content.match(/(https?:\/\/[^\s]+|git[^\n]+)/g);
        if (matches) console.log('Matches:', matches.slice(0, 5));
      }
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          console.log('Tool call:', tc.name, JSON.stringify(tc.arguments).slice(0, 200));
        }
      }
    }
  }
}

processLineByLine();
