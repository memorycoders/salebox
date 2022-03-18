//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getUser } from '../../Auth/auth.selector';
import { withRouter } from 'react-router';
import * as NotificationActions from '../../Notification/notification.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Do you want to set a sales target?': 'Do you want to set a sales target?',
  },
});

const SetDalesTargetModal = ({ visible, hide, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      visible={visible}
      onDone={onSave}
      onClose={hide}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you want to set a sales target?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'set_sale_target');
    return {
      visible,
      user: getUser(state),
    };
  };
  return mapStateToProps;
};
export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    notiError: NotificationActions.error
  }),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ overviewType, clearHighlightAction, user, history, notiError }) => () => {
      if (user?.isAdmin) {
        history.push(`/settings/targets`);
      } else {
        notiError('You need to be a administrator for this action')
      }

      clearHighlightAction(overviewType);
    },
  })
)(SetDalesTargetModal);
