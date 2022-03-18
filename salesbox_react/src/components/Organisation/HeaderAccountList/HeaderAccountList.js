//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import css from '../OrganisationListRow.css';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { Icon, Popup } from 'semantic-ui-react';
import { setOrderBy, setFilter } from '../../AdvancedSearch/advanced-search.actions';
import { getSearch } from '../../AdvancedSearch/advanced-search.selectors';
import { showHideMassPersonalMail } from '../../Overview/overview.actions';
import { isShowSpiner } from '../../Overview/overview.selectors';
import OrganisationMutilActionMenu from '../../../essentials/Menu/OrganisationMutilActionMenu';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';
import { getItemsAccountCount } from '../organisation.selector';

type HeaderPropsType = {
  overviewType: string,
  itemsCount: number,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Responsible: 'Responsible',
    Name: 'Name',
    'Sales': 'Sales',
    'Pipeline': 'Pipeline',
    'Industry': 'Industry',
    'Latest': 'Latest',
    Type: 'Type'
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
      <div className={css.content}>
      <div style={{ borderLeft: '3px solid transparent' }} className={css.check}>
        <OverviewSelectAll overviewType={overviewType} />
      </div>
      {showSpiner && (
        <div className={css.check}>
          <OrganisationMutilActionMenu
            showHideMassPersonalMail={showHideMassPersonalMail}
            overviewType={overviewType}
            className={css.bgMore}
          />
        </div>
      )}
      <div className={css.contact}  onClick={() => setOrderBy('Alphabetical', objectType)}>
          {_l`Name`}
          <span className={orderBy === 'Alphabetical' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
      </div>
      <div className={css.email}>{}</div>
      <div  className={css.lastestAction} onClick={() => setOrderBy('latest', objectType)}>
        {_l`Latest`}
        <span className={orderBy === 'latest' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.title} onClick={() => setOrderBy('industry', objectType)}>
        {_l`Industry`}
        <span className={orderBy === 'industry' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.type} onClick={() => setOrderBy('type', objectType)}>
        {_l`Type`}
        <span className={orderBy === 'type' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.sale}  onClick={() => setOrderBy('closedSales', objectType)}>
        <span>
          {_l`Sales`}
        </span>
        <span className={orderBy === 'closedSales' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
      </div>
      <div className={css.owner} onClick={() => setOrderBy('owner', objectType)}>
        {_l`Responsible`}
        <span className={orderBy === 'owner' ? css.activeIcon : css.normalIcon}>
          <i className="angle down icon" />
        </span>
      </div>
      <div className={css.more} onClick={() => (filterBy === 'favorite' ? setFilter('', objectType) : setFilter('favorite', objectType))}>
        <span style= {{paddingRight: 23}}>
          {onHoverFavorite || filterBy === 'favorite' ? (
          <div className={css.circleButtonActive}>
            <img style={{ height: '15px', width: '15px' }} src={starActiveSvg}
                onMouseEnter={() => {
                  setOnHoverFavorite(true);
                }}
                onMouseLeave={() => {
                  setOnHoverFavorite(false);
                }}
            />
          </div>
        ) : (
          <div className={css.circleButton}>
            <img style={{ height: '15px', width: '15px' }} src={starSvg}
                onMouseEnter={() => {
                  setOnHoverFavorite(true);
                }}
                onMouseLeave={() => {
                  setOnHoverFavorite(false);
                }}/>
          </div>
        )}
      </span>
      </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => {
    const search = getSearch(state, objectType)
    const showSpiner = isShowSpiner(state, overviewType);
    return {
      orderBy: search ? search.orderBy : 'closedSales',
      itemsCount: getItemsAccountCount(state),
      showSpiner: showSpiner,
      filterBy: search ? search.filter : null,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    {
      setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
      setFilter: (pram, objectType) => setFilter(objectType, pram),
      showHideMassPersonalMail: (s) => showHideMassPersonalMail(s),
    }
    ),
    withState('onHoverFavorite', 'setOnHoverFavorite', false),
)(HeaderComponent);
