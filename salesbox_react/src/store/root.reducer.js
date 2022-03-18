import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import auth from 'components/Auth/auth.reducer';
import wizard from 'components/Wizard/wizard.reducer';
import common from 'components/Common/common.reducer';
import profile from 'components/Profile/profile.reducer';
import settings from 'components/Settings/settings.reducer';
import period from 'components/PeriodSelector/period-selector.reducer';
import search from 'components/AdvancedSearch/advanced-search.reducer';
import overview from 'components/Overview/overview.reducer';
import dropdown from 'components/Dropdown/dropdown.reducer';
import dashboard from 'components/Dashboard/dashboard.reducer';
import ui from './ui.reducer';
import entities from './entities.reducer';
import remember from './remember.reducer';
import download from './local-download.reducer';
import leftMenu from '../components/LeftMenu/left-menu.reducer';
import trello from '../components/PipeLineQualifiedDeals/TaskSteps/TrelloElement/trello-reducer';
import flashMessages from 'components/FlashMessages/flashMessage.reducer';
import AuthActionTypes from "../components/Auth/auth.actions";

const appReducer = combineReducers({
  form: formReducer,
  router: routerReducer,
  dashboard,
  ui,
  auth,
  wizard,
  entities,
  profile,
  settings,
  search,
  period,
  overview,
  dropdown,
  remember,
  download,
  leftMenu,
  common,
  trello,
  flashMessages,
});
const rootReducer = (state, action) => {
  // clear all data
  if(action.type == AuthActionTypes.LOGOUT) {
    if (state.ui.app != null && state.ui.app.locale != null)
      state = {ui: {app: {locale: state.ui.app.locale}}}
    else
      state = undefined;
  }
  return appReducer(state, action)
}
export default rootReducer;
