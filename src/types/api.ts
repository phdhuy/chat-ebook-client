export type Meta = {
    current_page: number;
    next_page: number;
    prev_page: number;
    total_pages: number;
    total_count: number;
  };

export type ApiResponse<T> = {
  status: string;
  data: T;
  meta?: Meta;
};