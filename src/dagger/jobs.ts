import Client, { connect } from "../../deps.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", "node_modules", ".fluentci"];

export const deploy = async (src = ".", token?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);

    if (!Deno.env.get("RAILWAY_TOKEN") && !token) {
      console.log("RAILWAY_TOKEN is not set");
      Deno.exit(1);
    }

    if (token) {
      Deno.env.set("RAILWAY_TOKEN", token);
    }

    const ctr = client
      .pipeline(Job.deploy)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "bash", "tar"])
      .withExec(["sh", "-c", "bash <(curl -fsSL cli.new)"])
      .withEnvVariable("RAILWAY_TOKEN", Deno.env.get("RAILWAY_TOKEN")!)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "railway up"]);

    const result = await ctr.stdout();

    console.log(result);
  });

  return "done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Railway",
};
