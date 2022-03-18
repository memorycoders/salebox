// @flow
import * as React from 'react';
import DiagramGraph from './DiagramGraph';
import DiagramPie from './DiagramPie';

type PropsType = {
  data: {
    dashBoardType: string,
  },
  height: string | number,
};

const Graphs = {
  DIAGRAM: DiagramGraph,
  PIE_CHART: DiagramPie,
};

const DashboardGraph = ({ data, height, fullscreen }: PropsType) => {
  const type = data.dashBoardType;
  const Graph = Graphs[type];
  if (Graph) {
    return <Graph fullscreen={fullscreen} height={height} data={data} />;
  }
  return null;
};

export default DashboardGraph;
