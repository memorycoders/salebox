import React, { useState, memo, Fragment, useCallback, useEffect } from 'react';
import { Grid, Button, Divider, Form } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import css from './customFields.css';
import ViewDragable from './ViewDragable';
import SelectField from './SelectField';
import * as SettingsActions from 'components/Settings/settings.actions';
import { IconButton } from '../../Common/IconButton';
import add from '../../../../public/Add.svg';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { isCustomFieldDTOList } from '../settings.selectors';

const ViewResult = ({ updatePositionCustomFieldsSettings, addCustomFieldsSettings, customFieldDTOList }: any) => {
  const BUTTON = [
    { key: 1, text: _l`Text`, value: 'TEXT' },
    { key: 2, text: _l`Dropdown`, value: 'DROPDOWN' },
    { key: 3, text: _l`Number`, value: 'NUMBER' },
    { key: 4, text: _l`Textbox`, value: 'TEXT_BOX' },
    { key: 5, text: _l`Date`, value: 'DATE' },
    { key: 6, text: _l`Checkboxes`, value: 'CHECK_BOXES' },
    { key: 7, text: _l`URL`, value: 'URL' },
    { key: 8, text: _l`Product tag`, value: 'PRODUCT_TAG' },
  ];

  const [uuidSelect, setUuidSelect] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [textNewField, setTextNewField] = useState('');
  const [showError, setShowError] = useState(false);
  const [valueDropdown, setValueDropdwon] = useState(BUTTON[0].value);
  const [added, setAdded] = useState(false);

  const onChangeDropDown = useCallback((_, data) => {
    setValueDropdwon(data.value);
  }, []);

  const onDone = useCallback(async () => {
    if (!textNewField) {
      setShowError(true);
    } else {
      await addCustomFieldsSettings(textNewField, valueDropdown);
      setOpenModal(false);
      setValueDropdwon(BUTTON[0].value);
      setTextNewField('');
      setShowError(false);
      setAdded(true);
    }
  }, [textNewField, addCustomFieldsSettings, valueDropdown]);

  const onChange = useCallback((_, data) => {
    setTextNewField(data.value);
  }, []);

  const onClose = useCallback(() => {
    setOpenModal(false);
    setShowError(false);
  }, []);

  useEffect(() => {
    if (customFieldDTOList.length > 0 && added) {
      setUuidSelect(customFieldDTOList[customFieldDTOList.length - 1].uuid);
      setAdded(false);
    }
  }, [customFieldDTOList]);

  return (
    <Fragment>
      <Grid>
        <Grid.Column className={css.viewResult} width={7}>
          <Grid>
            <Grid.Column width={5}>
              <p className={css.textHeader}>{_l`Field name`}</p>
            </Grid.Column>
            <Grid.Column width={6}>
              <p className={css.textHeader}>{_l`Type`}</p>
            </Grid.Column>
            <Grid.Column width={5} className={css.iconAddHeader} style={{ paddingRight: '18px' }}>
              <IconButton
                onClick={() => setOpenModal(true)}
                className={css.viewIconAddHeader}
                imageClass={css.imageClass}
                name="profile"
                size={24}
                src={add}
              />
            </Grid.Column>
          </Grid>

          <Divider className={css.viewResultDiviver} />

          <ViewDragable uuidSelect={uuidSelect} setUuidSelect={setUuidSelect} />

          <Grid>
            <Grid.Column textAlign="center">
              <Button onClick={updatePositionCustomFieldsSettings} className={css.btnDone}>
                {_l`Update Position`}
              </Button>
            </Grid.Column>
          </Grid>
        </Grid.Column>

        {!!uuidSelect && <SelectField uuidSelect={uuidSelect} />}
      </Grid>

      <ModalCommon
        title={_l`Add custom fields`}
        visible={openModal}
        className={css.editTaskModal}
        onDone={onDone}
        size="small"
        onClose={onClose}
        okLabel={_l`Save`}
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
              <Form.Input
                error={showError && !textNewField}
                onChange={onChange}
                value={textNewField}
                className={css.inputField}
              />
              <span className="form-errors">{showError && !textNewField && _l`Object name is required`}</span>
            </div>
          </Form.Group>

          <Form.Group className={css.formField}>
            <div className={css.label} width={6}>
              {_l`Type`}
            </div>
            <div className={css.inputWraper}>
              <Form.Dropdown
                search
                onChange={onChangeDropDown}
                value={valueDropdown}
                className={css.inputField}
                selection
                fluid
                options={BUTTON}
              />
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    </Fragment>
  );
};

export default compose(
  memo,
  connect((state) => ({ customFieldDTOList: isCustomFieldDTOList(state) }), {
    updatePositionCustomFieldsSettings: SettingsActions.updatePositionCustomFieldsSettings,
    addCustomFieldsSettings: SettingsActions.addCustomFieldsSettings,
  })
)(ViewResult);
