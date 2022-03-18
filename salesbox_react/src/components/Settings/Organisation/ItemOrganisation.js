import React, { Fragment, useState, useCallback, memo, useEffect } from 'react';
import { Grid, Image, Icon, Menu, Input, TextArea, Form, Divider } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import classNames from 'classnames';

import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './organisation.css';
import * as SettingsActions from 'components/Settings/settings.actions';
import ModalChangeAvatar from './ModalChangeAvatar';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';

const ItemOrganisation = ({
  item,
  handleClickItem,
  activeIndex,
  index,
  updateItemUnitOrganisationSettings,
  deleteItemUnitOrganisationSettings,
  updateAvatarOrganisationSettings,
}: any) => {
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalAvatar, setModalAvatar] = useState(false);

  const [fileData, setFileData] = useState(null);

  const [nameUnit, setNameUnit] = useState(item.name);
  const [descriptionUnit, setDescriptionUnit] = useState(item.description);

  useEffect(() => {
    setNameUnit(item.name);
    setDescriptionUnit(item.description);
  }, [item.name, item.description]);

  const onDoneEdit = useCallback(async () => {
    if (!nameUnit) {
      setShowError(true);
    } else {
      await updateItemUnitOrganisationSettings({ ...item, description: descriptionUnit, name: nameUnit });
      setModalEdit(false);
      setShowError(false);
    }
  }, [nameUnit, descriptionUnit, updateItemUnitOrganisationSettings, item]);

  const onDoneDelete = useCallback(async () => {
    await deleteItemUnitOrganisationSettings(item.uuid);
    setModalDelete(false);
  }, [deleteItemUnitOrganisationSettings, item.uuid]);

  const handleAvatar = useCallback(() => {
    if (item.uuid) {
      document.getElementById('contact-field-photo').click();
      document.getElementById('contact-field-photo').onchange = function() {
        if (this.files && this.files.length) {
          setFileData(this.files[0]);
          setModalAvatar(true);
        }
      };
    }
  }, [item]);

  const onDoneChageAvatar = useCallback(
    async (avatar) => {
      await updateAvatarOrganisationSettings(item.uuid, avatar);
      setModalAvatar(false);
      setFileData(null);
    },
    [updateAvatarOrganisationSettings, item]
  );

  const onCloseEdit = useCallback(() => {
    setModalEdit(false);
    setShowError(false);
    setNameUnit(item.name);
    setDescriptionUnit(item.description);
  }, [item.name, item.description]);

  return (
    <Fragment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Image
              circular
              onClick={handleAvatar}
              src={
                item.avatar
                  ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${item.avatar.substr(
                      item.avatar.length - 3
                    )}/${item.avatar}`
                  : 'https://qa.salesbox.com/desktop/assets/img/non-sprite/Default_Photo.png'
              }
              width={50}
              height={50}
            />
            <input type="file" id="contact-field-photo" style={{ display: 'none' }} />
          </Grid.Column>
          <Grid.Column width={9}>
            <b onClick={() => handleClickItem(index)}>
              {item.name === 'No Unit' ? _l`No unit` : item.name}
              <Icon name={activeIndex.includes(index) ? 'angle down' : 'angle right'} size="large" />
            </b>
            <p className={css.numberUserActive}>
              {item.userDTOList.length} {_l`User`}
            </p>
          </Grid.Column>
          {item.type !== 'DEFAULT' && (
            <Grid.Column width={4} textAlign="center">
              <MoreMenu className={css.bgMore} on="hover" position="bottom right">
                <Menu.Item onClick={() => setModalEdit(true)} icon>
                  <div className={css.actionIcon}>{_l`Update`}</div>
                </Menu.Item>
                <Menu.Item onClick={() => setModalDelete(true)} icon>
                  <div className={css.actionIcon}>{_l`Delete`}</div>
                </Menu.Item>
              </MoreMenu>
            </Grid.Column>
          )}{' '}
          <p className={css.description}>{item.description}</p>
        </Grid.Row>
      </Grid>

      <ModalCommon
        title={_l`Confirm`}
        visible={modalDelete}
        onDone={onDoneDelete}
        onClose={() => setModalDelete(false)}
        size="tiny"
        cancelLabel={_l`No`}
        okLabel={_l`Yes`}
        paddingAsHeader={true}
      >
        <p>
          {_l`All users will be removed from the deactivated unit and will be under company. Are you sure you want to deactivate unit?`}
        </p>
      </ModalCommon>

      <ModalCommon
        title={_l`Update unit`}
        visible={modalEdit}
        className={css.editTaskModal}
        onDone={onDoneEdit}
        size="small"
        onClose={onCloseEdit}
        okLabel={_l`Save`}
        scrolling
      >
        <Form className={`position-unset`}>
          <Form.Group className={css.formField}>
            <div className={css.label} width={6}>
              {_l`Name`}
              <span className={css.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={showError && !nameUnit}
                onChange={(_, data) => setNameUnit(data.value)}
                value={nameUnit}
                className={css.inputField}
              />
              <span className="form-errors">{showError && !nameUnit && _l`Name is required`}</span>
            </div>
          </Form.Group>

          <Form.Group className={`${css.formField} position-relative`}>
            <div className={css.label} width={6}>{_l`Description`}</div>
            <TextArea
              className={classNames(css.dropdownForm, css.noteForm)}
              size="small"
              value={descriptionUnit}
              onChange={(_, data) => setDescriptionUnit(data.value)}
              rows={5}
              maxLength={140}
            />
            <span className={css.spanNote}>{140 - descriptionUnit.length}</span>
          </Form.Group>
        </Form>
      </ModalCommon>

      <ModalChangeAvatar
        onDone={onDoneChageAvatar}
        setOpenModal={setModalAvatar}
        fileData={fileData}
        openModal={modalAvatar}
      />
    </Fragment>
  );
};

export default compose(
  memo,
  connect(null, {
    updateItemUnitOrganisationSettings: SettingsActions.updateItemUnitOrganisationSettings,
    deleteItemUnitOrganisationSettings: SettingsActions.deleteItemUnitOrganisationSettings,
    updateAvatarOrganisationSettings: SettingsActions.updateAvatarOrganisationSettings,
  })
)(ItemOrganisation);
