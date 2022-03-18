//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose, pure, withHandlers, withState, lifecycle } from 'recompose';
import { Message, Loader } from 'semantic-ui-react';
import { withGetData } from 'lib/hocHelpers';
import { Collapsible } from 'components';
import QualifiedItem from '../../../essentials/List/Qualified/QualifiedItem';
import { requestFetchContactQualified } from '../contact.actions';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import { requestFetchAccountQualified, sortQualifiedDealSublist } from '../../Organisation/organisation.actions';
import css from '../../Organisation/Cards/TasksCard.css';
import * as ContactActions from '../contact.actions';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Qualified: 'Qualified',
  },
});
const QualifiedPane = ({ route, data, dataInList, objectType, orderBy, handleOrderBy, isFetching }: PropsType) => {
  let objectMerge = data;
  if (dataInList) {
    objectMerge = {
      ...dataInList,
      ...data,
    };
  }
  let overviewType = OverviewTypes.Account_Qualified;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewType = OverviewTypes.Account_Qualified;
      break;
    case ObjectTypes.Contact:
      overviewType = OverviewTypes.Contact_Qualified;
      break;
    default:
      break;
  }
  const { qualifieds } = objectMerge;
  if (qualifieds && qualifieds.length === 0) {
    return (
      <Collapsible count="0" padded wrapperClassName={css.appointmentContainer} width={308} title={_l`Deals`}>
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No deals`}
          </Message>
        )}
      </Collapsible>
    );
  }
  return (
    <Collapsible count={qualifieds ? qualifieds.length : ''} width={308} title={_l`Deals`}>
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          <QualifiedItem header orderBy={orderBy} setOrderBy={handleOrderBy} />
          {(qualifieds ? qualifieds : []).map((value) => {
            return <QualifiedItem route={route} qualifiedDeal={value} overviewType={overviewType} />;
          })}
        </>
      )}
    </Collapsible>
  );
};

const mapDispatchToProps = (dispatch, { objectType }) => {
  return {
    requestFetchQualified: (id) => {
      const func =
        objectType === ObjectTypes.Account
          ? requestFetchAccountQualified
          : objectType === ObjectTypes.Contact
          ? requestFetchContactQualified
          : requestFetchContactQualified;
      dispatch(func(id));
    },
    sortQualifiedDealSublist: (orderBy) => {
      dispatch(sortQualifiedDealSublist(orderBy));
    },
    sortQualifiedDealSublistInContact: (orderBy) => {
      dispatch(ContactActions.sortQualifiedDealSublist(orderBy));
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
  withState('orderBy', 'setOrderBy', 'dateAndTime'),

  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchQualified, data } = this.props;
      if (data.uuid !== nextProps.data.uuid) {
        requestFetchQualified(nextProps.data.uuid);
      }
      if (ObjectTypes.Contact === nextProps.objectType) {
        nextProps.sortQualifiedDealSublistInContact(nextProps.orderBy);
      } else if (ObjectTypes.Account === nextProps.objectType) {
        nextProps.sortQualifiedDealSublist(nextProps.orderBy);
      }
    },
  }),
  withGetData(({ requestFetchQualified, data }) => () => {
    requestFetchQualified(data.uuid);
  }),

  withHandlers({
    handleOrderBy: ({ setOrderBy, data, sortQualifiedDealSublist, objectType, sortQualifiedDealSublistInContact }) => (
      orderBy
    ) => {
      setOrderBy(orderBy);
      if (ObjectTypes.Contact === objectType) {
        sortQualifiedDealSublistInContact(orderBy);
      } else if (ObjectTypes.Account === objectType) {
        sortQualifiedDealSublist(orderBy);
      }
    },
  }),
  pure
)(QualifiedPane);
