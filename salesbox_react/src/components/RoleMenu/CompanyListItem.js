// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Clickable, Avatar } from 'components';
import * as AppActions from 'components/App/app.actions';
import cx from 'classnames';
import css from './List.css';

type PropsT = {
  company: {},
  active: boolean,
  chooseRole: () => void,
};

const CompanyListItem = ({ company, active, chooseRole }: PropsT) => {
  const cn = cx(css.listItem, {
    [css.active]: active,
  });
  return (
    <Clickable className={cn} onNavigate={chooseRole}>
      <div className={css.avatar}>
        <Avatar size={32} src={company.avatar} fallbackIcon="company" />
      </div>
      <div className={css.name}>{company.name}</div>
    </Clickable>
  );
};

const mapStateToProps = (state) => ({
  company: state.auth.company,
  active: state.ui.app.roleType === 'Company',
});

const mapDispatchToProps = {
  setActiveRole: AppActions.setActiveRole,
};

const handlers = withHandlers({
  chooseRole: ({ setActiveRole }) => () => setActiveRole('Company', null),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      const { active, setActiveRole } = this.props;
      if (!active)
        setActiveRole('Company', null);
    }
  }),
  handlers
)(CompanyListItem);
