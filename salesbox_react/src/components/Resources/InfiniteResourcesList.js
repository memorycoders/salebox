import * as React from 'react';
import { ObjectTypes, OverviewTypes, Colors } from '../../Constants';
import HeaderComponent from './HeaderResourcesList/HeaderResourcesList';
import createOverview from 'components/Overview/createOverview';
import InfiniteResourcesListRow, { PlaceholderComponent } from './InfiniteResourcesListRow';
import UpdateManagerModal from './ResourceModal/UpdateManagerModal';
const header = (width) => (
  <HeaderComponent width={width} objectType={ObjectTypes.Resource} overviewType={OverviewTypes.Resource} />
);
const Overview = createOverview(
  OverviewTypes.Resource,
  ObjectTypes.Resource,
  Colors.Resource,
  header,
  InfiniteResourcesListRow,
  PlaceholderComponent
);

export const ResourceObjectFeature = () => {
  return (
    <>
    </>
  );
};
const InfiniteResourceListOverview = () => {
  return (
    <Overview hasPeriodSelector hasFilter hideOnlyPeriod>
      <ResourceObjectFeature />
      <UpdateManagerModal overviewType={OverviewTypes.Resource} />
    </Overview>
  );
};
export default InfiniteResourceListOverview;
