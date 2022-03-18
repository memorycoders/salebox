import React, { useMemo, Fragment, useState, useCallback, memo } from 'react';
import { Grid, Image, Menu } from 'semantic-ui-react';
import classNames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './organisation.css';
import * as SettingsActions from 'components/Settings/settings.actions';
import ModalUser from './ModalUser';
import ModalChangeAvatar from './ModalChangeAvatar';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import userDeactive from '../../../../public/userDeactive.png';
import user from '../../../../public/userGray.png';
import userCaution from '../../../../public/userCaution.png';

const ItemInCompany = ({
  item,
  updateStatusUserOrganisationSettings,
  deleteUserPendingOranisationSettings,
  updateUserOrganisationSettings,
  updateUserAvatarOrganisationSettings,
}: any) => {
  const [openModalActive, setOpenModalActive] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [fileData, setFileData] = useState(null);

  const discProfile = useMemo(() => {
    if (item.discProfile === 'YELLOW') {
      return css.itemYellow;
    }
    if (item.discProfile === 'BLUE') {
      return css.itemBlue;
    }
    if (item.discProfile === 'RED') {
      return css.itemRed;
    }
    if (item.discProfile === 'GREEN') {
      return css.itemGreen;
    }

    return css.aabc;
  }, [item.discProfile]);

  const src = useMemo(() => {
    if (item.pendingId) {
      return userCaution;
    }

    if (item.active) {
      return item.avatar
        ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${item.avatar.substr(item.avatar.length - 3)}/${
            item.avatar
          }`
        : user;
    }

    return userDeactive;
  }, [item.active, item.avatar]);

  const onDoneModalActive = useCallback(async () => {
    if (item.pendingId) {
      await deleteUserPendingOranisationSettings(item.pendingId);
    } else {
      await updateStatusUserOrganisationSettings(item.uuid, !item.active);
    }
    setOpenModalActive(false);
  }, [item, updateStatusUserOrganisationSettings, updateStatusUserOrganisationSettings]);

  const onDoneEditUser = useCallback(
    async (values) => {
      await updateUserOrganisationSettings({ ...values, uuid: item.uuid });
      setOpenModalEdit(false);
    },
    [updateUserOrganisationSettings, item]
  );

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
      await updateUserAvatarOrganisationSettings(item.uuid, avatar);
      setModalAvatar(false);
      setFileData(null);
    },
    [updateUserAvatarOrganisationSettings, item]
  );

  return (
    <Fragment>
      <div className={css.viewChildAccodion}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Image onClick={handleAvatar} src={src} width={50} height={50} circular />
              <input type="file" id="contact-field-photo" style={{ display: 'none' }} />
            </Grid.Column>
            <Grid.Column width={9}>
              <b>
                {item.firstName} {item.lastName}
              </b>
              <p className={css.textEmail}>
                {item.discProfile !== 'NONE' && <p className={classNames(css.discProfile, discProfile)} />}
                {item.email}
              </p>
              <p className={css.textEmail}>{item.phone}</p>
            </Grid.Column>

            <Grid.Column width={4} textAlign="center">
              <MoreMenu className={css.bgMore} on="hover" position="bottom right">
                {item.pendingId ? (
                  <Menu.Item icon onClick={() => setOpenModalActive(true)}>
                    <div className={css.actionIcon}>{_l`Delete`}</div>
                  </Menu.Item>
                ) : (
                  <Fragment>
                    <Menu.Item icon onClick={() => setOpenModalEdit(true)}>
                      <div className={css.actionIcon}>{_l`Update`}</div>
                    </Menu.Item>
                    <Menu.Item onClick={() => setOpenModalActive(true)} icon>
                      <div className={css.actionIcon}>{item.active ? 'Deactive' : 'Active'}</div>
                    </Menu.Item>
                  </Fragment>
                )}
              </MoreMenu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <ModalCommon
        title={`Confirm`}
        visible={openModalActive}
        onDone={onDoneModalActive}
        onClose={() => setOpenModalActive(false)}
        size="tiny"
        cancelLabel={_l`No`}
        okLabel={_l`Yes`}
        paddingAsHeader={true}
      >
        {item.pendingId ? (
          <p>{_l`Are you sure you want to delete this user?`}</p>
        ) : item.active ? (
          <p>{_l`Are you sure you want to deactive?`}</p>
        ) : (
          <p>{_l`Are you sure you want to active?`}</p>
        )}
      </ModalCommon>

      <ModalUser
        title={_l`Update user`}
        openModal={openModalEdit}
        onDone={onDoneEditUser}
        setOpenModal={setOpenModalEdit}
        itemEdit={item}
      />

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
    updateStatusUserOrganisationSettings: SettingsActions.updateStatusUserOrganisationSettings,
    deleteUserPendingOranisationSettings: SettingsActions.deleteUserPendingOranisationSettings,
    updateUserOrganisationSettings: SettingsActions.updateUserOrganisationSettings,
    updateUserAvatarOrganisationSettings: SettingsActions.updateUserAvatarOrganisationSettings,
  })
)(ItemInCompany);
