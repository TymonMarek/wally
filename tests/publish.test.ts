import { publishWally } from "../src/publish";
import { runCommand } from "../src/command";

jest.mock("../src/command", () => ({
  runCommand: jest.fn(),
}));

test("publishWally runs wally publish", async () => {
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;
  runCommandMock.mockResolvedValue({ exitCode: 0 } as never);

  const context = { env: {} } as unknown as Parameters<typeof publishWally>[1];

  await expect(publishWally({}, context)).resolves.toBeUndefined();
  expect(runCommandMock).toHaveBeenCalledWith("wally", ["publish"], context);
});

test("publishWally throws when publish command fails", async () => {
  const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;
  runCommandMock.mockResolvedValue({ exitCode: 1 } as never);

  await expect(
    publishWally({}, { env: {} } as unknown as Parameters<
      typeof publishWally
    >[1]),
  ).rejects.toThrow("Failed to publish package with Wally.");
});
