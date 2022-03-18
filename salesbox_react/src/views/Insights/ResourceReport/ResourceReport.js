import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Popup } from "semantic-ui-react";
import { getReportResource } from "../../../components/Insight/insight.actions";
import { RESOURCE_PERIOD_TYPE } from "../../../Constants";
import style from './style.css';
import _l from 'lib/i18n';
import moment from 'moment';
import ResourceName from "./ResourceName";

const ResourceReport = ({
	getReportResource,
	resourceReportDatas,
	history
}) => {
	const weeks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
		18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
		35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]

	useEffect(() => {
		getReportResource();
	}, [])


	const getClass = (val) => {
		switch(val) {
			case 'RED':
				return 'rsr_red'
			case 'YELLOW':
				return 'rsr_yellow'
			case 'GREEN':
				return 'rsr_green'
		}
	}
	const renderTitle = () => {
		if(resourceReportDatas?.periodType === RESOURCE_PERIOD_TYPE.MONTH) {
			return (
				months.map((item) => {
					return (
						<div className={`${style.rsr_week} ${style.rsr_font_bold}`} key={`week-${item}`}>{_l.call(this, [item])}</div>
					)
				})
			)
		} else {
			return (
				resourceReportDatas?.reportDTOList?.[0]?.resourceReportCellDTOList.map((item, index) => {
					return (
						<div className={`${style.rsr_week} ${style.rsr_font_bold}`} key={`week-${index}`}>{index + 1}</div>
					)
				})
			)
		}
	}
	const renderData = (item) => {
		return (
			item.map((val, indexVal) => {
				return (
					<>
					{ val?.orderRowLiteDTOList?.length > 0 ?
						<Popup trigger={
							<div className={`${style.rsr_week} ${style[getClass(val.color)]}`} key={`body-week-${indexVal}`}>{val.occupied}</div>
						}
						>
							{val?.orderRowLiteDTOList.map((order, index) => {
								return (
									<p className={style.popup} key={`popup-index-${index}`}>
										<b>{order.companyName}</b> : { `${_l`${moment(order.startDate).format('DD MMM')}:t(d) - ${moment(order.endDate).format('DD MMM, YYYY')}:t(d)`}` } <span style={{whiteSpace: "nowrap"}}>{`(${order.occupied}%)`}</span>
									</p>
								)
							})}
						</Popup>
					:
						<div className={`${style.rsr_week} ${style[getClass(val.color)]}`} key={`body-week-${indexVal}`}>{val.occupied}</div>
					}

					</>
				)
			})
		)
	}

	return (
		<div className={style.rsr_container}>
			<div className={style.rsr_title}>
				<div className={`${style.rsr_week_first} ${resourceReportDatas?.periodType === RESOURCE_PERIOD_TYPE.MONTH ? style.rsr_month : ''}`}> </div>
				{renderTitle()}
			</div>
			<div className={style.rsr_body}>
				{
					resourceReportDatas?.reportDTOList?.map((item, index) => {
						return (
							<div className={style.rsr_title} key={`body-${index}`}>
							<ResourceName item={item} resourceReportDatas={resourceReportDatas} history={history}/>
							{renderData(item?.resourceReportCellDTOList)}
						</div>
						)
					})
				}
			</div>
		</div>
	)
};

export default connect((state) => {
	return {
		resourceReport: state?.entities?.insight?.resourceReport,
		resourceReportDatas: state?.entities?.insight?.resourceReportDatas
	}
}, {
	getReportResource: getReportResource,
})(ResourceReport);
