/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { createEntity } from '../qualifiedDeal.actions';
import _l from 'lib/i18n';
import './styles.less';

addTranslations({
  'en-US': {
    Percentage: 'Percentage',
    'Total percentage must be 100%': 'Total percentage must be 100%',
  },
});

class Percentage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      participantList: props.participantList || [],
      message: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.participantList !== this.props.participantList) {
      setTimeout(() => {
        this.setState({ participantList: this.props.participantList });
      }, 100);
    }
  }

  sumPercent = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseInt(arr[i].sharedPercent);
    }
    return sum;
  };

  onSave = () => {
    const { participantList } = this.state;
    const { changePercentageReponsible } = this.props;
    const sum = this.sumPercent(participantList);
    if (sum !== 100) return this.setState({ message: _l`Total percentage must be 100%` });
    if (sum === 100) {
      this.setState({ message: null }, () => {
        if (changePercentageReponsible){
          changePercentageReponsible(participantList);
        } else {
          this.props.createEntity(this.props.formKey, { ...this.props.qualified, participantList });
        }
        this.props.onClosePercentage();
      });
    }
  };

  onClose = () => {
    this.props.onClosePercentage();
  };

  _handleChange = (e, { value }, index) => {
    const { participantList } = this.state;
    const newObj = [...participantList];
    newObj[index].sharedPercent = value;
    this.setState({ participantList: newObj });
  };

  render() {
    const { participantList, message } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Percentage`}
          visible={this.props.visible}
          onDone={this.onSave}
          onClose={this.onClose}
          okLabel={_l`save`}
          scrolling={true}
          size="mini"
        >
          <div className="qualified-add-form">
            {message && (
              <Message negative>
                <p>{message}</p>
              </Message>
            )}
            <Form>
              {participantList.map((p, index) => {
                return (
                  <Form.Group className="unqualified-fields" key={p.uuid}>
                    <div className="unqualified-label participant-label">
                      {this.props.users[p.uuid] &&
                        `${this.props.users[p.uuid].firstName} ${this.props.users[p.uuid].lastName}`}
                    </div>
                    <div className="dropdown-wrapper" width={6}>
                      <Input
                        value={p.sharedPercent}
                        type="number"
                        min={0}
                        onChange={(e, data) => this._handleChange(e, data, index)}
                      />
                      <span className="form-errors" />
                    </div>
                  </Form.Group>
                );
              })}
            </Form>
          </div>
        </ModalCommon>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { formKey }) => {
  return {
    qualified: state.entities.qualifiedDeal[formKey] || {},
    users: state.entities.user,
  };
};

export default connect(mapStateToProps, { createEntity })(Percentage);
