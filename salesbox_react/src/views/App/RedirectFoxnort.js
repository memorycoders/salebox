import React from 'react';
import { connect } from 'react-redux';
import { requestLogout, autoLoginFortnox } from '../../components/Auth/auth.actions';
import _l from 'lib/i18n';
import ModalCommon from '../../components/ModalCommon/ModalCommon';
import { isFirstLogin } from 'components/Auth/auth.selector';
import { withRouter } from 'react-router';
class RedirectFoxnort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    const { isFirstLogin, isMainContact } = this.props;
    if (window?.location?.pathname === '/redirectFortnox') {
      this.setState({
        visible: true,
      });
    }
    const { props } = this;
    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    if (queryObj.sessionId) {
      props.autoLoginFortnox(queryObj.sessionId, false);
    } else {
    }
  }
  componentWillReceiveProps(nextProps) {
    // if (
    //   nextProps.isFirstLogin !== this.props.isFirstLogin &&
    //   nextProps.isMainContact !== this.props.isMainContact &&
    //   nextProps.isFirstLogin &&
    //   nextProps.isMainContact
    // ) {
    //   this.setState({
    //     visible: true,
    //   });
    // }
    if (window.location.pathname === '/redirectFortnox') {
      this.setState({
        visible: true,
      });
    }
  }
  onDone = () => {
    const { props } = this;
    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    // if (queryObj.sessionId) {
    //   props.autoLoginFortnox(queryObj.sessionId);
    // } else {
    // }

    this.setState({
      visible: false,
    });

    this.props.history.push('/contacts');
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { props } = this;

    return (
      <>
        {!this.state.visible && (
          <div>
            <h4>Integrating Fortnox ...</h4>
          </div>
        )}

        <ModalCommon
          title={_l`Notification`}
          size="tiny"
          closeOnDimmerClick={false}
          cancelHidden
          visible={this.state.visible}
          onClose={this.onClose}
          onDone={this.onDone}
        >{_l`Salesbox has started to import your companies, contacts, orders and articles from Fortnox and this can take up to 48h depending on how much information you have in Fortnox. You can of course work with the information as soon as its been added to Salesbox.`}</ModalCommon>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFirstLogin: isFirstLogin(state),
    isMainContact: state.auth.user.isMainContact,
  };
};
const mapDispatchToProps = {
  requestLogout,
  autoLoginFortnox,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RedirectFoxnort));
