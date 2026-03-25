const nodemailer = require('nodemailer');

// Creates a transporter. Uses Gmail if SMTP_USER/SMTP_PASS are set,
// otherwise falls back to Ethereal (a test account) so email still "works"
// without any credentials configured.
async function createTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Ethereal test account - emails are captured at https://ethereal.email/
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('[Mailer] Using Ethereal test account:', testAccount.user);
  return transporter;
}

/**
 * Send an email. Returns the message info (includes previewURL on Ethereal).
 */
async function sendMail({ to, subject, html }) {
  const transporter = await createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || 'MediConnect';
  const fromAddr = process.env.SMTP_USER || 'noreply@mediconnect.app';

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddr}>`,
    to,
    subject,
    html,
  });

  // Log Ethereal preview URL so you can view the email during development
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log('[Mailer] Preview URL:', preview);

  return info;
}

module.exports = { sendMail };
