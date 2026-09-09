# ISMI on Supabase

This folder contains the first production migration for the ISMI application data model.

1. Create a Supabase project in the required organization.
2. Run `supabase/migrations/20260909000000_ismi_core.sql` in the SQL editor, or apply it with `supabase db push` after linking the CLI.
3. In Supabase Authentication, create or invite the required users. Keep passwords only in Supabase Auth.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel for Production, Preview, and Development.
5. Add each authenticated user's UUID to `profiles` and assign their role. A role is also read from Auth user metadata by the NextAuth bridge during the transition.
6. Export the existing PostgreSQL data before shutting down Symfony, map legacy numeric user IDs to Supabase UUIDs, and import organizations, projects, articles, and links in that order.

The browser never receives a `service_role` key. Row Level Security limits data to the user's organization; administrative actions require `ROLE_ADMIN` in `profiles.roles`.
