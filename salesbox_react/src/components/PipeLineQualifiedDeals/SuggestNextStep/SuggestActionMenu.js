// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { Menu, Popup, Icon, Button } from 'semantic-ui-react';
import * as AppActions from 'components/App/app.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { Colors, OverviewTypes } from 'Constants';
import { getAvatar } from 'components/Auth/auth.selector';
import add from '../../../../public/Add.svg';
import css from '../../CreateMenu/CreateMenu.css'
import { IconButton } from '../../Common/IconButton';
import taskAdd from '../../../../public/Tasks.svg';
import appointmentAdd from '..././../../public/Appointments.svg';
import localCss from './SuggestNextStep.css';

type PropsT = {
    showPipeForm: () => void,
    showAccountForm: () => void,
    showContactForm: () => void,
    showCallListAccountForm: () => void,
    showCallListContactForm: () => void,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    addTask: () => void,
};

addTranslations({
    'en-US': {
        'Add reminder': 'Add reminder',
    },
});

const popupStyle = {
    padding: 0,
};

const SuggestActionMenu = ({
    open, onOpen, onClose,
    showPipeForm, addTask
}: PropsT) => {
    const profileMenuItem = (
        <div className={localCss.circleButton}>
            <img className={localCss.image} src={add}/>
        </div>
    );
    return (
        <Popup
            hoverable
            trigger={profileMenuItem}
            onOpen={onOpen}
            onClose={onClose}
            onClick={onClose}
            open={open}
            flowing
            position="bottom center"
            size="huge"
            style={popupStyle}
        >
            <Menu vertical fluid>
                <Menu.Item onClick={addTask}>
                    <div className={css.actionIcon}>
                        {_l`Add reminder`}
                        <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
                    </div>
                </Menu.Item>

                <Menu.Item onClick={showPipeForm}>
                    <div className={css.actionIcon}>
                        {_l`Add meeting`}
                        <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
                    </div>
                </Menu.Item>

            </Menu>
        </Popup>
    );
};

export default compose(
    connect(
        (state) => ({
            activeTab: state.ui.app.roleTab,
            avatar: getAvatar(state),
        }),
        {
            setActiveTab: AppActions.setRoleTab,
            setActionForHighlight: OverviewActions.setActionForHighlight,
        }
    ),
    withState('open', 'setOpen', false),
    withHandlers({
        onOpen: ({ setOpen }) => () => {
            setOpen(true);
        },
        onClose: ({ setOpen }) => () => {
            setOpen(false);
        },

        showPipeForm: ({ setActionForHighlight }) => () => {
            setActionForHighlight(OverviewTypes.Pipeline.Lead, 'create');
        },

        addTask: ({ setActionForHighlight }) => () => {
            setActionForHighlight(OverviewTypes.Activity.Task, 'create');
        },
    })
)(SuggestActionMenu);
