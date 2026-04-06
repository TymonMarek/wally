import { ErrorCode } from "../src/error";
import { verifyWally } from "../src/verify";
import { parsePluginArgs } from "../src/args";
import { runCommand } from "../src/command";

jest.mock("../src/args", () => ({
  parsePluginArgs: jest.fn(),
}));

jest.mock("../src/command", () => ({
  runCommand: jest.fn(),
}));

test("verifyWally returns both token and install errors when both fail", async () => {
  const parsePluginArgsMock = parsePluginArgs as jest.MockedFunction<
    typeof parsePluginArgs
  >;
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;

  parsePluginArgsMock.mockReturnValue({ wallyToken: undefined });
  runCommandMock.mockResolvedValue({ exitCode: 1 } as never);

  const errors = await verifyWally({}, { env: {} } as unknown as Parameters<
    typeof verifyWally
  >[1]);

  expect(errors.map((error) => error.code)).toEqual([
    ErrorCode.WallyTokenMissing.toString(),
    ErrorCode.WallyNotInstalled.toString(),
  ]);
});

test("verifyWally returns no errors when token exists and wally is installed", async () => {
  const parsePluginArgsMock = parsePluginArgs as jest.MockedFunction<
    typeof parsePluginArgs
  >;
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;

  parsePluginArgsMock.mockReturnValue({ wallyToken: "token" });
  runCommandMock.mockResolvedValue({ exitCode: 0 } as never);

  const errors = await verifyWally({}, { env: {} } as unknown as Parameters<
    typeof verifyWally
  >[1]);

  expect(errors).toEqual([]);
  expect(runCommandMock).toHaveBeenCalledWith("wally", ["--version"], {
    env: {},
  });
});
