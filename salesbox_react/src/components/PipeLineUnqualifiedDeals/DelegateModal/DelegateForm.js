//@flow
import * as React from 'react';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
// import * as TaskActions from 'components/Task/task.actions';
import * as UnqualifiedDealActions from 'components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';

import { Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import {compose, branch, withHandlers, renderNothing, withState} from 'recompose';
import { connect } from 'react-redux';
import { FormPair } from 'components';
import css from 'components/Task/Delegation.css';

type PropsT = {
  unqualifiedDeal: {},
  handleOwnerChange: (event: Event, { value: string }) => void,
  handleDateChange: (date: Date) => void,
  handleUnitChange: (event: Event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    Unit: 'Unit',
    User: 'User',
  },
});

const DelegateUnqualifiedDeal = ({  handleOwnerChange, handleUnitChange,unitSelected }: PropsT) => {
  return (
    <Form>
      <FormPair label={_l`Unit`} labelStyle={css.delegateFormLabel} left>
        <UnitDropdown placeholder='' onChange={handleUnitChange} placeholder='' />
      </FormPair>
      <FormPair label={_l`User`} left labelStyle={css.delegateFormLabel}>
        <UserDropdown placeholder='' unitId={unitSelected} onChange={handleOwnerChange} />
      </FormPair>
    </Form>
  );
};

export default compose(
  withState('unitSelected', 'setUnitSelected', null),
  connect(null, {
    // updateUnqualified: UnqualifiedDealActions.updateUnqualified,
  }),
  branch(({ unqualifiedDeal }) => !unqualifiedDeal.uuid, renderNothing),
  withHandlers({
    // handleNoteChange: ({ unqualifiedDeal, updateTask }) => (event, { value: note }) => {
    //   updateTask(unqualifiedDeal.uuid, { note });
    // },
    // handleDateChange: ({ unqualifiedDeal, updateTask }) => (dateAndTime) => {
    //   updateTask(unqualifiedDeal.uuid, {
    //     dateAndTime,
    //   });
    // },
    handleOwnerChange: ({ onChange }) => (event, { value: owner }) => {
      onChange(owner);
      // updateTask(unqualifiedDeal.uuid, {
      //   owner,
      // });
    },
    handleUnitChange: ({  setUnitSelected }) => (event, { value: unit }) => {
      setUnitSelected(unit);
/*      updateUnqualified(unqualifiedDeal.uuid, {
        unit,
        owner: null,
      });*/
    },
  })
)(DelegateUnqualifiedDeal);
