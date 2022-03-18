// @flow

export type RowType = {
  field: string,
  value: string,
  valueId: string,
  valueDate: string,
  operator: string,
};

export type SearchType = {
  groups: Array<string>,
  shown: boolean,
  selected: string,
  name: string,
  tag: string,
  term: string,
};
