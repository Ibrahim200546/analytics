# Release Checklist

## Required before production

- Rotate every credential that was ever present in the old Git history: AWS, Telegram, Free Currency API, ChatGPT, Auth.js, JWT and Instagram sessions.
- Generate a fresh JWT key pair and store it in the Kubernetes Secret or an external secret manager.
- Create exchange-rates-prod-secrets in the target namespace. Do not put its values in Helm values files or Docker build arguments.
- Configure NEXT_PUBLIC_API_URL_PROD and NEXT_PUBLIC_API_URL_FROM_SERVER_PROD as protected CI variables.
- Configure Vercel AUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_URL_FROM_SERVER.
- Confirm cap-regcred exists and can pull all four images.
- Confirm PostgreSQL and Elasticsearch are external, backed up and reachable from the cluster.

## Verification

    helm lint .\chart --strict
    helm template exchange-rates .\chart -f .\chart\prod_values.yaml
    docker compose config

Run the application checks from the root README. Deploy with --atomic --wait and verify /healthz, login, organization access, project CRUD, article loading, export and the three scheduled commands.

## Known operational boundaries

- The Python Instagram scraper is an optional manual utility and is not part of the Kubernetes release.
- HSTS is configured for the Next.js/Vercel surface. The public API ingress must also terminate HTTPS and send HSTS.
- The existing PostgreSQL 13 and Elasticsearch 7.17 versions need a separate compatibility-tested upgrade plan.
