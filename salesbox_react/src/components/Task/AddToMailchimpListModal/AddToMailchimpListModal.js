//@flow
import * as React from 'react';
import { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { FormPair } from 'components';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../Delegation.css';
import { MailchimpDropdown } from './MailchimpDropdown';
import { changeOnMutilTaskMenu } from '../task.actions';
import { changeOnMultiMenu } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { OverviewTypes, calculatingPositionMenuDropdown } from '../../../Constants';
import * as OrganisationActions from '../../Organisation/organisation.actions';
import * as ContacActions from '../../Contact/contact.actions';
import * as AppointmentActions from '../../Appointment/appointment.actions';
import * as CallListAccountActions from '../../CallListAccount/callListAccount.actions';
import * as CallListContactActions from '../../CallListContact/callListContact.actions';
import * as QualifiedActions from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as RecruitmentActions from '../../Recruitment/recruitment.actions';

addTranslations({
  'en-US': {
    'Mailchimp is required': 'Mailchimp is required',
  },
});

type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  handleTagChange: EventHandlerType,
  overviewType: string,
  error: boolean,
};

addTranslations({
  'en-US': {
    List: 'List',
    Cancel: 'Cancel',
    Save: 'Save',
    'Add to Mailchimp list': 'Add to Mailchimp list',
  },
});

const AddToMailchampListModal = ({
  visible,
  hide,
  onSave,
  setMailchimp,
  mailchimp,
  overviewType,
  highlight,
  error,
}: PropsT) => {
  useEffect(() => {
    if (visible === true) {
      setMailchimp(null);
    }
  }, [visible]);
  return (
    <ModalCommon
      title={_l`Add to Mailchimp list`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={hide}
      size="small"
      className={css.mutilActionModal}
      scrolling={false}
      description={false}
    >
      <Form>
        <FormPair required label={_l`List`} labelStyle={css.delegateFormLabel} left>
          <MailchimpDropdown
            colId={'add-to-mailchimp'}
            onChange={setMailchimp}
            addLabel={`Add list`}
            overviewType={overviewType}
            highlight={highlight}
          />
          <span className="form-errors">{error && _l`Mailchimp is required`}</span>
        </FormPair>
      </Form>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'add_to_mailchimp_list');
    return {
      visible,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    changeOnMutilTaskMenu: changeOnMutilTaskMenu,
    changeOnMultiUnqualified: changeOnMultiMenu,
    changeOnMultiOrganisation: OrganisationActions.changeOnMultiMenu,
    highlight: OverviewActions.highlight,
    changeOnMultiContact: ContacActions.changeOnMultiMenu,
    changeOnmultiAppoiment: AppointmentActions.changeOnMultiMenu,
    changeOnMultiCallListAccount: CallListAccountActions.changeOnMultiMenu,
    changeOnMultiCallListContact: CallListContactActions.changeOnMultiMenu,
    changeOnMultiQualified: QualifiedActions.changeOnMultiMenu,
    changeOnMultiRecruitmentClose: RecruitmentActions.changeOnMultiMenu
  }),
  withState('mailchimp', 'setMailchimp', null),
  withState('error', 'setError', false),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType, setMailchimp, setError }) => () => {
      setMailchimp(null);
      setError(false);
      clearHighlightAction(overviewType);
    },
    setMailchimp: ({ setMailchimp, setError }) => (event, mailchimp) => {
      if(mailchimp){
        const { options, value } = mailchimp;
        setError(false);
        setMailchimp(mailchimp);
      }

      // if (options) {
      //   const mailchimpSelected = options.find((option) => option.id === value);
      //   if (mailchimpSelected) {
      //     setMailchimp(mailchimpSelected);
      //   }
      // }
    },
    onSave: ({ overviewType, mailchimp, setMailchimp, setError, ...props }) => () => {
      if (mailchimp) {
        setError(false);
        let cloneMailchimp = {
          ...mailchimp,
          onClick: undefined,
        };
        if (cloneMailchimp) {
          if (overviewType === OverviewTypes.Activity.Task || overviewType === OverviewTypes.Delegation.Task) {
            props.changeOnMutilTaskMenu('add_to_mailchimp_list', cloneMailchimp, overviewType);
            // setMailchimp(null);
          } else if (overviewType === OverviewTypes.Pipeline.Lead || overviewType === OverviewTypes.Delegation.Lead) {
            props.changeOnMultiUnqualified('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.Account) {
            props.changeOnMultiOrganisation('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.Contact) {
            props.changeOnMultiContact('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.Activity.Appointment) {
            props.changeOnmultiAppoiment('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.CallList.Account) {
            props.changeOnMultiCallListAccount('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.CallList.Contact) {
            props.changeOnMultiCallListContact('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.Pipeline.Qualified) {
            props.changeOnMultiQualified('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if (overviewType === OverviewTypes.Pipeline.Order) {
            props.changeOnMultiQualified('add_to_mailchimp_list', cloneMailchimp, overviewType);
            //setMailchimp(null);
          } else if(overviewType === OverviewTypes.RecruitmentClosed) {
            props.changeOnMultiRecruitmentClose('add_to_mailchimp_list', cloneMailchimp, overviewType);
          }
        }
      } else {
        setError(true);
      }
    },
  })
)(AddToMailchampListModal);
