import React, { useState } from 'react';
import { Menu, Popup } from 'semantic-ui-react';
import style from './style.css';
import _l from 'lib/i18n';
import { OverviewTypes, RESOURCE_PERIOD_TYPE } from '../../../Constants';
import { connect } from 'react-redux';
import { setAddDealResource, setResourceReportId } from '../../../components/Resources/resources.actions';
import { setActionForHighlight } from '../../../components/Overview/overview.actions';
const ResourceName = ({item, resourceReportDatas, history, setAddDealResource, setActionForHighlight, setResourceReportId}) => {
    
		const [isOpenPopup, setOpenPopup] = useState(false);
		const [isHover, setHover] = useState(true);
		const goToResource = (item) => {
			history.push(`/resources/${item.resourceId}`);
		}
		const addDeal = (item) => {
			setResourceReportId(item.resourceId)
			setAddDealResource(true);
			setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
		}
		const handleHover = (status) => {
            if(!isHover) return;
			setOpenPopup(status)
		}
		const handleClickName = () => {
			setHover(false);
			setOpenPopup(true);
		}
		
		const addOrder = () => {
			setResourceReportId(item.resourceId)
			setAddDealResource(true);
			setActionForHighlight(OverviewTypes.Order, 'create');
		}
        
        const handleMoveLeaveMenu = () => {
            setHover(true);
            setOpenPopup(false)
        }
		return (
		<Popup
            open={isOpenPopup}
            flowing
            hoverable
			style={{padding: 0}}
			offset={[0, -10]}
			trigger={
				<div 
				onClick={handleClickName}
				className={`${style.rsr_week_first_body}  ${resourceReportDatas?.periodType === RESOURCE_PERIOD_TYPE.MONTH ? style.rsr_month : ''} ${style.rsr_text}`}><span onMouseEnter={() => {handleHover(true)}} onMouseLeave={() => {handleHover(false)}}>{item.resourceName}</span></div>
			}>
			{
				isHover ? <p className={style.popup}>{item.resourceName}</p> :
				(
					<Menu  vertical color="teal" onMouseLeave={handleMoveLeaveMenu}>
						<Menu.Item onClick={() => {goToResource(item)}}>
							{_l`Go to profile`}
						</Menu.Item>
						<Menu.Item onClick={() => { addDeal(item) }}>
							{_l`Add deal`}
						</Menu.Item>
						<Menu.Item onClick={() => { addOrder(item) }}>
							{_l`Add order`}
						</Menu.Item>
					</Menu>
				)
			}
			
		</Popup>
		)
    }
    
export default connect(null, {
	setAddDealResource: setAddDealResource,
	setActionForHighlight: setActionForHighlight,
	setResourceReportId: setResourceReportId
})(ResourceName);