# Cut Tracker

Socle mobile-first d’une application de suivi de perte de poids, construit avec Next.js App Router, TypeScript, Tailwind CSS et Supabase.

## Démarrage

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sans variables Supabase, l’écran Aujourd’hui reste consultable avec les données de démonstration. Pour activer l’authentification et la persistance :

1. créer un projet Supabase ;
<<<<<<< ours
2. exécuter `supabase/migrations/20260909160000_initial_schema.sql` dans le SQL Editor ;
3. créer un utilisateur email dans Supabase Auth ;
4. exécuter `supabase/seed.sql` pour ce premier utilisateur ;
=======
2. exécuter, dans l’ordre, les fichiers de `supabase/migrations` dans le SQL Editor (ou lancer `supabase db push`) ;
3. créer un utilisateur email dans Supabase Auth ;
4. définir `cut_tracker.seed_user_email`, puis exécuter `supabase/seed.sql` pour cet utilisateur ;
>>>>>>> theirs
5. renseigner `.env.local`, puis relancer l’application.

## Variables d’environnement

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
<<<<<<< ours
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Seule la clé publique `anon` est utilisée par l’application. Ne jamais exposer la clé `service_role` au navigateur.
=======
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Seule la clé publiable est utilisée par l’application. Les clés `SUPABASE_SECRET_KEY` et `service_role` sont réservées aux environnements serveur de confiance et ne doivent jamais être exposées via une variable `NEXT_PUBLIC_*`.

Le fichier de seed exige un compte Auth existant et une adresse explicite afin de ne jamais rattacher les données au mauvais utilisateur :

```sql
set cut_tracker.seed_user_email = 'votre-adresse@example.com';
-- Exécuter ensuite le contenu de supabase/seed.sql dans la même requête.
```
>>>>>>> theirs

## Génération locale des icônes PWA

Les sources SVG sont versionnées, contrairement aux fichiers PNG générés. Après `npm install`, générez les icônes PNG destinées aux plateformes qui les exigent avec :

```bash
npm run icons:generate
```

Cette commande crée les variantes 192 × 192, 512 × 512 et Apple Touch Icon 180 × 180 dans `public/icons`. Ces fichiers sont ignorés par Git.

## Vérifications

```bash
npm run typecheck
npm run lint
npm run build
```

## Architecture

- `src/app` : routes, layouts et manifeste PWA ;
- `src/components` : composants d’interface réutilisables ;
<<<<<<< ours
- `src/features` : logique par domaine (`auth`, `today`) ;
=======
- `src/features` : logique par domaine (`auth`, `today`, `meals`) ;
>>>>>>> theirs
- `src/lib` : clients Supabase et données de démonstration ;
- `src/types` : types métier partagés ;
- `supabase/migrations` : schéma SQL versionné.
