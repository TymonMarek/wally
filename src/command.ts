import { execa } from "execa";

type CommandContext = {
  cwd?: string;
  env: NodeJS.ProcessEnv;
  stdout?: unknown;
  stderr?: unknown;
};

function pipeIfReadable(stream: unknown, destination: NodeJS.WritableStream) {
  if (stream && typeof (stream as NodeJS.ReadableStream).pipe === "function") {
    (stream as NodeJS.ReadableStream).pipe(destination);
  }
}

export async function runCommand(
  command: string,
  args: string[],
  context: CommandContext,
) {
  const { cwd, env } = context;
  const result = execa(command, args, {
    reject: false,
    cwd,
    env,
  });

  pipeIfReadable(context.stdout, process.stdout);
  pipeIfReadable(context.stderr, process.stderr);

  return await result;
}
