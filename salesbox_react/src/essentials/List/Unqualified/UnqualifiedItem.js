// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Avatar from '../../../components/Avatar/Avatar';
import { Icon, Popup, Button } from 'semantic-ui-react';
import ContactPopup from '../../../components/Contact/ContactPopup';
import CreatorPane from '../../../components/User/CreatorPane/CreatorPane';
import * as OverviewActions from 'components/Overview/overview.actions';
// import * as contactActions from 'components/Contact/contact.actions';
import cx from 'classnames';
import css from './UnqualifiedItem.css';
import overviewCss from 'components/Overview/Overview.css';
import Moment from 'react-moment';
import moment from 'moment';
import UnqualifiedSubListAction from '../../Menu/UnqualifiedSubListAction';
import _l from 'lib/i18n';
import { withRouter } from 'react-router';
addTranslations({
  'en-US': {
    Deadline: 'Deadline',
    Who: 'Who',
    What: 'What',
    'Resp.': 'Resp.',
  },
});

const UnqualifiedListHeader = ({ objectType, orderBy, setOrderBy }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div className={css.dealine} onClick={() => setOrderBy('dateAndTime')}>
        <span>
          {_l`Deadline`}
          <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div className={css.who} onClick={() => setOrderBy('accountContact')}>
        <span>
          {_l`Who`}
          <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div className={css.info} />
      <div className={css.focus} onClick={() => setOrderBy('description')}>
        <span>
          {_l`What`}
          <span className={orderBy === 'description' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      {/* <div className={css.mask} /> */}
      <div className={css.resp} onClick={() => setOrderBy('owner')}>
        <span style={{ marginLeft: 6 }}>
          {_l`Resp.`}
          <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
    </div>
  );
};

const UnqualifiedItem = ({
  unqualifiedDeal,
  overviewType,
  acceptedDelegate,
  declineDelegate,
  setTask,
  setActionInHistoryTask,
  setUnqualified,
  currentUser,
  route,
  history
}: PropsT) => {
  const {
    organisationPhone,
    organisationEmail,
    finishedDate,
    deadlineDate,
    contactEmail,
    contactPhone,
    productList,
    lineOfBusiness,
    createdDate,
  } = unqualifiedDeal;

  const interestTitle = lineOfBusiness ? lineOfBusiness.name : '';
  const interestSubtitle =
    productList && productList.length > 0
      ? productList.map((p, index) => {
          return <div key={index}>{p.name}</div>;
        })
      : '';

  const renderActionSpinder = () => {
    if (unqualifiedDeal.accepted === null && unqualifiedDeal.type === 'INVITED') {
      return (
        <div className={css.responsibleRow}>
          <CreatorPane size={30} creator={{ avatar: unqualifiedDeal.ownerAvatar }} avatar={true} />
          <div className={css.invitedBtn}>
            {/*{unqualifiedDeal.ownerId == currentUser.uuid && <>*/}
            <a onClick={acceptedDelegate} className={css.accpetInvited}>
              Accept
            </a>
            <a onClick={declineDelegate} className={css.declineInvited}>
              Decline
            </a>
            {/*</>}*/}
          </div>
        </div>
      );
    }
    return (
      <div className={css.responsibleRow}>
        <CreatorPane
          styleCircle={{ marginRight: 6 }}
          size={30}
          creator={{ avatar: unqualifiedDeal.ownerAvatar }}
          avatar={true}
        />
        <div className={css.rightMenu}>
          <div className={css.reponsibleIconSize}>
            {(unqualifiedDeal.type === 'MANUAL' || (unqualifiedDeal.type === 'INVITED' && unqualifiedDeal.accepted)) &&
            unqualifiedDeal.ownerId ? (
              <div
                className={
                  !unqualifiedDeal.finished
                    ? `${css.notSetasDone}`
                    : unqualifiedDeal.prospectId != null
                    ? `${css.hasConvert}`
                    : `${css.setDone}`
                }
                onClick={!unqualifiedDeal.finished ? setUnqualified : setActionInHistoryTask}
              >
                <div></div>
              </div>
            ) : (
              <div className={css.spaceForNotDone}></div>
            )}
          </div>

          <div className={css.reponsibleIconSize}>
            <UnqualifiedSubListAction
              className={css.bgMore}
              unqualifiedDeal={unqualifiedDeal}
              overviewType={overviewType}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleDate = (value) => {
    return new Date(value).getTime() < new Date().getTime() && new Date(value).getDate() < new Date().getDate();
  };
  const listCn = cx(css.listItem, css[unqualifiedDeal.status]);
  return (
    <div onClick={()=>{
      if(route){
        history.push(`${route}/unqualified/${unqualifiedDeal.uuid}`)
      }
    }} className={listCn}>
      <div className={css.dealine}>
        {!unqualifiedDeal.finished ? (
          <div className={cx(handleDate(deadlineDate) && css.redColor)}>
            {finishedDate === null ? (deadlineDate ? moment(deadlineDate).format('DD MMM YYYY') : '') : ''}
          </div>
        ) : (
          <div>
            <p>{moment(finishedDate).format('DD MMM YYYY')}</p>
          </div>
        )}
      </div>
      <div className={css.who}>
        {unqualifiedDeal.contactId ? <Avatar
          size={30}
          fallbackIcon="user"
          isShowName
          borderSize={3}
          src={unqualifiedDeal.contactAvatar}
          firstName={unqualifiedDeal.contactFirstName}
          lastName={unqualifiedDeal.contactLastName}
          border={unqualifiedDeal.relationship}
        /> : ''}
      </div>
      {unqualifiedDeal.contactName || unqualifiedDeal.contactEmail || unqualifiedDeal.contactPhone ? (
        <div className={css.info}>
          <ContactPopup
            triggerClassName={css.bgMore}
            name={unqualifiedDeal.contactName}
            email={unqualifiedDeal.contactEmail}
            phone={unqualifiedDeal.contactPhone}
          />
        </div>
      ) : (
        <div className={css.info}></div>
      )}

      <div className={css.focus}>
        <div>{interestTitle}</div>
        <div>{interestSubtitle}</div>
      </div>

      <div className={css.resp}>{renderActionSpinder(unqualifiedDeal)}</div>
    </div>
  );
};

const mapDispatchToProps = {
  highlight: OverviewActions.highlight,
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(UnqualifiedListHeader)),
  connect((state, { overviewType }) => {
    const currentUser = state.auth.user;
    return {
      currentUser,
    };
  }, mapDispatchToProps),
  withHandlers({
    acceptedDelegate: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'acceptedDelegate', unqualifiedDeal);
    },
    declineDelegate: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'declineDelegate', unqualifiedDeal);
    },

    setTask: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'set');
    },
    setUnqualified: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'set');
    },
    setActionInHistoryTask: () => (e) => {
      e.stopPropagation();
    },
  })
)(UnqualifiedItem);
