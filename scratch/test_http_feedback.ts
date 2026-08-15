async function runTest() {
  try {
    const res = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aditya Web User ' + Date.now(),
        comment: 'Feedback ini terkirim sempurna dari website ke PostgreSQL!',
        rating: 5,
      }),
    });
    const json = await res.json();
    console.log('HTTP Status Code:', res.status);
    console.log('Response JSON:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    process.exit(0);
  }
}

runTest();
