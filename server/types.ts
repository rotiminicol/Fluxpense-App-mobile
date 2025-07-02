export function parseQueryParam(param: unknown): string | undefined {
  if (typeof param === 'string') {
    return param;
  }
  return undefined;
}