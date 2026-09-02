# Exchange Rates / ISMI

ISMI is a media-monitoring system with a Symfony API, Next.js administration UI, PostgreSQL, Elasticsearch and asynchronous parsing workers.

## Local development

1. Copy .env.dist to .env and set local-only secrets. Generate AUTH_SECRET, APP_SECRET, JWT keys and API credentials locally.
2. Start Docker Desktop with permission to access the Docker engine.
3. Run:

    docker compose up --build

The frontend is available at http://localhost:3001, the API at http://localhost:8000, and Elasticsearch at http://localhost:9200.

To create the initial administrator inside the PHP container:

    docker compose exec php php bin/console admin:create --generate-random-password

Do not use the default password in a shared environment.

## Production configuration

Production images do not contain .env or JWT key files. Create the Kubernetes Secret referenced by existingSecret in chart/prod_values.yaml before deploying. The secret must contain the Symfony, database, JWT, parser, storage and integration variables required by backend/config/packages.

The frontend requires these Vercel or container environment variables:

- AUTH_SECRET
- NEXTAUTH_URL
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_API_URL_FROM_SERVER

Optional scraper credentials are server-side only. See frontend/.env.example.

## Checks

    cd frontend
    corepack yarn install --frozen-lockfile
    corepack yarn build
    corepack yarn lint
    npx tsc -b --noEmit
    cd ..
    helm lint .\chart --strict

The full release checklist and subagent prompt are in docs/release-checklist.md and docs/subagents-release-prompt.md.
