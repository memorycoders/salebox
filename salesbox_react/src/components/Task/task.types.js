//@flow
export type TaskT = {
  focusWorkData: {
    name: string,
    description: string,
  },
  organisationName: string,
  contactName: string,
  contactEmail: string,
  note: string,
  contactPhone: string,
  color: string,
};

export type FetchFocusListT = {
  taskId: string,
  focusType: string,
};
