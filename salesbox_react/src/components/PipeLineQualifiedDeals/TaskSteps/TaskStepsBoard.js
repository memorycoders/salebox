import React, { Component } from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { fetchCountBySteps, updateSteps, fetchListSaleProcess, moveStepActionPlanLocal } from '../qualifiedDeal.actions';
import { getDetailBySteps } from '../qualifiedDeal.selector';
import { CardItem, CardHeader } from './CardStep';
import { ObjectTypes, Endpoints } from 'Constants';
import api from 'lib/apiClient';
import generateUuid from 'uuid/v4';
import { updateSalesProcessAndMode } from 'components/AdvancedSearch/advanced-search.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { DynamicList } from '../DynamicList/DynamicList';
import { OverviewTypes } from '../../../Constants';
import NewBoard from './TrelloElement/Board';
import { updateLanesParent } from './TrelloElement/trello-action';

class TaskStepsBoardC extends Component {

  constructor(props) {
    super(props);
    this.oldLaneId = null;
    this.newLaneId = null;
    this.newStepById = null;
    this.MODE = 'SEQUENTIAL';
    this.state = {
      mode: 'SEQUENTIAL',
      eventBus: null,
      data: { lanes: [] },
      saleListProcess: [],
      salesProcessId: null,
      manualProgress: 'OFF'
    }
  }

  componentDidMount() {

    const { steps, salesMethodUsing, fetchCountBySteps, fetchListSaleProcess, updateSalesProcessAndMode } = this.props;
    if (salesMethodUsing) {

      const { uuid, activityDTOList, mode, manualProgress } = salesMethodUsing.find(value => value.isActive);
      this.salesProcessId = uuid;
      this.setState({ mode, salesProcessId: uuid, manualProgress })
      this.MODE = mode;
      updateSalesProcessAndMode(OverviewTypes.Pipeline.Qualified, uuid, mode)
      if (mode === "SEQUENTIAL") {
        fetchCountBySteps(uuid)
        let stepShow = activityDTOList;
        if (steps[uuid]) {
          stepShow = steps[uuid];
        }
        this.convertStepToTrello(stepShow)
      } else if (mode === "DYNAMIC") {
        fetchListSaleProcess(uuid);
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    const {
      roleType,
      activeRole,
      userId,
      steps,
      salesMethodUsing,
      fetchCountBySteps,
      search,
      period,
      fetchListSaleProcess,
      updateSalesProcessAndMode,
    } = this.props;

    //Khi chọn 1 sale method khác

    if (salesMethodUsing !== nextProps.salesMethodUsing && nextProps.salesMethodUsing) {
      if (this.newStepById && this.salesProcessId) {
        this.props.updateSteps(this.salesProcessId, this.newStepById);
      }
      const { activityDTOList = [], uuid, mode, manualProgress } = nextProps.salesMethodUsing.find(value => value.isActive) || {};
      const oldSaleMethodActive = salesMethodUsing ? salesMethodUsing.find(value => value.isActive) : null;
      if (!oldSaleMethodActive || oldSaleMethodActive.uuid !== uuid) {
        this.salesProcessId = uuid;
        this.setState({ mode, salesProcessId: uuid, manualProgress })
        this.MODE = mode;
        updateSalesProcessAndMode(OverviewTypes.Pipeline.Qualified, uuid, mode)
        if (mode === 'SEQUENTIAL') {
          fetchCountBySteps(uuid)
          if (steps[this.salesProcessId]) {
            this.convertStepToTrello(steps[this.salesProcessId])
          } else {
            this.convertStepToTrello(activityDTOList.map(step => {
              return {
                uuid: step.uuid, // Chính là activityId
                progress: 0,
                count: 0,
                grossValue: 0,
                name: step.name,
                prospectDTOList: []
              }
            }))
          }
        } else if (mode === 'DYNAMIC') {
          fetchListSaleProcess(uuid);
          if (steps[this.salesProcessId]) {
            this.setState({ saleListProcess: steps[this.salesProcessId] })
          }
        }

      }
    }

    // Khi steps đã được call api xong
    if (steps !== nextProps.steps) {
      updateSalesProcessAndMode(OverviewTypes.Pipeline.Qualified, this.salesProcessId, this.MODE)
      if (this.MODE === "SEQUENTIAL") {
        this.convertStepToTrello(nextProps.steps[this.salesProcessId])
      } else if (this.MODE === "DYNAMIC") {
        this.setState({ saleListProcess: nextProps.steps[this.salesProcessId] })
      }

    }

    //Khi search and filter change

    if (search.term !== nextProps.search.term ||
      period !== nextProps.period ||
      roleType !== nextProps.roleType ||
      activeRole !== nextProps.activeRole
    ) {

      const { mode } = this.state;
      if (mode === "SEQUENTIAL") {
        fetchCountBySteps(this.salesProcessId)
      } else if (mode === "DYNAMIC") {
        fetchListSaleProcess(this.salesProcessId);
      }

    }

  }

  convertStepToTrello = (steps) => {
    const { updateLanesParent } = this.props;
    let objectData = {}
    if (steps) {
      objectData = (steps || []).reduce((obj, item) => {
        obj[item.uuid] = item;
        return obj;
      }, {})
    }

    //new
    updateLanesParent(this.salesProcessId, objectData)
  }

  handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    if (sourceLaneId === targetLaneId || targetLaneId === 'lost' || targetLaneId === 'won') {
      return;
    }

    const { prospect: { prospectProgressDTOList, grossValue } } = cardDetails;

    const prospectTarget = prospectProgressDTOList.find(value => value.activityId === targetLaneId);

    api.post({
      resource: `${Endpoints.Prospect}/prospectProgress/move`,
      data: {
        prospectId: cardId,
        targetId: prospectTarget.uuid
      },
    }).then(result => {


      const { steps, moveStepActionPlanLocal } = this.props;
      const splitPathName = location.pathname.split('/');
      if (splitPathName.length > 0 && cardId === splitPathName[splitPathName.length - 1]) {
        moveStepActionPlanLocal(prospectTarget.uuid, prospectTarget.progress);
      }

      const stepsById = steps[this.salesProcessId];
      const newStepById = stepsById.map(step => {
        if (step.uuid === sourceLaneId) {
          return {
            ...step,
            count: Number(step.count) - 1,
            grossValue: Number(step.grossValue) - grossValue,
            prospectDTOList: step.prospectDTOList.filter(prospect => prospect.uuid !== cardId)
          }
        }

        if (step.uuid === targetLaneId) {
          return {
            ...step,
            count: Number(step.count) + 1,
            grossValue: Number(step.grossValue) + grossValue,
            prospectDTOList: step.prospectDTOList.concat(cardDetails.prospect)
          }
        }

        return step;
      })
      this.newStepById = newStepById;

    }).catch(err => {
      console.log(err);
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { search, searchFieldDTOList } = this.props;
    if (nextProps.searchFieldDTOList !== searchFieldDTOList) {
      return false;
    }
    if (nextProps.search !== search) {
      if (search.term !== nextProps.search.term) {
        return true;
      }
      return false;
    }
    return true;
  }


  render() {
    const { data, mode, saleListProcess, salesProcessId, manualProgress } = this.state;
    const { width, height, currency } = this.props;

    return (


      <div className="task-steps-board" style={{ width, height }}>
        {/* <div id="won-container">
          Won
        </div> */}
        {mode === 'SEQUENTIAL' ? <NewBoard
          height={height}
          manualProgress={manualProgress}
          width={width}
          currency={currency}
          parentId={salesProcessId}
          data={data.lanes} /> : <DynamicList
            list={saleListProcess}
            salesProcessId={this.salesProcessId}
            {...this.props} />}
      </div>
    )
  }
}

export const TaskStepsBoard = compose(
  connect(
    (state, { overviewType }) => {
      const steps = getDetailBySteps(state);
      const search = getSearch(state, ObjectTypes.PipelineQualified);
      const period = getPeriod(state, ObjectTypes.PipelineQualified);
      const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.PipelineQualified);
      const { roleType, currency } = state.ui.app;
      const { qualifiedDeal } = state.entities;
      return {
        otherParam: state.overview[overviewType] ? state.overview[overviewType].otherParam : {},
        steps,
        search,
        period,
        searchFieldDTOList,
        roleType,
        currency: currency ? currency : 'SEK',
        activeRole: state.ui.app.activeRole,
        userId: state.auth.userId,
        salesMethodUsing: qualifiedDeal.__COMMON_DATA ? qualifiedDeal.__COMMON_DATA['salesMethodUsing'] : null,
      }
    },
    {
      fetchCountBySteps,
      updateSteps,
      fetchListSaleProcess,
      moveStepActionPlanLocal,
      updateSalesProcessAndMode,
      updateLanesParent
    }
  )
)(TaskStepsBoardC);
