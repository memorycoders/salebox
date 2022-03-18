//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import { Collapsible } from 'components';
import { Grid, Header, Popup, Icon } from 'semantic-ui-react';
import { Container, Progress, Text } from 'components/CircularProgressBar';
import { getPriceValue } from '../../PipeLineQualifiedDeals/Insight/Insight';
import css from './SalesPane.css';

type PropsType = {
  item: {},
  averageValues: {},
  growthType: string,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Profit: {0}': 'Profit: {0}',
    '{0} days': '{0} days',
    '{0}K': '{0}K',
    Sales: 'Sales',
    Margin: 'Margin',
    'Deal size': 'Deal size',
    'Deal time': 'Deal time',
    'Compared to last year': 'Compared to last year',

    'of your company average deal size for Accounts (Outer circle)': 'of your company average deal size for Accounts (Outer circle)',

    'of your company average deal time for companies (Inner circle)':
      'of your company average deal time for companies (Inner circle)',

    ' has closed sales on': ' has closed sales on',
    'of your company average sales for Accounts (Outer circle)': 'of your company average sales for Accounts (Outer circle)',
    'of your company average margin for Accounts (Inner circle)': 'of your company average margin for Accounts (Inner circle)'


  },
});

const getColor = (ratio, reverse) => {
  if (!ratio) {
    return chartColors['GRAY'];
  }
  if (ratio < 80) {
    return reverse ? chartColors['GREEN'] : chartColors['RED'];
  }
  if (ratio >= 100) {
    return reverse ? chartColors['RED'] : chartColors['GREEN'];
  }

  return chartColors['YELLOW'];
};

const yellowIcon = (
  <div style={{ background: '#fff' }} className={`${css.circle}`}>
    <Icon style={{ color: 'white' }} color="white" name="long arrow alternate right" />
  </div>
);
const greenIcon = (
  <div style={{ background: '#AACD45' }} className={`${css.circleGreen}`}>
    <Icon style={{ color: 'white' }} color="white" name="long arrow alternate up" />
  </div>
);
const redIcon = (
  <div style={{ background: '#E0575A' }} className={`${css.circle}`}>
    <Icon style={{ color: 'white' }} color="white" name="long arrow alternate down" />
  </div>
);
const grayIcon = (
  <div style={{ background: '#5D5D5D' }} className={`${css.circle}`}>
    <Icon style={{ color: 'white' }} name="long arrow alternate right" />
  </div>
);
const icons = {
  NONE: grayIcon,
  YELLOW: yellowIcon,
  GREEN: greenIcon,
  RED: redIcon,
};

const statusColors = {
  NONE: '#5D5D5D',
  YELLOW: '#F7C06F',
  GREEN: '#AACD45',
  RED: '#E0575A',
};

const chartColors = {
  RED: '#E0575A',
  GREEN: '#AACD45',
  GRAY: '#5D5D5D', // #333
  YELLOW: '#F7C06F',
};

const textColor = '#000';

const calculatePercentage = (value, average) => {
  if (!value) {
    return 0;
  }
  if(average === 0) {
    return 0;
  }
  return (value / average) * 100;
};

const SalesPane = ({ averageValues, item, growthType }: PropsType) => {

  let name = item.name ? item.name : `${item.firstName} ${item.lastName}`

  const dealTime = Math.ceil(item.medianDealTime / (24 * 60 * 60000));
  const orderIntakeObject = getPriceValue(item.orderIntake);
  const orderIntake = `${orderIntakeObject.value ? orderIntakeObject.value : ''}${
    orderIntakeObject.unitOfMea ? orderIntakeObject.unitOfMea : ''
  }`;
  const mediaSizeObject = getPriceValue(item.medianDealSize);

  const medianDealSize = `${mediaSizeObject.value ? mediaSizeObject.value : ''}${
    mediaSizeObject.unitOfMea ? mediaSizeObject.unitOfMea : ''
  }`;
  let statusColor = '';
  let icon = '';

  if (item.contactGrowth != null) {
    icon = icons[item.contactGrowth];
    statusColor = statusColors[item.contactGrowth];
  }
  if (item.accountGrowth != null) {
    icon = icons[item.accountGrowth];

    statusColor = statusColors[item.accountGrowth];
  }

  const popup = <Popup style={{ fontSize: 11 }} trigger={icon}>{_l`Compared to last year`}</Popup>;

  // Deals Info
  const dealOuterPert = calculatePercentage(item.medianDealSize, averageValues.medianDealSize);
  const dealInnerPert = calculatePercentage(item.medianDealTime, averageValues.medianDealTime);

  let dealOuterColor = chartColors['RED'];
  let dealInnerColor = getColor(dealInnerPert, true);

  if (dealOuterPert <= 0) {
    dealOuterColor = chartColors['GRAY'];
  }

  // if (dealInnerPert <= 0) {
  //   dealInnerColor = chartColors['GRAY'];
  // }

  // Sale & Margin Info
  const smOuterPert = calculatePercentage(item.orderIntake, averageValues.closedProfit);
  const smInnerPert = calculatePercentage(item.closedMargin, averageValues.closeMargin * 100);
  let smOuterColor = getColor(smOuterPert, false);
  let smInnerColor = getColor(smInnerPert, false);
  // if (smOuterPert <= 0) {
  //   smOuterColor = chartColors['GRAY'];
  // }

  // if (smInnerPert <= 0) {
  //   smInnerColor = chartColors['GRAY'];
  // }
  // if (smInnerPert <= 80) {
  //   smInnerColor = chartColors['RED'];
  // }
  // if (smInnerPert >= 100) {
  //   smInnerColor = chartColors['GREEN'];
  // }

  return (
    <Collapsible
      hasDragable
      width={308}
      padded
      title={_l`Sales`}
      icon={popup}
      statusText={growthType}
      statusColor={statusColor}
    >
      <Grid columns={2}>
        <Grid.Column>
          <Container fullRadius={128}>
            {/* Outer */}
            <Progress percentage={dealOuterPert} color={dealOuterColor} strokeWidth={16} />
            {/* Inner */}
            <Progress percentage={dealInnerPert} color={dealInnerColor} padding={18} strokeWidth={16} />
            <Popup
              style={{ fontSize: 11, }}

              trigger={
              <Text size={20} color={textColor} text={_l`Deal size`} x={128} y={128 - 63} />
            } content={name + _l` close deals on` + ` ${dealOuterPert ? Number(dealOuterPert).toFixed(0) : 0}% ` + _l`of your company average deal size for companies (Outer circle)`}>
            </Popup>
            <Popup
              style={{ fontSize: 11, }}
             trigger={
              <Text size={20} color={textColor} text={_l`Deal time`} x={128} y={128 + 63} />
            } content={name + _l` close deals on` + ` ${dealInnerPert ? Number(dealInnerPert).toFixed(0) : 0}% ` + _l`of your company average deal time for companies (Inner circle)`}>
            </Popup>
            <Text size={40} color={dealOuterColor} text={_l`${ medianDealSize ? medianDealSize: 0 }`} x={128} y={128 - 30} />
            <Text size={40} color={dealInnerColor} text={_l`${ dealTime ? dealTime : 0} days`} x={128} y={128 + 30} />
          </Container>
        </Grid.Column>
        <Grid.Column>
          <Container fullRadius={128}>
            {/* Outer */}
            <Progress percentage={smOuterPert} color={smOuterColor} strokeWidth={16} />
            {/* Inner */}
            <Progress percentage={smInnerPert} color={smInnerColor} padding={18} strokeWidth={16} />
            <Popup
              trigger={<Text size={20} color={textColor} text={_l`Sales`} x={128} y={128 - 63} />}
              style={{ fontSize: 11 }}
              content={
                name +
                _l` has closed sales on` +
                ` ${Number(smOuterPert).toFixed(0)}% ` +
                _l`of your company average sales for companies (Outer circle)`
              }
            ></Popup>
            <Popup
              trigger={<Text size={20} color={textColor} text={_l`Margin`} x={128} y={128 + 63} />}
              style={{ fontSize: 11 }}
              content={
                name +
                _l` close a margin` +
                ` ${Number(smInnerPert).toFixed(0)}% ` +
                _l`of your company average margin for companies (Inner circle)`
              }
              style={{ fontSize: 11, }}
              content={name + _l` closes with a margin on` + ` ${Number(smInnerPert).toFixed(0)}% ` + _l`of your company average margin for companies (Inner circle)`}>
            </Popup>

            <Text size={40} color={smOuterColor} text={_l`${orderIntake ? orderIntake : 0}`} x={128} y={128 - 30} />
            <Text
              size={40}
              color={smInnerColor}
              text={_l`${item.closedMargin ? item.closedMargin / 100 : 0}:p`}
              x={128}
              y={128 + 30}
            />
          </Container>
        </Grid.Column>
      </Grid>
      <Header style={{ fontSize: 11, textAlign: 'center' }}>{_l`Profit: ${item.wonProfit}`}</Header>
    </Collapsible>
  );
};

export default compose(
  connect((state) => ({ averageValues: state.ui.app.averageValues }))
  // branch(({ item }) => !item || Object.keys(item).length < 1, renderNothing),
  // pure
)(SalesPane);
