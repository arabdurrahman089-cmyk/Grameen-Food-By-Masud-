async function checkUrl() {
  const res = await fetch('https://grameen-food-by-masud-three.vercel.app/assets/index-BX196-XL.js');
  const text = await res.text();
  const idx = text.indexOf('identifier:e,password:t');
  console.log(text.slice(idx - 300, idx + 100));
}
checkUrl();
