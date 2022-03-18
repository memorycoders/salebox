import React, { useMemo, memo, useCallback, useState } from 'react';
import { Grid, Icon, Input } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import classNames from 'classnames';

import css from './customFields.css';
import SelectTypeUrl from './Items/SelectTypeUrl';
import SelectProductTag from './Items/SelectProductTag';
import SelectTypeText from './Items/SelectTypeText';
import SelectTypeNumber from './Items/SelectTypeNumber';
import SelectTypeDropdown from './Items/SelectTypeDropdown';
import { isCustomFieldDTOList } from '../settings.selectors';
import * as SettingsActions from 'components/Settings/settings.actions';
import SelectTypeDate from './Items/SelectTypeDate';
import _l from 'lib/i18n';

const typeMultiChoise = ['PRODUCT_TAG', 'DROPDOWN', 'CHECK_BOXES'];

const SelectField = ({
  uuidSelect,
  customFieldDTOList,
  editRequiedCustomField,
  editActiveCustomField,
  editMultiChooseCustomField,
  updateFieldNameCustomField,
  updateItemCustomFieldRequest,
  updateItemCustomField,
}: any) => {
  const [showError, setShowError] = useState(false);

  const itemSelect = useMemo(() => customFieldDTOList.find((i) => i.uuid === uuidSelect), [
    customFieldDTOList,
    uuidSelect,
  ]);

  const updateCustomFieldRequest = useCallback(() => {
    if (itemSelect.title) {
      setShowError(false);
      updateItemCustomFieldRequest(itemSelect);
    } else {
      setShowError(true);
    }
  }, [updateItemCustomFieldRequest, itemSelect]);

  const updateCustomField = useCallback(
    (query = {}) => {
      updateItemCustomField(itemSelect.uuid, { ...itemSelect, ...query });
    },
    [updateItemCustomField, itemSelect]
  );

  const renderFiled = useMemo(() => {
    if (itemSelect) {
      switch (itemSelect.fieldType) {
        case 'URL':
          return (
            <SelectTypeUrl
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'PRODUCT_TAG':
          return (
            <SelectProductTag
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'TEXT':
        case 'TEXT_BOX':
          return (
            <SelectTypeText
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'NUMBER':
          return (
            <SelectTypeNumber
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'DROPDOWN':
          return (
            <SelectTypeDropdown
              title={_l`Options`}
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'CHECK_BOXES':
          return (
            <SelectTypeDropdown
              title={_l`Options`}
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        case 'DATE':
          return (
            <SelectTypeDate
              updateCustomField={updateCustomField}
              updateCustomFieldRequest={updateCustomFieldRequest}
              itemSelect={itemSelect}
            />
          );
        default:
          return null;
      }
    }

    return null;
  }, [itemSelect, updateCustomFieldRequest, updateCustomField]);

  const clickMultiChoose = useCallback(() => {
    editMultiChooseCustomField(itemSelect.uuid, !itemSelect?.customFieldOptionDTO?.multiChoice);
  }, [editMultiChooseCustomField, itemSelect]);

  const clickRequired = useCallback(() => {
    editRequiedCustomField(itemSelect.uuid, !itemSelect.required);
  }, [editRequiedCustomField, itemSelect]);

  const clickActive = useCallback(() => {
    editActiveCustomField(itemSelect.uuid, !itemSelect.active);
  }, [editActiveCustomField, itemSelect]);

  const onchangeInput = useCallback(
    (_, data) => {
      updateFieldNameCustomField(itemSelect.uuid, data.value);
    },
    [updateFieldNameCustomField, itemSelect]
  );

  return (
    !!itemSelect && (
      <Grid.Column width={6}>
        <Grid>
          <Grid.Row columns={3} className={css.viewResult}>
            {typeMultiChoise.includes(itemSelect.fieldType) && (
              <Grid.Column>
                <div className={css.reponsibleIconSize} onClick={clickMultiChoose}>
                  <h5 className={css.textHeaderCheck}>{_l`Multiple choose`}</h5>
                  <div className={itemSelect?.customFieldOptionDTO?.multiChoice ? css.setDone : css.notSetasDone}>
                    <div />
                  </div>
                </div>
              </Grid.Column>
            )}
            <Grid.Column>
              <div onClick={clickRequired} className={css.reponsibleIconSize}>
                <h5 className={css.textHeaderCheck}>{_l`Required`}</h5>
                <div className={itemSelect.required ? css.setDone : css.notSetasDone}>
                  <div />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div onClick={clickActive} className={css.reponsibleIconSize}>
                <h5 className={css.textHeaderCheck}>{_l`Active`}</h5>
                <div className={itemSelect.active ? css.setDone : css.notSetasDone}>
                  <div />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className={css.viewHeaderSelectFiled}>
            {/* <Grid.Column width={16}>{showError && <span className={css.error}>Title is required</span>}</Grid.Column> */}

            <Grid.Column width={8}>
              <h5 className={css.textHeader}>{_l`Field name`}</h5>
            </Grid.Column>
            <Grid.Column textAlign="right" width={8}>
              <Input
                onChange={onchangeInput}
                type="text"
                className={classNames(css.inputSelectField, css.textItemCustomField)}
                value={itemSelect.title}
                transparent
                maxLength={30}
                error={showError}
                fluid
              />
            </Grid.Column>
          </Grid.Row>

          {renderFiled}
        </Grid>
      </Grid.Column>
    )
  );
};

export default compose(
  memo,
  connect((state) => ({ customFieldDTOList: isCustomFieldDTOList(state) }), {
    editMultiChooseCustomField: SettingsActions.editMultiChooseCustomField,
    editRequiedCustomField: SettingsActions.editRequiedCustomField,
    editActiveCustomField: SettingsActions.editActiveCustomField,
    updateFieldNameCustomField: SettingsActions.updateFieldNameCustomField,
    updateItemCustomFieldRequest: SettingsActions.updateItemCustomFieldRequest,
    updateItemCustomField: SettingsActions.updateItemCustomField,
  })
)(SelectField);
