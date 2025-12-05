/**
 * Password Hash Generator for Admin Panel
 * 
 * This script generates a secure SHA-256 hash of your admin password.
 * 
 * Usage:
 *   node generate-password-hash.js
 * 
 * Then copy the generated hash to .env.local file:
 *   REACT_APP_ADMIN_PASSWORD_HASH=your_generated_hash_here
 */

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n========================================');
console.log('  Admin Password Hash Generator');
console.log('========================================\n');

rl.question('Enter your new admin password: ', (password) => {
  
  if (!password || password.length < 6) {
    console.log('\n❌ Password must be at least 6 characters long!');
    rl.close();
    return;
  }

  // Generate SHA-256 hash
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  
  console.log('\n✅ Password hash generated successfully!\n');
  console.log('========================================');
  console.log('Copy this hash to your .env.local file:');
  console.log('========================================\n');
  console.log(hash);
  console.log('\n========================================');
  console.log('Instructions:');
  console.log('========================================');
  console.log('1. Open .env.local file');
  console.log('2. Find: REACT_APP_ADMIN_PASSWORD_HASH=...');
  console.log('3. Replace the hash with the one above');
  console.log('4. Save the file');
  console.log('5. Restart your dev server (npm start)');
  console.log('========================================\n');
  
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});
