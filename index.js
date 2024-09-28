// index.js
const joinContest = require('./joinContest');

async function simulateContest() {
  const users = Array.from({ length: 1000 }, (_, i) => i + 1); // Simulating 1000 users

  const promises = users.map((userId) => joinContest(userId));

  const results = await Promise.all(promises);
  console.log(results);
}

simulateContest();
