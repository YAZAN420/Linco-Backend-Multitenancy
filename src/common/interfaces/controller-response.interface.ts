export interface ControllerResponse<T> {
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}
