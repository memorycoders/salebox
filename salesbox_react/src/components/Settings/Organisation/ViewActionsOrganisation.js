/* eslint-disable react/jsx-no-bind */
import React, { Fragment, useState, useCallback, memo } from 'react';
import { Grid, Form, TextArea, Button } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import classNames from 'classnames';

import css from './organisation.css';
import * as SettingsActions from 'components/Settings/settings.actions';
import ModalUser from './ModalUser';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { isCompanyOrganisation, getTotalUserPending } from '../settings.selectors';
import * as NotificationActions from '../../Notification/notification.actions';
import api from 'lib/apiClient';

const ViewActionsOrganisation = ({
  addNewUnitOranisationSettings,
  company,
  handleAddAction,
  dispatch,
  totalPending,
}: any) => {
  const [modalUnit, setModalUnit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);

  const [nameUnit, setNameUnit] = useState('');
  const [descriptionUnit, setDescriptionUnit] = useState('');

  const onDoneModal = useCallback(() => {
    if (!nameUnit) {
      setShowError(true);
    } else {
      addNewUnitOranisationSettings(descriptionUnit, nameUnit);
      setModalUnit(false);
      setShowError(false);
    }
  }, [nameUnit, descriptionUnit, addNewUnitOranisationSettings]);

  const onDoneUser = useCallback(
    async (values) => {
      handleAddAction({ values, setOpenModalUser });
    },
    [handleAddAction]
  );

  const closeModalUnit = useCallback(() => {
    setModalUnit(false);
    setNameUnit('');
    setDescriptionUnit('');
    setShowError(false);
  }, []);

  return (
    <Fragment>
      <Grid.Row className={css.viewActionsOrga}>
        <p className={css.textNumberuser}>
          {_l`Number of user`}{' '}
          <span className={css.numberUserActive}>
            {company.numberUserActive}/{company.numberLicense}
          </span>
        </p>
        <div>
          <Button className={css.button} onClick={() => setModalUnit(true)}>{_l`Add unit`}</Button>
          <Button
            className={css.button}
            onClick={() => {
              if (company.numberUserActive + totalPending >= company.numberLicense) {
                dispatch(NotificationActions.error('You need to add more subscribers to add more users'));
              } else {
                setOpenModalUser(true);
              }
            }}
          >{_l`Add user`}</Button>
        </div>
      </Grid.Row>

      {/* <div>
          <Grid>
            <Grid.Column className={css.viewItemAction} width={16}>
              <Image src="https://image.flaticon.com/icons/svg/1738/1738455.svg" width={45} height={45} />
              <p className={css.textViewAction}>{_l`Add unit`}</p>
            </Grid.Column>
          </Grid>
        </div>

        <div onClick={() => setOpenModalUser(true)}>
          <Grid>
            <Grid.Column textAlign="center" width={16}>
              <Grid.Column className={css.viewItemAction} width={16}>
                <Image src={addUser} width={45} height={45} />
                <p className={css.textViewAction}>{_l`Add user`}</p>
              </Grid.Column>
            </Grid.Column>
          </Grid>
        </div> */}

      <ModalCommon
        title={_l`Add unit`}
        visible={modalUnit}
        className={css.editTaskModal}
        onDone={onDoneModal}
        size="small"
        onClose={closeModalUnit}
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
              onChange={(_, data) => {
                if (descriptionUnit.length < 141) {
                  setDescriptionUnit(data.value);
                }
              }}
              rows={5}
              maxLength={140}
            />
            <span className={css.spanNote}>{140 - descriptionUnit.length}</span>
          </Form.Group>
        </Form>
      </ModalCommon>

      <ModalUser title={_l`Add user`} onDone={onDoneUser} openModal={openModalUser} setOpenModal={setOpenModalUser} />
    </Fragment>
  );
};

export default compose(
  memo,
  connect(
    (state) => ({ company: isCompanyOrganisation(state), totalPending: getTotalUserPending(state) }),
    (dispatch) => ({
      dispatch,
    })
  ),
  withHandlers({
    handleAddAction: ({ dispatch }) => async ({ values, setOpenModalUser }) => {
      try {
        let country = values.country;
        if (
          values?.country !== 'England' &&
          values?.country !== 'Sweden' &&
          values?.country !== 'Spain' &&
          values?.country !== 'Germany'
        ) {
          country = 'England';
        }
        await api.post({
          resource: `enterprise-v3.0/user/requestAddUser`,
          data: { ...values, country: country },
        });

        setOpenModalUser(false);
        dispatch(SettingsActions.requestOrganisationSettings());
        dispatch(NotificationActions.success(_l`Added`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message));
      }
    },
    addNewUnitOranisationSettings: ({ dispatch }) => async (descriptionUnit, nameUnit) => {
      dispatch(SettingsActions.addNewUnitOranisationSettings(descriptionUnit, nameUnit));
    },
  })
)(ViewActionsOrganisation);
