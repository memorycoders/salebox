// @flow
import produce from 'immer';

type ActionT = {
  type: string,
  entities?: {},
  result?: string,
};
type StateT = {};
type ReducerT = (state: StateT, action: ActionT) => StateT;
type ImmerReducerT = (state: StateT, action: ActionT) => void;
type ImmerHandlersT = {
  default?: ImmerReducerT,
};

const createReducer = (initialState: StateT, handlers: ImmerHandlersT): ReducerT => {
  return (state: StateT = initialState, action: ActionT): StateT => {
    return produce(state, (draft: {}) => {
      if (handlers[action.type]) {
        handlers[action.type](draft, action);
      }

      if (handlers.default) {
        handlers.default(draft, action);
      }
      return draft;
    });
  };
};

export const createConsumeEntities = (entity: string) => (draft: {}, action: ActionT): void => {
  const { entities } = action;
  if (entities && entities[entity]) {
    const objects = entities[entity];
    Object.keys(objects).forEach((id) => {
      const right = objects[id];
      draft[id] = draft[id] || {};
      Object.keys(right).forEach((key) => {
        if (typeof right[key] !== 'undefined') {
          if (key === 'orderIntake') {
            if ((!draft[id][key] && (right[key] !== null && right[key] !== ''))){
              draft[id][key] = right[key];
            }
           return;
          }
          draft[id][key] = right[key];
        }
      });
    });
  }
};

export default createReducer;
