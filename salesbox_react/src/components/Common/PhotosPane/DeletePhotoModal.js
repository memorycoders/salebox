//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { OverviewTypes, ObjectTypes } from 'Constants';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { refreshQualifiedDetail } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { refreshOrganisation } from '../../Organisation/organisation.actions'
import { refreshContact } from '../../Contact/contact.actions';
import api from '../../../lib/apiClient';
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
        'Do you really want to delete?': 'Do you really want to delete?'
    },
});

const DeletePhotoModal = ({ visible, hide, onSave }: PropsT) => {

    return (
        <ModalCommon title={_l`Confirm`} cancelLabel={_l`No`} okLabel={_l`Yes`} visible={visible} onDone={onSave} onClose={hide} size="tiny"
            paddingAsHeader={true} >
            <p>{_l`Do you really want to delete?`}</p>
        </ModalCommon>
    );
};

const makeMapStateToProps = () => {
    const mapStateToProps = (state, { overviewType}) => {
        const visible = isHighlightAction(state, overviewType, 'delete_photo');
        const itemId = getHighlighted(state, overviewType)
        return {
            visible,
            itemId
        };
    };
    return mapStateToProps;
};
export default compose(
    connect(
        makeMapStateToProps,
        {
            clearHighlightAction: OverviewActions.clearHighlightAction,
            refreshQualifiedDetail,
            refreshOrganisation,
            refreshContact
        }
    ),
    withHandlers({
        hide: ({ clearHighlightAction, overviewType }) => () => {
            clearHighlightAction(overviewType);
        },
        onSave: ({ refreshContact, itemId, refreshQualifiedDetail, refreshOrganisation, overviewType }) => async () => {
            try {
                const result = await api.get({
                    resource: `document-v3.0/photo/delete/upload/${itemId}`,
                });
                if (overviewType === OverviewTypes.Pipeline.Qualified_Photo){
                    refreshQualifiedDetail('photo')
                } else if (overviewType === OverviewTypes.Account_Photo){
                    refreshOrganisation('photo')
                } else if (overviewType === OverviewTypes.Contact_Photo) {
                    refreshContact('photo')
                }

            } catch (error) {
                console.log(error)
            }
        },
    })
)(DeletePhotoModal);
