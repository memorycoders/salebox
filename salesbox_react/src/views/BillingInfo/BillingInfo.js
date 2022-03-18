// @flow
import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, Route, Switch } from 'react-router';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import common from 'style/Common.css';
import css from './BillingInfo.css';
import { Subscriptions, Services, SalesAcademy } from './billing.routes';

const BillingInfo = () => {
  return (
    <div style={{ padding: 0, background: '#ffffff' }} className={`${common.container} ${common.positionAbsolute}`}>
      <Menu style={styles.sidebar} borderless>
        <Menu.Menu position="left">
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/billing-info/subscriptions' &&
              css.menuActive}`}
            as={Link}
            to="/billing-info/subscriptions"
          >
            {_l`Subscriptions`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/billing-info/services' &&
              css.menuActive}`}
            as={Link}
            to="/billing-info/services"
          >
            {_l`Services`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/billing-info/sales-academy' &&
              css.menuActive}`}
            as={Link}
            to="/billing-info/sales-academy"
          >
            {_l`Sales academy`}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div className={css.charts}>
        <Switch>
          <Route path="/billing-info/subscriptions" component={Subscriptions} />
          <Route path="/billing-info/services" component={Services} />
          <Route path="/billing-info/sales-academy" component={SalesAcademy} />

          <Route component={Subscriptions} />
        </Switch>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      if (location.pathname === '/billing-info') {
        this.props.history.push('/billing-info/subscriptions');
      }
    },
  })
)(BillingInfo);

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
