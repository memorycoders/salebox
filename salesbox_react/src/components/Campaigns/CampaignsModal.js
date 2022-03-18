/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes, OverviewColors } from 'Constants';
import { CampaignsForm } from './CampaignsForm';
import ModalCommon from '../ModalCommon/ModalCommon';
import css from '../Task/EditTaskModal/EditTaskModal.css';
import api from '../../lib/apiClient'
import { success } from '../Notification/notification.actions'
import { getCustomFieldsObject } from '../CustomField/custom-field.selectors';

addTranslations({
    'en-US': {
        Cancel: 'Cancel',
        Save: 'Save',
        'Name is required': 'Name is required',
        'End date is required': 'End date is required',
        'Start date is required': 'Start date is required',
        'Product group is required': 'Product group is required',
        'Products is required': 'Products is required',
        'Units is required': 'Units is required',
        'Users is required': 'Users is required'
    },
});

class CampaignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            errors: {}
        }
        this.params ={};
    }

    hideEditForm = () => {
        const { overviewType } = this.props;
        this.props.clearHighlight(overviewType);
    };

    onSave = async () => {
        const {
            name,
            endDate,
            startDate,
            lineOfBusiness,
            productList,
            unitList,
            userList,
        } = this.params;
        const { userId, overviewType } = this.props;

        let errors = {};
        // if(!name){
        //     errors.name =_l`Name is required`
        // }
        if (!endDate) {
            errors.endDate = _l`End date is required`
        }
        if (!startDate) {
            errors.startDate = _l`Start date is required`
        }

        if (!lineOfBusiness) {
            errors.lineOfBusiness = _l`Product group is required`
        }

        // if (!productList || productList.length === 0) {
        //     errors.productList = _l`Products is required`
        // }

        // if (!unitList || unitList.length === 0) {
        //     errors.unitList = _l`Units is required`
        // }

        // if (!userList || userList.length === 0) {
        //     errors.userList = _l`Users is required`
        // }

        if(Object.keys(errors).length === 0){
            delete this.params.campaigns;
            delete this.params.errors;
            const create = await api.post({
                resource: `campaign-v3.0/market/update`,
                data: {
                    ...this.params,
                    ownerId: userId,

                }
            });
            this.props.success(_l`Added`, '', 2000);
            this.props.clearHighlight(overviewType);
        } else {
            console.log('errors: ', errors)
            this.setState({ errors })
        }
    };

    render() {
        const { visible, customField } = this.props;
        return (
            <ModalCommon
                title={_l`Add campaign`}
                visible={visible}
                onDone={this.onSave}
                onClose={this.hideEditForm}
                className={customField.length > 0 ? css.modalCustomField : css.editTaskModal}
                okLabel={_l`Save`}
                scrolling={true}
            >
                <CampaignsForm errors={this.state.errors} setParams={params => this.params = params} />
            </ModalCommon>
        );
    }
}
const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'create');
    const customField = getCustomFieldsObject(state);
    return {
      visible,
      customField,
        userId: state.auth.userId
    };
};

export default connect(mapStateToProps, {
    clearHighlight,
    success
})(CampaignModal);
