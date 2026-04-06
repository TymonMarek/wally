import { parsePluginArgs } from "../src/args";

test("parsePluginArgs reads WALLY_TOKEN from context env", () => {
  const context = {
    env: { WALLY_TOKEN: "token-123" },
  } as unknown as Parameters<typeof parsePluginArgs>[1];

  const result = parsePluginArgs({}, context);

  expect(result).toEqual({ wallyToken: "token-123" });
});

test("parsePluginArgs returns undefined token when missing", () => {
  const context = {
    env: {},
  } as unknown as Parameters<typeof parsePluginArgs>[1];

  const result = parsePluginArgs({}, context);

  expect(result).toEqual({ wallyToken: undefined });
});
