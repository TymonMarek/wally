import SemanticReleaseError from "@semantic-release/error";
export declare const link: (file: string) => string;
export type ErrorDefinition = {
  message: string;
  details: string;
};
export declare const enum ErrorCode {
  WallyNotInstalled = 0,
}
export declare const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDefinition>;
export declare function getError(errorCode: ErrorCode): SemanticReleaseError;
//# sourceMappingURL=error.d.ts.map
