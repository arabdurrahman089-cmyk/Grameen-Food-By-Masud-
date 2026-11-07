async function check() {
  const res = await fetch('https://grameen-food-by-masud-three.vercel.app/assets/index-BX196-XL.js');
  const text = await res.text();
  console.log('Bundle length:', text.length);
  const supabaseMatches = text.match(/https:\/\/[a-zA-Z0-9_-]+\.supabase\.co/g);
  console.log('Supabase URL:', Array.from(new Set(supabaseMatches || [])));
  const githubMatches = text.match(/https:\/\/github\.com\/[a-zA-Z0-9_\-\/]+/g);
  console.log('GitHub URL:', Array.from(new Set(githubMatches || [])));
  
  // Find route paths
  const routeMatches = text.match(/(?:path|to|href):\s*["']([^"']+)["']/g);
  console.log('Sample routes:', Array.from(new Set(routeMatches || [])).slice(0, 30));

  // Search for admin references
  const adminMatches = text.match(/admin[a-zA-Z0-9_\-\/]*/gi);
  console.log('Admin matches count:', adminMatches ? adminMatches.length : 0);
  if (adminMatches) {
    console.log('Unique admin keywords:', Array.from(new Set(adminMatches)).slice(0, 30));
  }
}
check();
