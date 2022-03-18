//@flow
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { FormPair, FormHeader } from 'components';
import _l from 'lib/i18n';
import PhoneRow from './PhoneRow';

type PropsT = {
  organisationId: string,
  phones: Array<{}>,
  addPhone: () => void,
};

addTranslations({
  'en-US': {
    Phone: 'Phone',
    'Add phone': 'Add phone',
  },
});

const PhonePane = ({ organisationId, phones, addPhone }: PropsT) => {
  return (
    <React.Fragment>
      <FormHeader
        label={_l`Phone`}
        action={<Button icon="phone" content={_l`Add phone`} onClick={addPhone} labelPosition="right" size="mini" />}
        mini
      />
      <FormPair mini>
        {phones.map((phone) => <PhoneRow organisationId={organisationId} key={phone.uuid} phone={phone} />)}
      </FormPair>
    </React.Fragment>
  );
};

export default compose(
  connect(
    null,
    {
      addPhone: OrganisationActions.addPhone,
    }
  ),
  withHandlers({
    addPhone: ({ addPhone, organisationId }) => () => {
      addPhone(organisationId);
    },
  })
)(PhonePane);
