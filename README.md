# CareLink Academy

A low-cost onboarding LMS for doctors, pharmacists, nurses, counsellors and healthcare workers across England, Wales, Scotland, South Africa and New Zealand.

## Features
- Supabase login and signup
- Healthcare worker profile creator
- Country and role-specific learning paths
- SOP, slide and video module links
- Progress tracking
- Quick assessments
- Knowledge report dashboard
- Admin-ready database structure

## Stack
- Next.js
- Supabase
- Vercel
- Tailwind CSS
- Google Drive / YouTube unlisted links for low-cost content hosting

## Setup

### 1. Install
```bash
npm install
npm run dev
```

### 2. Supabase
Create a Supabase project and run:

```sql
supabase/schema.sql
```

### 3. Environment variables
Copy `.env.example` to `.env.local` and add your Supabase credentials.

### 4. Deploy to Vercel
Push this folder to GitHub, then import the repo into Vercel.
Add the same environment variables inside Vercel.

## New in v2: Contract review and electronic sign-off

This build now includes a DocuSign-style workflow:

- Contract template library
- Role and country-specific contracts
- Doctor contract review page
- Electronic typed signature
- Signer name, registration/ID number, email and mobile capture
- Signed contract record stored in Supabase
- Contract status shown in the knowledge report
- Admin page to add future contract templates for pharmacists, nurses, psychologists and other healthcare workers

### Key pages

- `/contracts` — learner contract review and sign-off
- `/admin/contracts` — add contract templates
- `/guide` — VideoMed Doctor Operations Guide preview
- `/report` — includes assessment and contract sign-off status

### Included sample documents

- `public/documents/VideoMed Doctors Contract.docx`
- `public/documents/videomed_doctor_guide.pdf`

### Production recommendation

For a more formal e-signature process, convert all final contracts to PDF and store them in Supabase Storage or Google Drive.
The current implementation captures electronic acknowledgement and typed signature. It is not a full legal replacement for DocuSign unless reviewed by your legal advisor.
