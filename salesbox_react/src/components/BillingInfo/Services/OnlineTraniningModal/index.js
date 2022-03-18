import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import { Form, TextArea } from 'semantic-ui-react';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import _l from 'lib/i18n';
import css from './onlineTrainingModal.css';
import { FormPair } from 'components';

export const TrainingFocusModal = (props) => {
  const [time, setTime] = useState(null);
  const [focus, setFocus] = useState(null);
  const [errorTime, setErrorTime] = useState(false);
  const [errorFocus, setErrorFocus] = useState(false);

  const { visible, fnOk, fnCancel } = props;

  const changeTime = (e) => {
    setErrorTime(false);
    setTime(e);
  };
  const handleChangeFocus = (e) => {
    setErrorFocus(false);
    setFocus(e.target.value);
  };
  return (
    <ModalCommon
      title={_l`Training focus`}
      visible={visible}
      onDone={() => {
        if (!time) {
          setErrorTime(true);
          return;
        }
        if (!focus) {
          setErrorFocus(true);
          return;
        }
        fnOk(time, focus);
        setTime(null);
        setFocus('');
        setErrorFocus(false);
        setErrorTime(false);
      }}
      onClose={() => {
        setTime(null);
        setFocus('');
        setErrorFocus(false);
        setErrorTime(false);
        fnCancel();
      }}
      size="tiny"
    >
      <Form className={css.form}>
        <FormPair left label={_l`When`} required labelStyle={css.labelForm}>
          <DatePickerInput timePicker onChange={changeTime} value={time} error={errorTime} />
          {errorTime && <span className={css.errorForm}>{_l`When is required`}</span>}
        </FormPair>
        <FormPair left label={_l`Focus`} required labelStyle={css.labelForm}>
          <TextArea
            id="FocusOnlineTraining"
            fluid
            rows={5}
            placeholder={_l`Tell us what you want to focus on`}
            value={focus}
            onChange={handleChangeFocus}
          ></TextArea>
          {errorFocus && <span className={css.errorForm}>{_l`Focus is required`}</span>}
        </FormPair>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingFocusModal);
