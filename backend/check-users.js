import { pool } from './src/database/pool.js';

async function main() {
  const { rows } = await pool.query('SELECT id, name, email, role FROM users');
  console.log('Users in DB:');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
