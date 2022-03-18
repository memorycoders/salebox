// @flow
import { combineReducers } from 'redux';
import app from 'components/App/app.ui.reducer';
import delegation from 'components/Delegation/delegation.ui.reducer';
import category from 'components/Category/category.ui.reducer';
import contact from 'components/Contact/contact.ui.reducer';
import user from 'components/User/user.ui.reducer';
import unit from 'components/Unit/unit.ui.reducer';
import industry from 'components/Industry/industry.ui.reducer';
import tag from 'components/Tag/tag.ui.reducer';
import focus from 'components/Focus/focus.ui.reducer';
import type from 'components/Type/type.ui.reducer';
import size from 'components/Size/size.ui.reducer';
import notification from 'components/Notification/notification.ui.reducer';
import customField from 'components/CustomField/custom-field.ui.reducer';
import multiRelation from 'components/MultiRelation/multi-relation.ui.reducer';
import salesMethod from 'components/SalesMethod/sales-method.ui.reducer';

export default combineReducers({
  app,
  delegation,
  category,
  contact,
  user,
  unit,
  industry,
  tag,
  focus,
  type,
  size,
  notification,
  customField,
  multiRelation,
  salesMethod
});
