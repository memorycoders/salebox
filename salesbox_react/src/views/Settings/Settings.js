import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { ObjectTypes, CssNames } from 'Constants';
import _l from 'lib/i18n';
import common from 'style/Common.css';
import css from './settings.css';
import {
  CompanyInfo,
  CustomFields,
  DefaultValues,
  Organisation,
  Targets,
  Rights,
  Product,
  ImportExport,
} from './settings.routes';

addTranslations({
  'en-US': {
    'Company Info': 'Company Info',
    'Custom Fields': 'Custom Fields',
    'Default Values': 'Default Values',
    Organisation: 'Organisation',
    Targets: 'Targets',
    Rights: 'Rights',
    Product: 'Product',
    'Import/Exp': 'Import/Exp',
  },
});

const Settings = (props) => {
  return (
    <div
      style={{ padding: 0, background: 'rgb(240,240,240)' }}
      className={`${common.container} ${common.positionAbsolute}`}
    >
      <Menu style={styles.sidebar} borderless>
        <Menu.Menu position="left">
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/company-info' &&
              css.menuActive}`}
            as={Link}
            to="/settings/company-info"
          >
            {_l`Our company`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/rights' &&
              css.menuActive}`}
            as={Link}
            to="/settings/rights"
          >
            {_l`User rights`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/targets' &&
              css.menuActive}`}
            as={Link}
            to="/settings/targets"
          >
            {_l`Targets`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/default-values' &&
              css.menuActive}`}
            as={Link}
            to="/settings/default-values"
          >
            {_l`Default values`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/custom-fields' &&
              css.menuActive}`}
            as={Link}
            to="/settings/custom-fields"
          >
            {_l`Custom fields`}
          </Menu.Item>

          {/* <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/organisation' &&
              css.menuActive}`}
            as={Link}
            to="/settings/organisation"
          >
            {_l`Organisation`}
          </Menu.Item> */}
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/settings/product' &&
              css.menuActive}`}
            as={Link}
            to="/settings/product"
          >
            {_l`Products`}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div className={css.charts}>
        <Switch>
          <Route path="/settings/company-info" component={CompanyInfo} />
          <Route path="/settings/custom-fields" component={CustomFields} />
          <Route path="/settings/default-values" component={DefaultValues} />
          <Route path="/settings/organisation" component={Organisation} />
          <Route path="/settings/targets" component={Targets} />
          <Route path="/settings/rights" component={Rights} />
          <Route path="/settings/product" component={Product} />
          <Route path="/settings/import-export" component={ImportExport} />
          <Route component={CompanyInfo} />
        </Switch>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      if (location.pathname === '/settings') {
        this.props.history.push('/settings/company-info');
      }
    },
  })
)(Settings);

const styles = {
  sidebar: {
    border: 'none',
    boxShadow: 'none',
    width: '100%',
    borderBottom: '1px solid rgb(241,241, 241)',
    borderRadius: 0,
    height: 50,
    padding: '0px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 0,
  },

  charts: {
    padding: '10px 10px',
    height: 'calc(100% - 50px)',
    overflowY: 'ovelay',
    overflowX: 'hidden',
  },
};
