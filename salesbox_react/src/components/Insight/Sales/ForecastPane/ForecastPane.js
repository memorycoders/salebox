//@flow
import React, { useRef } from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Icon, Loader } from 'semantic-ui-react';
import * as InsightActions from 'components/Insight/insight.actions';
import { lifecycle, compose, withState } from 'recompose';
import {
  VictoryVoronoiContainer,
  VictoryLegend,
  VictoryScatter,
  VictoryTooltip,
  VictoryTheme,
  VictoryChart,
  VictoryBar,
  VictoryLine,
} from 'victory';
import { Chart } from 'Constants';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';
import { FORECAST_TYPE } from '../../../../Constants';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Forecasts: 'Forecasts',
  },
});


const ForecastPane = ({ data, revenue, margin, profit, setCurrentForecastType, currentForecastType, fetchForecast, isLoading }: PropsT) => {
  const carouselRef = useRef(null);
  const changeChart = (next) => {
    //increment
    if (carouselRef) {
      if (next) {
        carouselRef.current.increment();
      } else {
        carouselRef.current.decrement();
        //decrement
      }
    }
  };
  const handleChange = (index) => {

    if(currentForecastType !== FORECAST_TYPE[index]) {
      setCurrentForecastType(FORECAST_TYPE[index])
      fetchForecast()
    }
  }

  return (
    <InsightPane
      padded
      title={_l`Forecasts`}
      headerRight={
        <div>
          <Icon onClick={() => changeChart(false)} style={{ fontSize: 16, width: 10 }} name={'caret left'} />
          <Icon onClick={() => changeChart(true)} style={{ fontSize: 16, width: 10 }} name={'caret right'} />
        </div>
      }
    >
      <Carousel ref={carouselRef} onChange={handleChange}>
        <div className={css.forecast}>
          {isLoading && currentForecastType === FORECAST_TYPE[0] ? <Loader active  size="large"></Loader> : 
          <>
          <div className={css.chartName}>
            {_l`Forecast Sales`}
          </div>
          <VictoryChart
            width={1000}
            responsive={false}
            theme={VictoryTheme.material}
            containerComponent={<VictoryVoronoiContainer />}
            domainPadding={{ x: 8 }}
          >
            <VictoryBar labelComponent={<VictoryTooltip />} style={{ data: { fill: '#c43a31' } }} data={data.column} />
            <VictoryLine interpolation="monotoneX" labelComponent={<VictoryTooltip />} data={data.line} />
            <VictoryScatter labelComponent={<VictoryTooltip />} data={data.line} style={Chart.Scatter} />
            <VictoryLegend
              orientation="horizontal"
              gutter={20}
              colorScale={['#c43a31', '#000']}
              data={[{ name:_l`Forecast` + '( ' + (_l`Close` + '+ ' + _l`Weighted` + ')') }, { name: _l`Target` }]}
            />
          </VictoryChart>
          </>
          }

        </div>
        <div className={css.forecast}>
        {isLoading && currentForecastType === FORECAST_TYPE[1] ? <Loader active  size="large"></Loader> : 
        <>
          <div className={css.chartName}>{_l`Forecast Revenue`}</div>
          <VictoryChart
            width={1000}
            responsive={false}
            theme={VictoryTheme.material}
            containerComponent={<VictoryVoronoiContainer />}
            domainPadding={{ x: 8 }}
          >
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              style={{ data: { fill: '#c43a31' } }}
              data={revenue.column}
            />
            <VictoryLine interpolation="monotoneX" labelComponent={<VictoryTooltip />} data={revenue.line} />
            <VictoryScatter labelComponent={<VictoryTooltip />} data={revenue.line} style={Chart.Scatter} />
            <VictoryLegend
              orientation="horizontal"
              gutter={20}
              colorScale={['#c43a31', '#000']}
              data={[{ name: _l`Forecast` + '( ' + (_l`Close` + '+ ' + _l`Weighted` + ')') }, { name: _l`Target` }]}
            />
          </VictoryChart>
          </>
        }
        </div>
        <div className={css.forecast}>
          {isLoading && currentForecastType === FORECAST_TYPE[2]? <Loader active  size="large"></Loader> : 
          <>
          <div className={css.chartName}>{_l`Forecast Profit`}</div>
          <VictoryChart
            width={1000}
            responsive={false}
            theme={VictoryTheme.material}
            containerComponent={<VictoryVoronoiContainer />}
            domainPadding={{ x: 8 }}
          >
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              style={{ data: { fill: '#c43a31' } }}
              data={profit.column}
            />
            <VictoryLine interpolation="monotoneX" labelComponent={<VictoryTooltip />} data={profit.line} />
            <VictoryScatter labelComponent={<VictoryTooltip />} data={profit.line} style={Chart.Scatter} />
            <VictoryLegend
              orientation="horizontal"
              gutter={20}
              colorScale={['#c43a31', '#000']}
              data={[{ name:_l`Forecast` + '( ' + (_l`Close` + '+ ' + _l`Weighted` + ')') }, { name: _l`Target` }]}
            />
          </VictoryChart>
          </>
          }
        </div>
        <div className={css.forecast}>
          {isLoading && currentForecastType === FORECAST_TYPE[3] ? <Loader active  size="large"></Loader> : 
          <>
          <div className={css.chartName}>{_l`Forecast Margin`}</div>
          <VictoryChart
            width={1000}
            responsive={false}
            theme={VictoryTheme.material}
            containerComponent={<VictoryVoronoiContainer />}
            domainPadding={{ x: 8 }}
          >
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              style={{ data: { fill: '#c43a31' } }}
              data={margin.column}
            />
            <VictoryLine interpolation="monotoneX" labelComponent={<VictoryTooltip />} data={margin.line} />
            <VictoryScatter labelComponent={<VictoryTooltip />} data={margin.line} style={Chart.Scatter} />
            <VictoryLegend
              orientation="horizontal"
              gutter={20}
              colorScale={['#c43a31', '#000']}
              data={[{ name:_l`Forecast` + '( ' + (_l`Close` + '+ ' + _l`Weighted` + ')') }, { name: _l`Target` }]}
            />
          </VictoryChart>
          </>
          }
        </div>
      </Carousel>
    </InsightPane>
  );
};

const mapDispatchToProps = {
  fetchForecast: InsightActions.fetchForecast,
  setCurrentForecastType: InsightActions.setCurrentForecastType
};

const mapStateToProps = (state) => {
  const { insight } = state.entities;
  const { revenue, margin, profit, currentForecastType, isLoading } = insight;
  return {
    revenue: revenue || {
      column: [],
      line: [],
    },
    margin: margin || {
      column: [],
      line: [],
    },
    profit: profit || {
      column: [],
      line: [],
    },
    roleType: state.ui.app.roleType,
    activeRole: state.ui.app.activeRole,
    userId: state.auth.userId,
    currentForecastType: currentForecastType,
    isLoading: isLoading
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('currentIndex', 'setCurrentIndex', 0),
  lifecycle({
    componentDidMount() {
      this.props.fetchForecast();
    },
    componentWillReceiveProps(nextProps) {
      const { activeRole, roleType, userId } = this.props;
      if (nextProps.activeRole !== activeRole || nextProps.roleType !== roleType || userId !== nextProps.userId) {
        if (location.pathname === '/insights/sales') {
          this.props.fetchForecast();
        }
      }
    },
  })
)(ForecastPane);

// export default ForecastPane;
