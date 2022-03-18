//@flow
import React from 'react';
import api from '../../../lib/apiClient';
import { Endpoints, OverviewTypes } from '../../../Constants';
import { connect } from 'react-redux';
import AddDropdown from '../../AddDropdown/AddDropdown';

export class MailchimpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mailchimps: [],
    };
  }

  async componentDidMount() {
    try {

      const data = await api.get({
        resource: `${Endpoints.Enterprise}/storage/list`,
      });
      const { storageDTOList } = data;
      const mailchimpWebTokenIndex = storageDTOList.findIndex((value) => value.type === 'MAIL_CHIMP_WEB_TOKEN');
      if (mailchimpWebTokenIndex !== -1) {
        const mailchimpResult = await api.post({
          resource: `${Endpoints.Campaign}/getMailChimpList`,
          query: {
            mailChimpToken: storageDTOList[mailchimpWebTokenIndex].value,
          },
        });
        const { data } = mailchimpResult;
        this.setState({
          mailchimps: data.map((mailchimp) => {
            return {
              ...mailchimp,
              key: mailchimp.id,
              value: mailchimp.id,
              text: mailchimp.name,
              apikey: storageDTOList[mailchimpWebTokenIndex].value,
            };
          }),
        });
      }
    } catch (error) {}
  }

  addNewMailchimp = () => {
    const { highlight, overviewType } = this.props;
    highlight(overviewType, '', 'addNewMailchimp');
  };
  render() {
    const { mailchimps } = this.state;
    const { onChange, addLabel, colId } = this.props;
    return (
      <AddDropdown
        placeholder=""
        colId={colId}
        options={mailchimps}
        onChange={onChange}
        onClickAdd={this.addNewMailchimp}
        fluid
        addLabel={addLabel}
        selection
        size="small"
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(MailchimpDropdown);
