//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import InsightPane from '../InsightPane/InsightPane';
import css from './UpcomingPane.css';
import taskIcon from '../../../../public/Tasks.svg';
import contactIcon from '../../../../public/Contacts.svg';
import unqualifiedIcon from '../../../../public/Unqualified_deals.svg';
import qualifiedIcon from '../../../../public/Qualified_deals.svg';
import accountIcon from '../../../../public/Accounts.svg';
import appointmentIcon from '../../../../public/Appointments.svg';
import documentSvg from '../../../../public/Documents.svg';
import photoSvg from '../../../../public/Photos.svg';
import wonIcon from '../../../../public/star_circle_won_active.svg'
import lostIcon from '../../../../public/star_circle_lost_active.svg'
import contactAvatar from '../../../../public/Contacts.svg';
import accountAvatar from '../../../../public/Accounts.svg'
import actionPlanSvg from '../../../../public/action_plan.svg';
import callAdd from '../../../../public/Call lists.svg';
import noAvatar from '../../../../public/square-image.png'

const getIcon = (style) => {
    switch (style) {
        case 'ADD_TO_OBJECT_USER_LIST':
            return accountIcon
        case 'TASK':
            returntaskIcon
        case 'APPOINTMENT':
            return appointmentIcon
        case 'LEAD':
            return unqualifiedIcon
        case 'OPPORTUNITY':
        case 'ADD_OPPORTUNITY':
            return qualifiedIcon
        case 'VIEW_DETAILS':
            return contactIcon
        case 'DOCUMENT':
            return documentSvg
        case 'PHOTO':
            return photoSvg
        case 'WON_OPPORTUNITY':
            return wonIcon
        case 'LOST_OPPORTUNITY':
            return lostIcon
        case 'PROGRESS':
            return actionPlanSvg
        case 'FACE_TIME':
            return callAdd

        default:
            return taskIcon
    }
};

type PropsT = {
    data: {},
};

addTranslations({
    'en-US': {
        Upcoming: 'Upcoming',
    },
});


const UpcomingPane = ({ data }: PropsT) => {
    return (
        <InsightPane padded title={_l`Upcoming`}>
            <div className={css.progress}>

            </div>
        </InsightPane>
    );
};

export default UpcomingPane;
