import 'server-only';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Keyless-first email. Sends via Resend when RESEND_API_KEY is set; otherwise
 * logs the message server-side so flows (lead alerts, password resets) work
 * end-to-end in dev/demo without any provider.
 */
export async function sendEmail(msg: EmailMessage): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Mit-Mak Motors <onboarding@resend.dev>';

  if (!apiKey || !msg.to) {
    console.log(
      `[mit-mak] email not sent (${!apiKey ? 'no RESEND_API_KEY' : 'no recipient'}) | to=${msg.to} | subject=${msg.subject}\n${msg.text}`,
    );
    return { delivered: false };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html ?? `<pre style="font:14px/1.6 system-ui">${escapeHtml(msg.text)}</pre>`,
      }),
    });
    if (!res.ok) {
      console.error('[mit-mak] Resend error:', res.status, await res.text().catch(() => ''));
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error('[mit-mak] email send failed:', err);
    return { delivered: false };
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);
}
