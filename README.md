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
2. exécuter `supabase/migrations/20260909160000_initial_schema.sql` dans le SQL Editor ;
3. créer un utilisateur email dans Supabase Auth ;
4. exécuter `supabase/seed.sql` pour ce premier utilisateur ;
5. renseigner `.env.local`, puis relancer l’application.

## Variables d’environnement

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Seule la clé publique `anon` est utilisée par l’application. Ne jamais exposer la clé `service_role` au navigateur.

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
- `src/features` : logique par domaine (`auth`, `today`) ;
- `src/lib` : clients Supabase et données de démonstration ;
- `src/types` : types métier partagés ;
- `supabase/migrations` : schéma SQL versionné.
