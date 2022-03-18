/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import { branch, renderNothing, compose, pure, defaultProps, withHandlers } from 'recompose';
import cx from 'classnames';
import css from './ContactPane.css';
import QualifiedCircle from '../../Svg/QualifiedCircle';
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import { checkBorder } from '../../PipeLineQualifiedDeals/TaskSteps/CardStep';
import starWonActive from '../../../../public/star_circle_won_active.svg';
import starLostActive from '../../../../public/star_circle_lost_active.svg';
addTranslations({
  'en-US': {
    Value: 'Value',
    Net: 'Net',
    Profit: 'Profit',
    Margin: 'Margin',
    'Days in pipe': 'Days in pipe',
    'Next action': 'Next action',
  },
});

const ContactQualified = ({ history, route, color, qualifiedDeal, currency, isOrder }) => {
  const borderColorCheck = checkBorder(qualifiedDeal);
  const progressBorberColor =
    borderColorCheck === 'GREEN' ? '#aacd40' : borderColorCheck === 'YELLOW' ? '#f4b24e' : '#df5759';
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const {
    description,
    serialNumber,
    organisationName,
    grossValue,
    netValue,
    profit,
    margin,
    daysInPipeline,
    contractDate,
    realProspectProgress,
    sponsorList,
    organisationId,
  } = qualifiedDeal || {};
  const shortenName = (value) => {
    if (value && value.length > 21) {
      return value.slice(0, 21);
    }
    return value;
  };

  const contactName =
    sponsorList && sponsorList.length > 0 ? `${sponsorList[0].firstName} ${sponsorList[0].lastName}` : '';

  const routing = (type) => {
    if (type === 'CONTACT') {
      if (sponsorList && sponsorList.length > 0) history.push(`${route}/contact/${sponsorList[0].uuid}`);
    } else {
      if (organisationId) history.push(`${route}/account/${organisationId}`);
    }
  };

  return (
    <div className={css.contactContainer}>
      <div className={cx(css.header, css.qualifiedHeader, color)}>
        <div className={css.contentContact}>
          <Popup
            position="top center"
            style={{ fontSize: 11 }}
            content={description}
            trigger={<div className={`${css.heading} ${css.qualifiedDescription}`}>{description}</div>}
          ></Popup>

          {serialNumber && <div className={css.subHeading}>{serialNumber}</div>}
          {organisationName && (
            <div className={css.heading}>
              {organisationName.length > 21 ? (
                <Popup
                  trigger={
                    <div style={{ cursor: 'pointer' }} onClick={() => routing('ACCOUNT')}>{`${shortenName(
                      organisationName
                    )}...`}</div>
                  }
                  style={{ fontSize: 11 }}
                  content={organisationName}
                  position="top center"
                />
              ) : (
                  <span style={{ cursor: 'pointer' }} onClick={() => routing('ACCOUNT')}>
                    {organisationName}
                  </span>
                )}
            </div>
          )}
          {!organisationId && (
            <div className={css.heading}>
              {contactName.length > 21 ? (
                <Popup
                  trigger={
                    <div style={{ cursor: 'pointer' }} onClick={() => routing('CONTACT')}>{`${shortenName(
                      contactName
                    )}...`}</div>
                  }
                  style={{ fontSize: 11 }}
                  content={contactName}
                  position="top center"
                />
              ) : (
                  <span style={{ cursor: 'pointer' }} onClick={() => routing('CONTACT')}>
                    {contactName}
                  </span>
                )}
            </div>
          )}
        </div>
        <div className={css.contactDetails}>
          <div className={css.qualifiedContractDetails}>
            <div className={css.qualifiedContractLeft}>
              <ul>
                <li>
                  <span className={css.weight400}>{_l`Value`}:</span>{' '}
                  <span className={css.weight500}>
                    {grossValue && numberWithCommas(Math.ceil(grossValue))} {currency}
                  </span>
                </li>
                <li>
                  <span className={css.weight400}>{_l`Net`}:</span>{' '}
                  <span className={css.weight500}>
                    {netValue && numberWithCommas(Math.ceil(netValue))} {currency}
                  </span>
                </li>
                <li>
                  <span className={css.weight400}>{_l`Profit`}:</span>{' '}
                  <span className={css.weight500}>
                    {profit && numberWithCommas(Math.ceil(profit))} {currency}
                  </span>
                </li>
              </ul>
            </div>
            <div className={css.qualifiedContractRight}>
              <ul style={{ padding: '10px 4px 0px 4px' }}>
                <li><span className={css.weight400}>{_l`Margin`}:</span> <span className={css.weight500}>{margin && Math.round(margin * 100)} %</span></li>
                <li><span className={css.weight400}>{_l`Active for`}:</span> <span className={css.weight500}>{Math.ceil(daysInPipeline / 1000 / 3600 / 24)} {_l`Days`}</span></li>
                <li><span className={css.weight400}>{isOrder ? _l`Closure date` : _l`Next action`}: </span>
                  <span style={{ borderRadius: 5 }} className={!isOrder && (moment(new Date(contractDate)).isSameOrAfter(moment(new Date())) || moment(new Date(contractDate)).isSame(moment(new Date()), 'day') ? css.weight500 : css.oldDate)}>{isOrder ? (
                    qualifiedDeal.wonLostDate ? moment(qualifiedDeal.wonLostDate).format('DD MMM YYYY') : ''
                  ) : (contractDate ? moment(contractDate).format('DD MMM YYYY') : '')}&nbsp;&nbsp;</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={cx(css.centerImage, css.notBorder)} flipDirection="horizontal">
        {isOrder ? (
          <img width={90} src={qualifiedDeal.won ? starWonActive : starLostActive} />
        ) : (
            <CircularProgressBar textStyle={css.font24} color={progressBorberColor} percentage={realProspectProgress} />
          )}

        {/* <QualifiedCircle
          width={100}
          height={100}
          percent={realProspectProgress}
          radius={50}
          color={'rgb(225, 86, 86)'}
          strokeWidth={4}
        /> */}
      </div>
    </div>
  );
};

export default compose(
  defaultProps({}),
  branch(({ qualifiedDeal }) => !qualifiedDeal, renderNothing),
  pure
)(ContactQualified);
