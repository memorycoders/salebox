//@flow
import * as React from 'react';
import { Modal } from 'semantic-ui-react';
import * as IndustryActions from 'components/Industry/industry.actions';
import { getIndustriesForAccount } from 'components/Industry/industry.selector';
import { compose, mapProps, withHandlers, withState, pure } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import { highlight } from '../../../Overview/overview.actions';
import _l from 'lib/i18n';
import type { IndustryT } from 'components/Industry/industry.types';
import AddDropdown from '../../../AddDropdown/AddDropdown'
import AddIndustryModal from './AddIndustryModal';

type PropsT = {
  industries: Array<IndustryT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const IndustryDropdown = ({ handleSearch, changeCloseOnDimmerClickParent, industries, isFetching, addIndustry, setVisiableAddModal, visiableAddModal, onHandleAddNew, industryNew, ...other }: PropsT) => {


  return (
    <>
      <AddDropdown
        loading={isFetching}
        fluid
        selection
        clearable
        size="small"
        search
        options={industryNew.concat(industries)}
        onClickAdd={addIndustry}
        isLoadMore={false}
        {...other}
      />
      <Modal.Actions>
        <AddIndustryModal
          onHandleAddNew={onHandleAddNew}
          hideAssignForm={() => {
            changeCloseOnDimmerClickParent(true);
            setVisiableAddModal(false)
          }}
          visible={visiableAddModal} />
      </Modal.Actions>

    </>
  );
};

export default compose(
  connect(
    (state, { value }) => ({
      industries: getIndustriesForAccount(state, { value }),
      isFetching: state.ui.industry.dropdownFetching,
    }),
    {
      requestFetchDropdown: IndustryActions.requestFetchDropdown,
      highlight
    }
  ),

  withState('visiableAddModal', 'setVisiableAddModal', false),
  withState('industryNew', 'setIndustryNew', []),
  //industryNew
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  withHandlers({
    addIndustry: ({ setVisiableAddModal, changeCloseOnDimmerClickParent }) => () => {
      changeCloseOnDimmerClickParent(false);
      setVisiableAddModal(true)
    },

    onHandleAddNew: ({ setIndustryNew, industryNew, onChange, requestFetchDropdown, changeCloseOnDimmerClickParent }) => industry => {
      const industryConvert = {
        key: industry.uuid,
        text: industry.name,
        value: industry.uuid
      }
      setIndustryNew(industryNew.concat(industryConvert));
      requestFetchDropdown();
      changeCloseOnDimmerClickParent(true);
      onChange({}, industryConvert)
    }
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, dispatch, ...other }) => ({
    ...other,
  })),
  pure
)(IndustryDropdown);
