import nodemailer from 'nodemailer';

import { env } from '../config/index.js';
import { logger } from '../utils/logger.js';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let transporter;

function getTransporter() {
  if (!env.smtpHost || !env.smtpUser) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth:
        env.smtpUser && env.smtpPass
          ? { user: env.smtpUser, pass: env.smtpPass }
          : undefined,
    });
  }
  return transporter;
}

function emailTemplate({ title, bodyHtml, bodyText }) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title></head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="background:#0f766e;color:#fff;padding:20px 24px;">
          <strong style="font-size:18px;">verdiMobility</strong>
        </td></tr>
        <tr><td style="padding:24px;color:#18181b;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 24px;background:#fafafa;color:#71717a;font-size:12px;line-height:1.5;">
          You received this email because of activity on your verdiMobility account.<br/>
          <a href="${env.appUrl}" style="color:#0f766e;">verdiMobility</a> · Enterprise logistics<br/>
          © ${year} verdiMobility · <em>Unsubscribe</em> not available for transactional mail.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendMail({ to, subject, html, text }, meta = {}) {
  const t = getTransporter();
  if (!t) {
    logger.warn('Email skipped: SMTP not configured', { to, subject, ...meta });
    return { skipped: true };
  }
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await t.sendMail({
        from: env.emailFrom,
        to,
        subject,
        text,
        html,
      });
      logger.info('Email sent', { to, subject, attempt, ...meta });
      return { ok: true };
    } catch (e) {
      lastErr = e;
      logger.warn('Email send attempt failed', {
        message: e?.message,
        attempt,
        ...meta,
      });
      await sleep(100 * 2 ** attempt);
    }
  }
  logger.error('Email send failed after retries', {
    message: lastErr?.message,
    to,
    subject,
    ...meta,
  });
  throw lastErr;
}

function queueMail(fn) {
  setImmediate(() => {
    fn().catch((e) => logger.error('Background email error', { message: e?.message }));
  });
}

export async function sendWelcomeEmail({ to, name }) {
  const subject = 'Welcome to verdiMobility';
  const text = `Hi ${name},\n\nWelcome to verdiMobility. Your account is ready.\n\n${env.appUrl}`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<h1 style="margin-top:0;">Welcome, ${name}</h1><p>Your verdiMobility account is ready. We're glad you're here.</p><p><a href="${env.appUrl}" style="color:#0f766e;">Open platform</a></p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'welcome' });
}

export async function sendEmailVerificationEmail({ to, name, verificationUrl }) {
  const subject = 'Verify your email — verdiMobility';
  const text = `Hi ${name},\n\nVerify your email: ${verificationUrl}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<h1 style="margin-top:0;">Verify your email</h1><p>Hi ${name},</p><p><a href="${verificationUrl}" style="display:inline-block;background:#0f766e;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Verify email</a></p><p style="word-break:break-all;font-size:13px;color:#71717a;">${verificationUrl}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'verify' });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = 'Reset your password — verdiMobility';
  const text = `Hi ${name},\n\nReset password: ${resetUrl}\nLink expires in 1 hour.`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<h1 style="margin-top:0;">Password reset</h1><p>Hi ${name},</p><p><a href="${resetUrl}" style="display:inline-block;background:#0f766e;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Reset password</a></p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'reset' });
}

export async function sendPasswordChangedEmail({ to, name }) {
  const subject = 'Your password was changed — verdiMobility';
  const text = `Hi ${name},\n\nYour password was changed. If this wasn't\nyou, contact support immediately.\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your password was changed. If this wasn't you, contact support immediately.</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'password_changed' });
}

export async function sendAccountSuspendedEmail({ to, name, reason }) {
  const subject = 'Account suspended — verdiMobility';
  const text = `Hi ${name},\n\nYour account has been suspended.\nReason: ${reason ?? 'N/A'}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your account has been suspended.</p><p><strong>Reason:</strong> ${reason ?? 'Not specified'}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'suspended' });
}

export async function sendAccountReactivatedEmail({ to, name }) {
  const subject = 'Account reactivated — verdiMobility';
  const text = `Hi ${name},\n\nYour verdiMobility account is active again.\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your account has been reactivated.</p><p><a href="${env.appUrl}">Sign in</a></p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'reactivated' });
}

export async function sendRoleChangedEmail({ to, name, newRole }) {
  const subject = 'Your role was updated — verdiMobility';
  const text = `Hi ${name},\n\nYour role is now: ${newRole}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your account role is now <strong>${newRole}</strong>.</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'role_changed' });
}

function shipmentSummary(s) {
  if (!s) return '';
  return `${s.pickupLocation ?? s.pickup_location ?? '—'} → ${s.destination ?? '—'} (ref ${s.id})`;
}

export async function sendShipmentCreatedEmail({ to, name, shipment }) {
  const subject = 'Shipment created — verdiMobility';
  const sum = shipmentSummary(shipment);
  const text = `Hi ${name},\n\nShipment created:\n${sum}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your shipment was created.</p><p>${sum}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'shipment_created' });
}

export async function sendShipmentMatchedEmail({ to, name, shipment, driver }) {
  const subject = 'Shipment matched to a vehicle — verdiMobility';
  const d = driver
    ? `Driver: ${driver.name ?? 'assigned'} (${driver.licenseNumber ?? ''})`
    : 'A vehicle has been assigned.';
  const text = `Hi ${name},\n\n${shipmentSummary(shipment)}\n${d}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your shipment has been matched.</p><p>${shipmentSummary(shipment)}</p><p>${d}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'shipment_matched' });
}

export async function sendShipmentPickedUpEmail({ to, name, shipment }) {
  const subject = 'Shipment in transit — verdiMobility';
  const text = `Hi ${name},\n\nYour shipment is in transit.\n${shipmentSummary(shipment)}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your shipment is <strong>in transit</strong>.</p><p>${shipmentSummary(shipment)}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'shipment_pickup' });
}

export async function sendShipmentDeliveredEmail({ to, name, shipment }) {
  const subject = 'Shipment delivered — verdiMobility';
  const text = `Hi ${name},\n\nDelivered:\n${shipmentSummary(shipment)}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your shipment was <strong>delivered</strong>.</p><p>${shipmentSummary(shipment)}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'shipment_delivered' });
}

export async function sendShipmentCancelledEmail({ to, name, shipment, reason }) {
  const subject = 'Shipment cancelled — verdiMobility';
  const text = `Hi ${name},\n\nCancelled: ${shipmentSummary(shipment)}\nReason: ${reason ?? 'N/A'}\n`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p>Hi ${name},</p><p>Your shipment was cancelled.</p><p>${shipmentSummary(shipment)}</p><p><strong>Reason:</strong> ${reason ?? '—'}</p>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'shipment_cancelled' });
}

export async function sendAdminNewUserAlertEmail({ to, newUser }) {
  const subject = 'New user registration — verdiMobility';
  const text = `New user: ${newUser?.name} <${newUser?.email}> role ${newUser?.role}`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p><strong>New registration</strong></p><ul><li>${newUser?.name}</li><li>${newUser?.email}</li><li>Role: ${newUser?.role}</li></ul>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'admin_new_user' });
}

export async function sendDailyDigestEmail({ to, stats }) {
  const subject = 'Daily digest — verdiMobility';
  const text = `Daily stats:\n${JSON.stringify(stats ?? {}, null, 2)}`;
  const html = emailTemplate({
    title: subject,
    bodyHtml: `<p><strong>Daily digest</strong></p><pre style="background:#f4f4f5;padding:12px;border-radius:6px;overflow:auto;">${JSON.stringify(stats ?? {}, null, 2)}</pre>`,
    bodyText: text,
  });
  return sendMail({ to, subject, html, text }, { type: 'digest' });
}

export function queueWelcomeEmail(ctx) {
  queueMail(() => sendWelcomeEmail(ctx));
}
export function queueEmailVerification(ctx) {
  queueMail(() => sendEmailVerificationEmail(ctx));
}
export function queuePasswordResetEmail(ctx) {
  queueMail(() => sendPasswordResetEmail(ctx));
}
export function queuePasswordChangedEmail(ctx) {
  queueMail(() => sendPasswordChangedEmail(ctx));
}
export function queueAccountSuspendedEmail(ctx) {
  queueMail(() => sendAccountSuspendedEmail(ctx));
}
export function queueAccountReactivatedEmail(ctx) {
  queueMail(() => sendAccountReactivatedEmail(ctx));
}
export function queueRoleChangedEmail(ctx) {
  queueMail(() => sendRoleChangedEmail(ctx));
}
export function queueShipmentCreatedEmail(ctx) {
  queueMail(() => sendShipmentCreatedEmail(ctx));
}
export function queueShipmentMatchedEmail(ctx) {
  queueMail(() => sendShipmentMatchedEmail(ctx));
}
export function queueShipmentPickedUpEmail(ctx) {
  queueMail(() => sendShipmentPickedUpEmail(ctx));
}
export function queueShipmentDeliveredEmail(ctx) {
  queueMail(() => sendShipmentDeliveredEmail(ctx));
}
export function queueShipmentCancelledEmail(ctx) {
  queueMail(() => sendShipmentCancelledEmail(ctx));
}
export function queueAdminNewUserAlert(ctx) {
  queueMail(() => sendAdminNewUserAlertEmail(ctx));
}
export function queueDailyDigestEmail(ctx) {
  queueMail(() => sendDailyDigestEmail(ctx));
}
