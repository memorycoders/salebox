import React, { useCallback, Fragment, memo } from 'react';
import { Grid, Dropdown, Button, Divider, Input } from 'semantic-ui-react';
import update from 'immer';

import css from '../customFields.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isDateTimeFormatDTOList } from '../../settings.selectors';
import _l from 'lib/i18n';

const friendOptions = [
  {
    key: 'Linkedin',
    text: 'Linkedin',
    value: 'LINKEDIN',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111499.svg' },
  },
  {
    key: 'Facebook',
    text: 'Facebook',
    value: 'FACEBOOK',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111393.svg' },
  },
  {
    key: 'Twitter',
    text: 'Twitter',
    value: 'TWITTER',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111688.svg' },
  },
  {
    key: 'Skype',
    text: 'Skype',
    value: 'SKYPE',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111609.svg' },
  },
  {
    key: 'Instagram',
    text: 'Instagram',
    value: 'INSTAGRAM',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111463.svg' },
  },
  {
    key: 'Web',
    text: 'Web',
    value: 'WEB',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/891/891194.svg' },
  },
  {
    key: 'Google search',
    text: 'Google search',
    value: 'GOOGLE_SEARCH',
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/1086/1086933.svg' },
  },
];

const SelectTypeDate = ({ itemSelect, updateCustomFieldRequest, updateCustomField, dateTimeFormatDTOList }: any) => {
  const onChange = useCallback(
    (_, data) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          draf.customFieldOptionDTO.dateFormat = data.value;
        })
      );
    },
    [updateCustomField, itemSelect]
  );

  return (
    <Fragment>
      <Grid.Row className={css.viewHeaderSelectFiled}>
        <Grid.Column verticalAlign="middle" width={6}>
          <h5 className={css.textHeader}>{_l`Settings`}</h5>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
        <Grid.Column verticalAlign="middle" width={6}>
          <p className={css.textItemCustomField}>{_l`Date format`}:</p>
        </Grid.Column>
        <Grid.Column width={10}>
          <Dropdown
            search
            onChange={onChange}
            value={itemSelect.customFieldOptionDTO.dateFormat}
            className={css.viewDropdownSelect}
            selection
            fluid
            options={dateTimeFormatDTOList.map((i) => ({ key: i.uuid, text: i.name, value: i.format }))}
          />
        </Grid.Column>

        <Grid.Column width={16} textAlign="center">
          <Button onClick={updateCustomFieldRequest} className={css.btnDone}>
            {_l`Done`}
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Fragment>
  );
};

export default compose(
  memo,
  connect((state) => ({ dateTimeFormatDTOList: isDateTimeFormatDTOList(state) }))
)(SelectTypeDate);
