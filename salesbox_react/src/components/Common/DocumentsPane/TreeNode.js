/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import './tree.less';

const TreeNode = (props) => {
  const getPaddingLeft = (level) => {
    const paddingLeft = level * 20;
    return paddingLeft;
  };

  return (
    <>
      {props.node.isFolder && (
        <div
          className={`tree-node-wrapper`}
          onClick={() => props.onClick(props.node)}
          style={{ paddingLeft: getPaddingLeft(props.level) }}
        >
          <div className="tree-node-icon">
            <Icon name="folder" color="greyDocument" />
          </div>
          <div className="tree-node-label">{props.node.name}</div>
        </div>
      )}
      {props.getChildNodes(props.node).map((childNode) => (
        <TreeNode {...props} node={childNode} key={childNode.fileId} level={props.level + 1} />
      ))}
    </>
  );
};

TreeNode.propTypes = {
  level: PropTypes.number,
};
TreeNode.defaultProps = {
  level: 0,
};
export default TreeNode;
