# KinetyQ Technician

The technician-facing web app for the KinetyQ vehicle operations platform. One
responsive web product (web + mobile, not native): technicians work mobile-first,
organization admins work desktop-first.

Built from the product PRD (`Work done on technician app.docx`) plus the org-deployed
technician ticket (`Kinetyq Technician Ticket.docx`).

## Stack

- React + Vite + TypeScript
- Tailwind CSS (brand design system)
- React Router
- Front-end only at this stage: mock data + `localStorage`, no backend.

## Brand

- Colors: yellow `#F9C80E`, blue `#0077B6`, charcoal `#2D2D2D`, gray `#9FA2A5`.
- Type: **Gilroy** (drop the licensed `.woff2` files in `public/fonts/`; falls back
  to Poppins until then).

## Run

```bash
npm install
npm run dev
```

Opens on http://localhost:5180

### Demo login

- Individual technician: `tech@kinetyq.com` / `kine2026`
- Business provider: `business@kinetyq.com` / `kine2026`

## Status

Phase 0 (foundation): design system, app shell + responsive nav, auth + route
guards, login, and the technician workspace shell (Jobs / My Jobs / Profile).
Subsequent phases build out onboarding, the full job feed + quoting, active-job
execution, profile/certifications/settings, the business dashboard, and the
organization-deployed technician flow.
