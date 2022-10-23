interface SearchParams {
  page: number | string | null;
  perPage: number | string | null;
  query: string | null;
  wayIds: string[] | number[] | null;
}

interface SearchData<T> {
  data: T[];
  items_count: number;
}

interface MessageResponse {
  message: string;
  success: boolean;
}

export type { SearchParams, SearchData, MessageResponse };
