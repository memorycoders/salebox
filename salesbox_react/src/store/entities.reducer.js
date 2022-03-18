//@flow
import { combineReducers } from 'redux';
import user from 'components/User/user.reducer';
import participant from 'components/User/Participant/participant.reducer';
import task from 'components/Task/task.reducer';
import lead from 'components/Lead/lead.reducer';
import category from 'components/Category/category.reducer';
import appointment from 'components/Appointment/appointment.reducer';
import tag from 'components/Tag/tag.reducer';
import focus from 'components/Focus/focus.reducer';
import focusActivity from 'components/Focus/focus-activity.reducer';
import contact from 'components/Contact/contact.reducer';
import callList from 'components/CallList/callList.reducer';
import callListContact from 'components/CallListContact/callListContact.reducer';
import callListAccount from 'components/CallListAccount/callListAccount.reducer';
import organisation from 'components/Organisation/organisation.reducer';
import unit from 'components/Unit/unit.reducer';
import industry from 'components/Industry/industry.reducer';
import notification from 'components/Notification/notification.reducer';
import type from 'components/Type/type.reducer';
import prospect from 'components/Prospect/prospect.reducer';
import insight from 'components/Insight/insight.reducer';
import size from 'components/Size/size.reducer';
import customField from 'components/CustomField/custom-field.reducer';
import multiRelation from 'components/MultiRelation/multi-relation.reducer';
import salesMethod from 'components/SalesMethod/sales-method.reducer';
import measurementType from 'components/MeasurementType/measurement-type.reducer';
import lineOfBusiness from 'components/LineOfBusiness/line-of-business.reducer';
import product from 'components/Product/product.reducer';
import orderRow from 'components/OrderRow/order-row.reducer';
import unqualifiedDeal from 'components/PipeLineUnqualifiedDeals/unqualifiedDeal.reducer';
import productGroup from '../components/ProductGroup/productGroup.reducer';
import organisationDropdown from '../components/OrganisationDropdown/organisationDropdown.reducer';
import contactDropdown from '../components/ContactDropdown/contactDropdown.reducer';
import qualifiedDeal from '../components/PipeLineQualifiedDeals/qualifiedDeal.reducer';
import resources from '../components/Resources/resources.reducers';
import recruitment from '../components/Recruitment/recruitment.reducer';
export default combineReducers({
  orderRow,
  measurementType,
  product,
  lineOfBusiness,
  user,
  participant,
  salesMethod,
  prospect,
  task,
  lead,
  category,
  tag,
  focus,
  focusActivity,
  contact,
  organisation,
  unit,
  industry,
  notification,
  type,
  size,
  customField,
  multiRelation,
  appointment,
  insight,
  callListContact,
  callListAccount,
  callList,
  unqualifiedDeal,
  productGroup,
  organisationDropdown,
  contactDropdown,
  qualifiedDeal,
  resources,
  recruitment,
});
