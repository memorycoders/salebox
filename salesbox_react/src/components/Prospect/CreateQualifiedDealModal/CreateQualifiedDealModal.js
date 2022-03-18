//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes, UIDefaults, OverviewColors } from 'Constants';
import QualifiedDealForm from 'components/Prospect/QualifiedDealForm/QualifiedDealForm';
import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave?: () => void,
  color: string,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
  },
});

const overviewType = OverviewTypes.Prospect;

const CreateQualifiedDealModal = ({ visible, color, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[color]}>{_l`Add deal`}</Modal.Header>
        <Modal.Content scrolling>
          <QualifiedDealForm formKey="__CREATE" />
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={hideEditForm}>{_l`Cancel`}</Button>
          <Button primary onClick={onSave}>{_l`Save`}</Button>
        </Modal.Actions>
      </Modal>
    </Transition>
  );
};

const mapStateToProps = (state) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  return {
    color: OverviewColors[state.ui.app.activeOverview],
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    hideEditForm: ({ clearHighlight }) => () => {
      clearHighlight(overviewType);
    },
  })
)(CreateQualifiedDealModal);
