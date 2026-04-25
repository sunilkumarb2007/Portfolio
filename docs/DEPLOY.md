# Deployment guide

This project deploys cleanly on Vercel as **two projects from the same repo**: one for the web frontend and one for the API.

## 1. Provision Postgres (Supabase)

1. Create a new Supabase project.
2. From **Settings → Database → Connection string**, copy the "URI" connection string.
3. (Optional) Add `?pgbouncer=true&connection_limit=1` if you'll scale the API to many serverless instances.

## 2. Run migrations + seed (one-time, from your laptop)

```bash
cd apps/api
DATABASE_URL="postgresql://..." npm run prisma:deploy
DATABASE_URL="postgresql://..." npm run seed
```

## 3. Generate the admin password hash

```bash
node -e "console.log(require('bcryptjs').hashSync('your-strong-password', 12))"
```

Copy the output — it's the value for `ADMIN_PASSWORD_HASH`.

## 4. Generate a JWT secret

```bash
openssl rand -hex 32
```

Use as `JWT_SECRET`.

## 5. Create the Vercel projects

### API project

- Root directory: `apps/api`
- Framework preset: **Other**
- Build command: `npm run vercel-build`
- Install command: leave default (`npm install` at repo root)
- Output directory: leave default
- Environment variables:

| Name                    | Value                                            |
| ----------------------- | ------------------------------------------------ |
| `NODE_ENV`              | `production`                                     |
| `DATABASE_URL`          | (Supabase connection URL)                        |
| `JWT_SECRET`            | (output of `openssl rand -hex 32`)               |
| `ADMIN_EMAIL`           | (your email)                                     |
| `ADMIN_PASSWORD_HASH`   | (bcrypt hash from step 3)                        |
| `OPENAI_API_KEY`        | (optional — assistant degrades gracefully)       |
| `OPENAI_MODEL`          | `gpt-4o-mini` (default)                          |
| `CORS_ORIGIN`           | (your web project URL, e.g. `https://you.dev`)   |

After first deploy, note the URL (e.g. `https://portfolio-api-xxx.vercel.app`).

### Web project

- Root directory: `apps/web`
- Framework preset: **Next.js**
- Environment variables:

| Name                  | Value                                |
| --------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL` | (URL of the api project from above)  |
| `NEXT_PUBLIC_SITE_URL`| (URL of this web project)            |
| `NEXT_PUBLIC_SITE_NAME`| `Portfolio`                         |

Deploy. Done.

## 6. Updating the API CORS

Once the web URL exists, set `CORS_ORIGIN` on the api project to that URL (comma-separated for multiple origins, including preview deploys if you want).

## Alternative: deploying via the Vercel CLI

```bash
npm i -g vercel

# API
cd apps/api
vercel link --project portfolio-api
vercel env add DATABASE_URL production   # ...etc
vercel --prod

# Web
cd ../web
vercel link --project portfolio-web
vercel env add NEXT_PUBLIC_API_URL production
vercel --prod
```

## Local docker-compose

For a one-command full stack locally:

```bash
docker compose up --build
```

Postgres on `:5432`, api on `:4000`, web on `:3000`. Migrations run automatically on first api boot? No — run `npm --workspace apps/api run prisma:migrate` against the running container's `DATABASE_URL`.
