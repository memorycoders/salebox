//@flow

import React from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { setOfficeLostToken } from '../common.actions';
addTranslations({
  'en-US': {
    'Error': 'Error',
    "Later": "Later",
    'Your Google connection has been canceled by Google. Please link Google account again.': 'Your Google connection has been canceled by Google. Please link Google account again.',
    'Your Outlook.com connection has been canceled by Microsoft. Please link Outlook.com account again.': 'Your Outlook.com connection has been canceled by Microsoft. Please link Outlook.com account again.'
  },
});

class LostTokenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      message: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.listOfficeLostToken.status && nextProps.listOfficeLostToken.status !== this.props.listOfficeLostToken.status) {
      this.setState({
        currentIndex: 0,
        message: this.getMessageError(nextProps.listOfficeLostToken.data[0])
      })
    }
  }

  getMessageError = (type) => {
    switch(type) {
      case 'GOOGLE_TOKEN_HAS_BEEN_REVOKED':
        return _l`Your Google connection has been canceled by Google. Please link Google account again.`
      case 'OUTLOOK_TOKEN_HAS_BEEN_REVOKED':
        return _l`Your Outlook.com connection has been canceled by Microsoft. Please link Outlook.com account again.`
    }
  }

  
  onCloseModal = () => {
    let _nextIndex = this.state.currentIndex + 1;
    if(this.props.listOfficeLostToken.data[_nextIndex]) {
      this.setState({
        currentIndex: _nextIndex,
        message: this.getMessageError(this.props.listOfficeLostToken.data[_nextIndex])
      })
    } else {
      this.props.setOfficeLostToken(false)
    }
  }

  render() {
    return (
      <>
      <ModalCommon
        title={_l`Error`}
        visible={this.props.listOfficeLostToken.status}
        onDone={this.onCloseModal}
        onClose={this.onCloseModal}
        scrolling={false}
        size="tiny"
        cancelHidden={true}
        paddingAsHeader={true}
      >
        <div>{this.state.message}</div>
      </ModalCommon>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  listOfficeLostToken: state.common.listOfficeLostToken,
})

const mapDispatchToProps = (dispatch) => {
  return {
    setOfficeLostToken: (status) => dispatch(setOfficeLostToken(status)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LostTokenModal);
