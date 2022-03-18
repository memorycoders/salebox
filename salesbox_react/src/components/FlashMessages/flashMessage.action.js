// @flow
const ActionTypes = {
  ADD_FLASH_MESSAGE: 'ADD_FLASH_MESSAGE',
  REMOVE_FLASH_MESSAGE: 'REMOVE_FLASH_MESSAGE',
  REMOVE_ALL_FLASH_MESSAGES: 'REMOVE_ALL_FLASH_MESSAGES',
};

export const addInfoFlashMessage = (messages) => {
  return {
    type: ActionTypes.ADD_FLASH_MESSAGE,
    messages,
    noti_type: 'info',
  };
};

export const addSuccessFlashMessage = (messages) => {
  return {
    type: ActionTypes.ADD_FLASH_MESSAGE,
    messages,
    noti_type: 'success',
  };
};

export const addWarningFlashMessage = (messages) => {
  return {
    type: ActionTypes.ADD_FLASH_MESSAGE,
    messages,
    noti_type: 'warning',
  };
};

export const addErrorFlashMessage = (messages) => {
  return {
    type: ActionTypes.ADD_FLASH_MESSAGE,
    messages,
    noti_type: 'warning',
  };
};

export const removeFlashMessage = (id) => {
  return {
    type: ActionTypes.REMOVE_FLASH_MESSAGE,
    id,
  };
};

export const removeAllFlashMessages = () => {
  return {
    type: ActionTypes.REMOVE_ALL_FLASH_MESSAGES,
  };
};

export default ActionTypes;
