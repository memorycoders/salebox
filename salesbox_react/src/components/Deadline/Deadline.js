//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import cx from 'classnames';
import moment from 'moment';
import { branch, renderNothing, renderComponent, compose } from 'recompose';
import css from './Deadline.css';

addTranslations({
  'en-US': {
    '{0}': '{0}',
  },
});

type PropsT = {
  className: string,
  onlyDate?: boolean,
  date: Date,
};

const Deadline = ({ className, date, onlyDate }: PropsT) => {
  const deadlineDate = date ? moment(date).valueOf() : 0;
  const now = moment().valueOf();
  const past = deadlineDate < now;


  if (onlyDate) {
    return <span className={cx(className, past ? css.past : null)}>{date ? _l`${moment(deadlineDate).format('DD MMM, YYYY')}:t(d)` : ''}</span>;
  }
  return <span className={cx(className, past ? css.past : null)}>{_l`${moment(date).format('DD MMM, YYYY HH:mm')}:t(h)`}</span>;
};

const DeadlineTwoRows = ({ className, date }: PropsT) => {
  const deadlineDate = new Date(date);
  const now = new Date();
  const past = deadlineDate < now;

  return (
    <div className={past ? css.past : null}>
      <div>{_l`${moment(deadlineDate).format('DD MMM, YYYY')}:t(d)`}</div>
      <div>{_l`${deadlineDate}:t(t24)`}</div>
    </div>
  );
};

const isMissingDate = ({ date }) => !date;

export default compose(
  branch(isMissingDate, renderNothing),
  branch(({ twoRows }) => twoRows, renderComponent(DeadlineTwoRows))
)(Deadline);
