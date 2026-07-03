# Mit-Mak Motors - Private Vehicle Inventory Management System

A complete, dealership-grade admin system bolted onto the public site. Staff sign in, manage stock and enquiries, and every change flows straight to the public showroom. No code changes needed to add or edit a car.

- **Public showroom:** `/` and `/showroom` (unchanged for customers).
- **Private admin:** `/admin` (login required, hidden from the public + search engines).

---

## 1. How it works (keyless-first)

The system runs in two modes and switches automatically based on the environment variables you set. **Nothing is required to start** - it works out of the box in "demo mode":

| Capability | Demo mode (no setup) | Live mode (env vars set) |
| --- | --- | --- |
| Public showroom | Serves the bundled inventory (400+ cars) | Serves the database |
| Admin edits | Saved to a local file (not permanent in the cloud) | Saved to Postgres (permanent) |
| Image uploads | Paste an image URL | Upload files to Vercel Blob **or** paste a URL |
| Enquiry emails | Logged on the server | Emailed via Resend |

The public site **never breaks**: if the database is empty or unreachable, it falls back to the bundled inventory. So you can add the database at any time without downtime.

---

## 2. Going live on Vercel (recommended, ~10 minutes)

Everything below is done in the Vercel dashboard for this project. No code required.

### Step 1 - Add a Postgres database
1. Vercel project > **Storage** > **Create Database** > **Postgres** (Neon).
2. Connect it to the project. Vercel injects `POSTGRES_URL` (and friends) automatically.
   - The app creates its tables and imports the current inventory on the first request. No migration step needed.

### Step 2 - Add the auth secret (REQUIRED for production)
1. Vercel project > **Settings** > **Environment Variables**.
2. Add `AUTH_SECRET`. Generate a value with:
   ```bash
   openssl rand -base64 32
   ```
   > Security: once a database is connected, admin sign-in is **disabled in production until AUTH_SECRET is set** (the system fails closed rather than fall back to a shared secret, so no one can forge a session). A keyless no-database demo stays usable. The public site is always unaffected.

### Step 3 - Set the first admin login
Add these environment variables (used the first time the app runs to seed the Super Admin):
- `ADMIN_EMAIL` - e.g. `manager@mitmakmotors.co.za`
- `ADMIN_PASSWORD` - a strong password
- `ADMIN_NAME` - e.g. `Bobby Petkov`

### Step 4 (optional) - Image uploads
1. Vercel project > **Storage** > **Create** > **Blob**.
2. Connect it - Vercel injects `BLOB_READ_WRITE_TOKEN`.
   - Now staff can upload photo files directly. Without it, they can still paste image URLs.

### Step 5 (optional) - Enquiry + reset emails
1. Create a free [Resend](https://resend.com) account, verify your sending domain, create an API key.
2. Add `RESEND_API_KEY`, `EMAIL_FROM` (e.g. `Mit-Mak Motors <sales@mitmakmotors.co.za>`), and `LEADS_EMAIL`.
   - Enquiry alerts and password-reset links now arrive by email. Without this, enquiries are still saved and shown in the dashboard, and reset links are written to the server logs.

### Step 6 - Redeploy
Trigger a redeploy so the new variables take effect. Then open `/admin` and sign in with the admin email/password from Step 3.

> Optional: instead of relying on first-request seeding, you can pre-provision the schema and admin locally with `vercel env pull .env.local` then `npm run setup-db`.

---

## 3. Roles and permissions (RBAC)

Create staff under **Admin > Users** (Super Admin only). Each user has one role:

| Role | Vehicles | Enquiries | Users | Settings |
| --- | --- | --- | --- | --- |
| **Super Admin** | Full (add / edit / delete / publish) | Full | Manage users | Yes |
| **Manager** | Full | Full | - | Yes |
| **Sales Staff** | Add / edit / publish (no delete) | View / update / add notes | - | - |
| **Viewer** | View only | View only | - | - |

Access rules are enforced in three places: the edge middleware (auth), each API route (permission), and the UI (hidden controls).

---

## 4. Daily use

- **Add a car:** Admin > Vehicles > **Add vehicle**. Fill in the details, add photos, then **Publish** (or **Save as draft** to finish later). It appears in the showroom immediately.
- **Quick edits:** On the Vehicles list, click a price or mileage to edit it inline, change status from the dropdown, or star to feature.
- **Mark as sold / reserved:** Change the status dropdown. Sold cars show a "Sold" badge (or are hidden entirely - see Settings).
- **Bulk actions:** Select rows to set status, feature, or delete in one go.
- **Duplicate:** Copy a similar listing as a draft to speed up data entry.
- **Enquiries:** Admin > Enquiries. Every website enquiry (vehicle enquiry, finance, sell-your-car, test drive, callback, contact) lands here. Set a status, add notes, click to call/email.
- **Settings:** Dealership name, whether sold cars stay visible, and the email address enquiries are sent to (global or per branch).

---

## 5. Production checklist

- [ ] `AUTH_SECRET` set to a strong random value (not the dev default).
- [ ] Postgres database connected (`POSTGRES_URL` present) so edits persist.
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD` set; signed in and confirmed working.
- [ ] Changed the seeded admin password if the default was used.
- [ ] (Optional) Vercel Blob connected for file uploads.
- [ ] (Optional) Resend configured and a test enquiry email received.
- [ ] Confirmed the public showroom reflects an admin change (add a draft, publish it, see it live).
- [ ] Confirmed `/admin` redirects to login when signed out.
- [ ] Created real staff accounts and removed any test users.

---

## 6. Custom domain / DNS

To serve the demo (or production site) on a subdomain such as `demo.mitmakmotors.co.za`:
1. Vercel project > **Settings** > **Domains** > add the domain.
2. At your DNS provider, add the record Vercel shows (usually a `CNAME` to `cname.vercel-dns.com`, or an `A` record for an apex domain).
3. Set `APP_URL` (and `NEXT_PUBLIC_SITE_URL`) to the final URL so password-reset links and metadata use it.

---

## 7. Troubleshooting

- **"Admin sign-in is disabled until AUTH_SECRET is configured":** You connected a database without setting `AUTH_SECRET`. Set `AUTH_SECRET` (Step 2) and redeploy. This is the intended fail-closed behavior once real data is in play.
- **No known admin password:** If you deploy without `ADMIN_PASSWORD`, the first Super Admin is seeded with a random password (no usable default ships). Use **Forgot password** at `/admin/login` to set your own (the reset link is emailed if Resend is configured, otherwise printed in the Vercel logs), or set `ADMIN_PASSWORD` and run `npm run setup-db`.
- **Admin shows "Demo mode" banner:** No database is connected. Add `POSTGRES_URL` (Step 1) and redeploy.
- **"File upload is not configured":** Add a Vercel Blob store (Step 4), or paste an image URL instead.
- **Forgot-password link not received:** Configure Resend (Step 5). Until then, the link is printed in the Vercel deployment logs.
- **Locked out:** Set/replace `ADMIN_PASSWORD` in Vercel and run `npm run setup-db` locally against the same database, or use the forgot-password flow.
- **Public site looks empty after connecting the DB:** It will not - the site falls back to the bundled inventory until the database is seeded, which happens automatically on first request.
