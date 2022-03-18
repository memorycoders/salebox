//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import { compose, pure, lifecycle, withState, withHandlers } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { Collapsible } from 'components';
import UnqualifiedItem from '../../../essentials/List/Unqualified/UnqualifiedItem';
import { requestFetchAccountUnqualified, sortUnqualifiedDealSublist } from '../../Organisation/organisation.actions';
import { requestFetchContactUnqualified } from '../contact.actions';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import { orderBy } from 'lodash';
import * as ContactActions from '../../Contact/contact.actions';
import css from './UnqualifiedPane.css';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Unqualified: 'Unqualified',
  },
});
const UnqualifiedPane = ({ route, data, dataInList, objectType, orderBy, handleOrderBy, isFetching }: PropsType) => {
  let objectMerge = data;
  if (dataInList) {
    objectMerge = {
      ...dataInList,
      ...data,
    };
  }
  const { unQualifieds } = objectMerge;
  let overviewType = OverviewTypes.Account_Unqualified;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewType = OverviewTypes.Account_Unqualified;
      break;
    case ObjectTypes.Contact:
      overviewType = OverviewTypes.Contact_Unqualified;
      break;
    default:
      break;
  }
  if (unQualifieds && unQualifieds.length === 0) {
    return (
      <Collapsible count="0" padded width={308} title={_l`Prospect`}>
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No prospects`}
          </Message>
        )}
      </Collapsible>
    );
  }
  return (
    <Collapsible count={unQualifieds ? unQualifieds.length : ''} width={308} title={_l`Prospect`}>
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          <UnqualifiedItem header orderBy={orderBy} setOrderBy={handleOrderBy} />
          {(unQualifieds ? unQualifieds : []).map((unqualifiedDeal) => {
            return <UnqualifiedItem route={route} unqualifiedDeal={unqualifiedDeal} overviewType={overviewType} />;
          })}
        </>
      )}
    </Collapsible>
  );
};

const mapDispatchToProps = (dispatch, { objectType }) => {
  return {
    requestFetchUnqualified: (id) => {
      const func =
        objectType === ObjectTypes.Account
          ? requestFetchAccountUnqualified
          : objectType === ObjectTypes.Contact
          ? requestFetchContactUnqualified
          : requestFetchContactUnqualified;
      dispatch(func(id));
    },
    sortUnqualifiedDealSublist: (orderBy) => {
      dispatch(sortUnqualifiedDealSublist(orderBy));
    },
    sortUnqualifiedDealSublistInContact: (orderBy) => {
      dispatch(ContactActions.sortUnqualifiedDealSublist(orderBy));
    },
  };
};

export default compose(
  connect((state, { data, objectType }) => {
    return {
      dataInList:
        objectType === ObjectTypes.Account
          ? state.entities.organisation[data.uuid]
          : objectType === ObjectTypes.Contact
          ? state.entities.contact[data.uuid]
          : state.entities.contact[data.uuid],
/*
      isFetching:
        objectType === ObjectTypes.Account
          ? state.overview.ACCOUNTS.isFetching
          : objectType === ObjectTypes.Contact
          ? state.overview.CONTACTS.isFetching
          : false,
*/
    };
  }, mapDispatchToProps),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchUnqualified, data } = this.props;
      if (data.uuid !== nextProps.data.uuid) {
        requestFetchUnqualified(nextProps.data.uuid);
      }
    },
  }),
  withGetData(({ requestFetchUnqualified, data }) => () => {
    requestFetchUnqualified(data.uuid);
  }),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  withHandlers({
    handleOrderBy: ({
      setOrderBy,
      data,
      sortUnqualifiedDealSublist,
      sortUnqualifiedDealSublistInContact,
      objectType,
    }) => (orderBy) => {
      setOrderBy(orderBy);
      if (objectType === ObjectTypes.Account) {
        sortUnqualifiedDealSublist(orderBy);
      } else if (objectType === ObjectTypes.Contact) {
        sortUnqualifiedDealSublistInContact(orderBy);
      }
    },
  }),
  pure
)(UnqualifiedPane);
