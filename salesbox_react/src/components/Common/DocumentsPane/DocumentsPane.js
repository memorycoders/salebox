/* eslint-disable no-loop-func */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Collapsible } from 'components';
import { connect } from 'react-redux';
import { Icon, Menu, Loader, Popup, Message } from 'semantic-ui-react';
import _ from 'lodash';
import cx from 'classnames';
import {
  fetchDocumentsStorage,
  fetchGetRootFolder,
  fetchDocumentsByFileId,
  changeDocumentSelected,
  updateDocumentObjectId,
} from '../common.actions';
import './documents-pane.less';
import css from '../../PipeLineQualifiedDeals/Cards/TasksCard.css';
import filterCss from './filter.css';
import * as OverviewActions from '../../../components/Overview/overview.actions';
import iconDoc from '../../../../public/google-docs-color.svg';
import iconSheet from '../../../../public/google-sheets-color.svg';
import iconSlide from '../../../../public/google-slides-color.svg';
import iconpdf from '../../../../public/pdf.svg';
import DeleteDocument from './DeleteDocument';

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Documents: 'Documents',
    Name: 'Name',
    'Folder is empty!': 'Folder is empty!',
    'No Document': 'No Document',
  },
});

class DocumentsPane extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.delay = 200;
    this.prevent = false;
    this.state = {
      node: null,
      documentDTOList: props.documentDTOList,
      filter: null,
      openDelete: false,
      openView: false,
    };
  }

  // componentWillMount() {
  //   this.props.updateDocumentObjectId(this.props.data.uuid);
  // }

  componentDidMount() {
    // this.props.fetchDocumentsStorage();
    if (this.props.data.uuid) {
      this.props.fetchGetRootFolder(this.props.data.uuid);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.documentDTOList !== this.props.documentDTOList) {
      let right = null;
      if (this.state.node) {
        right = this.props.documentDTOList.find((x) => x.fileId === this.state.node.fileId);
      }
      this.setState({
        documentDTOList: this.props.documentDTOList,
        node: right ? right : null,
        openDelete: !right ? false : this.state.openDelete,
        openView: !right ? false : this.state.openView,
      });
    }
    if (prevProps.data.uuid !== this.props.data.uuid) {
      this.props.fetchGetRootFolder(this.props.data.uuid);
    }
  }

  handleClick = (node) => {
    const _this = this;
    this.timer = setTimeout(() => {
      if (!this.prevent) {
        _this.doClickAction(node);
      }
      this.prevent = false;
    }, this.delay);
  };

  handleDoubleClick = (node) => {
    clearTimeout(this.timer);
    this.prevent = true;
    this.doDoubleClickAction(node);
  };

  doClickAction = (node) => {
    this.setState({ openDelete: true, openView: true, node: node });
    this.props.changeDocumentSelected(node);
  };

  doDoubleClickAction(node) {
    if (node.isFolder) {
      this.fetchByFolder(node);
    } else {
      window.open(node.fileURL);
    }
  }

  fetchByFolder = (node) => {
    this.props.fetchDocumentsByFileId(this.props.data.uuid, node.fileId);
    this.setState({ node });
    this.props.changeDocumentSelected(node);
  };

  fetchByFolderTree = (node) => {
    this.props.fetchDocumentsByFileId(this.props.data.uuid, node.fileId);
    this.setState({ node, openDelete: false });
    this.props.changeDocumentSelected(node);
  };

  getRootNodes = () => {
    const { documentDTOList } = this.props;
    const choices = documentDTOList.filter((node) => node.isRoot === true);
    return choices;
  };

  getChildNodes = (node) => {
    const { documentDTOList } = this.state;
    if (!node) return this.sortDocument(this.getRootNodes());
    if (node && !node.children) return [];
    const choices = (node ? node.children : []).map((id) => {
      const right = documentDTOList.find((x) => x.fileId === id);
      if (!right) return false;
      if (right) return right;
    });
    return node === this.state.node ? this.sortDocument(choices) : choices;
  };

  renderBreadcrumb = (currentFolder) => {
    if (!currentFolder) return false;
    const { documentDTOList } = this.state;
    let node = currentFolder;
    let breadcrumb = node.isRoot ? node.name : '';
    while (node.parentId) {
      const right = documentDTOList.find((x) => x.fileId === node.parentId);
      breadcrumb = node.name + (breadcrumb ? '/' : '') + breadcrumb;
      if (right.isRoot) {
        breadcrumb = right.name + '/' + breadcrumb;
      }
      node = right;
    }
    return breadcrumb;
  };

  limitName = (name) => {
    if (!name) return false;
    return name.length > 13 ? name.slice(0, 13) + ' ...' : name;
  };

  sortDocument = (array) => {
    if (this.state.filter && array.length > 0) {
      return _.sortBy(array, this.state.filter);
    }
    return array;
  };

  getDocuments = () => {
    return this.state.documentDTOList.filter((x) => !x.isFolder);
  };

  getExtension = (filename) => {
    filename = filename.toLowerCase();
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  getIconByExtension = (filename, fileObj) => {
    const exts = {
      word: ['doc', 'dot', 'docx', 'docm', 'dotx', 'dotm', 'docb'],
      powerpoint: ['ppt', 'pptm', 'pptx', 'pot', 'pps', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm'],
      excel: ['xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xla', 'xlam', 'xll', 'xlw'],
      pdf: ['pdf'],
      zip: ['zip'],
      archive: ['rar', '7z', 'gzip'],
      image: ['png', 'jpg', 'jpeg', 'bmp', 'gif'],
    };
    let ext = null;
    if (
      fileObj.fileURL &&
      fileObj.fileURL.indexOf('https://docs.google.com') > -1 &&
      fileObj.fileURL.indexOf('document') > -1
    ) {
      return iconDoc;
    } else if (
      fileObj.fileURL &&
      fileObj.fileURL.indexOf('https://docs.google.com') > -1 &&
      fileObj.fileURL.indexOf('spreadsheets') > -1
    ) {
      return iconSheet;
    } else if (
      fileObj.fileURL &&
      fileObj.fileURL.indexOf('https://docs.google.com') > -1 &&
      fileObj.fileURL.indexOf('presentation') > -1
    ) {
      return iconSlide;
    } else {
      ext = this.getExtension(filename);
    }

    const icon = iconpdf;
    // for (const name in exts) {
    //   if (exts.hasOwnProperty(name) && exts[name].indexOf(ext) >= 0) {
    //     icon = 'icon' + name;
    //     break;
    //   }
    // }
    if (ext === 'pdf') {
      return iconpdf;
    }
    return icon;
  };

  render() {
    const RightMenu = () => {
      return (
        <>
          {this.state.openDelete && this.state.openView && (
            <Menu.Item
              className={cx(css.rightIcon, filterCss.documentIcon)}
              onClick={() => window.open(this.state.node.fileURL)}
            >
              <Icon name="eye" color="greyDocument" />
            </Menu.Item>
          )}
          {this.state.openDelete && (
            <Menu.Item
              className={cx(css.rightIcon, filterCss.documentIcon)}
              onClick={() => this.props.setActionForHighlight(this.props.currentOverviewType, 'delete_document')}
            >
              <Icon name="trash alternate" color="greyDocument" />
            </Menu.Item>
          )}
          {/* <Menu.Item className={cx(css.rightIcon)}>
            <CreateMenu overviewTypes={this.props.currentOverviewType} item={this.props.data} />
          </Menu.Item>
          <Menu.Item className={cx(css.rightIcon)}>
            <SortMenu filter={true} imageClass={filterCss.filter}>
              <Menu.Item onClick={() => this.setState({ filter: 'name' })}>{_l`Name`}</Menu.Item>
              <Menu.Item onClick={() => this.setState({ filter: 'updatedDate' })}>{_l`Last modified`}</Menu.Item>
            </SortMenu>
          </Menu.Item> */}
        </>
      );
    };

    return (
      <>
      <Collapsible
        count={this.getDocuments().length.toString()}
        title={_l`Documents`}
        width={308}
        right={<RightMenu />}
        rightClassName={css.headerRight}
        onClick={() => {
          this.setState({ openDelete: false, node: null });
          this.props.changeDocumentSelected(null);
        }}
      >
        <div className="document-wrapper">
          <div className="document-tree-wrapper">
            {/* <Tree
              data={this.getRootNodes()}
              documentDTOList={documentDTOList}
              qualifiedDeal={this.props.qualifiedDeal}
              fetchByFolder={this.fetchByFolderTree}
              filter={this.state.filter}
              sortDocument={this.sortDocument}
            /> */}
            <input hidden id="file-google" name="file-google" type="file" />
          </div>
          <div className="document-file-list">
            {/* <div className="document-breadcrumb">{this.renderBreadcrumb(this.state.node)}</div> */}
            <div className={`document-list-wrapper ${this.props.isFetching ? 'isLoading' : ''}`}>
              {this.props.isFetching && (
                <div className="document-loader">
                  <Loader active={this.props.isFetching}>Loading</Loader>
                </div>
              )}
              {!this.props.isFetching && this.getDocuments().length <= 0 && (
                <div className="document-empty">
                  <Message active info>
                    {_l`No Document`}
                  </Message>
                </div>
              )}
              {!this.props.isFetching &&
                this.sortDocument(this.getDocuments()).map((node) => {
                  return (
                    <div
                      className={`folder-wrapper`}
                      key={node.fileId}
                      onClick={() => {
                        this.handleClick(node);
                      }}
                      // onDoubleClick={() => {
                      //   this.handleDoubleClick(node);
                      // }}
                    >
                      <div className="folder-icon">
                        <img src={this.getIconByExtension(node.name, node)} style={{ height: '40px', width: '30px' }} />
                      </div>
                      <div className="folder-label">
                        {node.name && node.name.length > 13 ? (
                          <Popup position="top center" hoverable trigger={<div>{this.limitName(node.name)}</div>}>
                            <Popup.Content>
                              <p style={{ fontSize: '11px' }}>{node.name}</p>
                            </Popup.Content>
                          </Popup>
                        ) : (
                          node.name
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Collapsible>
      <DeleteDocument/>
      </>
      
    );
  }
}
const mapStateToProps = (state) => {
  const _document = state.common.__DOCUMENTS;
  return {
    documentDTOList: _document.documentDTOList ? _document.documentDTOList : [],
    isFetching: _document.isFetching,
    currentOverviewType: state.common.currentOverviewType,
  };
};

export default connect(mapStateToProps, {
  fetchDocumentsStorage,
  fetchGetRootFolder,
  fetchDocumentsByFileId,
  changeDocumentSelected,
  setActionForHighlight: OverviewActions.setActionForHighlight,
  updateDocumentObjectId,
})(DocumentsPane);
