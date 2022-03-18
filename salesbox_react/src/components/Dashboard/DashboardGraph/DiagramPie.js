// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { compose } from 'recompose';
import { Chart } from 'Constants';
import _l from 'lib/i18n';
import { ResponsiveContainer, Legend, PieChart, Pie, Tooltip, Cell } from 'recharts';
import { connect } from 'react-redux';
import {isNumber} from "recharts/es6/util/DataUtils";

type PropsType = {
  data: {},
  height: string | number,
};

const groupData = createSelector(
  (diagram) => diagram,
  (diagram) => {
    const data = [];
    let hasNodata = true;
    diagram.dashBoardDataSetDTOList.forEach((d) => {
      if (d.dataSet[0] !== 0) {
        hasNodata = false;
      }
      data.push({
        name: d.name,
        value: d.dataSet[0],
        filterId:d.filterId,
        filterType:d.filterType,

      });
    });
    if (hasNodata) {
      return null;
    }
    return data;
  }
);

const getColor = (start, index) => {
  // const newIndex = Math.floor(Math.random() * (140 - 0)) + 0;
  const newIndex = (index % 7) * 20 + (start+ Math.floor(index / 20) % 20)%20;
  // console.log('index',index)
  // console.log('newIndex',newIndex)
  return Chart.Colors[newIndex];
};
const getColorByUser = (users,dashBoardItem, start, index) => {
  try {
    let colorsUser = Object.keys(users).filter(function (key) {
      let user = users[key];
      if (user.uuid === dashBoardItem.filterId && user.colorCode != null && user.colorCode != '') {
        return true;
      }
    });
    let colors = colorsUser.map(k => users[k].colorCode);

    return colors != null && colors.length > 0 ? colors[0] : getColor(start, index);
  } catch (e) {
    console.log(e)
  }
  return getColor(start, index);
};

const nodataStyle = {
  // height: 270,
  width: '100%',
  borderRadius: '50%',
  backgroundColor: 'rgb(240, 240, 240)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000',
};

const noteNodata = {
  position: 'absolute',
  top: 10,
  right: 10,
  display: 'flex',
  alignItems: 'center',
  fontSize: 11,
};

const circle = {
  width: 12,
  height: 12,
  marginRight: 5,
  borderRadius: '50%',
  backgroundColor: 'rgb(240, 240, 240)',
};

const DiagramGraph = ({ data, height, fullscreen,users }: PropsType) => {
  const diagramData = groupData(data);
  const _lengthData = diagramData ? diagramData.length : 0;
  let totalValue= 0;
  if(_lengthData>0){
    diagramData.forEach(d=>{
      totalValue+=(isNumber(d.value)? Number(d.value):0);
    });
  }
  if (!diagramData || totalValue==0) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <div style={{ ...nodataStyle, width: 0.8 * height, height: 0.8 * height }}>
          <div style={noteNodata}>
            <div style={circle}></div> {_l`No data`}
          </div>
          {_l`No data`}
        </div>
      </ResponsiveContainer>
    );
  }
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    if (_lengthData < 15) {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {value === 0 ? '' : name}
        </text>
      );
    }
  };
/*
  console.log('diagramData',diagramData);
  let diagramDataNew = diagramData.map(d => {return {
    name:d.name ,
      value:
    (d.value != null ? d.value : 1)
  }});
  console.log('diagramData',diagramData);
  console.log('users',users);
*/

  return (
    <React.Fragment>
{/*

      <PieChart width={800} height={400} >
        <Pie
          data={diagramDataNew}
          cx={300}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
        >
          {
            diagramDataNew.map((entry, index) =>
              <Cell fill={
                diagramData[index]!=null && diagramData[index].filterType == 'USER' ? getColorByUser(users,diagramData[index]) : getColor(5, index)
              }
              />
            )
          }
        </Pie>
      </PieChart>
*/}

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={diagramData}
            innerRadius={2}
            labelLine={false}
            outerRadius="80%"
            fill={Chart.Colors[4]}
            label={renderCustomizedLabel}
          >
            {diagramData.map((entry, index) => (
              <Cell
                style={{ fontSize: fullscreen ? 18 : 11, fontWeight: fullscreen ? '600' : '400' }}
                key={index}
                // fill={getColor(5, index)}
                fill={entry.filterType == 'USER' ? getColorByUser(users,entry,5, index) : getColor(5, index)}
              />
            ))}
          </Pie>
          <Legend
            wrapperStyle={{ fontSize: fullscreen ? 18 : 11, overflow: 'auto' }}
            height="95%"
            iconType="circle"
            layout="vertical"
            verticalAlign="top"
            align="right"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default compose(
  connect(
    (state)=>{
      return {users: state.entities.user}
  },null)
)(DiagramGraph);
// withState('zoom', 'setZoom', { x: [new Date(2017, 1, 1), new Date(2018, 1, 1)] }),
