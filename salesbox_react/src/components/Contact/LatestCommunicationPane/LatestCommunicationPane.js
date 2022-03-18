//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';
import { Input, Icon, Menu, Popup, Message } from 'semantic-ui-react';
import { branch, renderNothing, compose, pure, withState, withHandlers } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import CommunicationItem from './CommunicationItem';
import appointmentAdd from '../../../../public/Appointments.svg';
import css from './CommunicationItem.css';
import PeriodPicker from 'components/DatePicker/PeriodPicker';
import cx from 'classnames';
import moment from 'moment';
import ComminicationFilterAction from '../../../essentials/Menu/CommunicationFilterAction';
import { filterLastestComminication } from '../../Organisation/organisation.actions';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Search for email': 'Search for email',
  },
});

const RightMenu = ({
  resetDate,
  handleOpenDate,
  openDatePicker,
  setEmail,
  searchForEmail,
  setSearchForEmail,
  tag,
  setTag,
  endDate,
  startDate,
  selectStartDate,
  selectEndDate,
}) => {
  return (
    <>
      <Menu.Item
        className={cx(css.rightIcon, searchForEmail && css.circleAvtive)}
        onClick={() => {
          setSearchForEmail(!searchForEmail);
          setEmail('');
        }}
      >
        <Icon className={css.searchIconCommunication} size={18} name="search" />
      </Menu.Item>
      <Popup
        flowing
        on="click"
        keepInViewPort
        closeOnTriggerBlur
        open={openDatePicker}
        style={{ padding: 0 }}
        position="top center"
        trigger={
          <Menu.Item
            onClick={() => handleOpenDate()}
            className={`${css.rightIcon} ${css.mr2} ${openDatePicker && css.circleAvtive}`}
          >
            <img style={{ height: 15, width: 15 }} src={appointmentAdd} />
          </Menu.Item>
        }
      >
        <Menu vertical color="teal">
          <Menu.Item onClick={resetDate}>{_l`All`}</Menu.Item>
          <PeriodPicker
            startDate={startDate}
            endDate={endDate}
            onChangeStart={selectStartDate}
            onChangeEnd={selectEndDate}
            trigger={<Menu.Item>{_l`Custom`}</Menu.Item>}
          />
        </Menu>
      </Popup>

      <Menu.Item className={`${css.rightIcon} ${css.mr2}`}>
        <ComminicationFilterAction imageClass={css.historyIcon} propsValueSet={tag} setTag={setTag} />
      </Menu.Item>
    </>
  );
};

const LatestCommunicationPane = ({
  resetDate,
  handleOpenDate,
  openDatePicker,
  overviewType,
  endDate,
  startDate,
  selectStartDate,
  selectEndDate,
  contact,
  setTag,
  setEmail,
  setSearchForEmail,
  tag,
  email,
  searchForEmail,
  handleFilter,
  totalCommunicationHistoryContact,
  totalCommunicationHistoryAccount
}: PropsType) => {
  let pageIndexSection = 0;
  if (!contact.latestCommunication || (contact.latestCommunication && contact.latestCommunication.length === 0)) {
    return (
      <Collapsible
        hasDragable
        right={
          <RightMenu
            endDate={endDate}
            setEmail={setEmail}
            openDatePicker={openDatePicker}
            handleOpenDate={handleOpenDate}
            startDate={startDate}
            resetDate={resetDate}
            selectStartDate={selectStartDate}
            selectEndDate={selectEndDate}
            searchForEmail={searchForEmail}
            setSearchForEmail={setSearchForEmail}
            setTag={setTag}
            tag={tag}
          />
        }
        width={308}
        padded
        count="0"
        title={_l`Communication log`}
      >
        <Message active info>
          {_l`No communication`}
        </Message>
      </Collapsible>
    );
  }
  if (contact.latestCommunication.length <= 10) {
    pageIndexSection = 0;
  }
  let totalCommunicationHistory = overviewType === 'ACCOUNTS' ? totalCommunicationHistoryAccount : totalCommunicationHistoryContact;
  return (
    <Collapsible
      right={
        <RightMenu
          endDate={endDate}
          setEmail={setEmail}
          resetDate={resetDate}
          startDate={startDate}
          openDatePicker={openDatePicker}
          handleOpenDate={handleOpenDate}
          selectStartDate={selectStartDate}
          selectEndDate={selectEndDate}
          searchForEmail={searchForEmail}
          setSearchForEmail={setSearchForEmail}
          setTag={setTag}
          tag={tag}
        />
      }
      width={308}
      title={_l`Communication log`}
    >
      <div style={{ background: '#fff', paddingTop: 10 }}>
        {searchForEmail && (
          <Input
            className={css.inputSearch}
            fluid
            focus
            size="medium"
            value={email}
            onBlur={() => {
              if (!email) {
                handleFilter(0);
              }
            }}
            onChange={(value) => {
              setEmail(value.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilter(0);
              }
            }}
            icon={
              <Icon
                size={18}
                className={css.searchIcon}
                onClick={() => {
                  handleFilter(0);
                }}
                name="search"
                link
              />
            }
            placeholder={_l`Search for email`}
          />
        )}
        <InfiniteLoader
          autoReload={true}
          isRowLoaded={isRowRender(contact.latestCommunication)}
          loadMoreRows={(param) => {
            const { stopIndex } = param;
            const pageIndex = Math.ceil(stopIndex / 10) - 1;

            if (pageIndexSection < pageIndex) {
              pageIndexSection = pageIndex;
              handleFilter(pageIndex);
            }
          }}
          threshold={1}
          rowCount={totalCommunicationHistory || 100}
        >
          {({ onRowsRendered, registerChild }) => {
            return (
              <List
                height={getHeight(contact.latestCommunication)}
                className={css.list}
                rowCount={contact.latestCommunication.length}
                rowHeight={48}
                width={308}
                ref={registerChild}
                // style={{
                //   backgroundColor: 'rgb(227, 227, 227)',
                //   transition: 'background-color 0.2s ease',
                // }}
                onRowsRendered={onRowsRendered}
                rowRenderer={getRowRender(contact.latestCommunication, overviewType)}
                threshold={300}
                data={contact.latestCommunication}
              />
            );
          }}
        </InfiniteLoader>
      </div>
    </Collapsible>
  );
};

const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
};

const getHeight = (data) => {
  let _length = data && data.length
  if(_length > 6) {
    return 300;
  } else {
    return _length * 48;
  }
  
}

const getRowRender = (quotes, overviewType) => ({ index, style }) => {
  const communication = quotes[index];

  if (!communication) {
    return null;
  }
  return (
    <CommunicationItem
      overviewType={overviewType}
      style={style}
      communication={communication}
      key={communication.uuid}
    />
  );
};

export default compose(
  connect((state) => ({
    totalCommunicationHistoryContact: state.entities?.contact?.__DETAIL?.totalCommunicationHistory,
    totalCommunicationHistoryAccount: state.entities?.organisation?.__DETAIL?.totalCommunicationHistory

  }), {
    filterLastestComminication,
  }),
  withState('searchForEmail', 'setSearchForEmail', false),
  withState('email', 'setEmail', ''),
  withState('endDate', 'selectEndDate', new Date()),
  withState('startDate', 'selectStartDate', new Date()),
  withState('tag', 'setTag', null),
  withState('isSetDate', 'setIsSetDate', false),
  withState('openDatePicker', 'setOpenDatePicker', false),

  withHandlers({
    resetDate: ({
      setIsSetDate,
      setOpenDatePicker,
      filterLastestComminication,
      contact,
      email,
      tag,
      objectType,
    }) => () => {
      setIsSetDate(false);
      setOpenDatePicker(false);
      filterLastestComminication(contact.uuid, objectType, 0, null, null, email, tag);
    },
    handleOpenDate: ({ openDatePicker, setOpenDatePicker }) => () => {
      setOpenDatePicker(!openDatePicker);
    },
    selectEndDate: ({
      setIsSetDate,
      filterLastestComminication,
      selectEndDate,
      contact,
      email,
      startDate,
      tag,
      objectType,
    }) => (date) => {
      selectEndDate(date);
      setIsSetDate(true);
      filterLastestComminication(
        contact.uuid,
        objectType,
        0,
        moment(startDate).valueOf(),
        moment(date).valueOf(),
        email,
        tag
      );
    },
    selectStartDate: ({
      setIsSetDate,
      filterLastestComminication,
      selectStartDate,
      contact,
      email,
      endDate,
      tag,
      objectType,
    }) => (date) => {
      selectStartDate(date);
      setIsSetDate(true);
      filterLastestComminication(
        contact.uuid,
        objectType,
        0,
        moment(date).valueOf(),
        moment(endDate).valueOf(date),
        email,
        tag
      );
    },

    handleFilter: ({ filterLastestComminication, contact, email, endDate, tag, startDate, objectType, isSetDate }) => (
      pageIndex
    ) => {
      console.log('---------Load more ');
      filterLastestComminication(
        contact.uuid,
        objectType,
        pageIndex,
        isSetDate ? moment(startDate).valueOf() : null,
        isSetDate ? moment(endDate).valueOf() : null,
        email,
        tag
      );
    },

    setTag: ({ setTag, filterLastestComminication, contact, email, endDate, startDate, objectType, isSetDate }) => (
      tag
    ) => {
      setTag(tag);
      filterLastestComminication(
        contact.uuid,
        objectType,
        0,
        isSetDate ? moment(startDate).valueOf() : null,
        isSetDate ? moment(endDate).valueOf() : null,
        email,
        tag
      );
    },
  }),
  pure
)(LatestCommunicationPane);
