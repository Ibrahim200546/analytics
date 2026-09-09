-- Allow admins to insert/update/delete articles
create policy "admins manage articles" on public.articles for all
using (public.is_ismi_admin()) with check (public.is_ismi_admin());
