import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RoutingObjectFeature } from '../../RoutingObjectModal/RoutingObjectFeature';
import createOverview from '../../Overview/createOverview';
import { getSearch } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { OverviewTypes, ObjectTypes, Colors } from '../../../Constants';
import RecruitmentBoard from './RecruitmentBoard';
import InfiniteRecruitmentClosedListRow, {
  PlaceholderComponent,
} from '../RecruitmentClosed/InfiniteRecruitmentClosedListRow';
import HeaderComponent from '../HeaderRecruitmentList/HeaderRecruitmentList';
import SetWonCandidateModal from '../RecruitmentActive/SetWonCandidateModal';
import SetLostCandidateModal from './SetLostCandidateModal';
import DeleteCandidateModal from './DeleteCandidateModal';
import DeleteRecruitmentCase from './DeleteRecruitmentCase';
import CloseRecruitmentCaseModal from './CloseRecruitmentCaseModal';
import UpdateResponsibleCandidateModal from './UpdateResponsibleCandidateModal';
import UpdateCandidateModal from './UpdateCandidateModal';
import CopyCandidateModal from './CopyCandidateModal';
import CopyRecuitmentCase from './CopyRecuitmentCase';
const header = (width) => (
  <HeaderComponent
    width={width}
    objectType={ObjectTypes.RecruitmentActive}
    overviewType={OverviewTypes.RecruitmentActive}
  />
);

const Overview = createOverview(
  OverviewTypes.RecruitmentActive,
  ObjectTypes.RecruitmentActive,
  Colors.Recruitment,
  null,
  InfiniteRecruitmentClosedListRow,
  PlaceholderComponent,
  RecruitmentBoard
);

export const RecruitmentObjectFeature = () => {
  return <></>;
};

const RecruitmentStepOverview = ({currentRC}) => {
  useEffect(() => {}, []);

  return (
    <Overview hasPeriodSelector hideOnlyPeriod route="/recruitment/active">
      <RoutingObjectFeature />
      <SetWonCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <SetLostCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <DeleteCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <CloseRecruitmentCaseModal overviewType={OverviewTypes.RecruitmentActive} />
      <UpdateResponsibleCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <CopyCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <UpdateCandidateModal overviewType={OverviewTypes.RecruitmentActive} />
      <DeleteRecruitmentCase overviewType={OverviewTypes.RecruitmentActive} />
      <CopyRecuitmentCase overviewType={OverviewTypes.RecruitmentActive} />
    </Overview>
  );
};

const mapStateToProps = (state) => ({
  currentRC: state.settings.display?.candidateActive?.defaultView,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentStepOverview);
