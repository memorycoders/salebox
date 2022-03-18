//@flow
export type DropdownType = {
  key: string,
  value: any,
  text: string,
};

export type EventHandlerType = (event: Event, { value: string }) => void;
export type CallbackType = () => void;
