// joinContest.js
const pool = require('./db');

async function joinContest(userId) {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Set isolation level to serializable
    await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    // await client.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');


    // Check current number of participants
    const res = await client.query('SELECT COUNT(*) FROM contest');
    const participantCount = parseInt(res.rows[0].count, 10);

    if (participantCount >= 2) {
      console.log('Contest full');
      await client.query('ROLLBACK');
      return 'Contest is already full';
    }

    // Insert participant
    await client.query('INSERT INTO contest (user_id) VALUES ($1)', [userId]);

    // Commit transaction
    await client.query('COMMIT');
    console.log(`User ${userId} joined the contest!`);
    return `User ${userId} joined the contest`;
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error joining contest:', error);
    return 'Failed to join contest';
  } finally {
    client.release();
  }
}

module.exports = joinContest;
