interface PrevStateProps<T> {
  message?: string;
  status: boolean;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
