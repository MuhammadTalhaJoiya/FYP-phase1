import { sendEmail, sendShortlistEmail } from './src/utils/mailer.js';

async function testGmail() {
  console.log('🔍 Testing Gmail functionality...\n');

  try {
    // Test basic email sending
    console.log('1️⃣ Testing basic email send...');
    const basicResult = await sendEmail({
      to: 'talhajoiyamuhammad@gmail.com',
      subject: 'Test Email - Basic Send',
      html: '<h1>Test Email</h1><p>This is a test email to verify Gmail functionality.</p>',
      text: 'Test Email - This is a test email to verify Gmail functionality.'
    });

    console.log('✅ Basic email result:', basicResult);
    console.log('');

    // Test shortlist email
    console.log('2️⃣ Testing shortlist email...');
    const shortlistResult = await sendShortlistEmail(
      'talhajoiyamuhammad@gmail.com',
      'Test Candidate',
      'Software Developer',
      'Test Company'
    );

    console.log('✅ Shortlist email result:', shortlistResult);
    console.log('');

    console.log('🎉 All Gmail tests completed successfully!');

  } catch (error) {
    console.log('❌ Gmail Error:', error.message);

    if (error.response) {
      console.log('📊 Error Details:');
      console.log('- Status:', error.response.status);
      console.log('- Headers:', error.response.headers);
      if (error.response.data) {
        console.log('- Data:', error.response.data);
      }
    }

    // Common Gmail issues
    if (error.message.includes('535') || error.message.includes('Authentication failed')) {
      console.log('\n🔧 Possible Issues:');
      console.log('1. App Password might be incorrect');
      console.log('2. 2-Factor Authentication not set up properly');
      console.log('3. Gmail account security settings blocking access');
      console.log('4. Less secure app access disabled');
    }

    if (error.message.includes('550') || error.message.includes('Mailbox unavailable')) {
      console.log('\n🔧 Possible Issues:');
      console.log('1. Recipient email address might be invalid');
      console.log('2. Gmail daily sending limits exceeded');
      console.log('3. Spam filtering might be blocking emails');
    }
  }
}

testGmail();
