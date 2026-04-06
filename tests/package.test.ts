import fs from "fs/promises";
import toml from "@iarna/toml";
import { ErrorCode } from "../src/error";
import {
  getWallyPackage,
  readWallyPackage,
  setWallyPackage,
  writeWallyPackage,
} from "../src/package";

jest.mock("fs/promises", () => ({
  __esModule: true,
  default: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock("@iarna/toml", () => ({
  __esModule: true,
  default: {
    parse: jest.fn(),
  },
}));

function validPackage() {
  return {
    package: {
      name: "scope/pkg",
      description: "desc",
      version: "1.0.0",
      realm: "shared",
      registry: "https://wally.run",
    },
  };
}

test("readWallyPackage returns parsed package when valid", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue(validPackage());

  const result = await readWallyPackage({}, {
    cwd: "/repo",
    env: {},
  } as unknown as Parameters<typeof readWallyPackage>[1]);

  expect(result.package.name).toBe("scope/pkg");
});

test("readWallyPackage throws invalid configuration error for non-object TOML content", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue(null);

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for missing [package] section", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({});

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for missing name", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "",
      version: "1.0.0",
      realm: "shared",
      registry: "https://wally.run",
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for invalid version", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "scope/pkg",
      version: "1.0",
      realm: "shared",
      registry: "https://wally.run",
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for non-string version", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "scope/pkg",
      version: 123,
      realm: "shared",
      registry: "https://wally.run",
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for invalid registry", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "scope/pkg",
      version: "1.0.0",
      realm: "shared",
      registry: "not-a-url",
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for non-string registry", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "scope/pkg",
      version: "1.0.0",
      realm: "shared",
      registry: 123,
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("readWallyPackage throws invalid configuration error for invalid realm", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue({
    package: {
      name: "scope/pkg",
      version: "1.0.0",
      realm: "client",
      registry: "https://wally.run",
    },
  });

  await expect(
    readWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof readWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    code: ErrorCode.WallyConfigurationInvalid.toString(),
  });
});

test("writeWallyPackage only updates version line and preserves other text", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };

  fsMock.readFile.mockResolvedValue(
    [
      "[package]",
      "# keep this comment",
      'name = "scope/pkg"',
      'version = "1.0.0"',
      'realm = "shared"',
      'registry = "https://wally.run"',
      "",
    ].join("\n"),
  );

  await writeWallyPackage(
    {
      package: {
        name: "scope/pkg",
        description: "desc",
        version: "2.0.0",
        realm: "shared",
        registry: "https://wally.run",
      },
    },
    {},
    {
      cwd: "/repo",
      env: {},
    } as unknown as Parameters<typeof writeWallyPackage>[2],
  );

  expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
  const updatedContent = fsMock.writeFile.mock.calls[0][1] as string;
  expect(updatedContent).toContain("# keep this comment");
  expect(updatedContent).toContain('name = "scope/pkg"');
  expect(updatedContent).toContain('version = "2.0.0"');
});

test("readWallyPackage and writeWallyPackage fallback to process.cwd when cwd is undefined", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile
    .mockResolvedValueOnce("toml")
    .mockResolvedValueOnce(
      [
        "[package]",
        'name = "scope/pkg"',
        'version = "1.0.0"',
        'realm = "shared"',
        'registry = "https://wally.run"',
      ].join("\n"),
    );
  tomlMock.parse.mockReturnValue(validPackage());

  const context = { env: {} } as unknown as Parameters<
    typeof readWallyPackage
  >[1];

  await readWallyPackage({}, context);
  await writeWallyPackage(
    {
      package: {
        name: "scope/pkg",
        description: "desc",
        version: "3.0.0",
        realm: "shared",
        registry: "https://wally.run",
      },
    },
    {},
    context,
  );

  expect(fsMock.readFile.mock.calls[0][0]).toContain("wally.toml");
  expect(fsMock.readFile.mock.calls[1][0]).toContain("wally.toml");
});

test("getWallyPackage wraps ENOENT as package missing aggregate error", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };

  fsMock.readFile.mockRejectedValue(
    Object.assign(new Error("missing"), {
      code: "ENOENT",
    }),
  );

  await expect(
    getWallyPackage({}, { cwd: "/repo", env: {} } as unknown as Parameters<
      typeof getWallyPackage
    >[1]),
  ).rejects.toMatchObject({
    errors: [
      expect.objectContaining({
        code: ErrorCode.WallyPackageMissing.toString(),
      }),
    ],
  });
});

test("getWallyPackage returns package when read is successful", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };
  const tomlMock = toml as unknown as { parse: jest.Mock };

  fsMock.readFile.mockResolvedValue("toml");
  tomlMock.parse.mockReturnValue(validPackage());

  const result = await getWallyPackage({}, {
    cwd: "/repo",
    env: {},
  } as unknown as Parameters<typeof getWallyPackage>[1]);

  expect(result.package.name).toBe("scope/pkg");
});

test("setWallyPackage wraps ENOENT as package missing aggregate error", async () => {
  const fsMock = fs as unknown as {
    readFile: jest.Mock;
    writeFile: jest.Mock;
  };

  fsMock.readFile.mockRejectedValue(
    Object.assign(new Error("missing"), {
      code: "ENOENT",
    }),
  );

  await expect(
    setWallyPackage(
      {
        package: {
          name: "scope/pkg",
          description: "desc",
          version: "2.0.0",
          realm: "shared",
          registry: "https://wally.run",
        },
      },
      {},
      {
        cwd: "/repo",
        env: {},
      } as unknown as Parameters<typeof setWallyPackage>[2],
    ),
  ).rejects.toMatchObject({
    errors: [
      expect.objectContaining({
        code: ErrorCode.WallyPackageMissing.toString(),
      }),
    ],
  });
});
