import * as nodemailer from 'nodemailer';

export async function sendMail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
