import React, { Fragment, useState, memo, useCallback, useMemo } from 'react';
import { Grid, Button, Form, Dropdown, Popup, Icon } from 'semantic-ui-react';
import classnames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import css from './customFields.css';
import * as SettingsActions from 'components/Settings/settings.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';

const ItemViewDragable = ({
  uuidSelect,
  setUuidSelect,
  item,
  deleteItemCustomFieldsSettings,
  copyItemCustomFieldsSettings,
}: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalCopy, setOpenModalCopy] = useState(false);
  const [valueDropdown, setValueDropdown] = useState([]);

  const [errorDropdown, setErrorDropdown] = useState(false);
  // const BUTTON = [
  //   { key: 1, text: _l`Accounts`, value: 'ACCOUNT' },
  //   { key: 2, text: _l`Contacts`, value: 'CONTACT' },
  //   { key: 3, text: _l`Qualified deals`, value: 'OPPORTUNITY' },
  //   { key: 4, text: _l`Unqualified deals`, value: 'LEAD' },
  //   { key: 5, text: _l`Tasks`, value: 'TASK' },
  //   { key: 6, text: _l`Appointments`, value: 'APPOINTMENT' },
  //   { key: 7, text: _l`Users`, value: 'USER' },
  //   { key: 8, text: _l`Products/Order rows`, value: 'PRODUCT_REGISTER' },
  // ];
  const BUTTON = [
    { id: 1, name: _l`Companies`, value: 'ACCOUNT', text: _l`Companies` },
    { id: 2, name: _l`Contacts`, value: 'CONTACT', text: _l`Contacts` },
    { id: 3, name: _l`Deals`, value: 'OPPORTUNITY', text: _l`Deals` },
    { id: 4, name: _l`Prospects`, value: 'LEAD', text: _l`Prospects` },
    { id: 5, name: _l`Reminders`, value: 'TASK', text: _l`Reminders` },
    { id: 6, name: _l`Meetings`, value: 'APPOINTMENT', text: _l`Meetings` },
    { id: 7, name: _l`Users`, value: 'USER', text: _l`Users` },
    { id: 8, name: _l`Products`, value: 'PRODUCT_REGISTER', text: _l`Products` },
  ];

  const onDone = useCallback(() => {
    deleteItemCustomFieldsSettings(item.uuid);
    setUuidSelect(0);
    setOpenModal(false);
  }, [deleteItemCustomFieldsSettings, item.uuid, setUuidSelect]);

  const onChangeDropDown = useCallback((_, data) => {
    setValueDropdown(data.value);
    setErrorDropdown(false);
  }, []);

  const onDoneCopy = useCallback(async () => {
    if (valueDropdown.length > 0) {
      await copyItemCustomFieldsSettings(omit(item, ['id']), valueDropdown);
      setOpenModalCopy(false);
      setValueDropdown([]);
      setErrorDropdown(false);
    } else {
      setErrorDropdown(true);
    }
  }, [valueDropdown, copyItemCustomFieldsSettings, item]);

  const fieldType = useMemo(() => {
    switch (item.fieldType) {
      case 'TEXT':
        return _l`Text`;
      case 'CHECK_BOXES':
        return _l`Checkboxes`;
      case 'PRODUCT_TAG':
        return _l`Product tag`;
      case 'DROPDOWN':
        return _l`Dropdown`;
      case 'NUMBER':
        return _l`Number`;
      case 'TEXT_BOX':
        return _l`Textbox`;
      case 'DATE':
        return _l`Date`;
      case 'URL':
        return _l`URL`;
      default:
        return '';
    }
  }, [item.fieldType]);

  return (
    <Fragment>
      <Grid style={{ paddingRight: 8 }}>
        <Grid.Column className={css.itemView} width={5}>
          <picture className={classnames(css.textItemCustomField, uuidSelect === item.uuid && css.titleItemClick)}>
            {item.title}
          </picture>
        </Grid.Column>
        <Grid.Column className={css.itemView} width={8}>
          <p className={classnames(css.textItemCustomField, uuidSelect === item.uuid && css.titleItemClick)}>
            {fieldType}
          </p>
        </Grid.Column>
        <Grid.Column className={[css.itemView, css.iconCopy]} width={1} textAlign="right">
          <Popup
            className={css.popupCommmon}
            // trigger={<Button icon="list ul" size="mini" className={css.deleteButton} style={{cursor: 'grab'}} circular compact />}
            trigger={
              <div className={css.iconList}>
                <Icon name="list ul" color="grey" className={css.iconListItem} />
              </div>
            }
            content={_l`Drag & Drop`}
          />
        </Grid.Column>
        <Grid.Column className={[css.itemView, css.iconCopy]} width={1} textAlign="right">
          <Popup
            className={css.popupCommmon}
            trigger={
              <Button
                icon="close"
                size="mini"
                className={css.deleteButton}
                onClick={() => setOpenModal(true)}
                circular
                compact
              />
            }
            content={_l`Delete`}
          />
        </Grid.Column>
        <Grid.Column className={[css.itemView, css.iconCopy]} width={1} textAlign="right">
          <Popup
            className={css.popupCommmon}
            trigger={
              <Button
                icon="copy outline"
                className={css.deleteButton}
                onClick={() => setOpenModalCopy(true)}
                size="mini"
                circular
                compact
              />
            }
            content={_l`Copy`}
          />
        </Grid.Column>
      </Grid>

      <ModalCommon
        title={_l`Confirm`}
        visible={openModal}
        onDone={onDone}
        onClose={() => setOpenModal(false)}
        size="tiny"
        cancelLabel={_l`No`}
        okLabel={_l`Yes`}
        paddingAsHeader={true}
      >
        <p>{_l`Do you really want to delete this custom field?`}</p>
      </ModalCommon>

      <ModalCommon
        title={_l`Copy ${item.title} to...`}
        visible={openModalCopy}
        onDone={onDoneCopy}
        onClose={() => {
          setOpenModalCopy(false);
          setValueDropdown([]);
          setErrorDropdown(false);
        }}
        size="tiny"
        cancelLabel={_l`Cancel`}
        okLabel={_l`Save`}
        paddingAsHeader={true}
        scrolling={false}
        description={false}
      >
        <Form className={`position-unset`}>
          <Form.Group className={css.formField}>
            <div className={css.label} width={6}>
              {_l`Object name`}
              <span className={css.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Dropdown
                error={errorDropdown}
                id="SelectObjectCopyCustomField"
                onChange={onChangeDropDown}
                placeholder={_l`Selected objects` + ':'}
                fluid
                value={valueDropdown}
                multiple
                search
                selection
                className={css.inputField}
                options={BUTTON}
              />
              <span className="form-errors">{errorDropdown && _l`Object name is required`}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    </Fragment>
  );
};

export default compose(
  memo,
  connect(null, {
    deleteItemCustomFieldsSettings: SettingsActions.deleteItemCustomFieldsSettings,
    copyItemCustomFieldsSettings: SettingsActions.copyItemCustomFieldsSettings,
  })
)(ItemViewDragable);
