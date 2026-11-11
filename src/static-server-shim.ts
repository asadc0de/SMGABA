type ServerFunctionHandler = (...args: never[]) => never;

type ServerFunctionBuilder = {
  validator: (validator: (input: unknown) => unknown) => ServerFunctionBuilder;
  handler: (handler: ServerFunctionHandler) => ServerFunctionHandler;
};

export function createServerFn(): ServerFunctionBuilder {
  const builder: ServerFunctionBuilder = {
    validator: () => builder,
    handler: () => {
      throw new Error(
        "This server function is unavailable in the static frontend. Use the Vercel API client.",
      );
    },
  };
  return builder;
}

export async function getRequestIP(): Promise<string | undefined> {
  return undefined;
}

export function getRequestHeader(): string | undefined {
  return undefined;
}
