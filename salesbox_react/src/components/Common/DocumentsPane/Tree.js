/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchDocumentsByFileId } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import TreeNode from './TreeNode';

class Tree extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  onClick = (node) => {
    this.props.fetchByFolder(node);
  };

  getChildNodes = (node) => {
    const { documentDTOList } = this.props;
    if (!node.children) return [];
    const choices = node.children.map((id) => {
      const right = documentDTOList.find((x) => x.fileId === id);
      if (!right) return false;
      if (right) return right;
    });
    if (this.props.currentNode === node) {
      return this.props.sortDocument(choices);
    }
    return choices;
  };

  render() {
    return (
      <>
        {this.props.data.map((node) => {
          return <TreeNode node={node} key={node.fileId} onClick={this.onClick} getChildNodes={this.getChildNodes} />;
        })}
      </>
    );
  }
}

export default connect(null, { fetchDocumentsByFileId })(Tree);
