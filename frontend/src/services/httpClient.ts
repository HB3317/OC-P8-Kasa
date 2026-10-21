export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type RequestOptions = Omit<RequestInit, "method" | "body">;

// Share HTTP, JSON, and error handling across API calls.
async function request<TResponse, TBody = undefined>(
  url: string,
  method: string,
  body?: TBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  const hasBody = body !== undefined;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      method,
      headers,
      body: !hasBody ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new HttpError(503, "Impossible de contacter le serveur.");
  }

  const raw = response.status === 204 ? "" : await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      if (response.ok) throw new HttpError(502, "Réponse du serveur invalide.");
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Erreur HTTP ${response.status}.`;
    throw new HttpError(response.status, message);
  }
  return data as TResponse;
}

export const httpClient = {
  request: <TResponse>(url: string, method: "POST" | "DELETE", options?: RequestOptions) =>
    request<TResponse>(url, method, undefined, options),
  get: <TResponse>(url: string, options?: RequestOptions) =>
    request<TResponse>(url, "GET", undefined, options),
  post: <TResponse, TBody>(url: string, body: TBody, options?: RequestOptions) =>
    request<TResponse, TBody>(url, "POST", body, options),
  put: <TResponse, TBody>(url: string, body: TBody, options?: RequestOptions) =>
    request<TResponse, TBody>(url, "PUT", body, options),
  patch: <TResponse, TBody>(url: string, body: TBody, options?: RequestOptions) =>
    request<TResponse, TBody>(url, "PATCH", body, options),
  delete: <TResponse>(url: string, options?: RequestOptions) =>
    request<TResponse>(url, "DELETE", undefined, options),
};
