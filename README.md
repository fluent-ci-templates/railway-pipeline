# Railway Pipeline

[![deno module](https://shield.deno.dev/x/railway_pipeline)](https://deno.land/x/railway_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/railway-pipeline)](https://codecov.io/gh/fluent-ci-templates/railway-pipeline)

A ready-to-use CI/CD Pipeline for deploying your applications to [Railway](https://railway.app).

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci railway_pipeline
```

## Environment Variables

| Variable      | Description               |
|---------------|---------------------------|
| RAILWAY_TOKEN | Your Railway Access Token |

## Jobs

| Job     | Description                      |
|---------|----------------------------------|
| deploy  | Deploys your application to Railway. |

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/railway_pipeline/mod.ts";

const { deploy } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await deploy(client, src);
  });
}

pipeline();

```
