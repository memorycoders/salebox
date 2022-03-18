import * as React from 'react';
import { useEffect } from 'react';
import { Progress, Segment, Grid, Image, Popup } from 'semantic-ui-react';
import { ObjectTypes, OverviewTypes, Colors } from '../../../Constants';
import HeaderComponent from './HeaderRecruitmentCloseList';
import createOverview from 'components/Overview/createOverview';
import InfiniteRecruitmentClosedListRow, { PlaceholderComponent } from './InfiniteRecruitmentClosedListRow';
import { connect } from 'react-redux';
import { fetchListRecruitmentClosedByCaseId, selectRecruitmentCase } from '../recruitment.actions';
import AddToMailchimpListModal from '../../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import FormAddNewMailchimpList from '../../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import { RoutingObjectFeature } from '../../RoutingObjectModal/RoutingObjectFeature';
import UpdateDataFieldsModal from '../../Contact/UpdateDataFieldsModal';
import AddCallListModal from '../../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';
import DeleteMultiCandidateModal from '../RecruitmentClosed/DeleteMultiCandidateModal';
import UpdateResponsibleCandidateModal from '../RecruitmentActive/UpdateResponsibleCandidateModal';
import DeleteCandidateModal from '../RecruitmentActive/DeleteCandidateModal';
import UpdateMultiResponsibleModal from './UpdateMultiResponsibleModal';

const header = (width) => (
  <HeaderComponent
    width={width}
    objectType={ObjectTypes.RecruitmentClosed}
    overviewType={OverviewTypes.RecruitmentClosed}
  />
);
const Overview = createOverview(
  OverviewTypes.RecruitmentClosed,
  ObjectTypes.RecruitmentClosed,
  Colors.Recruitment,
  header,
  InfiniteRecruitmentClosedListRow,
  PlaceholderComponent
);

export const RecruitmentObjectFeature = () => {
  return <Segment basic>{/* <RecruitmentObjectFeature /> */}</Segment>;
};
const InfiniteRecruitmentClosedList = ({ fetchListRecruitmentClosedByCaseId, currentRC }) => {
  useEffect(() => {
    // fetchListRecruitmentClosedByCaseId(currentRC || 'ALL');
    // selectRecruitmentCase(currentRC ||'ALL');
  }, []);
  return (
    <Overview hasPeriodSelector hasFilter>
      {/* <RecruitmentObjectFeature /> */}
      <RoutingObjectFeature />
      <UpdateDataFieldsModal overviewType={OverviewTypes.RecruitmentClosed} />
      <AddCallListModal overviewType={OverviewTypes.RecruitmentClosed} />
      <AddToMailchimpListModal overviewType={OverviewTypes.RecruitmentClosed} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.RecruitmentClosed} />
      <DeleteMultiCandidateModal overviewType={OverviewTypes.RecruitmentClosed} />
      <UpdateMultiResponsibleModal overviewType={OverviewTypes.RecruitmentClosed} />
      <UpdateResponsibleCandidateModal overviewType={OverviewTypes.RecruitmentClosed} />
      <DeleteCandidateModal overviewType={OverviewTypes.RecruitmentClosed} />
    </Overview>
  );
};

const mapStateToProps = (state) => ({
  // currentRC: state.settings.display?.candidateClose?.defaultView,
});
const mapDispatchToProps = { fetchListRecruitmentClosedByCaseId, selectRecruitmentCase };
export default connect(mapStateToProps, mapDispatchToProps)(InfiniteRecruitmentClosedList);
