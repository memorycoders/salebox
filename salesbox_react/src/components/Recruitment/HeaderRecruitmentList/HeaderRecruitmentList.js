import React, { useState } from 'react';
import css from '../../Resources/ResourceListRow.css';
import _l from 'lib/i18n';
import starSvg from '../../../../public/myStar.svg';
import starActiveSvg from '../../../../public/myStar_active.png';
import { connect } from 'react-redux';
import { getSearch } from '../../AdvancedSearch/advanced-search.selectors';
import { setOrderBy, setFilter } from '../../AdvancedSearch/advanced-search.actions';
import { ObjectTypes } from '../../../Constants';

function HeaderRecruitmentList(props) {
  const { orderBy, filterBy, setOrderBy, objectType = ObjectTypes.Resource, setFilter } = props;
  const [onHoverFavorite, setOnHoverFavorite] = useState(false);
  const { width, overviewType } = props;
  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content}>
        <div className={css.progressSale} onClick={() => setOrderBy('name', objectType)}>
          {overviewType === 'RECRUITMENT_CLOSED' ? _l`Yes/No` : _l`Won/Lost`}
          <span className={orderBy === 'name' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.title} onClick={() => setOrderBy('title', objectType)}>
          {_l`Name`}
          <span className={orderBy === 'title' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.occuied} onClick={() => setOrderBy('occupancy', objectType)}>
          {_l`When`}
          <span className={orderBy === 'occupancy' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.sale} onClick={() => setOrderBy('pipeline ', objectType)}>
          {_l`Responsible`}
          <span className={orderBy === 'pipeline ' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
          </span>
        </div>
        <div className={css.owner} onClick={() => setOrderBy('responsible', objectType)}>
          {_l`Date`}
          <span className={orderBy === 'responsible' ? css.activeIcon : css.normalIcon}>
            <i className="angle down icon" />
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
      orderBy: search ? search.orderBy : 'occupancy',
      filterBy: search ? search.filter : null,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
  setFilter: (pram, objectType) => setFilter(objectType, pram),
};
export default connect(makeMapStateToProps, mapDispatchToProps)(HeaderRecruitmentList);
