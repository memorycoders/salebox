import React, { useState } from 'react';
import css from '../../Resources/ResourceListRow.css';
import _l from 'lib/i18n';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';
import { connect } from 'react-redux';
import { getSearch } from '../../AdvancedSearch/advanced-search.selectors';
import { setOrderBy, setFilter } from '../../AdvancedSearch/advanced-search.actions';
import { ObjectTypes } from '../../../Constants';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { isShowSpiner } from '../../Overview/overview.selectors';
import ContactMutilActionMenu from '../../../essentials/Menu/ContactMutilActionMenu';

function HeaderRecruitmentCloseList(props) {
  const { orderBy, filterBy, setOrderBy, objectType = ObjectTypes.RecruitmentClosed, setFilter, showSpiner } = props;
  const [onHoverFavorite, setOnHoverFavorite] = useState(false);
  const { width, overviewType } = props;
  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content}>
        <div style={{ borderLeft: '3px solid transparent' }} className={css.check}>
          <OverviewSelectAll overviewType={overviewType} />
        </div>
        {showSpiner && (
          <div className={css.check}>
            <ContactMutilActionMenu
              showHideMassPersonalMail={false}
              overviewType={overviewType}
              className={css.bgMore}
            />
          </div>
        )}
        <div style={{ width: '10%' }} className={css.progressSale} onClick={() => setOrderBy('wonLost', objectType)}>
          {_l`Yes/No`}
          <span className={orderBy === 'wonLost' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        {/* <div className={css.email}>{}</div> */}
        <div className={css.contact} onClick={() => setOrderBy('contactName', objectType)}>
          {_l`Name`}
          <span className={orderBy === 'contactName' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.time} style={{ width: '30%' }} onClick={() => setOrderBy('wonLostDate', objectType)}>
          {_l`When`}
          <span className={orderBy === 'wonLostDate' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.responsible} style={{ width: '13.5%' }} onClick={() => setOrderBy('owner', objectType)}>
          {_l`Responsible`}
          <span className={orderBy === 'owner' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div
          className={css.more}
          onClick={() => (filterBy === 'favorite' ? setFilter('', objectType) : setFilter('favorite', objectType))}
        >
          <span style={{ paddingRight: 23 }}>
            {onHoverFavorite || filterBy === 'favorite' ? (
              <div className={css.circleButton}>
                <img
                  style={{ height: '15px', width: '15px' }}
                  src={starActiveSvg}
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
                <img
                  style={{ height: '15px', width: '15px' }}
                  src={starSvg}
                  onMouseEnter={() => {
                    setOnHoverFavorite(true);
                  }}
                  onMouseLeave={() => {
                    setOnHoverFavorite(false);
                  }}
                />
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => {
    const search = getSearch(state, objectType);
    return {
      orderBy: search?.orderBy === 'dateAndTime' ? 'wonLostDate' : search?.orderBy,
      filterBy: search ? search.filter : null,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
  setFilter: (pram, objectType) => setFilter(objectType, pram),
};
export default connect(makeMapStateToProps, mapDispatchToProps)(HeaderRecruitmentCloseList);
