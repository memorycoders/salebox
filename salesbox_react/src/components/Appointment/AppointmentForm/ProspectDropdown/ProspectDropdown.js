/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import api from 'lib/apiClient';
import { requestFetch } from 'components/Dropdown/dropdown.actions';
import { update } from '../../appointment.actions';
import { getProspectsForContact, getProspectsByContact } from 'components/Prospect/prospect.selector';
import Select from 'components/Select';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import * as AppointmentActions from '../../appointment.actions';
import _l from 'lib/i18n';
import { OverviewTypes } from '../../../../Constants';
import { isHighlightAction } from 'components/Overview/overview.selectors';

addTranslations({
  'en-US': {
    'Select qualified deal': 'Select qualified deal',
  },
});

const objectType = ObjectTypes.Prospect;

class OrganisationDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leads: [],
      isAddProspectLead: false,
    };
  }

  componentDidMount() {
    const { contactId, requestFetch } = this.props;
    if (contactId) requestFetch(objectType, null, contactId);
    this.fetchLead();
  }

  componentDidUpdate(prevProps) {
    const { contactId, requestFetch, searchTerm, organisationId } = this.props;
    if (
      (contactId !== prevProps.contactId ||
        (this.state.isAddProspectLead &&
          this.props.visibleAddQualifiedUnqualified != true &&
          prevProps.visibleAddQualifiedUnqualified == true)) &&
      contactId
    ) {
      this.setState({ isAddProspectLead: false });

      requestFetch(objectType, searchTerm, contactId);
      this.fetchLead();
    }
    if (organisationId !== prevProps.organisationId && organisationId) {
      this.fetchLead();
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.contactId && Array.isArray(nextProps.contactId) && nextProps.contactId.length <= 0) {
  //     this.props.updateErrorAppointment('__ERRORS', { contact: _l`You must choose a contact first` });
  //   }
  // }
  fetchLead = async () => {
    const { contactId, organisationId } = this.props;
    if (contactId) {
      try {
        const data = await api.post({
          resource: `lead-v3.0/getLeadOnContactOrOrganisation`,
          query: {
            pageSize: 1000,
            pageIndex: 0,
          },
          data: {
            contactIdList: !contactId ? [] : Array.isArray(contactId) ? contactId : [contactId],
            finished: false,
            organisationIdList: organisationId ? [organisationId] : [],
          },
        });
        if (data) {
          this.setState({ leads: data.leadOnContactOrOrganisationList });
        }
      } catch (error) {}
    }
  };

  onChange = (data) => {
    if (data && data.type === 'lead') {
      this.props.onChange('', { value: { leadId: data.key } });
    } else if (data && data.type === 'prospec') {
      this.props.onChange('', { value: { prospectId: data.key } });
    }
  };

  _addUnqualilfied = () => {
    setTimeout((self) => {
      this.setState({ isAddProspectLead: true });
    }, 100);
    // e.stopPropagation()
  };
  _addQualilfied = () => {
    setTimeout((self) => {
      this.setState({ isAddProspectLead: true });
    }, 100);

    // e.stopPropagation()
  };

  render() {
    const { prospects, isFetching, contactId, overviewType, organisationId } = this.props;
    const { leads } = this.state;
    return (
      <Select
        overviewType={overviewType}
        prospects={prospects}
        leads={leads}
        isFetching={isFetching}
        organisationId={organisationId}
        contactId={contactId}
        onChange={this.onChange}
        unqualifiedId={this.props.unqualifiedId}
        prospectId={this.props.prospectId}
        addUnqualilfied={this._addUnqualilfied}
        addQualilfied={this._addQualilfied}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { contactId } = ownProps;

  const dropdown = getDropdown(state, objectType);
  let prospects = [];
  if (contactId) {
    prospects = getProspectsByContact(state, contactId);
  }
  const visibleAddQualifiedUnqualified =
    isHighlightAction(state, OverviewTypes.Pipeline.Lead, 'create') ||
    isHighlightAction(state, OverviewTypes.Pipeline.Qualified, 'create');

  return {
    prospects,
    searchTerm: dropdown.searchTerm,
    isFetching: dropdown.isFetching,
    visibleAddQualifiedUnqualified,
  };
};

export default connect(mapStateToProps, { requestFetch, update, updateErrorAppointment: AppointmentActions.update })(
  OrganisationDropdown
);

OrganisationDropdown.propTypes = {
  prospects: PropTypes.array,
  isFetching: PropTypes.bool,
  contactId: PropTypes.string,
  requestFetch: PropTypes.func,
};
