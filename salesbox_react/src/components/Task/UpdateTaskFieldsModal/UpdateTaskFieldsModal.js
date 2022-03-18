//@flow
import * as React from 'react';
import { Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { FormPair } from 'components';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../Delegation.css';
import { MailchimpDropdown } from './MailchimpDropdown';
import { changeOnMutilTaskMenu } from '../task.actions';
import EditTaskForm from '../EditTaskForm/EditTaskForm';

type PropsT = {
    task: {},
    visible: boolean,
    hideAssignForm: () => void,
    onSave?: () => void,
    handleTagChange: EventHandlerType,
};

addTranslations({
    'en-US': {
        Cancel: 'Cancel',
        Save: 'Save',
        'Update data fields': 'Update data fields'
    },
});

const UpdateTaskFieldsModal = ({ visible, hide, onSave, setMailchimp, mailchimp }: PropsT) => {

    return (
        <ModalCommon
            title={_l`Update data fields`}
            visible={visible}
            cancelLabel={_l`Cancel`}
            okLabel={_l`Save`}
            onDone={onSave}
            onClose={hide}
            size="small"
            scrolling={false}
        >
            <EditTaskForm />
        </ModalCommon>
    );
};

const makeMapStateToProps = () => {
    const mapStateToProps = (state, { overviewType }) => {
        const visible = isHighlightAction(state, overviewType, 'add_to_mailchimp_list');
        return {
            visible
        };
    };
    return mapStateToProps;
};

export default compose(
    connect(
        makeMapStateToProps,
        {
            clearHighlightAction: OverviewActions.clearHighlightAction,
            changeOnMutilTaskMenu: changeOnMutilTaskMenu
        }
    ),
    withState('mailchimp', 'setMailchimp', null),
    withHandlers({
        hide: ({ clearHighlightAction, overviewType, setMailchimp }) => () => {
            setMailchimp(null);
            clearHighlightAction(overviewType);
        },
        setMailchimp: ({ setMailchimp }) => (event, mailchimp) => {
            setMailchimp(mailchimp)
        },
        onSave: ({ changeOnMutilTaskMenu }) => () => {
            changeOnMutilTaskMenu('update_task_fields')
        },
    })
)(UpdateTaskFieldsModal);
