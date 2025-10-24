export interface TableColumn<T> {
  label: string;
  attribute: keyof T;
}
