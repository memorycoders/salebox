/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { fetchDelete } from '../../OrderRow/order-row.actions';

addTranslations({
  'en-US': {
    save: 'Save',
    'Confirm': 'Confirm',
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

class DeleteOrderRowModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
      error: null,
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
  };

  onSave = async () => {
    const { overviewType } = this.props;
    this.props.fetchDelete(overviewType);
  };

  render() {
    const { visible } = this.props;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Confirm`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={true}
          size="tiny"
          paddingAsHeader={true}
        >
          <p>{_l`Do you really want to delete?`}</p>
        </ModalCommon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'deleteOrder');
  return {
    visible,
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  fetchDelete,
})(DeleteOrderRowModal);
