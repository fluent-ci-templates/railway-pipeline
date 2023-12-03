import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getRailwayToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", "node_modules", ".fluentci"];

/**
 * @function
 * @description Deploy to Railway
 * @param {Directory | string} src The directory to deploy
 * @param {Secret | string} token Railway token
 * @returns {Promise<string>}
 */
export async function deploy(
  src: Directory | string,
  token: Secret | string
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const secret = getRailwayToken(client, token);

    if (!secret) {
      console.error("RAILWAY_TOKEN is not set");
      Deno.exit(1);
    }

    const ctr = client
      .pipeline(Job.deploy)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "bash", "tar"])
      .withExec(["sh", "-c", "bash <(curl -fsSL cli.new)"])
      .withSecretVariable("RAILWAY_TOKEN", secret)
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["sh", "-c", "railway up"]);

    const result = await ctr.stdout();

    console.log(result);
  });

  return "done";
}

export type JobExec = (
  src: Directory | string,
  token: Secret | string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Railway",
};
