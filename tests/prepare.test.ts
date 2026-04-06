import { prepareWally } from "../src/prepare";
import { getWallyPackage, setWallyPackage } from "../src/package";

jest.mock("../src/package", () => ({
  getWallyPackage: jest.fn(),
  setWallyPackage: jest.fn(),
}));

test("prepareWally updates package version and persists it", async () => {
  const getWallyPackageMock = getWallyPackage as jest.MockedFunction<
    typeof getWallyPackage
  >;
  const setWallyPackageMock = setWallyPackage as jest.MockedFunction<
    typeof setWallyPackage
  >;

  const packageObject = {
    package: {
      name: "scope/pkg",
      description: "desc",
      version: "1.0.0",
      realm: "shared",
      registry: "https://wally.run",
    },
  } as unknown as Awaited<ReturnType<typeof getWallyPackage>>;

  getWallyPackageMock.mockResolvedValue(packageObject);

  const context = {
    nextRelease: { version: "2.3.4" },
  } as unknown as Parameters<typeof prepareWally>[1];

  await prepareWally({}, context);

  expect(packageObject.package.version).toBe("2.3.4");
  expect(setWallyPackageMock).toHaveBeenCalledWith(packageObject, {}, context);
});
