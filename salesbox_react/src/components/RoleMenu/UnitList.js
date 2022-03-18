// @flow
import * as React from 'react';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { getUnits, getUnitsDTO, isFetchingUnits } from 'components/Unit/unit.selector';
import UnitListItem from './UnitListItem';
import * as UnitActions from 'components/Unit/unit.actions';
import { withGetData } from 'lib/hocHelpers';
import css from './List.css';
import { Icon, Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { getUser } from '../Auth/auth.selector';

type PropsT = {
  units: Array<{}>,
};
addTranslations({
  'en-US': {
    Search: 'Search',
  },
});

const UnitList = ({ units, name, handleChangeName, unitsFilter, isFetchingUnits, userLoggedIn }: PropsT) => {
  return (
    <>
      <Input
        className={css.inputSearch}
        fluid
        focus
        size="medium"
        value={name}
        onChange={handleChangeName}
        iconPosition="right"
        icon={<Icon size={3} className={css.searchIcon} name="search" link />}
        placeholder={_l`Search for unit`}
      />
      <div className={css.scrollList}>
        <div className={css.list}>
          {/*        { (true || isFetchingUnits && units.length == 0) &&
        <Dimmer active inverted>
          <Loader size="tiny">Loading</Loader>
        </Dimmer>}*/}
          {userLoggedIn?.permission?.own_unit?.read && !userLoggedIn?.permission?.all_company?.read
            ? unitsFilter?.filter(e => e === userLoggedIn?.unit).map((unitId) => {
                return <UnitListItem unitId={unitId} key={unitId} />;
              })
            : unitsFilter.map((unitId) => {
                return <UnitListItem unitId={unitId} key={unitId} />;
              })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  units: getUnits(state),
  unitsDTO: getUnitsDTO(state),
  isFetchingUnits: isFetchingUnits(state),
  userLoggedIn: getUser(state),
});

const mapDispatchToProps = {
  requestFetch: UnitActions.requestFetch,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('name', 'setName', ''),
  withState('unitsFilter', 'setUnitsFilter', (props) => props.units),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      //fix not render when change props
      if (nextProps.units.length != this.props.units.length) {
        this.props.setUnitsFilter(nextProps.units);
      }
    },
  }),
  withGetData(({ requestFetch }) => () => requestFetch()),
  withHandlers({
    handleChangeName: (props) => (event, { value: name }) => {
      props.setName(name);
      let userResults =
        name == null || name == ''
          ? Object.keys(props.unitsDTO)
          : Object.keys(props.unitsDTO).filter(
              (uuid) =>
                props.unitsDTO[uuid].name != null &&
                props.unitsDTO[uuid].name.toLowerCase().includes(name.toLowerCase().trim())
            );

      props.setUnitsFilter(userResults);
    },
  })
)(UnitList);
