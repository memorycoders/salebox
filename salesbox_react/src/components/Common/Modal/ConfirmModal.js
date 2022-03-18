//@flow

import React from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    "Confirm": "Confirm",
    "Later": "Later"
  },
});

class ConfirmModal extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  handleActionCancel = () => {
    this.props.fnCancel && this.props.fnCancel()
  }

  handleActionDone = () => {
    this.props.fnOk && this.props.fnOk()
  }

  render() {
    return (
      <>
      <ModalCommon
        title={_l`Confirm`}
        visible={this.props.visible}
        onDone={this.handleActionDone}
        onClose={this.handleActionCancel}
        scrolling={false}
        size="tiny"
        paddingAsHeader={true}
      >
        <div>{this.props.title}</div>
      </ModalCommon>
      </>
    );
  }
}

export default ConfirmModal;
