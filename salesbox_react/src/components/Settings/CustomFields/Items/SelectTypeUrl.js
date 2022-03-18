import React, { useCallback, Fragment, memo } from 'react';
import { Grid, Dropdown, Button, Divider, Input } from 'semantic-ui-react';
import update from 'immer';

import css from '../customFields.css';
import _l from 'lib/i18n';

const friendOptions = [
  {
    key: 'Linkedin',
    text: 'Linkedin',
    value: 'LINKEDIN',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/145/145807.svg', className: css.iconSocial },
  },
  {
    key: 'Facebook',
    text: 'Facebook',
    value: 'FACEBOOK',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111393.svg', className: css.iconSocial },
  },
  {
    key: 'Twitter',
    text: 'Twitter',
    value: 'TWITTER',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111688.svg', className: css.iconSocial },
  },
  {
    key: 'Skype',
    text: 'Skype',
    value: 'SKYPE',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111609.svg', className: css.iconSocial },
  },
  {
    key: 'Instagram',
    text: 'Instagram',
    value: 'INSTAGRAM',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/2111/2111463.svg', className: css.iconSocial },
  },
  {
    key: 'Web',
    text: 'Web',
    value: 'WEB',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/891/891194.svg', className: css.iconSocial },
  },
  {
    key: 'Google search',
    text: 'Google search',
    value: 'GOOGLE_SEARCH',
    className: css.itemOptionUrl,
    image: { avatar: true, src: 'https://image.flaticon.com/icons/svg/1086/1086933.svg', className: css.iconSocial },
  },
];

const SelectTypeUrl = ({ itemSelect, updateCustomFieldRequest, updateCustomField }: any) => {
  const onChange = useCallback(
    (_, data) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          draf.customFieldOptionDTO.urlType = data.value;
        })
      );
    },
    [updateCustomField, itemSelect]
  );

  const onChangeInput = useCallback(
    (_, data) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          draf.customFieldOptionDTO.searchPrefix = data.value;
        })
      );
    },
    [updateCustomField, itemSelect]
  );

  return (
    <Fragment>
      <Grid.Row className={css.viewHeaderSelectFiled}>
        <Grid.Column verticalAlign="middle" width={6}>
          <p className={css.headerPane}>{_l`Type of link`}:</p>
        </Grid.Column>
        <Grid.Column width={10}>
          <Dropdown
            onChange={onChange}
            value={itemSelect.customFieldOptionDTO.urlType}
            className={css.viewDropdownSelect}
            selection
            search
            fluid
            options={friendOptions}
          />
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>

        {itemSelect.customFieldOptionDTO.urlType === 'GOOGLE_SEARCH' && (
          <Fragment>
            <Grid.Column verticalAlign="middle" width={6}>
              <b className={css.textHeader}>{_l`Search site`}</b>
            </Grid.Column>

            <Grid.Column width={10}>
              <Input
                className={css.textItemCustomField}
                type="text"
                onChange={onChangeInput}
                value={itemSelect.customFieldOptionDTO.searchPrefix}
                transparent
                placeholder={_l`Required`}
                fluid
              />
            </Grid.Column>

            <Grid.Column width={16}>
              <i style={{ marginTop: 30 }}>({_l`searches google for site plus the account name`})</i>
            </Grid.Column>
          </Fragment>
        )}

        <Grid.Column width={16} textAlign="center">
          <Button onClick={updateCustomFieldRequest} className={css.btnDone}>
            {_l`Done`}
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Fragment>
  );
};

export default memo(SelectTypeUrl);
