import React, { useState } from 'react';
import css from '../ResourceListRow.css';
import _l from 'lib/i18n';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';
import { connect } from 'react-redux';
import { getSearch } from '../../AdvancedSearch/advanced-search.selectors';
import { setOrderBy, setFilter } from '../../AdvancedSearch/advanced-search.actions';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import MutilActionMenu from '../../../essentials/Menu/MutilActionMenu';
import ResourceMutilActionMenu from './ResourceMultiActionMenu';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { isShowSpiner } from '../../Overview/overview.selectors';

function HeaderResourcesList(props) {
  const { orderBy, filterBy, setOrderBy, objectType = ObjectTypes.Resource, setFilter, showSpiner } = props;
  const [onHoverFavorite, setOnHoverFavorite] = useState(false);
  const { width } = props;
  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content}>
        <div className={css.check}>
          <OverviewSelectAll overviewType={objectType} />
        </div>
        {showSpiner && (
          <div className={css.check}>
            <ResourceMutilActionMenu className={css.bgMore} overviewType={OverviewTypes.Resource} />
          </div>
        )}

        <div className={css.contact} onClick={() => setOrderBy('name', objectType)}>
          {_l`Name`}
          <span className={orderBy === 'name' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.email}>{}</div>
        <div className={css.title} onClick={() => setOrderBy('title', objectType)}>
          {_l`Title`}
          <span className={orderBy === 'title' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.occuied} onClick={() => setOrderBy('occupancy', objectType)}>
          {_l`Occupied`}
          <span className={orderBy === 'occupancy' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.sale} onClick={() => setOrderBy('pipeline ', objectType)}>
          {_l`Pipeline`}
          <span className={orderBy === 'pipeline ' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.owner} onClick={() => setOrderBy('responsible', objectType)}>
          {_l`Manager`}
          <span className={orderBy === 'responsible' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div
          className={css.more}
          onClick={() => (filterBy === 'favorite' ? setFilter('', objectType) : setFilter('favorite', objectType))}
        >
          <span style={{ paddingRight: 17 }}>
            {onHoverFavorite || filterBy === 'favorite' ? (
              <div className={css.circleButtonActive}>
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

          <div className={css.spinner} style={{background: "#fff"}}></div>
        </div>
      </div>
    </div>
  );
}
const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => {
    const search = getSearch(state, objectType);
    return {
      orderBy: search ? search.orderBy : 'occupancy',
      filterBy: search ? search.filter : null,
      showSpiner: isShowSpiner(state, overviewType),
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
  setFilter: (pram, objectType) => setFilter(objectType, pram),
};
export default connect(makeMapStateToProps, mapDispatchToProps)(HeaderResourcesList);
