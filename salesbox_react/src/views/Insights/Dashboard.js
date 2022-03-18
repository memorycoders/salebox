// @flow
import * as React from 'react';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { Header, Loader} from 'semantic-ui-react';
import DashboardGraph from 'components/Dashboard/DashboardGraph';
import * as DashboardActions from 'components/Dashboard/dashboard.actions';
import InsightPane from 'components/Insight/InsightPane/InsightPane';
import DashBoardActionMenu from '../../components/Insight/InsightPane/DashBoardAction'
import OverviewAction from '../../components/Overview/overview.actions';
import Fullscreen from 'react-fullscreen-crossbrowser';
import css from 'Common.css';
import insightCss from './Insight.css'
import Sortable, { Swap } from "sortablejs";
let _intervalGetNodeGraph, listChange = [], _sortable;
type PropsType = {
  columns: number,
  setOneCol: () => void,
  setTwoCol: () => void,
  setThreeCol: () => void,
  items: [],
  loading: boolean,
  isFirstTimeFetch: boolean,
  fullscreen: boolean,
  setFullscreen: () => void,
  disableFullscreen: () => void,
  currentItem: {},
};

const Dashboard = ({
  items,
  fullscreen,
  setFullscreen,
  columns,
  currentItem,
  loading,
  isFirstTimeFetch
}: PropsType) => {

  let interval = null;
  const getClass = (columns) => {
    switch (columns) {
      case 3:
        return 'three';
      case 2:
        return 'two';
      case 1:
        return 'one'
    }
  }
  if (loading && isFirstTimeFetch) {
    return <>
        <Loader active  size="large"></Loader>
    </>
  }

  return (
    <>
      <div id="list-graph">
        {items && items.length === 0 ? <></> : (
          <>
            {items && items.map((item, index) => {
              return (
                <div key={index} className={`dashboard-sortable-swap _column ${getClass(columns)}`}>
                  <InsightPane headerRight={<DashBoardActionMenu chartData={item} className={insightCss.bgMore} />} title={item.name}>
                    <DashboardGraph key={item.uuid} data={item} height={320 + (3 - columns) * 60} />
                  </InsightPane>
                </div>
              )
            })}

            <Fullscreen enabled={fullscreen} onChange={setFullscreen}>
              {fullscreen && (
                <div className={css.fullscreen}>
                  <Header as="h1" textAlign="center">
                    {currentItem.name}
                  </Header>
                  <div className={css.wrapper}>
                    <DashboardGraph fullscreen data={currentItem} height="100%" />
                  </div>
                </div>
              )}
            </Fullscreen>

          </>
        )}
      </div>
    </>
  );
};

const mapDispatchToProps = {
  requestFetchData: DashboardActions.requestFetchData,
  setColumns: DashboardActions.setColumns,
  enableFullscreen: DashboardActions.enableFullscreen,
  setFullscreen: DashboardActions.setFullscreen,
  highlight: OverviewAction.highlight,
  updateItems: DashboardActions.updateItems,
  updateIndex: DashboardActions.updateIndex

};

const mapStateToProps = (state) => {
  const { dashboard } = state;
  return {
    fullscreen: dashboard.fullscreen,
    loading: dashboard.loading,
    items: dashboard.items,
    columns: dashboard.columns,
    currentItem: dashboard.items[dashboard.currentItem],
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState('listGraph', 'setListGraph', []),
  withState('isInit', 'setIsInit', false),
  withState('interval', 'setInterval', null),
  withState('isFirstTimeFetch', 'setIsFirstTimeFetch', true),
  withHandlers({
    setOneCol: ({ setColumns }) => () => setColumns(1),
    setTwoCol: ({ setColumns }) => () => setColumns(2),
    setThreeCol: ({ setColumns }) => () => setColumns(3),
    updateItems: ({ updateItems }) => (items) => {
      updateItems(items)
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.requestFetchData();
      let interval = setInterval(() => {
        this.props.requestFetchData();
      }, 5 * 60 * 1000);
      this.props.setInterval(interval);
    },
    componentWillUnmount() {
      let uuids = [];
      if(listChange.length > 0) {
        for (let i = 0; i < listChange.length; i++) {
          if (listChange[i])
            uuids.push(listChange[i].uuid);
        }
        this.props.updateIndex(uuids)
      }
      this.props.setListGraph([]);
      listChange = [];
      clearInterval(this.props.interval);
      clearInterval(_intervalGetNodeGraph);
      this.props.setIsFirstTimeFetch(false);
    },
    componentWillReceiveProps(nextProps) {

      if (nextProps.items.length > 0 && !nextProps.isInit) {
        this.props.setIsInit(true);
        this.props.setListGraph(nextProps.items);
        this.props.setIsFirstTimeFetch(false);
        clearInterval(_intervalGetNodeGraph);
        _intervalGetNodeGraph = setInterval(() => {
          let _node = document.getElementById("list-graph");
          if(_node) {
            clearInterval(_intervalGetNodeGraph)
            
            if(_sortable && _sortable.swap) {
              //
            } else {
              Sortable.mount(new Swap());
            }
            _sortable = new Sortable(_node, {
              swap: true, // Enable swap mode
              swapClass: "dashboard-sortable-swap",
              onUpdate: (evt) => {

                let list = Array.from(this.props.items)
                let oldItem = list[evt.oldIndex];
                let newItem = list[evt.newIndex]
                list[evt.newIndex] = oldItem;
                list[evt.oldIndex] = newItem;
                listChange = list;
                this.props.setListGraph(list)
                // same properties as onEnd
              },
            });
          }
        })
      

      }
      // const { activeRole, roleType } = this.props;
      // if (nextProps.activeRole !== activeRole || nextProps.roleType !== roleType) {
      //   if (location.pathname === '/insights/dashboard') {
      //     this.props.requestFetchData();
      //   }
      // }
    }
  })
)(Dashboard);
