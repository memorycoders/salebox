import React from 'react';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';

const TableCsv = ({ data }) => {
  console.log('data', data)
  return (
    <Table compact celled padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Row</Table.HeaderCell>
          {_.map(data[0], (el, index) => {
            console.log('el', el);
            return <Table.HeaderCell key={index}>{el}</Table.HeaderCell>;
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {_.map(data, (el, index) => {
          console.log('index', index);
          if (index > 0) {
            return (
              <Table.Row key={index}>
                <Table.Cell>{index}</Table.Cell>
                {_.map(el, (t, i) => {
                  return <Table.Cell key={i}>{t}</Table.Cell>;
                })}
              </Table.Row>
            );
          }
        })}
      </Table.Body>
    </Table>
  );
};
export default TableCsv;
