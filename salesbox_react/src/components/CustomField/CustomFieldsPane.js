//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { defaultProps, compose, pure, branch, renderNothing, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import Collapsible from '../Collapsible/Collapsible';
import { Loader, Form } from 'semantic-ui-react';
import * as CustomFieldActions from './custom-field.actions';
import css from './CustomField.css';
import { isFetching, getCustomFieldValues, getCustomFieldsObject } from './custom-field.selectors';
import CustomFieldInput from './CustomFieldInput/CustomFieldInput';
import { isSignedIn } from '../Auth/auth.selector';
import { ObjectTypes, Endpoints } from '../../Constants';
import SpecialCustomField from '../Contact/SpecialCustomField/SpecialCustomField';
import api from 'lib/apiClient';

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Custom fields': 'Custom fields',
  },
});

const CustomFieldPane = ({
  isDetail,
  noHeader,
  fetching,
  customFields,
  object,
  objectId,
  calculatingPositionMenuDropdown,
  colId,
  objectType,
  type0,
  isConnectTeams,
  hasConnectTeams, //this props used for check connect team Account & Qualified Deal
  listProjectForum,
  formID
}: PropsType) => {
  if (isDetail && !objectId) {
    return (
      <Collapsible hasDragable width={308} padded title={_l`Custom fields`}>
        <Form className={ formID ? `position-unset`: ''}>
          {customFields &&
            customFields
              .filter((value) => value.active)
              .map((customField, index) => {
                return <CustomFieldInput formID={formID} type0={type0} customFieldObject={customField} key={customField.uuid} />;
              })}
        </Form>
      </Collapsible>
    );
  }

  if (!objectId) {
    return (
      <>
        <Form className={formID ? `position-unset`: ''}>
          {customFields &&
            customFields
              .filter((value) => value.active)
              .map((customField, index) => {
                return <CustomFieldInput formID={formID} type0={type0} customFieldObject={customField} key={customField.uuid} />;
              })}
        </Form>
      </>
    );
  }

  if (noHeader && objectId) {
    return (
      <Form className={formID ? `position-unset`: ''}>
        {customFields
          .filter((value) => value.active)
          .map((customField, index) => {
            return (
              <CustomFieldInput
                type0={type0}
                colId={colId}
                formID={formID}
                noHeader={noHeader}
                object={objectId ? object : null}
                customFieldObject={customField}
                customFieldId={customField.uuid}
                key={customField.uuid}
              />
            );
          })}
      </Form>
    );
  }

  return (
    <Collapsible hasDragable width={308} padded title={_l`Custom fields`}>
      {fetching && (
        <div className={css.loader}>
          <Loader size="massive" inline active />
        </div>
      )}
      {!fetching && (
        <>
          {objectType === ObjectTypes.Contact && isConnectTeams && (
            <SpecialCustomField objectType={objectType} objectId={objectId} />
          )}

          {objectType === ObjectTypes.Account && <SpecialCustomField listProjectForum={listProjectForum} objectType={objectType} objectId={objectId} />}
          {objectType === ObjectTypes.Opportunity && <SpecialCustomField listProjectForum={listProjectForum} objectType={objectType} objectId={objectId} />}
          <Form className={formID ? `position-unset`: ''}>
            {customFields
              .filter((value) => value.active)
              .map((customField, index) => {
                return (
                  <CustomFieldInput
                    type0={type0}
                    colId={colId}
                    formID={formID}
                    object={objectId ? object : null}
                    customFieldObject={customField}
                    objectType={objectType}
                    customFieldId={customField.uuid}
                    key={customField.uuid}
                  />
                );
              })}
          </Form>
        </>
      )}
    </Collapsible>
  );
};

const mapStateToProps = (state, { objectType, objectId }) => {
  let customFields = [];
  if (objectId) {
    customFields = getCustomFieldValues(state, objectId);
  } else {
    customFields = getCustomFieldsObject(state);
  }

  return {
    fetching: isFetching(state, objectType, objectId),
    customFields,
    isSignedIn: isSignedIn(state),
    isConnectMsTeams: state.common.isConnectMsTeams,
  };
};

const isCustomFieldsEmpty = (customFields, hasConnectTeam) => {
  if (customFields && customFields.length > 0) return false;
  if (customFields && customFields.length === 0 && hasConnectTeam) return false;
  if (customFields && customFields.length === 0 && !hasConnectTeam) return true;
  return true;
};

export default compose(
  // branch(({ contact }) => !contact || Object.keys(contact).length < 1, renderNothing),
  defaultProps({
    customFields: [],
    object: {},
  }),
  withState('hasConnectTeam', 'setHasConnnectTeam', false),
  withState('listProjectForum', 'setListProjectForum', {}),
  connect(mapStateToProps, {
    requestFetch: CustomFieldActions.requestFetch,
    fetchRequestCustomFieldsObject: CustomFieldActions.fetchRequestCustomFieldsObject,
  }),
  lifecycle({
    async componentWillReceiveProps(nextProps) {
      const { requestFetch, objectType, objectId, isConnectMsTeams } = this.props;

      if (objectId !== nextProps.objectId && nextProps.objectId) {
        requestFetch(objectType, nextProps.objectId);
        if((objectType === ObjectTypes.Account || objectType === ObjectTypes.Contact || objectType === ObjectTypes.Opportunity) && isConnectMsTeams) {
          try {
            const res = await api.get({
              resource: `${Endpoints.Contact}/msTeam/getProjectForums`,
              query: {
                objectId: nextProps.objectId,
                objectType:
                  objectType === ObjectTypes.Account
                    ? 'ACCOUNT'
                    : objectType === ObjectTypes.Contact
                    ? 'CONTACT'
                    : 'OPPORTUNITY',
              },
            });
            if (res && res.code == null) {
              this.props.setHasConnnectTeam(true);
              this.props.setListProjectForum(res);
            }
          } catch(e){

          }

        }

      }
    },
  }),
  withGetData(({ requestFetch, objectType, objectId, fetchRequestCustomFieldsObject, isSignedIn }) => () => {
    if (!objectId) {
      return fetchRequestCustomFieldsObject(objectType);
    }
    if (objectId) {
      requestFetch(objectType, objectId);
    }
  }),
  branch(({ customFields, hasConnectTeam }) => isCustomFieldsEmpty(customFields, hasConnectTeam), renderNothing)
)(CustomFieldPane);
