// @flow

const ActionTypes = {
    CHANGE_LEFT_MENU_STATUS: 'CHANGE_LEFT_MENU_STATUS'
};

export const changeLeftMenuStatus = (status)=>{
    return {
        type: ActionTypes.CHANGE_LEFT_MENU_STATUS,
        status
    }
}

export default ActionTypes;
