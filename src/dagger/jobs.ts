/**
 * @module railway
 * @description This module provides a function to deploy to Railway
 */
import { Directory, Secret, dag, exit } from "../../deps.ts";
import { getDirectory, getRailwayToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = [".git", "node_modules", ".fluentci"];

/**
 * Deploy to Railway
 *
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
  const context = await getDirectory(src);
  const secret = await getRailwayToken(token);

  if (!secret) {
    console.error("RAILWAY_TOKEN is not set");
    exit(1);
    return "";
  }

  const ctr = dag
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

  return ctr.stdout();
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
