import React from 'react';
import css from './ExcelDownload.css';
import { Table, Button, Icon } from 'semantic-ui-react';

const EmptyRow = ()=> {
  return <Table.Row>
    {Array.from(Array(Number(14)).keys()).map(value => {
      return <Table.Cell className={css.cell}>
      </Table.Cell>
    })}
  </Table.Row>
}

export const ExcelDownload = ({ data, excelData }) => {
  const miscellaneousData = [
    ['Revenue target', '0.0', 'Profit target', '0.00', 'Gross Pipeline', '704,84', 'Pipeline progress', '29.03%', '', '', '', '', '', ''],
    ['Revenue forecast', '0.0', 'Profit forecast', '0.00', 'Weighted pipe', '704,84', 'Win Ratio', '82.93%', '', '', '', '', '', ''],
    ['Revenue closed', '0.0', 'Profit closed', '0.00', 'Sales gap', '704,84', 'Book to bill', '1.17', '', '', '', '', '', ''],
    ['Sales target', '0.0', 'Margin target', '0.00', 'Missing qualified deal', '704,84', 'Median deal time', '29.03%', '', '', '', '', '', ''],
    ['Sales forecast', '0.0', 'Margin forecast', '0.00', 'Prioritized opportuniti', '704,84', 'Median deal size', '29.03%', '', '', '', '', '', ''],
    ['Sales closed', '0.0', 'Margin closed', '0.00', 'Appointment left', '704,84', 'Median profit', '29.03%', '', '', '', '', '', ''],
    ['', '', '', '', '', '', 'Median margin', '29.03%', '', '', '', '', '', '']
  ]

  const yearData = [
    ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEV', 'TOTAL'],
    ['Sales forecast', '0.0', '1', '0.00', '1', '704,84', '1', '29.03%', '1', '1', '1', '1', '1', '1'],
    ['Revenue forecast', '0.0', '1', '0.00', '1', '704,84', '1', '82.93%', '1', '1', '1', '1', '1', '1'],
    ['Revenue closed', '0.0', '1', '0.00', '1', '704,84', '1', '1.17', '1', '1', '1', '1', '1', '1'],
    ['Profit forecast', '0.0', '1', '0.00', '1', '704,84', '1', '29.03%', '1', '1', '1', '1', '1', '1'],
   
    ['Margin', '0.0', '1', '0.00', '1', '704,84', '1', '1.17', '1', '1', '1', '1', '1', '1'],
    ['Growth', '0.0', '1', '0.00', '1', '704,84', '1', '29.03%', '1', '1', '1', '1', '1', '1'],
  ]

  return <Table className={css.table}>
    <Table.Header>
      <Table.Row>
        {Array.from(Array(Number(4)).keys()).map((value, index) => {
          return <Table.Cell colSpan={index === 0 ? 11 : 1} className={`${css.cell} ${css.rowFirst}`}>
            {value === 0 ? <>
              <span className={css.bold}> Forecast overview</span> Business Acc Inc 01 Jan - 31 Dec 2020
            </> : ''}
          </Table.Cell>
        })}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <EmptyRow/>
      <EmptyRow/>
      <Table.Row>
        {Array.from(Array(Number(14)).keys()).map((value, index) => {
          return <Table.Cell className={`${css.cell} ${index === 0 && css.bold}`}>
            {value === 0 ? 'MISCELLANEOUS' : ''}
          </Table.Cell>
        })}
      </Table.Row>
      <EmptyRow/>
      {miscellaneousData.map(row => {
        return <Table.Row>
          {row.map((value, index) => {
            return <Table.Cell key={index} className={`${css.cell} ${index %2 === 0 && css.bold}`}>
              {value}
            </Table.Cell>
          })}
        </Table.Row>
        
      })}
      <EmptyRow/>
      <EmptyRow/>
      <Table.Row>
        {Array.from(Array(Number(11)).keys()).map((value, index) => {
          return <Table.Cell colSpan={index === 0 ? 4 : 1} className={`${css.cell} ${index=== 0 && css.bold}`}>
            {value === 0 ? 'ACCRUAL FORECAST FOR REVENUE/SALE/PROFIT/MARGIN' : ''}
          </Table.Cell>
        })}
      </Table.Row>
      <EmptyRow />
      <EmptyRow />
      {yearData.map((row, idx) => {
        return <Table.Row>
          {row.map((value, index) => {
            return <Table.Cell key={index} className={`${css.cell} ${(idx === 0 || index === 0) && css.bold}`}>
              {value}
            </Table.Cell>
          })}
        </Table.Row>

      })}
    </Table.Body>
  </Table>
}