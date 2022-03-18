/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import _l from 'lib/i18n';
import Papa from 'papaparse';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import cx from 'classnames';
import css from 'components/Collapsible/Collapsible.css';
import { setOverviewType } from 'components/Common/common.actions';
import localCss from './style.css';
import TableCsv from './Table';
import ColumnMap from './ColumnMap';

const ImportFile = (props) => {
  const [imported, setImported] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [temCsvData, setTemCsvData] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setOverviewType('IMPORT_CSV');
  }, []);
  const onDrop = (acceptedFiles) => {
    props.setLoading(true)
    if (!acceptedFiles) return false;
    setFileName(acceptedFiles[0].name);
    Papa.parse(acceptedFiles[0], {
      encoding: 'utf-8',
      // encoding: 'ISO-8859-1',
      // encoding: 'UTF-8',
      complete: (results) => {
        console.log('results', results);
        // update ui
        props.setProcessing(true);
        // processing file ccsv
        const csv = [];
        const tempCsv = [];
        const data = results.data;
        // remove blank
        for (let i = 0; i < data.length; i++) {
          let willAdd = false;
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] && data[i][j].length > 0) {
              willAdd = true;
              break;
            }
          }

          if (willAdd) {
            csv.push(data[i]);
            if (tempCsv.length < 4) {
              tempCsv.push(data[i]);
            }
          }
        }

        if (csv.length > 2001) {
          props.putError('The row limit for import is 2000. Please reduce your import data size');
          return false;
        }
        props.setLoading(false)
        setCsvData(csv);
        setTemCsvData(tempCsv);
        setImported(true);
      },
    });
  };

  const importedDone = () => {
    setImported(false);
    setCsvData([]);
    setTemCsvData([]);
    setFileName('');
    props.setProcessing(false);
  };
  return (
      <>
      <div style={{ minWidth: 'unset' }} className={cx(css.collapsible, css.margin)}>
        <div className={cx(css.container, css.closed)} style={{ borderRadius: '2px' }}>
          <div className={cx(css.wrapper, css.padded)}>
            {!imported && (
              <Dropzone
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.ms-excel.sheet.macroEnabled.12"
                onDrop={onDrop}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={localCss.photoDrag} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <strong>{_l`Drop your .CSV file here`}</strong>
                  </div>
                )}
              </Dropzone>
            )}
            {imported && <TableCsv data={temCsvData} />}
            {/* {imported && <ColumnMap csvData={csvData} fileName={fileName} importedDone={importedDone} />} */}
          </div>
        </div>
      </div>

      {imported && (
        <div style={{ minWidth: 'unset' }} className={cx(css.collapsible, css.margin)} style={{ marginTop: '20px' }}>
          <div className={cx(css.container, css.closed)} style={{ borderRadius: '2px' }}>
            <div className={cx(css.wrapper, css.padded)}>
              <ColumnMap csvData={csvData} fileName={fileName} importedDone={importedDone} />
            </div>
          </div>
        </div>
      )}
      </>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  setOverviewType,
})(ImportFile);
