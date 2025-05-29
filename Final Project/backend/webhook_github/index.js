import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use('/webhooks/github', express.json());

const PORT = process.env.PORT || 8080;
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || EMAIL_USER;

if (!GITHUB_WEBHOOK_SECRET || !EMAIL_USER || !EMAIL_PASS) {
  console.error('❌ Missing required environment variables. Exiting.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post('/webhooks/github', async (req, res) => {
  try {
    const sig = req.headers['x-hub-signature-256'];
    const body = JSON.stringify(req.body);

    if (!sig) {
      console.error('❌ No signature found');
      return res.status(400).send('No signature');
    }

    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(body).digest('hex');

    if (sig !== digest) {
      console.error('❌ GitHub webhook signature mismatch');
      return res.status(401).send('Invalid signature');
    }

    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`📦 GitHub event received: ${event}`);

    if (event === 'push') {
      const commitList = payload.commits.map(c => `- ${c.message} (${c.id.substring(0,7)})`).join('\n');

      const mailOptions = {
        from: `"GitHub Notifier" <${EMAIL_USER}>`,
        to: NOTIFY_EMAIL,
        subject: `GitHub Push: ${payload.repository.full_name}`,
        text: `
Repository: ${payload.repository.full_name}
Pusher: ${payload.pusher.name}
Ref: ${payload.ref}
Commit count: ${payload.commits.length}

Commits:
${commitList}
        `.trim(),
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
