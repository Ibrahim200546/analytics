async function poll() {
  for (let i = 0; i < 24; i++) {
    try {
      const res = await fetch('https://ismi-analytics.vercel.app/api/organization-accounts');
      console.log(`[${i * 5}s] /api/organization-accounts status: ${res.status}`);
      if (res.status === 200) {
        console.log('DEPLOYED SUCCESSFULLY!');
        const data = await res.json();
        console.log('Response sample:', data);
        return;
      }
    } catch (e) {
      console.log(`[${i * 5}s] fetch error:`, e.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}
poll();
