//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, defaultProps, renderNothing, compose, pure } from 'recompose';
import Collapsible from '../../Collapsible/Collapsible';
import FocusDescription from 'components/Focus/FocusDescription';
import { OverviewTypes, WIDTH_DEFINE } from 'Constants'
import { Popup } from 'semantic-ui-react'
import cx from 'classnames';
import css from './FocusPane.css';
import FocusPopup from '../FocusPopup';

type PropsT = {
  title: string,
  focus: {},
  overviewType: string,
  color: string
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Reminder focus': 'Reminder focus',
  },
});

const FocusPane = ({ title, focus, overviewType, color }: PropsT) => {
title = _l`Reminder focus`
  return (
    <Collapsible hasDragable width={WIDTH_DEFINE.DETAIL_WIDTH_CONTENT} wrapperClassName={css.wrapperClassNameFocus} padded title={title}>
      {overviewType !== OverviewTypes.Activity.Task ? (
        overviewType === OverviewTypes.Activity.Appointment ? <>
          <Popup style={{ fontSize: 11, }} content={focus.description} trigger={<div>{_l`${focus.name}`}</div>}></Popup>
        </> :
          <>
            {focus.description}
            <FocusDescription discProfile={focus.discProfile} />
          </>
      ) :
        <>
          <div style={{ backgroundColor: color }} className={cx(css.focusLine)} />
          {focus && <FocusPopup focus={focus} />}
        </>
      }
    </Collapsible>
  );
};

export default compose(
  defaultProps({

  }),
  branch(({ focus }) => !focus, renderNothing),
  pure
)(FocusPane);
