import { Client } from "@dagger.io/dagger";

export enum Job {
  deploy = "deploy",
}

export const deploy = async (client: Client, src = ".") => {
  const context = client.host().directory(src);

  if (!Deno.env.get("RAILWAY_TOKEN")) {
    console.log("RAILWAY_TOKEN is not set");
    Deno.exit(1);
  }

  const ctr = client
    .pipeline(Job.deploy)
    .container()
    .from("alpine:latest")
    .withExec(["apk", "update"])
    .withExec(["apk", "add", "curl", "bash", "tar"])
    .withExec(["sh", "-c", "bash <(curl -fsSL cli.new)"])
    .withEnvVariable("RAILWAY_TOKEN", Deno.env.get("RAILWAY_TOKEN")!)
    .withDirectory("/app", context, {
      exclude: [".git", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "railway up"]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Railway",
};