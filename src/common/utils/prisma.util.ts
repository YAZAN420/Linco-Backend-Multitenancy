export function buildWhere<T extends object, U>(
  filters: T,
  searchColumns?: string[],
): U {
  if (!filters) return {} as U;

  const nonFilterKeys = [
    'skip',
    'take',
    'page',
    'with',
    'cursor',
    'order',
    'orderBy',
  ];

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters) as [string, unknown][]) {
    if (value === undefined || nonFilterKeys.includes(key)) continue;

    if (
      key === 'search' &&
      searchColumns?.length &&
      typeof value === 'string'
    ) {
      result.OR = searchColumns.map((col) => ({
        [col]: { contains: value, mode: 'insensitive' as const },
      }));
      continue;
    }

    result[key] = value;
  }

  return result as U;
}
