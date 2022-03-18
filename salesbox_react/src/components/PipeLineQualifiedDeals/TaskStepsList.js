import * as React from 'react';
import createOverview from '../Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import InfiniteUnqualifiedDealListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteQualifiedDealListRow';
import { TaskStepsBoard } from './TaskSteps/TaskStepsBoard';
import { fetchQualifiedData } from './qualifiedDeal.actions';
import SetLostDealModal from './SetLostDealModal/SetLostDealModal';
import SelectClousureDateModal from './SelectClosureDateModal/SelectClousureDateModal';
import SuggestedActions from './SuggestedActions';
import SetWonDealModal from './SetWonDealModal/SetWonDealModal';
import DeleteQualifiedDealModal from "./DeleteQualifiedDealModal/DeleteQualifiedDealModal";
import DeleteOpportunityWithManyUsersConnectedModal
  from "./DeleteOpportunityWithManyUsersConnectedModal/DeleteOpportunityWithManyUsersConnectedModal";
import DeleteConnectedObjectModal from "./DeleteConnectedObjectModal/DeleteConnectedObjectModal";

const header = (width) => (
  <HeaderComponent
    objectType={ObjectTypes.PipelineQualified}
    width={width}
    overviewType={OverviewTypes.Pipeline.Qualified}
  />
);

const Overview = createOverview(
  OverviewTypes.Pipeline.Qualified,
  ObjectTypes.PipelineQualified,
  Colors.Pipeline,
  header,
  InfiniteUnqualifiedDealListRow,
  PlaceholderComponent,
  TaskStepsBoard
);

const TaskStepsOverview = () => {
  return (
    <Overview hasPeriodSelector hasQualifiedValue hasSalesMethod route="/task/steps">
      <SetLostDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
      <SetWonDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
      <SelectClousureDateModal overviewType={OverviewTypes.Pipeline.Qualified} />
      <SuggestedActions overviewType={OverviewTypes.Pipeline.Qualified} />

      <DeleteQualifiedDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
      <DeleteOpportunityWithManyUsersConnectedModal overviewType={OverviewTypes.Pipeline.Qualified}/>
      <DeleteConnectedObjectModal overviewType={OverviewTypes.Pipeline.Qualified} />

    </Overview>
  );
};

export default compose(
  connect(
    null,
    {
      fetchQualifiedData,
    }
  ),

  withGetData(({ fetchQualifiedData }) => () => {
    fetchQualifiedData();
  })
)(TaskStepsOverview);
