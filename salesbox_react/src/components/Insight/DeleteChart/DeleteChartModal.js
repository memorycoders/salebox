//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { deleteChart } from '../../Dashboard/dashboard.actions'
import { withRouter } from 'react-router';
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
        'Do you really want to delete?': 'Do you really want to delete?',
    },
});

const DeleteChartModal = ({ visible, onClose, onSave }: PropsT) => {
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
        const visible = isHighlightAction(state, overviewType, 'delete');
        const highlightedId = getHighlighted(state, overviewType);
        return {
            visible,
            highlightedId
        };
    };
    return mapStateToProps;
};

export default compose(
    withRouter,
    connect(
        makeMapStateToProps,
        {
            clearHighlightAction: OverviewActions.clearHighlightAction,
            deleteChart
        }
    ),
    withHandlers({
        onClose: ({ clearHighlightAction, overviewType }) => () => {
            clearHighlightAction(overviewType);
        },
        onSave: ({ overviewType, deleteChart, highlightedId, clearHighlightAction }) => () => {
            api.get({
                resource: `advance-search-v3.0/customDashBoard/delete/${highlightedId}`
            });
            deleteChart(highlightedId)
            clearHighlightAction(overviewType);
        },
    })
)(DeleteChartModal);
