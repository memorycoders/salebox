import reducer, { initialState } from './app.ui.reducer';
import ActionTypes from './app.actions';

describe('app.ui.reducer', () => {
  it('shows app drawer', () => {
    expect(reducer(initialState, { type: ActionTypes.SHOW_DRAWER })).toEqual({
      drawerShown: true,
      notifications: 0,
    });
  });
  it('hides the drawer', () => {
    expect(reducer(initialState, { type: ActionTypes.HIDE_DRAWER })).toEqual({
      drawerShown: false,
      notifications: 0,
    });
  });
  it('toggles the drawer', () => {
    expect(reducer(initialState, { type: ActionTypes.TOGGLE_DRAWER })).toEqual({
      drawerShown: !initialState.drawerShown,
      notifications: 0,
    });
  });
});
