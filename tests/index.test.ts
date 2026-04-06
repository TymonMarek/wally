import { getWallyPackage } from "../src/package";
import { loginWally } from "../src/login";
import { prepareWally } from "../src/prepare";
import { publishWally } from "../src/publish";
import { verifyWally } from "../src/verify";

jest.mock("../src/verify", () => ({ verifyWally: jest.fn() }));
jest.mock("../src/package", () => ({ getWallyPackage: jest.fn() }));
jest.mock("../src/login", () => ({ loginWally: jest.fn() }));
jest.mock("../src/prepare", () => ({ prepareWally: jest.fn() }));
jest.mock("../src/publish", () => ({ publishWally: jest.fn() }));

type IndexModule = typeof import("../src/index");

function loadFreshIndexModule(): IndexModule {
  let loadedModule: IndexModule | undefined;

  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loadedModule = require("../src/index") as IndexModule;
  });

  if (!loadedModule) {
    throw new Error("Unable to load index module.");
  }

  return loadedModule;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("verifyConditions verifies package and authenticates once", async () => {
  const verifyWallyMock = verifyWally as jest.MockedFunction<
    typeof verifyWally
  >;
  const getWallyPackageMock = getWallyPackage as jest.MockedFunction<
    typeof getWallyPackage
  >;
  const loginWallyMock = loginWally as jest.MockedFunction<typeof loginWally>;

  verifyWallyMock.mockResolvedValue([] as never);
  getWallyPackageMock.mockResolvedValue({} as never);
  loginWallyMock.mockResolvedValue(true);

  const index = loadFreshIndexModule();
  const context = { env: {} } as unknown as Parameters<
    typeof index.verifyConditions
  >[1];

  await index.verifyConditions({}, context);
  await index.verifyConditions({}, context);

  expect(loginWallyMock).toHaveBeenCalledTimes(1);
});

test("verifyConditions throws aggregate error when authentication fails", async () => {
  const verifyWallyMock = verifyWally as jest.MockedFunction<
    typeof verifyWally
  >;
  const getWallyPackageMock = getWallyPackage as jest.MockedFunction<
    typeof getWallyPackage
  >;
  const loginWallyMock = loginWally as jest.MockedFunction<typeof loginWally>;

  verifyWallyMock.mockResolvedValue([] as never);
  getWallyPackageMock.mockResolvedValue({} as never);
  loginWallyMock.mockRejectedValue(new Error("auth failed"));

  const index = loadFreshIndexModule();

  await expect(
    index.verifyConditions({}, { env: {} } as unknown as Parameters<
      typeof index.verifyConditions
    >[1]),
  ).rejects.toBeInstanceOf(Error);
});

test("prepare runs verify when not yet verified", async () => {
  const verifyWallyMock = verifyWally as jest.MockedFunction<
    typeof verifyWally
  >;
  const getWallyPackageMock = getWallyPackage as jest.MockedFunction<
    typeof getWallyPackage
  >;
  const prepareWallyMock = prepareWally as jest.MockedFunction<
    typeof prepareWally
  >;

  verifyWallyMock.mockResolvedValue([] as never);
  getWallyPackageMock.mockResolvedValue({} as never);
  prepareWallyMock.mockResolvedValue(undefined);

  const index = loadFreshIndexModule();

  await index.prepare({}, {
    env: {},
    nextRelease: { version: "1.0.0" },
  } as unknown as Parameters<typeof index.prepare>[1]);

  expect(verifyWallyMock).toHaveBeenCalledTimes(1);
  expect(prepareWallyMock).toHaveBeenCalledTimes(1);
});

test("publish prepares when not prepared and then publishes", async () => {
  const verifyWallyMock = verifyWally as jest.MockedFunction<
    typeof verifyWally
  >;
  const getWallyPackageMock = getWallyPackage as jest.MockedFunction<
    typeof getWallyPackage
  >;
  const prepareWallyMock = prepareWally as jest.MockedFunction<
    typeof prepareWally
  >;
  const publishWallyMock = publishWally as jest.MockedFunction<
    typeof publishWally
  >;

  verifyWallyMock.mockResolvedValue([] as never);
  getWallyPackageMock.mockResolvedValue({} as never);
  prepareWallyMock.mockResolvedValue(undefined);
  publishWallyMock.mockResolvedValue(undefined);

  const index = loadFreshIndexModule();

  await index.publish({}, {
    env: {},
    nextRelease: { version: "1.0.0" },
  } as unknown as Parameters<typeof index.publish>[1]);

  expect(prepareWallyMock).toHaveBeenCalledTimes(1);
  expect(publishWallyMock).toHaveBeenCalledTimes(1);
});
