import React, { Component } from 'react';
import CircularProgressBar from '../../CircularProgressBar/CircularProgressBar';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import './Insight.less';
import _l from 'lib/i18n';
import * as OverviewActions from 'components/Overview/overview.actions';
import { getOpportunityReportInfo } from '../qualifiedDeal.selector';
import Colors from '../../Insight/colors';
import { OverviewTypes } from 'Constants';
import moment from 'moment';
import * as NotificationActions from '../../Notification/notification.actions';
import { getUser } from '../../Auth/auth.selector';

// ở đây translate phải như thế này không được sửa
addTranslations({
  'en-US': {
    'Set a sales target': 'Set a sales target',
    'Win ratio': 'Win ratio',
    Forecast: 'Forecast',
    'to reach the target': 'to reach the target',
    'deals before': 'deals before',
    Add: 'Add',
    'You needed': 'You needed',
    'Congratulations! You have reached your target!': 'Congratulations! You have reached your target!',
    'There are enough deals to reach the target': 'There are enough deals to reach the target',
  },
});

export const getPriceValue = (value) => {
  var roundNumber = Math.round(value);
  if (roundNumber < 1000) return { value: roundNumber, unitOfMea: '' };

  //Thousands
  if (roundNumber >= 1000 && roundNumber < 10000) {
    return { value: Math.round(roundNumber / 10) / 100, unitOfMea: 'K' };
  } else if (roundNumber >= 10000 && roundNumber < 100000) {
    return { value: Math.round(roundNumber / 100) / 10, unitOfMea: 'K' };
  } else if (roundNumber >= 100000 && roundNumber < 1000000) {
    return { value: Math.round(roundNumber / 1000), unitOfMea: 'K' };
  }

  // Millions
  else if (roundNumber >= 1000000 && roundNumber < 10000000) {
    return { value: Math.round(roundNumber / 10000) / 100, unitOfMea: 'M' };
  } else if (roundNumber >= 10000000 && roundNumber < 100000000) {
    return { value: Math.round(roundNumber / 100000) / 10, unitOfMea: 'M' };
  } else if (roundNumber >= 100000000 && roundNumber < 1000000000) {
    return { value: Math.round(roundNumber / 1000000), unitOfMea: 'M' };
  }

  //Billions
  else if (roundNumber >= 1000000000 && roundNumber < 10000000000) {
    return { value: Math.round(roundNumber / 10000000) / 100, unitOfMea: 'B' };
  } else if (roundNumber >= 10000000000 && roundNumber < 100000000000) {
    return { value: Math.round(roundNumber / 100000000) / 10, unitOfMea: 'B' };
  } else if (roundNumber >= 100000000000 && roundNumber < 1000000000000) {
    return { value: Math.round(roundNumber / 1000000000), unitOfMea: 'B' };
  }
  return 0;
};

class InsightC extends Component {
  render() {
    let data = [
      {
        value: '0K',
        key: 'REPORT_CIRCLE_SALES',
        name: _l`Forecast`,
        border: false,
        colorType: 'GREEN',
        targetValue: 0,
      },
      {
        value: 100,
        name: _l`Win ratio`,
        key: 'WIN_RATIO',
        border: true,
        colorType: 'GREEN',
      },
      {
        value: 75,
        key: 'PIPE_PROGRESS',
        name: _l`Pipe progress`,
        border: true,
        colorType: 'GREEN',
      },
    ];
    const { OpportunityReportInfo } = this.props;
    if (OpportunityReportInfo) {
      const { circleDTOList } = OpportunityReportInfo;
      data = data.map((initData) => {
        const findData = (circleDTOList ? circleDTOList : []).find((value) => value.labelType === initData.key);
        if (findData) {
          return {
            ...initData,
            ...findData,
          };
        }
        return {
          ...initData,
        };
      });
    }

    const { setSalesTarget } = this.props;
    return (
      <div className="qualified-insight">
        <div className="qualified-progress">
          {data.map((item, idx) => {
            const borderColor = !item.colorType ? '#fff' : Colors[item.colorType];
            let percentage = getPriceValue(item.value);
            if (typeof percentage !== 'number') {
              percentage = `${percentage.value}${percentage.unitOfMea}`;
            }
            let subText = getPriceValue(item.targetValue);
            if (typeof subText !== 'number') {
              subText = `${subText.value}${subText.unitOfMea}`;
            }
            return (
              <div key={item.key} className="progress-item">
                <CircularProgressBar
                  width={60}
                  height={60}
                  noBorder={!item.border}
                  subText={item.key === 'REPORT_CIRCLE_SALES' ? `${subText}` : ''}
                  percentage={item.key === 'REPORT_CIRCLE_SALES' ? `${percentage}` : item.value}
                  radius={18}
                  textStyle="font24"
                  color={borderColor}
                />
                <div>{item.name}</div>
              </div>
            );
          })}
        </div>
        {OpportunityReportInfo?.displaySalesForecast && (
          <div
            onClick={() => {
              if (!OpportunityReportInfo.hasTarget) {
                setSalesTarget();
              }
            }}
            style={{ backgroundColor: Colors[OpportunityReportInfo.color] }}
            className="set-sales-button"
          >
            {OpportunityReportInfo.color == 'GREEN' &&
              OpportunityReportInfo.hasTarget &&
              !OpportunityReportInfo.reachTarget && (
                <div>
                  <span>{_l`There are enough deals to reach the target`}</span>
                </div>
              )}
            {OpportunityReportInfo.color == 'GREEN' &&
              OpportunityReportInfo.hasTarget &&
              OpportunityReportInfo.reachTarget && (
                <div>
                  <span>{_l`Congratulations! You have reached your target!`}</span>
                </div>
              )}
            {OpportunityReportInfo.color == 'RED' && OpportunityReportInfo.hasTarget && (
              <>
                {OpportunityReportInfo.hasTarget && (
                  <span>
                    <span>{_l`You needed`} </span>
                    <span class="text-bold text-larger">
                      {Math.ceil(OpportunityReportInfo ? OpportunityReportInfo.missingProspect : 0)}{' '}
                    </span>
                    <span>{_l`deals before`} </span>
                    <span class="text-bold text-larger">
                      {moment(OpportunityReportInfo.date).format('DD MMM, YYYY')}{' '}
                    </span>
                    <span>{_l`to reach the target`}</span>
                  </span>
                )}
              </>
            )}
            {OpportunityReportInfo.color == 'YELLOW' && OpportunityReportInfo.hasTarget && (
              <>
                <span>{_l`Add`} </span>
                <span class="text-bold text-larger">{Math.ceil(OpportunityReportInfo.missingProspect)} </span>
                <span translate>{_l`deals before`} </span>
                <span class="text-bold text-larger">{moment(OpportunityReportInfo.date).format('DD MMM, YYYY')} </span>
                <span>{_l`to reach the target`} </span>
              </>
            )}
            {!OpportunityReportInfo.hasTarget && (
              <>
                <span>{_l`Set a sales target`}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export const Insight = compose(
  connect(
    (state) => {
      const OpportunityReportInfo = getOpportunityReportInfo(state);
      return {
        OpportunityReportInfo,
        user: getUser(state),
      };
    },
    {
      highlight: OverviewActions.highlight,
      notiError: NotificationActions.error,
    }
  ),
  withHandlers({
    setSalesTarget: ({ highlight, notiError, user }) => () => {
      if (user?.isAdmin) {
        highlight(OverviewTypes.Pipeline.Qualified, null, 'set_sale_target');
      } else {
        notiError('You need to be a administrator for this action');
      }
    },
  })
)(InsightC);
