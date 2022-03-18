//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as SalesMethodActions from 'components/SalesMethod/sales-method.actions';
import { getActiveSalesMethods, getSaleMethodById } from 'components/SalesMethod/sales-method.selector';
import { compose, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import _l from 'lib/i18n';
import type { DropdownType } from 'types/semantic-ui.types';

type PropsT = {
  types: Array<DropdownType>,
  isFetching: boolean,
};

addTranslations({
  'en-US': {},
});

const SalesMethodDropdown = ({ types, isFetching, ...other }: PropsT) => {
  return <Dropdown loading={isFetching} fluid search selection options={types} {...other} />;
};

export default compose(
  connect(
    (state, {value}) => ({
      types: getActiveSalesMethods(state),
      isFetching: state.ui.focus.dropdownFetching,
      saleMethod: getSaleMethodById(state, value)
    }),
    {
      requestFetchDropdown: SalesMethodActions.requestFetchDropdown,
    }
  ),
  lifecycle({
    componentDidMount() {
      this.props.requestFetchDropdown();
    },
    componentWillReceiveProps(nextProps) {
      if (
        !this.props.types ||
        !nextProps.types ||
        (this.props.types && this.props.types.length < 1) ||
        (nextProps.types && nextProps.types.length < 1)
      ) {
        this.props.requestFetchDropdown();
      }
      if (nextProps.value && !nextProps.types?.find((e) => e.value === nextProps.value)) {
        console.log('------------------------:', nextProps.value, )
        console.log('huhuhuhu: ko  tim thay vlaue nao');
        nextProps.types.push({
          key: nextProps.value,
          value: nextProps.value,
          text: nextProps.saleMethod?.name,
          disabled: true
        })
      }
    },
  }),
  // withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, getData, dispatch, ...other }) => ({
    ...other,
  }))
)(SalesMethodDropdown);
