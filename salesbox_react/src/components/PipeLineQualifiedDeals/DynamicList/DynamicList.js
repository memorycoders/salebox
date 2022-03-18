import React, { Component } from 'react';
import {  List } from 'react-virtualized';
import { DynamicHeader, DynamicItem, DynamicTotalItem } from './DynamicElement';
import { NoResults } from 'components';

export class DynamicList extends Component {

  rowRenderer = ({ index,
    key,
    style,
    parent }) => {
    const { list, overviewType, salesProcessId } = this.props;
    return <DynamicItem
      style={style}
      salesProcessId={salesProcessId}
      overviewType={overviewType}
      labels={this.getLabels()}
      width={this.props.width}
      item={list[index]}/>

  }

  getLabels = ()=>{
    const { salesMethodUsing } = this.props;
    if (!salesMethodUsing){
      return [];
    }
    const { activityDTOList = [] } = salesMethodUsing.find(value => value.isActive) || {};
    return activityDTOList.map(value => {
      return {
        name: value.name,
        activityId: value.uuid,
        progress: value.progress ? value.progress: 0,
        description: value.description,
        discProfile: value.discProfile
      };
    })
  }

  getTotalData =()=>{
    const { salesMethodUsing, list } = this.props;
    if (!salesMethodUsing) {
      return {
        grossValue: 0
      };
    }

    let totalNetValue = 0;
    (list ? list : []).forEach(item => {
      totalNetValue += item.grossValue * item.prospectProgress/100;
    })
    const { grossValue } = salesMethodUsing.find(value => value.isActive) || {};

    return {
      grossValue,
      totalNetValue
    }
  }


  render() {
    const { width, list, height, registerChild, onRowsRendered, salesProcessId } = this.props;
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return (
      <div className="dynamic">
        <DynamicHeader salesProcessId={salesProcessId} labels={this.getLabels()} width={width}/>
        <DynamicTotalItem item={this.getTotalData()} labels={this.getLabels()} width={width} />
        {(!list || list.length === 0) && <div style={{ width, height }} className='no-result'>
          <NoResults />
        </div>}
        {list && list.length > 0 && (
          <List
            width={width > 650 ? width : 650}
            rowHeight={60}
            rowCount={list.length}
            height={hasDetail ? height - 25 :height}
            className="dynamic-list"
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowRenderer={this.rowRenderer}
            threshold={300}
            data={list}
          />
        )}
      </div>
    )
  }
}
