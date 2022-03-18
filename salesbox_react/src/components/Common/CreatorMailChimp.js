import React, { Component } from 'react';
import mailchimp from '../../../public/icon_Mailchimp.png';
import css from './CreatorMailChimp.css'
import Collapsible from 'components/Collapsible/Collapsible';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Source: 'Source'
  },
});

export class CreatorMailChimp extends Component {
  render() {
    const { lead } = this.props;
    return (
      <Collapsible width={308} padded flex horizontal title={_l`Source`}>
        <div className={css.mailChimpCreator}>
          <img className={css.image} src={mailchimp} />
          <table className={css.table}>
            <tbody>
              <tr className={css.row}>
                <td><span translate>Campaign name</span></td>
                <td className={css.textRight}>
                  <label>{lead.campaignName ? lead.campaignName : ''}</label>
                </td>
              </tr>
              <tr className={css.row}>
                <td><span translate>Total clicks</span></td>
                <td className={css.textRight}>
                  <label>{lead.mailChimpTotalClick}</label>
                </td>
              </tr>
              <tr className={css.row}>
                <td><span translate>Total opens</span></td>
                <td className={css.textRight}>
                  <label>{lead.mailChimpTotalOpen}</label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Collapsible>
    )
  }
}
