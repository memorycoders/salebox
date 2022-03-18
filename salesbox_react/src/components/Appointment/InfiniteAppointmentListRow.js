/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';
import _l from 'lib/i18n';
import { isItemSelected, isItemHighlighted } from 'components/Overview/overview.selectors';
import * as OverviewActions from 'components/Overview/overview.actions';
import { Checkbox, Icon, Popup } from 'semantic-ui-react';
import FocusPopup from 'components/Focus/FocusPopup';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { Avatar } from 'components';
import overviewCss from 'components/Overview/Overview.css';
import css from './AppointmentListRow.css';
import { makeGetAppointment } from './appointment.selector';
import AppointmentActionMenu from 'components/Appointment/AppointmentActionMenu/AppointmentActionMenu';
import moment from 'moment';
import ContactPopup from 'components/Contact/ContactPopup';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';

type PropsType = {
  appointment: {},
  className?: string,
  selected: boolean,
  search: {},
  highlighted: boolean,
  style: {},
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

type HeaderPropsType = {
  overviewType: string,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Responsible: 'Responsible',
    Name: 'Name',
    Contacts: 'Contacts',
    Focus: 'Focus',
    Title: 'Title',
  },
});

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);

const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const HeaderComponent = ({ overviewType }: HeaderPropsType) => {
  return (
    <div className={css.header}>
      <div className={css.content}>
        <div className={css.check}>
          <OverviewSelectAll overviewType={overviewType} />
        </div>
        <div className={css.time}>{_l`When`}</div>
        <div className={css.time}>{_l`Title`}</div>
        <div className={css.name}>{_l`Name`}</div>
        <div className={css.focus}>{_l`Focus`}</div>
        <div className={css.owner}>{_l`Responsible`}</div>
        <div className={css.more} />
      </div>
      
    </div>
  );
};

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.check}>{checkLoader}</div>
      <div className={css.name}>{noteLoader}</div>
      <div className={css.time}>{noteLoader}</div>
      <div className={css.contacts}>{noteLoader}</div>
      <div className={css.focus}>{noteLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.more}>{checkLoader}</div>
    </div>
  );
};

const InfiniteAppointmentListRow = ({
  select,
  highlighted,
  appointment,
  search,
  style,
  className,
  goto,
  selected,
  overviewType,
  objectType,
}: PropsType) => {
  const listCn = cx(className, {
    [overviewCss.highlighted]: highlighted,
    [overviewCss.selected]: selected,
  });
  const shortenValue = (value) => {
    if (value && value.length > 148) {
      return value.slice(0, 148);
    }
    return value.slice(0, 148);
  };

  return (
    <div className={listCn} style={style} onClick={goto}>
      <div className={`${css.content}`}>
        <div className={css.check}>
          <Checkbox onChange={select} checked={selected} />
        </div>
        <div className={css.time}>
          <div>
            <div>{appointment.startDate && moment(appointment.startDate).format('DD MMM, YYYY, HH:mm')}</div>
            <div>{appointment.endDate && moment(appointment.endDate).format('DD MMM, YYYY, HH:mm')}</div>
          </div>
        </div>
        <div className={css.time}>
          {appointment.title && appointment.title.length > 0 ? (
            appointment.title.length > 148 ? (
              <Popup
                trigger={<div>{`${shortenValue(appointment.title)}...`}</div>}
                style={{ fontSize: 11 }}
                content={appointment.title}
              />
            ) : (
                appointment.title
              )
          ) : (
              ''
            )}
        </div>
        <div className={cx(css.name, css.nameContact)}>
          <div>
            <span className={css.organisation}>{appointment.firstContact.displayName || ''}</span>
            {appointment.organisation.displayName && <div>{appointment.organisation.displayName}</div>}
          </div>
          <div>
            {appointment.firstContact.email || appointment.firstContact.phone ? (
              <div className={css.email}>
                <ContactPopup email={appointment.firstContact.email || ''} phone={appointment.firstContact.phone || ''} />
              </div>
            ) : (
                <div className={css.email} />
              )}
          </div>
        </div>
        <div className={css.focus}>
          <FocusPopup focus={appointment.focus} />
        </div>
        <div className={css.owner}>
          <Avatar
            size={30}
            isShowName
            firstName={appointment.owner.firstName}
            lastName={appointment.owner.lastName}
            src={appointment.owner.avatar}
          />
        </div>
        <div className={css.moreActionMenu}>
          <AppointmentActionMenu appointment={appointment} className={css.moreAction} overviewType={overviewType} />
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getAppointment = makeGetAppointment();
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => ({
    search: getSearch(state, objectType),
    appointment: getAppointment(state, itemId),
    selected: isItemSelected(state, overviewType, itemId),
    highlighted: isItemHighlighted(state, overviewType, itemId),
  });
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    highlight: OverviewActions.highlight,
  }),
  branch(({ appointment }) => !appointment, renderNothing),
  withHandlers({
    goto: ({ appointment, history, overviewType, highlight }) => () => {
      highlight(overviewType, appointment.uuid);
      history.push(`/activities/appointments/${appointment.uuid}`);
    },
    select: ({ select, appointment }) => (event, { checked }) => {
      event.stopPropagation();
      select(appointment.uuid, checked);
    },
  })
)(InfiniteAppointmentListRow);
