// @flow
import * as React from 'react';
import { lifecycle, compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import * as InsightActions from 'components/Insight/insight.actions';
import TopAccount from '../../components/Insight/TopLists/TopAccounts';

const columnStyle={
  minWidth: 280,
  marginTop: 5
}

const rowStyle={
  overflow: 'hidden',
  flexWrap: 'wrap',
  height: '100%',
}

const TopLists = ({ topLists }) => {
  // console.log('topLists: ', topLists)
  // if (!topLists){
  //   return <div/>
  // }
  return <div style={{ height: '100%'}}>
    <Grid style={rowStyle} columns={4}>
      <Grid.Row style={{ justifyContent: 'space-around',}}>
        <Grid.Column style={columnStyle}>
          <TopAccount type={'ACCOUNT'} data={topLists ? topLists.accountTopList: null} />
        </Grid.Column>
        <Grid.Column style={columnStyle}>
          <TopAccount type={'CONTACT'} data={topLists ? topLists.contactTopList: null} />
        </Grid.Column>
        <Grid.Column style={columnStyle}>
          <TopAccount type={'PERFORMERS'} data={topLists ? topLists.performerTopList: null} />
        </Grid.Column>
        <Grid.Column style={columnStyle}>
          <TopAccount type={'PRODUCTS'} data={topLists ? topLists.productTopList : null} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>;
};

const mapDispatchToProps = {
  requestFetchData: InsightActions.fetchTopLists,
};

const mapStateToProps = (state) => {
  const { entities } = state;
  return {
    topLists: entities.insight.topLists,
    roleType: state.ui.app.roleType,
    activeRole: state.ui.app.activeRole,
    userId: state.auth.userId,
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    setOneCol: ({ setColumns }) => () => setColumns(1),
    setTwoCol: ({ setColumns }) => () => setColumns(2),
    setThreeCol: ({ setColumns }) => () => setColumns(3),
  }),
  lifecycle({
    componentDidMount() {
      this.props.requestFetchData();
    },
    componentWillReceiveProps(nextProps) {
      const { activeRole, roleType, userId } = this.props;
      if (nextProps.activeRole !== activeRole || nextProps.roleType !== roleType || userId !== nextProps.userId) {
        if (location.pathname === '/insights/toplists') {
          this.props.requestFetchData();
        }
      }
    }
  })
)(TopLists);
