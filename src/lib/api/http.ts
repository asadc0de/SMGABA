import { apiUrl } from "./config";

export class ApiError extends Error {
  readonly status: number;
  readonly responseBody: unknown;

  constructor(message: string, status: number, responseBody: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(apiUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "The API request could not be completed.",
    );
  }

  const responseBody = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "error" in responseBody &&
      typeof responseBody.error === "string"
        ? responseBody.error
        : `API request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as TResponse;
}

export async function apiGet<TResponse>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(apiUrl(path, query), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "The API request could not be completed.",
    );
  }

  const responseBody = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "error" in responseBody &&
      typeof responseBody.error === "string"
        ? responseBody.error
        : `API request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as TResponse;
}
