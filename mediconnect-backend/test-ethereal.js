const { sendMail } = require('./src/lib/mailer');
const crypto = require('crypto');

async function testEmail() {
  console.log("---------------------------------------------------");
  console.log("  Testing Mediconnect Email Delivery System");
  console.log("---------------------------------------------------");
  
  const hasCreds = process.env.SMTP_USER && process.env.SMTP_PASS;
  
  console.log(`\nSMTP Configuration detected: ${hasCreds ? 'YES (Gmail/Real SMTP)' : 'NO (Using Ethereal Fake Inbox)'}`);
  
  if (!hasCreds) {
    console.log("\n⚠️ WARNING: You have not provided SMTP_USER and SMTP_PASS in the .env file.");
    console.log("  Because of this, the email will NOT arrive in your real inbox.");
    console.log("  Instead, Nodemailer intercepts it to a fake preview inbox called Ethereal.");
  }

  console.log("\nSimulating account registration sending OTP...");
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    const info = await sendMail({
      to: 'test-user@example.com',
      subject: '🏥 MediConnect — Verify Your Email (TEST SCRIPT)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin:0 auto; padding: 32px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <h2>This is a Test Email!</h2>
          <p>If you are reading this, the email system works perfectly.</p>
          <div style="background:#F0FDF4; border:2px dashed #22C55E; border-radius:12px; padding:24px; text-align:center;">
             <p style="font-size:42px; font-weight:800; color:#16A34A; letter-spacing:8px;">${otp}</p>
          </div>
        </div>
      `
    });
    
    console.log("\n✅ RESULT: Email physically generated and dispatched successfully!");
    
    const nodemailer = require('nodemailer');
    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    if (previewUrl) {
      console.log(`\n📬 VIEW YOUR EMAIL HERE:`);
      console.log(`   ${previewUrl}`);
      console.log(`\n   (Open that link in your browser to see the email that would have gone to your real inbox)`);
    } else {
      console.log(`\n   The email should now be in your actual real inbox!`);
    }
    
  } catch (error) {
    console.error("\n❌ ERROR sending email:", error.message);
  }
}

testEmail();
