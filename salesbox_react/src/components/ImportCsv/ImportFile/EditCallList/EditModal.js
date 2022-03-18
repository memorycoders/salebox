//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { OverviewTypes } from 'Constants';
import { setOverviewType } from 'components/Common/common.actions';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import CreateCallListForm from './EditForm';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave?: () => void,
  form: {},
  onClose: () => void,
  __error: Object,
  userId: String,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Add call list': 'Add call list',
    'Edit call list': 'Edit call list',
    'Name is required': 'Name is required',
  },
});

const EditCallListModal = ({ setError, visible, hideEditForm, onSave, __error, userId, data, setData }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Update call list`}
      visible={visible}
      onDone={onSave}
      onClose={hideEditForm}
      okLabel={_l`save`}
      scrolling={true}
      size="small"
    >
      <CreateCallListForm
        visible={visible}
        userId={userId}
        __error={__error}
        form={data || {}}
        setError={setError}
        setData={setData}
      />
    </ModalCommon>
  );
};

const mapStateToProps = (state, { visible, form }) => {
  console.log('form', form);
  return {
    visible,
    userId: state.auth && state.auth.userId ? state.auth.userId : '',
    form,
  };
};

const mapDispatchToProps = {
  setOverviewType: setOverviewType,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('data', 'setData', (props) => {
    return props.form;
  }),
  withState('__error', 'setError', { status: false, title: _l`Name is required` }),
  lifecycle({
    componentDidMount() {
      console.log('hihi');
      this.props.setOverviewType('IMPORT_CSV');
    },
    componentWillReceiveProps(nextProps) {
      console.log('nextProps', nextProps);
      if (this.props.form !== nextProps.form) {
        setTimeout(() => {
          this.props.setData(nextProps.form);
        }, 100);
      }
    }
  }),
  withHandlers({
    hideEditForm: ({ userId, onClose }) => () => {
      onClose();
    },
    onSave: ({ setError, __error, data, onDone }) => () => {
      if (!data.name) {
        return setError({ status: true, title: _l`Name is required` });
      }
      setError({ ...__error, status: false });
      onDone(data);
    },
  })
)(EditCallListModal);
