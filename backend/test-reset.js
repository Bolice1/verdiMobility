import { requestPasswordReset } from './src/services/auth.service.js';
import * as userModel from './src/models/user.model.js';

async function main() {
  try {
    const user = await userModel.findUserByEmail('komezusengebolice@gmail.com');
    console.log('findUserByEmail Result:', user);
    
    const res = await requestPasswordReset({ email: 'komezusengebolice@gmail.com' });
    console.log('Result:', res);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setTimeout(async () => {
       try {
           const { closePool } = await import('./src/config/database.js');
           await closePool();
       } catch (e) {}
       process.exit(0);
    }, 10000);
  }
}

main();
