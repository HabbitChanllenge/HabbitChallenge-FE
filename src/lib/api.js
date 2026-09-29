const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Send a request to the configured backend. Paths should start with a slash. */
export async function apiRequest(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error("API 주소가 설정되지 않았습니다. 프로젝트 루트의 .env.local에 VITE_API_BASE_URL을 입력해 주세요.");
  }

  const { body, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  let requestBody = body;

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`, {
    ...requestOptions,
    headers: requestHeaders,
    body: requestBody,
    credentials: requestOptions.credentials ?? "include",
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "string"
      ? data || `요청에 실패했습니다. (${response.status})`
      : data?.message || data?.error || `요청에 실패했습니다. (${response.status})`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
