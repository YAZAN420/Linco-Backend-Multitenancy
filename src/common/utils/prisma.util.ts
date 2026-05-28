export function buildWhere<T extends Record<string, any>, U>(
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
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || nonFilterKeys.includes(key)) continue;

    if (key === 'search' && searchColumns?.length) {
      result.OR = searchColumns.map((col) => ({
        [col]: { contains: value, mode: 'insensitive' },
      }));
      continue;
    }

    result[key] = value;
  }

  return result as U;
}
