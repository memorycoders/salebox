//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import moment from 'moment';
import { connect } from 'react-redux';
import api from '../../../lib/apiClient';
import * as OverviewActions from 'components/Overview/overview.actions';
import { success } from 'components/Notification/notification.actions';

import * as PeriodActionTypes from '../../PeriodSelector/period-selector.actions';
import { isHighlightAction, getItemSelected } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { OverviewTypes } from '../../../Constants';
import CreateChartForm from './CreateChartForm';
import AddNewFilter from './AddNewFilter';
import AddNameChart from './AddNameChart';
import { getPeriod } from '../../PeriodSelector/period-selector.selectors';
import { initOptionsField } from './AddNewFilter';
import { addChart, updateChart } from '../../Dashboard/dashboard.actions';
import NoteForPieChart from './NoteForPieChart';
import { formValueSelector } from 'redux-form';
type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'The opportunity, active reminders and appointments will be removed ?':
      'The opportunity, active reminders and appointments will be removed ?',
    'Are you sure you want to delete all ?': 'Are you sure you want to delete all ?',
  },
});

const CreateChartModal = ({
  closeNoteForPieChart,
  comfirmNoteForPieChart,
  visibleNoteForPieChart,
  EDIT_FORM,
  data,
  setCreateDone,
  setVisiableAddName,
  visiableAddName,
  dashBoardType,
  setDashBoardType,
  visible,
  hide,
  onSave,
  visiableAddFilterModal,
  setVisiableAddFilterModal,
  setFilters,
  filters,
  errors,
  setErrors,
  setData,
  setError,
  modalType,
  changeCloseOnDimmerClickParent,
  closeOnDimmerClick
}: PropsT) => {
  console.log('setVisiableAddName: ', visiableAddName);

  return (
    <>
      <ModalCommon
        title={modalType === 'edit'  ? _l`Edit diagram`: _l`Add Comparison`}
        cancelLabel={_l`Share`}
        okLabel={_l`Save`}
        visible={visible}
        onDone={() => {
            onSave(false);
        }}
        onClose={(isClose) => {
          if (isClose) {
            setErrors([]);
            setData([
              {
                diffPeriod: null,
                displayDataType: null,
                filterId: null,
                filterType: null,
                index: 0,
                name: '',
                searchFieldList: [],
                units: [],
                isShowUnit: true,
              },
            ]);
            setFilters([])
            return hide();
          }
          onSave(true);
        }}
        closeOnDimmerClick={!visiableAddFilterModal && closeOnDimmerClick}
        // closeOnDimmerClick={false}

        paddingAsHeader={true}
      >
        <CreateChartForm
          dashBoardType={dashBoardType}
          setDashBoardType={setDashBoardType}
          setData={setData}
          errors={errors}
          data={data}
          setErrors={setErrors}
          filters={filters}
          setError={setError}
          setVisiableAddFilterModal={setVisiableAddFilterModal}
          setFilters={setFilters}
          changeCloseOnDimmerClickParent={changeCloseOnDimmerClickParent}
        />
      </ModalCommon>
      <AddNewFilter
        setFilters={setFilters}
        filters={filters}
        setVisiableAddFilterModal={setVisiableAddFilterModal}
        visible={visiableAddFilterModal}
      />
      <AddNameChart
        oldName={EDIT_FORM ? EDIT_FORM.name : ''}
        setCreateDone={setCreateDone}
        setVisiableAddName={setVisiableAddName}
        visible={visiableAddName}
        setFilters={setFilters}
        setData={setData}
      />

      <NoteForPieChart
        visible={visibleNoteForPieChart}
        onDone={comfirmNoteForPieChart}
        onClose={closeNoteForPieChart}
      />
    </>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, modalType = 'create' }) => {
    const visible = isHighlightAction(state, overviewType, modalType);
    const period = getPeriod(state, 'INSIGHT_CHART_CREATE');
    let ownerId = state.auth.userId;
    let EDIT_FORM = null;
    if (modalType === 'edit' || modalType === 'copy') {
      EDIT_FORM = getItemSelected(state, 'INSIGHT_CREATE_MODAL');
    }
    console.log('EDIT_FORM',EDIT_FORM)
    return {
      visible,
      period,
      ownerId,
      EDIT_FORM,
    };
  };
  return mapStateToProps;
};
export default compose(
  withState('visibleNoteForPieChart', 'setVisibleNoteForPieChart', false),
  withState('visiableAddName', 'setVisiableAddName', false),
  withState('visiableAddFilterModal', 'setVisiableAddFilterModal', false),
  withState('filters', 'setFilters', []),
  withState('shareWith', 'setShareWith', false),

  withState('dashBoardType', 'setDashBoardType', 'DIAGRAM'),
  withState('errors', 'setErrors', []),
  withState('optionsFeild', 'setOptionsFeild', initOptionsField()),
  withState('data', 'setData', (props) => {
    console.log('props: setData', props);
    if (props.EDIT_FORM) {
      return props.EDIT_FORM.dashBoardDataSetDTOList;
    }
    return [
      {
        diffPeriod: null,
        displayDataType: null,
        filterId: null,
        filterType: null,
        index: 0,
        name: '',
        searchFieldList: [],
        units: [],
        isShowUnit: true,
      },
    ];
  }),

  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    success,
    periodRegister: PeriodActionTypes.register,
    selectPeriod: PeriodActionTypes.selectPeriod,
    addChart,
    updateChart,
    highlight: OverviewActions.highlight,
  }),
  withState('closeOnDimmerClick', 'setCloseOnDimmerClick', true),
  lifecycle({
    componentDidMount() {
      const { periodRegister } = this.props;
      periodRegister('INSIGHT_CHART_CREATE');
    },

    componentWillReceiveProps(nexProps) {
      const { visible, setFilters, setData, setDashBoardType, selectPeriod, EDIT_FORM, startDate,optionsFeild } = this.props;
      // const optionsFeild = initOptionsField();
      if (nexProps.EDIT_FORM && nexProps.EDIT_FORM !== EDIT_FORM) {
        const { dashBoardDataSetDTOList, dashBoardType, periodType, searchFieldList } = nexProps.EDIT_FORM;

        const data = dashBoardDataSetDTOList.map((dataSet, index) => {
          // console.log('optionsFeild',optionsFeild)
          let searchFieldListTemp = [];
            (dataSet.searchFieldList || []).forEach((value) => {
            // console.log('searchFieldList value',value);
            // return optionsFeild.findIndex((option) => option.value === value) !== -1;
            let index = optionsFeild.findIndex((option) => value!=null && option.value === value.field);
            if( index !== -1){
              searchFieldListTemp.push({
                ...value,
                name: optionsFeild[index].text
              })
            }
          });


          return {
            ...dataSet,
            units: [],
            index: index,
            isShowUnit: dataSet.filterType === 'COMPANY' ? false : true,
            // searchFieldList: (dataSet.searchFieldList || []).filter((value) => {
            //   console.log('searchFieldList value',value);
            //   // return optionsFeild.findIndex((option) => option.value === value) !== -1;
            //   return optionsFeild.findIndex((option) => value!=null && option.value === value.field) !== -1;
            //
            // }),
            searchFieldList: searchFieldListTemp,
          };
        });
        console.log('nexProps.EDIT_FORM: ', data);
        let searchFieldListTemp = [];
        searchFieldList.forEach((value) => {
          // console.log('searchFieldList value',value);
          // return optionsFeild.findIndex((option) => option.value === value) !== -1;
          let index = optionsFeild.findIndex((option) => value!=null && option.value === value.field);
          if( index !== -1){
            searchFieldListTemp.push({
              ...value,
              name: optionsFeild[index].text
            })
          }
        })
        // console.log('searchFieldListTemp',searchFieldListTemp)
        setTimeout(() => {
          setData(data);
          setFilters(
/*
            searchFieldList.filter((value) => {
              console.log('searchFieldList value',value);
              // return optionsFeild.findIndex((option) => option.value === value) !== -1;
              return optionsFeild.findIndex((option) => value!=null && option.value === value.field) !== -1;
            })
*/
          searchFieldListTemp
          );
          setDashBoardType(dashBoardType);
          selectPeriod('INSIGHT_CHART_CREATE', periodType.toLowerCase(), moment(startDate).toDate());
        }, 0);
      }
    },
  }),
  withHandlers({
    changeCloseOnDimmerClickParent: ({setCloseOnDimmerClick, closeOnDimmerClick}) => (closeOnDimmerClick) => {
      setCloseOnDimmerClick(closeOnDimmerClick)
    },
    hide: ({ clearHighlightAction, overviewType, highlight }) => () => {
      //INSIGHT_SHARE_WITH
      // highlight('INSIGHT_SHARE_WITH', null, 'share', {} )
      clearHighlightAction(overviewType);
    },
    onSave: ({ clearHighlightAction, setData, setShareWith, setVisiableAddName, ownerId, data, setErrors, dashBoardType, period, overviewType }) => (shareWith) => {
      let errors = [];
      data.forEach((value) => {
        let error = {};
        if (!value.diffPeriod && value.diffPeriod !== 0) {
          error.diffPeriod = _l`Time period is required`;
        }
        if (!value.displayDataType) {
          error.displayDataType = _l`Display data is required`;
        }
        if (!value.name) {
          error.name = _l`Name is required`;
        }
        if (!value.filterType) {
          error.filterType = _l`Unit type is required`;
        }
        if (!value.filterId && !value.filterType === 'COMPANY') {
          error.filterId = _l`Unit is required`;
        }
        //Unit is required
        errors.push(error);
      });

      const checkError = errors.findIndex((error) => Object.keys(error).length > 0) !== -1;
      setErrors(errors);
      if (checkError) {
        return;
      }
      setShareWith(shareWith);
      setVisiableAddName(true);
    },
    setCreateDone: ({
      setData,
      shareWith,
      highlight,
      addChart,
      updateChart,
      modalType,
      EDIT_FORM,
      success,
      clearHighlightAction,
      overviewType,
      filters,
      setVisiableAddName,
      ownerId,
      data,
      setErrors,
      dashBoardType,
      period,
    }) => async (name) => {

      const dashBoardDataSetDTOList = data.map((dataSet) => {
        return {
          diffPeriod: dataSet.diffPeriod,
          displayDataType: dataSet.displayDataType,
          filterId: dataSet.filterId,
          filterType: dataSet.filterType,
          index: dataSet.index,
          name: dataSet.name,
          searchFieldList: dataSet.searchFieldList && dataSet.searchFieldList.map((searchField) => {
            return {
              field: searchField.field,
              operator: searchField.operator,
              valueDate: null,
              valueId: searchField.valueId,
              valueText: searchField.valueText,
            };
          }),
        };
      });

      let payload = {
        dashBoardDataSetDTOList,
        dashBoardType: dashBoardType,
        endDate: moment(period.endDate).valueOf(),
        name: name,
        ownerId: ownerId,
        periodType: period.period.toUpperCase(),
        startDate: moment(period.startDate).valueOf(),
        searchFieldList: filters.map((filt) => {
          return {
            field: filt.field,
            operator: filt.operator,
            productId: null,
          };
        }),
      };

      let url = 'advance-search-v3.0/customDashBoard/add';

      if (modalType === 'edit') {
        url = `advance-search-v3.0/customDashBoard/update/${EDIT_FORM.uuid}`;
        payload.uuid = EDIT_FORM.uuid;
      }

      try {
        const timezone = new Date().getTimezoneOffset() / -60;

        const result = await api.post({
          resource: url,
          data: payload,
        });
        const chart = await api.get({
          resource: `advance-search-v3.0/customDashBoard/${result.uuid}`,
          query: {
            timezone: timezone,
          },
        });


        if (shareWith) {
          highlight('INSIGHT_SHARE_WITH', null, 'share', payload);
        }
        if (modalType === 'edit') {
          updateChart(chart);
          clearHighlightAction(overviewType);
          success(_l`Updated`, '', 2000);
          return;
        }
        addChart(chart);
        clearHighlightAction(overviewType);
        success(_l`Added`, '', 2000);
        setData([
          {
            diffPeriod: null,
            displayDataType: null,
            filterId: null,
            filterType: null,
            index: 0,
            name: '',
            searchFieldList: [],
            units: [],
            isShowUnit: true,
          },
        ]);
      } catch (error) {}
    },
    setError: ({ setErrors, errors }) => (index, type, hasError, errorMessage) => {
      if (errors[index]) {
        let newErrors = [...errors];
        if (hasError) {
          newErrors[index][type] = errorMessage;
        } else {
          delete newErrors[index][type];
        }

        setErrors(newErrors);
      }
    },

    comfirmNoteForPieChart: ({ setVisibleNoteForPieChart, setData, data }) => () => {
      const findHasData = data.find((value) => value.displayDataType);
      const newData = data.map((value) => {
        return {
          ...value,
          displayDataType: findHasData.displayDataType,
        };
      });
      setData(newData);
      setVisibleNoteForPieChart(false);
    },

    closeNoteForPieChart: ({ setVisibleNoteForPieChart }) => () => {
      setVisibleNoteForPieChart(false);
    },

    setDashBoardType: ({ setDashBoardType, setVisibleNoteForPieChart, data }) => (chartType) => {
      if (chartType === 'PIE_CHART') {
        const findHasData = data.find((value) => value.displayDataType);
        if (findHasData) {
          const findOtherDataType = data.find((value) => value.displayDataType !== findHasData.displayDataType);
          if (findOtherDataType) {
            setVisibleNoteForPieChart(true);
          }
        }
      }

      setDashBoardType(chartType);
    },
  })
)(CreateChartModal);
