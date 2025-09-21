export interface CheckboxGroupEntity {
  parentId?: string;
  k: string;
  type: number;
  indeterminate?: boolean;
  checked?: boolean;
  v: string;
  children: Array<CheckboxGroupEntity>;
}
