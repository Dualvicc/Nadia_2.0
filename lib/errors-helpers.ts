/**
 * Create custom error classes that can be thrown in the app
 * Each custom error class extends the built-in Error class and has a specific name that can be used for more precise error handling
 * @param name Name property of the error instance
 * @returns A new class extending Error with the specified error name
 * @example
 * ```typescript
 * const InvalidURL = createErrorFactory("InvalidURL");
 * throw new InvalidURL("The provided URL is invalid.");
 * ```
 */
const createErrorFactory = function (name: string) {
  return class CustomizeError extends Error {
    constructor(message: string) {
      super(message);
      this.name = name;
    }
  };
};

export const InvalidURL = createErrorFactory("InvalidURL");
export const ConnectionError = createErrorFactory("ConnectionError");
export const InvalidData = createErrorFactory("InvalidData");
export const SendError = createErrorFactory("SendError");
