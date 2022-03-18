//@flow
import React, { useEffect, useState } from 'react';
import { Input, Form } from 'semantic-ui-react';

import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { OverviewTypes, UIDefaults, Colors } from 'Constants';
import { updateSaleTarget } from '../organisation.actions';
import ModalCommon from 'components/ModalCommon/ModalCommon';
// import CreateAccountForm from 'components/Organisation/CreateAccountForm/CreateAccountForm';
import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onDone?: () => void,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Done: 'Done',
    "Edit sale's target": "Edit sale's target",
    'Sales target': 'Sales target',
  },
});

const overviewType = OverviewTypes.Account;

const EditTargetModal = ({ visible, hideEditForm, onDone, account }: PropsT) => {
  const [value, setValue] = useState(account ? account.budget : 0);
  useEffect(() => {
    setTimeout(() => {
      setValue(account ? account.budget : 0);
    }, 100);
  }, [account]);

  return (
    <ModalCommon
      title={_l`Update sale's target`}
      visible={visible}
      onDone={() => onDone(value)}
      onClose={hideEditForm}
      size="tiny"
      paddingAsHeader={true}
    >
      <div className="qualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Sales target`}</div>
            <div className="dropdown-wrapper" width={8}>
              <Input
                value={value}
                onChange={(event) => {
                  if (!isNaN(event.target.value)) {
                    setValue(event.target.value);
                  }
                }}
              />
            </div>
          </Form.Group>
        </Form>
      </div>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, overviewType, 'edit_sale_target');
    const account = state.entities.organisation.__DETAIL;
    return {
      visible,
      account,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlightAction: OverviewActions.clearHighlightAction,
  updateSaleTarget,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideEditForm: ({ account, clearHighlightAction }) => () => {
      clearHighlightAction(overviewType);
    },
    onDone: ({ account, updateSaleTarget }) => (value) => {
      updateSaleTarget(account.uuid, value);
    },
  })
)(EditTargetModal);
