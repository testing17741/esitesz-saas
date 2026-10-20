import nodemailer from 'nodemailer';
import { logger } from './logger';

export interface SendOtpMailParams {
  to: string;
  code: string;
}

/**
 * Enterprise Transactional Mailer for esitesz SaaS.
 * Supports:
 *  1. SMTP (nodemailer) with SSL/TLS (Gmail, Google Workspace, Hostinger, AWS SES, Brevo, SendGrid, custom SMTP).
 *  2. Resend API (HTTP-based fallback if RESEND_API_KEY is supplied).
 */
export async function sendOtpEmail({ to, code }: SendOtpMailParams): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = to.toLowerCase().trim();

  // 1. Try Resend API if API Key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'esitesz <auth@esitesz.com>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [normalizedEmail],
          subject: `${code} is your esitesz verification code`,
          html: generateOtpHtml(code, normalizedEmail),
        }),
      });

      if (res.ok) {
        logger.info('OTP email successfully delivered via Resend API', { to: normalizedEmail });
        return { success: true };
      }
      const errData = await res.json().catch(() => ({}));
      logger.warn('Resend API delivery failed, falling back to SMTP', { errData });
    } catch (apiErr) {
      logger.warn('Resend API threw error, attempting SMTP', { error: String(apiErr) });
    }
  }

  // 2. SMTP Delivery via Nodemailer
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || 587);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD;
  const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || (smtpUser ? `"esitesz" <${smtpUser}>` : '"esitesz" <no-reply@esitesz.com>');

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const isGmail = smtpHost.includes('gmail') || process.env.SMTP_SERVICE === 'gmail';
      const transporter = isGmail
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          })
        : nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for 587 or other ports
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

      await transporter.sendMail({
        from: fromAddress,
        to: normalizedEmail,
        subject: `${code} is your esitesz verification code`,
        text: `Your esitesz verification code is: ${code}. This code expires in 10 minutes. If you did not request this code, please ignore this email.`,
        html: generateOtpHtml(code, normalizedEmail),
      });

      logger.info('OTP email dispatched successfully via SMTP', { to: normalizedEmail });
      return { success: true };
    } catch (smtpErr) {
      logger.error('SMTP email dispatch error', { error: String(smtpErr), to: normalizedEmail });
      return {
        success: false,
        error: 'Unable to deliver verification code. Please verify email server settings.',
      };
    }
  }

  // If neither SMTP nor Resend is configured, log error in production
  logger.error('No email transport configured (missing SMTP_HOST/SMTP_USER or RESEND_API_KEY)', {
    to: normalizedEmail,
  });

  return {
    success: false,
    error: 'Email delivery service is currently not configured. Please contact system administrator.',
  };
}

function generateOtpHtml(code: string, recipient: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;background:#0f172a;text-align:center;">
              <span style="font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">
                esitesz
              </span>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:0.5px;text-transform:uppercase;">
                Local Business Engine
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">
                Verification Code
              </h1>
              <p style="font-size:14px;line-height:22px;color:#475569;margin:0 0 24px 0;">
                Hello, we received a request to sign in to your esitesz account associated with <strong style="color:#0f172a;">${recipient}</strong>. Use the security code below to complete your verification:
              </p>

              <!-- OTP Code Display -->
              <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px 0;">
                <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:800;letter-spacing:10px;color:#2563eb;display:inline-block;padding-left:10px;">
                  ${code}
                </span>
              </div>

              <p style="font-size:13px;line-height:20px;color:#64748b;margin:0 0 16px 0;">
                ● This code is valid for <strong>10 minutes</strong>.<br>
                ● Never share this code with anyone. Our staff will never ask for your code.
              </p>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">

              <p style="font-size:12px;line-height:18px;color:#94a3b8;margin:0;">
                If you did not request this code, you can safely ignore this email. No action is required.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#64748b;">
              &copy; ${new Date().getFullYear()} esitesz. Developed by esitesz.<br>
              Enterprise local business architecture, lead sync, and geo-optimization.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
