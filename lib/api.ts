import { NextResponse } from 'next/server';
import { getStore } from '@/lib/inventory/store';
import { notifyNewLead } from '@/lib/inventory/notify';
import type { LeadKind } from '@/lib/inventory/types';

/**
 * Shared form handler for the public API routes.
 *
 * 1. Car-sales enquiries (finance, sell, contact, insurance) are persisted as
 *    leads so they appear in the admin Enquiries dashboard, and the dealership
 *    is emailed. This works with or without a database (file fallback in dev).
 * 2. If FORM_WEBHOOK_URL is set, the raw payload is also forwarded there
 *    (CRM / Zapier). Otherwise it is logged server-side.
 */

// Which public form kinds become tracked sales leads (and how they map).
const KIND_TO_LEAD: Partial<Record<string, LeadKind>> = {
  finance: 'finance',
  sell: 'sell',
  contact: 'contact',
  insurance: 'finance',
  enquiry: 'general',
  callback: 'callback',
  'test-drive': 'test_drive',
};

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
}

function pick(p: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const val = str(p[k]);
    if (val) return val;
  }
  return '';
}

async function persistLead(kind: LeadKind, payload: Record<string, unknown>) {
  const name =
    pick(payload, ['name', 'fullName', 'full_name']) ||
    `${str(payload.firstName)} ${str(payload.lastName)}`.trim() ||
    pick(payload, ['email', 'phone']) ||
    'Website enquiry';
  const lead = await getStore().createLead({
    kind,
    name,
    phone: pick(payload, ['phone', 'phoneNumber', 'tel', 'mobile', 'cell', 'contactNumber']),
    email: pick(payload, ['email', 'emailAddress']),
    message: pick(payload, ['message', 'comments', 'notes', 'enquiry', 'details', 'question']),
    vehicleSlug: pick(payload, ['vehicleSlug', 'slug']) || null,
    vehicleTitle: pick(payload, ['vehicle', 'vehicleTitle', 'car', 'interest', 'model']) || null,
    locationId: pick(payload, ['locationId', 'branch', 'location']) || null,
    meta: { ...payload, formType: kind },
  });
  await notifyNewLead(lead);
}

export async function handleFormSubmission(req: Request, kind: string) {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  // Persist as a sales lead where relevant (never blocks the user's success).
  const leadKind = KIND_TO_LEAD[kind];
  if (leadKind) {
    try {
      await persistLead(leadKind, payload);
    } catch (err) {
      console.error(`[mit-mak] lead persist failed for ${kind}:`, err);
    }
  }

  const webhook = process.env.FORM_WEBHOOK_URL;
  const record = { kind, receivedAt: new Date().toISOString(), payload };

  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error(`[mit-mak] webhook forward failed for ${kind}:`, err);
    }
  } else if (!leadKind) {
    console.log(`[mit-mak] ${kind} submission received:`, JSON.stringify(payload).slice(0, 800));
  }

  return NextResponse.json({ ok: true, kind });
}
