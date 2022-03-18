//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getItemSelected } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from '../../../lib/apiClient';
import { refeshLastestComminication } from '../../Organisation/organisation.actions'
import { refeshLastestComminicationContact } from '../contact.actions';

type PropsT = {
    visible: boolean,
    onClose: () => void,
    onSave?: () => void,
};

addTranslations({
    'en-US': {
        'Confirm': 'Confirm',
        No: 'No',
        Yes: 'Yes',
        'Do you really want to delete?': 'Do you really want to delete?',
    },
});

const DeleteCommunicationModal = ({ visible, onClose, onSave }: PropsT) => {
    return (
        <ModalCommon
            title={_l`Confirm`}
            visible={visible}
            onDone={onSave}
            onClose={onClose}
            size="tiny"
            paddingAsHeader={true}
        >
            <p>{_l`Do you really want to delete?`}</p>

        </ModalCommon>
    );
};

const makeMapStateToProps = () => {

    const mapStateToProps = (state, { overviewType }) => {
        const visible = isHighlightAction(state, overviewType, 'delete_communication');
        const itemSelected = getItemSelected(state, overviewType);
        return {
            visible,
            itemSelected
        };
    };
    return mapStateToProps;
};

export default compose(
    connect(
        makeMapStateToProps,
        {
            clearHighlightAction: OverviewActions.clearHighlightAction,
            refeshLastestComminication,
            refeshLastestComminicationContact
        }
    ),
    withHandlers({
        onClose: ({ clearHighlightAction, overviewType }) => () => {
            clearHighlightAction(overviewType);
        },
        onSave: ({ refeshLastestComminicationContact, itemSelected, overviewType, clearHighlightAction, refeshLastestComminication }) => async () => {
            try {
                const result = await api.get({
                    resource: 'contact-v3.0/deleteLatestCommunication',
                    query: {
                        uuid: itemSelected.uuid
                    }
                });
                clearHighlightAction(overviewType);
                if (overviewType === 'CONTACTS'){
                    return refeshLastestComminicationContact(itemSelected.uuid)
                }
                refeshLastestComminication(itemSelected.uuid)
            } catch (error) {

            }
        },
    })
)(DeleteCommunicationModal);
