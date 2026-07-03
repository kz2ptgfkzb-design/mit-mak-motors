import 'server-only';
import { getStore } from './store';
import { sendEmail } from '@/lib/email';
import { LEAD_KIND_LABELS, type Lead } from './types';

/** Email the dealership about a new enquiry (branch address if set, else global). */
export async function notifyNewLead(lead: Lead): Promise<void> {
  let to = '';
  try {
    const settings = await getStore().getSettings();
    const branch = lead.locationId ? settings.branchEmails?.[lead.locationId] : '';
    to = branch || settings.notifyEmail || process.env.LEADS_EMAIL || '';
  } catch {
    to = process.env.LEADS_EMAIL || '';
  }

  const label = LEAD_KIND_LABELS[lead.kind] ?? 'Enquiry';
  const lines = [
    `New ${label.toLowerCase()} from the Mit-Mak Motors website.`,
    '',
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone || '-'}`,
    `Email:   ${lead.email || '-'}`,
    lead.vehicleTitle ? `Vehicle: ${lead.vehicleTitle}` : '',
    lead.message ? `\nMessage:\n${lead.message}` : '',
    '',
    `Received: ${lead.createdAt}`,
    'Manage this lead in the admin dashboard under Enquiries.',
  ].filter((l) => l !== '');

  await sendEmail({ to, subject: `New ${label}: ${lead.name}`, text: lines.join('\n') });
}
