// @flow
import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import _l from 'lib/i18n';
import { CssNames, Endpoints } from 'Constants';
import common from 'style/Common.css';
import css from './SalesAcademy.css';
import { Lessons, LeaderBoard } from './academy.routes';
import { compose, lifecycle, withState } from 'recompose';
import api from 'lib/apiClient';

const SalesAcademy = ({ canAccessVideo }) => {
  return (
    <div style={{ padding: 0, background: '#ffffff' }} className={`${common.container} ${common.positionAbsolute}`}>
      <Menu style={styles.sidebar} borderless>
        <Menu.Menu position="left">
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/sales-academy/lessons' &&
              css.menuActive}`}
            as={Link}
            to="/sales-academy/lessons"
          >
            {_l`Lessons`}
          </Menu.Item>
          {canAccessVideo && (
            <Menu.Item
              className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname ===
                '/sales-academy/leader-board' && css.menuActive}`}
              as={Link}
              to="/sales-academy/leader-board"
            >
              {_l`Leader board`}
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>
      <div className={css.charts}>
        <Switch>
          <Route path="/sales-academy/lessons" component={Lessons} />
          <Route path="/sales-academy/leader-board" component={LeaderBoard} />
          <Route component={Lessons} />
        </Switch>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  withState('canAccessVideo', 'setCanAccessVideo', false),
  lifecycle({
    async componentDidMount() {
      if (location.pathname === '/sales-academy') {
        this.props.history.push('/sales-academy/lessons');
      }
      try {
        const res = await api.get({
          resource: `${Endpoints.Enterprise}/payment/getPackageInfo`,
        });
        if (res) {
          if (res.extraPackage.find((e) => e === 'VIDEO_ACADEMY')) {
            this.props.setCanAccessVideo(true);
          }
        }
      } catch (error) {}
    },
  })
)(SalesAcademy);
const styles = {
  sidebar: {
    border: 'none',
    boxShadow: 'none',
    width: '100%',
    borderBottom: '1px solid #cacbcc',
    borderRadius: 0,
    height: 50,
    padding: '0px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0px',
  },

  charts: {
    padding: '10px 10px',
    height: 'calc(100% - 50px)',
    overflowY: 'ovelay',
    overflowX: 'hidden',
  },
};
