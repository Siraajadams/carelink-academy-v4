# CareLink Academy Deployment Checklist

## GitHub
1. Create a new repository called `carelink-academy`.
2. Upload or push this project folder.
3. Do not upload `.env.local`.

## Supabase
1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Go to Authentication > URL Configuration.
5. Add your Vercel URL after deployment.
6. Optional: Create Supabase Storage bucket called `contracts` for production contract files.

## Vercel
1. Import GitHub repo.
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy.

## Recommended content hosting
- Use Google Drive or Supabase Storage for PDFs and SOPs.
- Use YouTube unlisted, Vimeo, or Google Drive for training videos.
- Store only links in the `modules` and `contracts` tables to reduce hosting costs.

## Legal note
The included e-signature is a typed acknowledgement workflow. Ask a legal advisor to confirm whether it is sufficient for each jurisdiction.
