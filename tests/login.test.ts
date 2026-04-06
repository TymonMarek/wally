import { ErrorCode } from "../src/error";
import { loginWally } from "../src/login";
import { runCommand } from "../src/command";

jest.mock("../src/command", () => ({
  runCommand: jest.fn(),
}));

test("loginWally throws custom token missing error", async () => {
  const context = {
    env: {},
  } as unknown as Parameters<typeof loginWally>[1];

  await expect(loginWally({}, context)).rejects.toMatchObject({
    code: ErrorCode.WallyTokenMissing.toString(),
  });
});

test("loginWally runs wally login with github token", async () => {
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;
  runCommandMock.mockResolvedValue({ exitCode: 0 } as never);

  const context = {
    env: { GITHUB_TOKEN: "ghs_abc" },
  } as unknown as Parameters<typeof loginWally>[1];

  await expect(loginWally({}, context)).resolves.toBe(true);
  expect(runCommandMock).toHaveBeenCalledWith(
    "wally",
    ["login", "--token", "ghs_abc"],
    context,
  );
});

test("loginWally throws custom authentication failed error", async () => {
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;
  runCommandMock.mockResolvedValue({ exitCode: 42 } as never);

  const context = {
    env: { GITHUB_TOKEN: "ghs_abc" },
  } as unknown as Parameters<typeof loginWally>[1];

  await expect(loginWally({}, context)).rejects.toMatchObject({
    code: ErrorCode.WallyAuthenticationFailed.toString(),
  });
});
