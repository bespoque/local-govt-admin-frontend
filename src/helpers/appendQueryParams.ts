export function appendQueryParams(
  baseUrl: string,
  queryParams?: Record<string, any>
): string {
  const queryParam = new URLSearchParams();
  if (queryParams) {
    for (const key in queryParams) {
      queryParam.append(key, queryParams[key]);
    }
  }

  return queryParams ? `${baseUrl}?${queryParam.toString()}` : baseUrl;
}
