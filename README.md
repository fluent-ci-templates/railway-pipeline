# Railway Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Frailway_pipeline&query=%24.version)](https://pkg.fluentci.io/railway_pipeline)
[![deno module](https://shield.deno.dev/x/railway_pipeline)](https://deno.land/x/railway_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/railway-pipeline)](https://codecov.io/gh/fluent-ci-templates/railway-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Railway](https://railway.app).

## 🚀 Usage

Run the following command:

```bash
fluentci run railway_pipeline
```

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/railway-pipeline@mod
```

## Environment Variables

| Variable      | Description               |
|---------------|---------------------------|
| RAILWAY_TOKEN | Your Railway Access Token |

## Jobs

| Job     | Description                      |
|---------|----------------------------------|
| deploy  | Deploys your application to Railway. |

```typescript
deploy(
  src: Directory | string,
  token: Secret | string
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "https://pkg.fluentci.io/railway_pipeline@v0.7.0/mod.ts";

await deploy(".", Deno.env.get("RAILWAY_TOKEN")!);
```
