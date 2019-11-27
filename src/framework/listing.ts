// A listing of all specs within a single suite. This is the (awaited) type of
// `groups` in 'src/suites/*/index.ts' and the auto-generated
// 'out/suites/*/index.js' files (see src/tools/gen.ts).
export type TestSuiteListing = Iterable<TestSuiteListingEntry>;

export interface TestSuiteListingEntry {
  readonly path: string;
  readonly description: string;
}
