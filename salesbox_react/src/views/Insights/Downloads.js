// @flow
import React, { useState, useEffect } from 'react';
import { lifecycle, compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { ExcelDownload } from '../../components/Insight/Download/ExcelDownload';
import { excelDataRequest } from '../../components/Insight/insight.actions'

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

const style ={
  width: '100%', 
  padding: '0px 10px 50px 0px', 
  overflow: 'auto', 
  display: 'flex', 
  flexDirection: 'column',
  // alignItems: 'center',

}

const Downloads = ({ excelData }) => {

  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([])
  useEffect(() => {

    if (excelData) {
      try {
      ExcelRenderer(excelData, (err, resp) => {
        if (err) {
          // console.log('restipoens1', err);
        }
        else {
          console.log('restipoens1', resp.rows, resp.cols);
          setRows(resp.rows)
          setCols(resp.cols)
        }
      });
      }catch(ex) {}
    }
  }, [excelData])



  return <div style={style}>
    <OutTable
      data={rows}
      columns={cols}
      tableClassName="ExcelTable2007" 
      tableHeaderRowClass="heading" />
  </div>;
};

const mapDispatchToProps = {
  requestFetchData: excelDataRequest
};

const mapStateToProps = (state) => {
  const { entities } = state;
  return {
    excelData: entities.insight.excelData,
    roleType: state.ui.app,
    activeRole: state.ui.app.activeRole,
    userId: state.auth.userId,
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      this.props.requestFetchData('FORECAST_OVERVIEW-ES');
    },
    // componentWillReceiveProps(nextProps) {
    //   const { activeRole, roleType, userId } = this.props;
    //   if (nextProps.activeRole !== activeRole || nextProps.userId !== userId) {
    //     if (location.pathname === '/insights/downloads') {
    //       this.props.requestFetchData('FORECAST_OVERVIEW-ES');
    //     }
    //   }
    // }
  })
)(Downloads);
