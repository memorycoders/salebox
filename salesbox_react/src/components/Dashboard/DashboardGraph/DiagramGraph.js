// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { compose } from 'recompose';
import { Chart } from 'Constants';
import moment from 'moment';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type PropsType = {
  data: {},
  height: string | number,
};

const sum = (array)=> {
  let sum = 0;
  array.forEach(item => {
    sum += Number(item);
  });
  return sum;
}
const isSamePeriodTime=(customDashBoard) => {
  let isSamePeriod = true;
  for (let i = 0; i < customDashBoard.dashBoardDataSetDTOList.length - 1; i++) {
    if (customDashBoard.dashBoardDataSetDTOList[i].diffPeriod != customDashBoard.dashBoardDataSetDTOList[i + 1].diffPeriod) {
      isSamePeriod = false;
    }
  }
  return isSamePeriod;
}

const groupData = createSelector(
  (diagram) => diagram,
  (diagram) => {
    let names = {};
    const periods = {};
    let chartType = 'LineGraph';
    let checkMoreThan = false;
/*
    checkMoreThan = diagram.dashBoardDataSetDTOList.length > 1 && diagram.dashBoardDataSetDTOList.find(dataSet => dataSet.diffPeriod < 0);
    if (diagram.periodType === 'YEAR' || diagram.periodType === 'QUARTER' || diagram.periodType === 'MONTH' || diagram.periodType === 'WEEK'){
      if (checkMoreThan){
        chartType = 'BarGraph'
      }
    }
*/
    checkMoreThan =!isSamePeriodTime(diagram);
    if(checkMoreThan){
      chartType = 'BarGraph'
    }
    let list = {}
    const columnName = diagram.dashBoardDataSetDTOList.length > 0 ? diagram.dashBoardDataSetDTOList[0].name : '';


    diagram.dashBoardDataSetDTOList.map((data) => {

      if (checkMoreThan){
        const mid = data.endDate == null ? data.startDate : Math.ceil((data.startDate + data.endDate) / 2);
        const dataSum = sum(data.dataSet);
        periods[mid] = true;
        names[data.name] = {
          ...names[data.name],
          [mid]: dataSum
        };
        names[data.name][mid] = dataSum;

      } else {
        names[data.name] = {};
        data.periodDTOList.forEach((period, index) => {
          const mid = period.startDate;
          periods[mid] = true;
          names[data.name][mid] = data.dataSet[index];
        });
      }



    });

    const nameList = Object.keys(names).sort();
    const data = Object.keys(periods)
      .sort()
      .map((period) => {
        const d = {
          date: Math.round(period),
        };
        nameList.forEach((name) => {
          d[name] = names[name][period] || 0;
        });
        return d;
      });

    return {
      periodType: diagram.periodType,
      names: nameList,
      data,
      chartType,
      checkMoreThan
    };
  }
);

const getColor = (start, index) => {
  return Chart.Colors[start + index * 10];
};

const dateFormatter = (tickItem) => {
  return moment(tickItem).format('DD MMMM');
};

type GraphPropsType = {
  diagramData: {
    data: Array<{}>,
    names: Array<>,
    periodType: string,
  },
  height: string | number,
};

const LineGraph = ({ diagramData, height, fullscreen }: GraphPropsType) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={diagramData.data}>
        <XAxis dataKey="date" tickFormatter={(tickItem) => {
          if (diagramData.periodType === 'YEAR') {
            return moment(tickItem).format('MMM');
          } else if (diagramData.periodType === 'QUARTER') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('[Q]Q-YYYY');
            }
            return moment(tickItem).format('MMM');
          } else if (diagramData.periodType === 'MONTH') {
            if(diagramData.checkMoreThan){
              return moment(tickItem).format('MMM');
            }
            return moment(tickItem).format('DD');
          } else if (diagramData.periodType === 'WEEK') {
            if (diagramData.checkMoreThan) {
              return `W${moment(tickItem).week()}`;
            }
            return moment(tickItem).format('ddd');
          } else if (diagramData.periodType === 'DAY') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('DD-MMM');
            }
            return moment(tickItem).format('HH');
          }
        }}  />
        <YAxis
          width={fullscreen ? 100 : 60}
        style={{ fontSize: fullscreen ? 15 : 11, fontWeight: fullscreen ? '600' : '400' }} />
        <CartesianGrid strokeDasharray="4 4" />
        <Tooltip labelFormatter={(tickItem) => {
          if (diagramData.periodType === 'YEAR') {
            return moment(tickItem).format('MMM');
          } else if (diagramData.periodType === 'QUARTER') {
            return moment(tickItem).format('[Q]Q-YYYY');
          } else if (diagramData.periodType === 'MONTH') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('MMM');
            }
            return moment(tickItem).format('DD');
          } else if (diagramData.periodType === 'WEEK') {
            if (diagramData.checkMoreThan) {
              return `W${moment(tickItem).week()}`;
            }
            return moment(tickItem).format('ddd');
          } else if (diagramData.periodType === 'DAY') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('DD-MMM');
            }
            return moment(tickItem).format('HH');
          }
        }} />
        <Legend wrapperStyle={{ fontSize: fullscreen ? 18 : 11 }} />
        {diagramData.names.map((name, index) => {
          return (
            <Line
              strokeWidth={3}
              key={name}
              type="monotone"
              dataKey={name}
              stroke={getColor(3, (index * 2) % 10)}
              activeDot={{ r: 8 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

const BarGraph = ({ diagramData, height, fullscreen }: GraphPropsType) => {
  console.log('diagramData: ', diagramData)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart width="100%" data={diagramData.data}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="date" tickFormatter={(tickItem) => {
          if (diagramData.periodType === 'YEAR'){
            return moment(tickItem).format('YYYY');
          } else if (diagramData.periodType === 'QUARTER') {
            return moment(tickItem).format('[Q]Q-YYYY');
          } else if (diagramData.periodType === 'MONTH') {
            return moment(tickItem).format('MMM');
          } else if (diagramData.periodType === 'WEEK') {
            return `W${moment(tickItem).isoWeek()}`;
          } else if (diagramData.periodType === 'DAY') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('DD-MMM');
            }
            return moment(tickItem).format('HH');
          }
        }} />
        <YAxis width={fullscreen ? 100 : 60} style={{ fontSize: fullscreen ? 15 : 11, fontWeight: fullscreen ? '600' : '400', width: fullscreen ? 100 : 60 }} />
        <Tooltip labelFormatter={(tickItem) => {
          if (diagramData.periodType === 'YEAR') {
            return moment(tickItem).format('YYYY');
          } else if (diagramData.periodType === 'QUARTER') {
            return moment(tickItem).format('[Q]Q-YYYY');
          } else if (diagramData.periodType === 'MONTH') {
            return moment(tickItem).format('MMM');
          } else if (diagramData.periodType === 'WEEK') {
            return `W${moment(tickItem).isoWeek()}`;
          } else if (diagramData.periodType === 'DAY') {
            if (diagramData.checkMoreThan) {
              return moment(tickItem).format('DD-MMM');
            }
            return moment(tickItem).format('HH');
          }
        }} />
        <Legend wrapperStyle={{ fontSize: fullscreen ? 18 : 11, }}/>
        {diagramData.names.map((name, index) => {
          return <Bar key={name} dataKey={name} fill={getColor(3, (index * 2) % 10)} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

const DiagramGraph = ({ data, height, fullscreen }: PropsType) => {
  const diagramData = groupData(data);
  let Graph;
  if (diagramData.chartType === 'BarGraph') {
    Graph = BarGraph;
  } else {
    Graph = LineGraph;
  }
  return (
    <React.Fragment>
      <Graph fullscreen={fullscreen} height={height} diagramData={diagramData} />
    </React.Fragment>
  );
};

export default compose()(DiagramGraph);
// withState('zoom', 'setZoom', { x: [new Date(2017, 1, 1), new Date(2018, 1, 1)] }),
