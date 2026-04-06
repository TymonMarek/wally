import { execa } from "execa";
import { runCommand } from "../src/command";

jest.mock("execa", () => ({
  execa: jest.fn(),
}));

test("runCommand executes command with cwd/env and returns result", async () => {
  const execaMock = execa as jest.MockedFunction<typeof execa>;
  const result = { exitCode: 0 } as never;
  execaMock.mockResolvedValue(result);

  const stdout = { pipe: jest.fn() };
  const stderr = { pipe: jest.fn() };
  const context = {
    cwd: "C:/repo",
    env: { PATH: "test" },
    stdout,
    stderr,
  };

  const execution = await runCommand("wally", ["--version"], context);

  expect(execaMock).toHaveBeenCalledWith("wally", ["--version"], {
    reject: false,
    cwd: "C:/repo",
    env: { PATH: "test" },
  });
  expect(stdout.pipe).toHaveBeenCalledWith(process.stdout);
  expect(stderr.pipe).toHaveBeenCalledWith(process.stderr);
  expect(execution).toBe(result);
});

test("runCommand skips piping when streams are not pipeable", async () => {
  const execaMock = execa as jest.MockedFunction<typeof execa>;
  execaMock.mockResolvedValue({ exitCode: 0 } as never);

  await runCommand("wally", ["publish"], {
    env: {},
    stdout: {},
    stderr: null,
  });

  expect(execaMock).toHaveBeenCalledTimes(1);
});
