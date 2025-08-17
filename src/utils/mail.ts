import * as nodemailer from 'nodemailer';

export async function sendMail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: this.configService.getOrThrow('SMTP_HOST'),
    port: this.configService.getOrThrow('SMTP_PORT'),
    auth: {
      user: this.configService.getOrThrow('SMTP_USERNAME'),
      pass: this.configService.getOrThrow('SMTP_PASSWORD'),
    },
  });

  return transporter.sendMail({
    from: this.configService.getOrThrow('SMTP_FROM_EMAIL'),
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
