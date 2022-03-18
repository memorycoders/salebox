//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, withProps } from 'recompose';

type PropsT = {
  className?: string,
  days: number,
};

const now = new Date();
const msPerDay = 24 * 60 * 60 * 1000;

// Calculate a color between red and green
const getColor = (days) => {
  const value = Math.max(0, Math.min(-days / 100, 1));
  const hue = ((1 - value) * 120).toString(10);
  return `hsl(${hue}, 100%, 40%)`;
};

const Days = ({ className, days }: PropsT) => {
  const style = {
    color: getColor(days),
    fontWeight: 700,
  };
  return <span style={style} className={className}>{_l`${-days}:n`}</span>;
};

const isMissingDate = ({ date }) => !date;
const isDateInFuture = ({ date }) => {
  return new Date(date) - now > 0;
};

const isBadDate = ({ date }) => isMissingDate({ date }) || isDateInFuture({ date });

export default compose(
  branch(isBadDate, renderNothing),
  withProps(({ date }) => ({
    days: Math.ceil((new Date(date) - now) / msPerDay),
  }))
)(Days);
