export interface CheckboxGroupEntity {
  parentId?: string;
  id: string;
  type: number;
  indeterminate?: boolean;
  checked?: boolean;
  menuName: string;
  children: Array<CheckboxGroupEntity>;
}
