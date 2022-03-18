import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { ContentLoader } from 'components/Svg';
import cx from 'classnames';
import api from 'lib/apiClient';
import { isItemSelected, isItemHighlighted, isShowSpiner } from 'components/Overview/overview.selectors';
import { withRouter } from 'react-router';
import starWonActive from '../../../../public/star_circle_won_active.svg';
import starLostActive from '../../../../public/star_circle_lost_active.svg';
import starIcon from '../../../../public/myStar.svg';
import starIconActive from '../../../../public/myStar_active.png';
import css from '../RecruitmentListRow.css';
import overviewCss from '../../Overview/Overview.css';
import { Checkbox, Popup } from 'semantic-ui-react';
import { OverviewTypes } from '../../../Constants';
import CreatorPane from '../../User/CreatorPane/CreatorPane';
import RecruitmentActionMenu from '../RecruitmentActionMenu';
import moment from 'moment';
import { highlight, select, unselect, updateFavoriteClosedSuccess } from '../../Overview/overview.actions';
import { Endpoints } from '../../../Constants';
import { fetchCloseDataByCaseId } from '../recruitment.actions';
const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);
const nameLoader = (
  <ContentLoader width={400} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);
const occuiedLoader = (
  <ContentLoader width={100} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);
const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.content}>
        <div className={css.contact}>{nameLoader}</div>
        <div className={css.email}>{daysLoader}</div>
        <div className={css.title}>{noteLoader}</div>
        <div className={css.occuied}>{occuiedLoader}</div>
        <div className={css.sale}>{occuiedLoader}</div>
        <div className={css.owner}>{daysLoader}</div>
        <div className={css.more}>{checkLoader}</div>
      </div>
    </div>
  );
};
const InfiniteRecruitmentClosedListRow = ({
  select,
  highlighted,
  className,
  style,
  overviewType,
  selected,
  itemId,
  highlight,
  currentRC,
  fetchCloseDataByCaseId,
  updateFavoriteClosedSuccess,
  history,
  unselect
}) => {
  const listCn = cx(css.itemRow, className, {
    [overviewCss.highlighted]: highlighted,
  });
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const shortenValue = (value) => {
    if (value && value.length > limit) {
      return value.slice(0, limit);
    }
    return value;
  };

  const checkBorder = () => {};

  const borderColorCheck = checkBorder(itemId);

  // const pastDealLineDate = deadlineDate < now;
  let contractDate = itemId?.contractDate;

  const goto = () => {
    highlight(overviewType, itemId.contactId);
    history.push(`/recruitment/closed/${itemId.contactId}`);
  };
  const setFavoriteDeal  = async(e) => {
    e.stopPropagation()
    console.log('itemId.uuid', itemId)
    try {
      const create = await api.post({
        resource: `${Endpoints.Recruitment}/candidate/${itemId.uuid}/updateFavorite`,
        data: {
          favorite: !itemId.favorite
        },
      });
      if (create) {
        updateFavoriteClosedSuccess(itemId.uuid, !itemId.favorite)
      }
    } catch (error) {
      console.log('err', error)
    }
  };
  const [onHoverWon, setOnHoverWon] = useState(false);
  const [onHoverLost, setOnHoverLost] = useState(false);
  const handleSelect = (e, { checked }) => {
    e.stopPropagation();
    if (!checked) {
      unselect(overviewType, itemId.uuid);
    } else {
      select(overviewType, itemId.uuid);
    }
  };
  return (
    <React.Fragment>
      <div className={listCn} style={style} onClick={goto}>
        <div className={css.content}>
          <div className={css.check}>
            <Checkbox onChange={handleSelect} checked={selected} />
          </div>
          <div className={css.progressSale}>
            {overviewType === OverviewTypes.RecruitmentClosed && itemId?.won && (
              <div style={{ height: '40px', width: '40px' }}>
                <img style={{ height: '38px', width: '38px' }} src={starWonActive} />
              </div>
            )}
            {overviewType === OverviewTypes.RecruitmentClosed && itemId?.won === false && (
              <div style={{ height: '40px', width: '40px' }}>
                <img style={{ height: '38px', width: '38px' }} src={starLostActive} />
              </div>
            )}
          </div>
          <div className={css.contact} style={{ width: '35%' }}>
            {itemId?.contactName}
          </div>
          <div className={cx(css.interest, css.time)}>
            {itemId?.wonLostDate && moment(itemId?.wonLostDate).format('DD MMM YYYY')}
          </div>

          <div style={{paddingLeft: '2.5%'}} className={css.responsible}>
            {
              <CreatorPane
                size={30}
                creator={{
                  firstName: itemId?.ownerName?.split(' ')?.[0],
                  lastName: itemId?.ownerName?.split(' ')?.[1],
                  avatar: itemId?.ownerAvatar,
                  disc: itemId?.ownerDiscProfile,
                }}
                firstName={itemId?.ownerName?.split(' ')?.[0]}
                lastName={itemId?.ownerName?.split(' ')?.[1]}
                avatar={true}
              />
            }
          </div>
          <div style={{paddingLeft: '3.25%'}}  className={css.favorite}>
            {itemId?.favorite && (
              <div className={css.circleButtonActive} onClick={setFavoriteDeal}>
                <img style={{ height: '15px', width: '15px' }} src={starIconActive} />
              </div>
            )}
            {!itemId?.favorite && (
              <div className={css.circleButton} onClick={setFavoriteDeal}>
                <img style={{ height: '15px', width: '15px' }} src={starIcon} />
              </div>
            )}
          </div>
          <div style={{paddingLeft: '0.75%'}} className={cx(css.spiner, css.spinerRow)} >
            <RecruitmentActionMenu overviewType={OverviewTypes.RecruitmentClosed} candidate={itemId}/>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId }) => ({
    showSpiner: isShowSpiner(state, overviewType),
    selected: isItemSelected(state, overviewType, itemId?.uuid),
    highlighted: isItemHighlighted(state, overviewType, itemId?.uuid),
    currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  highlight,
  select,
  unselect,
  fetchCloseDataByCaseId,
  updateFavoriteClosedSuccess
};

export default withRouter(connect(makeMapStateToProps, mapDispatchToProps)(InfiniteRecruitmentClosedListRow));
