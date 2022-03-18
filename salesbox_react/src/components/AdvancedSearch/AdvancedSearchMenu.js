// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as AdvancedSearchActions from './advanced-search.actions';
import { canSave } from './advanced-search.selectors';
import css from './AdvancedSearch.css';
import AdvancedSearchActionMenu from '../../essentials/Menu/AdvancedSearchActionMenu';

type PropsType = {
  showSaveDialog: () => void,
  showSaveAndShareDialog: () => void,
  showCopyDialog: () => void,
  showDeleteDialog: () => void,
  performSearch: () => void,
  hasSelected: boolean,
  canSave: boolean,
  size?: string,
};

addTranslations({
  'en-US': {
    Save: 'Save',
    Copy: 'Copy',
    Search: 'Search',
    Delete: 'Delete',
  },
});

// const searchIcon = <Icon name="search" color="green" />;
// const saveIcon = <Icon name="save" color="green" />;
// const deleteIcon = <Icon name="trash" color="red" />;
// const exportIcon = <Icon name="file excel" color="green" />;
// const copyIcon = <Icon name="copy" color="green" />;

const SaveAdvancedSearchMenu = ({
  hasSelected,
  canSave,
  showDeleteDialog,
  showSaveDialog,
  showSaveAndShareDialog,
  showCopyDialog,
  performSearch,
  objectType,
  groups,
}: PropsType) => {
  return (
    <div className={css.menuSearch}>
      <Button
        className={`${canSave ? css.active : css.disabled}`}
        size="small"
        disabled={!canSave}
        onClick={showSaveAndShareDialog}
      >{_l`Share`}</Button>
      <Button
        className={`${canSave ? css.active : css.disabled}`}
        size="small"
        disabled={!canSave}
        onClick={showSaveDialog}
      >{_l`Save`}</Button>
      <Button
        className={`${canSave ? css.active : css.disabled}`}
        size="small"
        disabled={!canSave}
        onClick={performSearch}
      >{_l`Search`}</Button>
      {hasSelected && (
        <div className={css.check}>
          <AdvancedSearchActionMenu objectType={objectType} groups={groups} className={css.bgMore} />
        </div>
      )}
    </div>
    // <Menu borderless attached="bottom" size="mini">
    //   <Menu.Menu position="right">
    //     <Menu.Item>
    //       <Button labelPosition="left" content={_l`Search`} onClick={performSearch} icon={searchIcon} />
    //     </Menu.Item>
    //     <Menu.Item>
    //       <Button
    //         disabled={!canSave}
    //         labelPosition="left"
    //         content={_l`Save`}
    //         onClick={showSaveDialog}
    //         icon={saveIcon}
    //       />
    //     </Menu.Item>
    //     <Menu.Item>
    //       <Button
    //         disabled={!canSave}
    //         labelPosition="left"
    //         content={_l`Share`}
    //         onClick={showSaveAndShareDialog}
    //         icon={saveIcon}
    //       />
    //     </Menu.Item>
    //     <Dropdown item icon="vertical ellipsis">
    //       <Dropdown.Menu>
    //         <Dropdown.Item disabled={!hasSelected} content={_l`Copy`} onClick={showCopyDialog} icon={copyIcon} />
    //         <Dropdown.Item disabled={!hasSelected} onClick={showDeleteDialog} content={_l`Delete`} icon={deleteIcon} />
    //         <Dropdown.Item content={_l`Export to MS Excel`} icon={exportIcon} />
    //       </Dropdown.Menu>
    //     </Dropdown>
    //   </Menu.Menu>
    // </Menu>
  );
};

export default compose(
  connect(
    (state, { objectType }) => {
      const search = state.search[objectType];
      const hasSelected = search ? !!search.selected : false;
      return {
        hasSelected,
        canSave: canSave(state, objectType),
      };
    },

    {
      setAction: AdvancedSearchActions.setAction,
      performSearch: AdvancedSearchActions.performSearch,
    }
  ),
  withHandlers({
    performSearch: ({ performSearch, objectType }) => () => {
      performSearch(objectType);
    },
    showSaveDialog: ({ setAction, objectType }) => () => {
      setAction(objectType, 'save');
    },
    showSaveAndShareDialog: ({ setAction, objectType }) => () => {
      setAction(objectType, 'saveAndShare');
    },
    showCopyDialog: ({ setAction, objectType }) => () => {
      setAction(objectType, 'copy');
    },
    showDeleteDialog: ({ setAction, objectType }) => () => {
      setAction(objectType, 'delete');
    },
  })
)(SaveAdvancedSearchMenu);
