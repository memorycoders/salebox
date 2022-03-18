import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { setOrderBy, setFilter } from '../../AdvancedSearch/advanced-search.actions';
import { getSearch } from '../../AdvancedSearch/advanced-search.selectors';
import { showHideMassPersonalMail } from '../../Overview/overview.actions';
import { isShowSpiner } from '../../Overview/overview.selectors';
import ContactMutilActionMenu from '../../../essentials/Menu/ContactMutilActionMenu';
import cx from 'classnames';
import css from '../AppointmentListRow.css';

import _l from 'lib/i18n';

type HeaderPropsType = {
  overviewType: string,
  itemsCount: number,
};
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Responsible: 'Responsible',
    Name: 'Name',
    Contacts: 'Contacts',
    Focus: 'Focus',
  },
});

const HeaderComponent = ({
  overviewType,
  itemsCount,
  width,
  setOrderBy,
  orderBy,
  objectType,
  showSpiner,
  setFilter,
  filterBy,
  onHoverFavorite,
  setOnHoverFavorite,
}: HeaderPropsType) => {
  return (
    <div style={{ width }} className={css.header}>
      <div style={{ borderLeft: '3px solid transparent' }} className={css.check}>
        <OverviewSelectAll overviewType={overviewType} />
      </div>
      {showSpiner && (
        <div className={css.check}>
          <ContactMutilActionMenu
            showHideMassPersonalMail={showHideMassPersonalMail}
            overviewType={overviewType}
            className={css.moreAction}
          />
        </div>
      )}
      <div className={css.time} style={{ display: 'flex' }} onClick={() => setOrderBy('dateAndTime', objectType)}>
        {_l`When`}
        <span className={orderBy === 'dateAndTime' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.time} style={{ display: 'flex' }} onClick={() => setOrderBy('title', objectType)}>
        {_l`Title`}
        <span className={orderBy === 'title' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.name} style={{ display: 'flex' }} onClick={() => setOrderBy('contact', objectType)}>
        {_l`Name`}{' '}
        <span className={orderBy === 'contact' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.focus} style={{ display: 'flex' }} onClick={() => setOrderBy('focus', objectType)}>
        {_l`Focus`}{' '}
        <span className={orderBy === 'focus' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.owner} style={{ display: 'flex' }} onClick={() => setOrderBy('owner', objectType)}>
        {_l`Responsible`}{' '}
        <span className={orderBy === 'owner' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.more} />
    </div>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => {
    const search = getSearch(state, objectType);
    const showSpiner = isShowSpiner(state, overviewType);
    return {
      orderBy: search ? search.orderBy : 'dateAndTime',
      showSpiner: showSpiner,
      filterBy: search ? search.filter : null,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
    // setFilter: (pram, objectType) => setFilter(objectType, pram),
  }),
  withState('onHoverFavorite', 'setOnHoverFavorite', false)
)(HeaderComponent);
