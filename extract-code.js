const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function extractPreviousFiles() {
  const fileStream = fs.createReadStream('C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const outDir = 'c:\\Users\\lenovo\\Documents\\Grameen food by MASUD\\prev_source';
  let fileCount = 0;

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          const args = tc.args || tc.arguments || {};
          const filePath = args.TargetFile || args.Path || args.path || args.target_file;
          const content = args.CodeContent || args.Content || args.content || args.code_content;
          if (filePath && content) {
            // Keep relative path under "Grameen food by MASUD"
            let relPath = filePath;
            const marker = 'Grameen food by MASUD\\';
            const idx = filePath.indexOf(marker);
            if (idx !== -1) {
              relPath = filePath.substring(idx + marker.length);
            } else {
              relPath = path.basename(filePath);
            }
            if (!relPath.endsWith('.log')) {
              const dest = path.join(outDir, relPath);
              fs.mkdirSync(path.dirname(dest), { recursive: true });
              fs.writeFileSync(dest, content, 'utf8');
              fileCount++;
              console.log('Saved:', relPath);
            }
          }
        }
      }
    } catch(e) {}
  }
  console.log(`Extracted ${fileCount} files successfully to ${outDir}!`);
}

extractPreviousFiles();
