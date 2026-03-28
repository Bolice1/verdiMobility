import { sendWelcomeEmail } from './src/services/email.service.js';

console.log('Sending test email...');
try {
  await sendWelcomeEmail({ to: 'komezusengebolice@gmail.com', name: 'Bolice' });
  console.log('Test email sent successfully!');
  process.exit(0);
} catch (error) {
  console.error('Failed to send email:', error);
  process.exit(1);
}
