// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Clickable, Avatar } from 'components';
import * as AppActions from 'components/App/app.actions';
import { makeGetUnit } from 'components/Unit/unit.selector';
import css from './List.css';
import noneAvatar from '../../../public/none_avatar.png';
import _l from 'lib/i18n';

type PropsT = {
  unit: {},
  active: boolean,
  chooseRole: () => void,
};

const PersonListItem = ({ unit, active, chooseRole }: PropsT) => {
  const cn = cx(css.listItem, {
    [css.active]: active,
  });
  const fullName = unit.name
  const character1 = fullName !=null && fullName.length > 0 ? fullName.charAt(0) : '';
  const character2 = fullName !=null && fullName.length > 0 ? fullName.substr(fullName.indexOf(' ')+1).charAt(0) : '';
  return (
    <Clickable className={cn} onNavigate={chooseRole}>
      <div className={css.avatar}>
        {unit.avatar ? (
          <Avatar size={32} src={unit.avatar} fallbackIcon="unit" />
        ) : (
          <div className={css.container}>
            <img src={noneAvatar} style={{ width: '30px' }} />
            <div className={css.nameOfImage}>
              {character1}
              {character2}
            </div>
          </div>
        )}
      </div>
      <div className={css.name}>{unit.name === 'No Unit' ? _l`No unit` : unit.name}</div>
    </Clickable>
  );
};

const makeMapStateToProps = () => {
  const getUnit = makeGetUnit();
  const mapStateToProps = (state, { unitId }) => ({
    unit: getUnit(state, unitId),
    active: state.ui.app.roleType === 'Unit' && state.ui.app.activeRole === unitId,
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  setActiveRole: AppActions.setActiveRole,
};

const handlers = withHandlers({
  chooseRole: ({ unit, setActiveRole }) => () => setActiveRole('Unit', unit.uuid),
});

export default compose(connect(makeMapStateToProps, mapDispatchToProps), handlers)(PersonListItem);
