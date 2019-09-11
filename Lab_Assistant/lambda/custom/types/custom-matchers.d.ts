declare global {
  namespace jest {
    interface Matchers<R> {
      toSpeek(speech: string): R;
    }
  }
}

// A hack? to avoid compile errors:
// https://github.com/Microsoft/TypeScript/issues/17736#issuecomment-323073256
export {};
