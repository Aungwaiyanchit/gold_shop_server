export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

export const getPaginationParams = (query: {
  page: number;
  limit: number;
  q?: string;
}) => {
  const { page, limit, q } = query;
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    q,
    offset,
  };
};
