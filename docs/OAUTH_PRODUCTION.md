# Google OAuth en production (lesagedev.com)

Si Google OAuth fonctionne en local mais renvoie **500** en production, suivez cette checklist.

## 1. Variables d’environnement Vercel

Dans **Vercel → Projet → Settings → Environment Variables**, définir pour **Production** :

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `BETTER_AUTH_URL` | `https://lesagedev.com` | Oui (callback OAuth) |
| `BETTER_AUTH_SECRET` | Chaîne aléatoire ≥ 32 caractères | Oui (signature des cookies) |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth | Oui |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth | Oui |
| `DATABASE_URL` | Chaîne de connexion Postgres (Supabase) | Oui (Prisma / Better Auth) |
| `NEXT_PUBLIC_APP_URL` | `https://lesagedev.com` | Recommandé |

- **BETTER_AUTH_SECRET** : générer avec `openssl rand -base64 32` ou un générateur sécurisé.
- **BETTER_AUTH_URL** : doit être exactement l’URL du site en prod (sans slash final).

## 2. Google Cloud Console – URI de redirection

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Ouvrir les **OAuth 2.0 Client IDs** utilisés pour le site (Web client).
3. Dans **Authorized redirect URIs**, ajouter exactement :
   ```text
   https://lesagedev.com/api/auth/callback/google
   ```
4. Dans **Authorized JavaScript origins** (si utilisé), ajouter :
   ```text
   https://lesagedev.com
   ```
5. Enregistrer les modifications.

Sans cette URI, Google renverra une erreur et Better Auth peut répondre en 500.

## 3. Redéploiement

Après avoir ajouté ou modifié des variables d’environnement sur Vercel :

- Lancer un **nouveau déploiement** (Redeploy) pour que les nouvelles variables soient prises en compte.

## 4. Voir l’erreur exacte (500)

Pour savoir pourquoi la requête renvoie 500 :

1. **Navigateur** : F12 → onglet **Network** → cliquer sur « Sign in with Google » → sélectionner la requête `sign-in/social` (status 500) → onglet **Response** : le corps de la réponse peut contenir un message d’erreur.
2. **Vercel** : **Projet** → **Logs** (ou **Deployments** → dernier déploiement → **Functions**) → refaire un clic sur Google et regarder les logs ; les erreurs sont préfixées par `[Better Auth]`.

## 5. Vérifications si ça bloque encore

- **Logs Vercel** : voir section 4 pour l’erreur exacte (DB, secret, Google, etc.).
- **Réseau (navigateur)** : onglet Network → requête 500 → onglet **Response**.
- Vérifier que **DATABASE_URL** est bien celle de la base utilisée par Better Auth (même projet Supabase que le schéma Prisma avec les tables `better_auth_*`).

## Résumé des causes fréquentes de 500

1. **BETTER_AUTH_URL** absent ou encore en `http://localhost:3000` → callback Google incorrect.
2. **Redirect URI** non ajoutée dans Google Console pour `https://lesagedev.com/api/auth/callback/google`.
3. **BETTER_AUTH_SECRET** absent ou différent entre déploiements → cookies de session invalides.
4. **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** non définis en production.
5. **DATABASE_URL** manquante ou incorrecte sur Vercel → erreur Prisma dans les routes `/api/auth/*`.
