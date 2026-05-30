export function buildNestedInclude<T>(
  withRelations?: string[],
  allowedRelations: string[] = [],
): T | undefined {
  if (!withRelations?.length) {
    return undefined;
  }

  const includeObject: Record<string, unknown> = {};

  for (const relationPath of withRelations) {
    const parts = relationPath.split('.').slice(0, 2);
    const rootRelation = parts[0];

    if (allowedRelations.length && !allowedRelations.includes(rootRelation)) {
      continue;
    }

    let current = includeObject;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      if (isLast) {
        if (current[part] === undefined) {
          current[part] = true;
        }
      } else {
        if (current[part] === undefined || current[part] === true) {
          current[part] = { include: {} as Record<string, unknown> };
        }

        const nextLevel = current[part] as { include: Record<string, unknown> };

        if (!nextLevel.include) {
          nextLevel.include = {};
        }

        current = nextLevel.include;
      }
    });
  }

  return Object.keys(includeObject).length ? (includeObject as T) : undefined;
}
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

export function buildOrderBy<T extends Record<string, unknown>>(
  orderBy: T | undefined,
  allowedFields: string[],
): Record<string, 'asc' | 'desc'>[] {
  if (!orderBy) return [];

  return Object.entries(orderBy)
    .filter(([field, dir]) => allowedFields.includes(field) && dir)
    .map(([field, dir]) => ({
      [field]: String(dir).toLowerCase() as 'asc' | 'desc',
    }));
}
