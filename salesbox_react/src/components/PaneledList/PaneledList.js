// @flow
import * as React from 'react';
import {withProps, compose, defaultProps} from 'recompose';
import cx from 'classnames';
import css from './PaneledList.css';

type PropsT = {
  detailClassName: string,
  listClassName: string,
  hasSubList: boolean,
  list: React.Node,
  subList: React.Node,
  detail: React.Node,
};

const PaneledList = ({ list, detail, subList, detailClassName, listClassName, hasSubList }: PropsT) => {
  return (
    <div className={css.container}>
      <div className={css.list}>
        {hasSubList ? <div className={listClassName} style={{position : 'relative' }}>{subList}</div> : <div className={listClassName}>{list}</div>}
        <div className={detailClassName}>{detail}</div>
      </div>
    </div>
  );
};

export default compose(
  defaultProps({
    hasSubList: false,
  }),
  withProps(({ hasDetail }) => {
    return {
      listClassName: cx(css.left, {
        [css.collapsed]: hasDetail,
      }),
      detailClassName: cx(css.detail, {
        [css.active]: hasDetail,
      }),
    };
  })
)(PaneledList);
