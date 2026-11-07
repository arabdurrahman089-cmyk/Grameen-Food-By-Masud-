async function checkApi() {
  const res = await fetch('https://grameen-food-by-masud-three.vercel.app/assets/index-BX196-XL.js');
  const text = await res.text();
  
  // Find fetch or axios calls or API endpoints
  const matches = text.match(/https?:\/\/[^\s"'`]+|\/api\/[a-zA-Z0-9_\-\/]+/g);
  console.log('Matches:', Array.from(new Set(matches || [])).slice(0, 30));

  // Search for the error string or error handler
  const errIdx = text.indexOf('সার্ভারে সংযোগ করা সম্ভব হয়নি');
  if (errIdx !== -1) {
    console.log('Context around error string:', text.slice(Math.max(0, errIdx - 300), Math.min(text.length, errIdx + 300)));
  }
}
checkApi();
