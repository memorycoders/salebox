// @flow
import createReducer from 'store/createReducer';
import ActionTypes from './left-menu.action';

export const initialState = {
    leftMenuStatus: false
};

export default createReducer(initialState, {
    [ActionTypes.CHANGE_LEFT_MENU_STATUS]: (daft, { status }) => {
        daft.leftMenuStatus = status;
    }
});
