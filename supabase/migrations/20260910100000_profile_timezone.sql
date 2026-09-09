alter table public.profiles
  add column if not exists timezone text not null default 'Europe/Paris';

alter table public.profiles
  add constraint profiles_timezone_not_blank check (length(trim(timezone)) > 0);

comment on column public.profiles.timezone is
  'IANA timezone used to determine the user business date, for example Europe/Paris.';
