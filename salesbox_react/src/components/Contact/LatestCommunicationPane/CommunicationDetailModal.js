import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { CommunicationTypes } from 'Constants';
import { isHighlightAction, getItemSelected } from '../../Overview/overview.selectors';
import { clearHighlightAction } from '../../Overview/overview.actions';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import { Form, Input } from 'semantic-ui-react';
import api from '../../../lib/apiClient';
import localCss from './CommunicationItem.css';

addTranslations({
  'en-US': {
    save: 'Save',
    'Sent email': 'Sent email',
    'Received email': 'Received email',
    From: 'From',
    To: 'To',
    Subject: 'Subject',
    'Opened email': 'Opened email',
    'Clicked URL': 'Clicked URL',
    'Opened attachment': 'Opened attachment',
    'IMessage': 'IMessage',
    Content: 'Content'
  },
});

class ComminicationDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {}
    };
  }

  getTitle = () => {
    const { communication } = this.props;
    const { type } = communication;
    if (type === CommunicationTypes.I_MESSAGE){
      return _l`IMessage`
    }
    return type === CommunicationTypes.Email.Receiver ? _l`Received email` : _l`Sent email`;
  }

  async componentDidMount() {
    // const { communication } = this.props;
    // try {
    //   const data = await api.get({
    //     resource: `call-lists-v3.0/communication/getContent/${communication.uuid}`
    //   });
    //   this.setState({ detail: data })
    // } catch (error) {

    // }
  }

  async componentWillReceiveProps(nextProps) {
    const { communication, visible } = this.props;
    if (!nextProps.visible) {
      return;
    }

    if (communication !== nextProps.communication || (nextProps.visible !== visible && nextProps.visible)) {
      try {
        const data = await api.get({
          resource: `call-lists-v3.0/communication/getContent/${nextProps.communication.uuid}`
        });
        this.setState({ detail: data })
      } catch (error) {

      }
    }
  }


  render() {
    const { detail } = this.state;
    const { visible, clearHighlightAction, overviewType, communication } = this.props;
    const { content, fromEmail, toEmail, subject, date, to } = detail;

    const { type } = communication;
    if (type === CommunicationTypes.I_MESSAGE) {
      return <React.Fragment>
        <ModalCommon
          title={this.getTitle()}
          visible={visible}
          onDone={() => { }}
          onClose={() => { clearHighlightAction(overviewType) }}
          className={css.editTaskModal}
          okLabel={_l`save`}
          hasNotFooter
          scrolling={true}
        >
          <div className="qualified-add-form">
            <Form>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`To`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={to}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Content`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={content}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
            </Form>
          </div>
        </ModalCommon>
      </React.Fragment>
    }

    const { startDate, receiveDate, receiveUrlDate, receiveAttachmentDate, trackingCode, trackingAttachmentCode, trackingUrlCode } = communication;
    let sent = moment(startDate).format('DD MMM, YYYY, HH:mm');
    let openEmail = 'Tracking not on';
    let clickUrl = 'Tracking not on';
    let openAtach = 'Tracking not on';
    if (trackingCode) {
      openEmail = 'Tracking on';
      if (receiveDate) {
        openEmail = moment(receiveDate).format('DD MMM, YYYY, HH:mm');
      }
    }
    if (trackingUrlCode) {
      clickUrl = 'Tracking on';
      if (receiveUrlDate) {
        clickUrl = moment(receiveUrlDate).format('DD MMM, YYYY, HH:mm');
      }
    }
    if (trackingAttachmentCode) {
      openAtach = 'Tracking on';
      if (receiveUrlDate) {
        openAtach = moment(receiveAttachmentDate).format('DD MMM, YYYY, HH:mm');
      }
    }

    return (
      <React.Fragment>
        <ModalCommon
          title={this.getTitle()}
          visible={visible}
          onDone={() => { }}
          onClose={() => { clearHighlightAction(overviewType) }}
          className={css.editTaskModal}
          okLabel={_l`save`}
          hasNotFooter
          scrolling={true}
        >
          <div className="qualified-add-form">
            <Form>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`From`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={fromEmail}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`To`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={toEmail}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Subject`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={subject}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Sent`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={sent}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Opened email`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={openEmail}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Clicked URL`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={clickUrl}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Opened attachment`}</div>
                <div className="dropdown-wrapper">
                  <Input
                    value={openAtach}
                    readOnly={true}
                  />
                </div>
              </Form.Group>
            </Form>
            {content && content?.indexOf('<html>') !== -1 || content?.indexOf('<div>') !== -1 ?
              <div dangerouslySetInnerHTML={{ __html: content }}>
              </div>:
              <div dangerouslySetInnerHTML={{ __html: content.replace(/(>)/g,'').replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(<!--(.*?(\n))+.*?-->)/g, '')} }>
              </div>
              }

          </div>

        </ModalCommon>
      </React.Fragment>
    );
  }
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'communication_detail');
    const itemSelected = getItemSelected(state, overviewType);

    return {
      visible,
      communication: itemSelected ? itemSelected : {}
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    { clearHighlightAction }
  ),
)(ComminicationDetailModal);

