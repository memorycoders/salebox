// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from 'components/Overview/overview.actions';
import copy from '../../../public/copy.svg';
import css from './TaskActionMenu.css';
import * as AdvancedSearchActions from "../../components/AdvancedSearch/advanced-search.actions";

addTranslations({
    'en-US': {
        'Copy': 'Copy',
        'Delete': 'Delete',
    },
});

const AdvancedSearchActionMenu = ({
    className,
                                    openCopyDialogModal,
    openDeleteSaveAdvancedSearchModal,

}) => {
    return (
        <MoreMenu id="mutil_action" className={className} color={CssNames.Task}>
            <Menu.Item icon onClick={() => openCopyDialogModal()}>
                <div className={css.actionIcon}>
                    {_l`Copy`}
                    <img style={{ height: '13px', width: '17px'}} src={copy} />
                </div>
            </Menu.Item>
            <Menu.Item icon onClick={() => openDeleteSaveAdvancedSearchModal()}>
                <div className={css.actionIcon}>
                    {_l`Delete`}
                    <Icon name='trash alternate' />
                </div>
            </Menu.Item>
        </MoreMenu>
    );
};

export default compose(
    connect(
        null,
        {
            highlight: OverviewActions.highlight,
            setAction: AdvancedSearchActions.setAction,

        }
    ),

    withHandlers({

        openDeleteSaveAdvancedSearchModal: ({  objectType,setAction }) => () => {
          setAction(objectType, 'delete');

          // highlight(overviewType, null, 'delete_tasks');
        },
        openCopyDialogModal: ({objectType,setAction }) => () => {
          setAction(objectType, 'copy');
            // highlight(overviewType, null, 'delete_tasks');
        },


    })
)(AdvancedSearchActionMenu);
