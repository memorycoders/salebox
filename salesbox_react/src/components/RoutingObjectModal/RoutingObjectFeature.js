import React from 'react';

import { ContactObjectFeature } from '../Contact/InfiniteContactList';
import { AccountObjectFeature } from '../Organisation/InfiniteOrganisationList';
import { UnqualifiedObjectFeature } from '../PipeLineUnqualifiedDeals/InfiniteUnqualifiedDealList';
import { QualifiedObjectFeature } from '../PipeLineQualifiedDeals/InfiniteQualifiedDealList';
import { AppointmentObjectFeature } from '../Activities/InfiniteAppointmentList';
import { OrderObjectFeature } from '../PipeLineQualifiedDeals/infiniteOrderList';
import { TaskObjectFeature } from '../Activities/InfiniteTaskList';

export const RoutingObjectFeature = ()=>{
    return <>
        <TaskObjectFeature />
        <ContactObjectFeature />
        <AccountObjectFeature />
        <UnqualifiedObjectFeature />
        <QualifiedObjectFeature />
        <AppointmentObjectFeature />
        <OrderObjectFeature/>
    </>
}