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

const NoteForPieChart = ({ visible, onClose, onDone }: PropsT) => {
    return (
        <ModalCommon
            title={_l`Confirm`}
            visible={visible}
            onDone={onDone}
            onClose={onClose}
            size="tiny"
            paddingAsHeader={true}
        >
            <p>{_l`It will reset filter of all dataset to dataset 1 Do you want to apply it?`}</p>
        </ModalCommon>
    );
};

export default compose()(NoteForPieChart);
