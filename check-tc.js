const fs = require('fs');
const readline = require('readline');

async function checkArgs() {
  const fileStream = fs.createReadStream('C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('write_to_file')) {
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        if (tc.name === 'write_to_file') {
          console.log('Args keys:', Object.keys(tc.args));
          console.log('Sample args:', tc.args.TargetFile || tc.args.FilePath || tc.args.TargetFilePath || tc.args.Path);
          return;
        }
      }
    }
  }
}
checkArgs();
