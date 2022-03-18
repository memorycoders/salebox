// @flow
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { compose, defaultProps, withHandlers } from 'recompose';

type PropsT = {
  label: string,
  onClick: () => void,
};

const PeriodButton = ({ onClick, label, ...other }: PropsT) => <Button onClick={onClick} content={label} {...other} />;

export default compose(
  defaultProps({
    size: 'small',
  }),
  withHandlers({
    onClick: ({ onClick, period }) => () => {
      if (onClick) {
        onClick(period);
      }
    },
  })
)(PeriodButton);
