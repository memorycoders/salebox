import React from 'react';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import { RESOURCE_PERIOD_TYPE } from '../../../Constants';
import style from './style.css';
import _l from 'lib/i18n';
export const FilterTypeReport = ({
    setParamsReportResource,
    resourceReport,
}) => {
    return (
        <div className={style.iconFilterContainer}>
            <Popup trigger={<div className={style.iconFilter}></div>}
                flowing
                hoverable
                style={{padding: 0}}
                position="bottom right">
                <Menu vertical>
                    <Menu.Item onClick={() => { setParamsReportResource('periodType', RESOURCE_PERIOD_TYPE.WEEK) }}>{_l`Week`}  {resourceReport?.periodType ===  RESOURCE_PERIOD_TYPE.WEEK ? <Icon name="check"/> : null } </Menu.Item>
                    <Menu.Item onClick={() => { setParamsReportResource('periodType', RESOURCE_PERIOD_TYPE.MONTH) }}>{_l`Month`} {resourceReport?.periodType === RESOURCE_PERIOD_TYPE.MONTH ? <Icon name="check"/> : null }</Menu.Item>
                </Menu>
            </Popup>

        </div>
    )
}
