/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import moment from 'moment';
import { Grid, Dropdown } from 'semantic-ui-react';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import { Endpoints } from '../../../../Constants';
import api from '../../../../lib/apiClient';
import css from '../BillingModal/style.css';
import iconPdf from '../../../../../public/icon_pdf.png';

const InvoiceModal = (props) => {
  const [year, setYear] = useState(moment().year());
  const [invoices, setInvoices] = useState([]);
/*  const yearList = [
    {
      key: moment().year() - 1,
      value: moment().year() - 1,
      text: moment().year() - 1,
    },
    {
      key: moment().year(),
      value: moment().year(),
      text: moment().year(),
    },
    {
      key: moment().year() + 1,
      value: moment().year() + 1,
      text: moment().year() + 1,
    },
    {
      key: moment().year() + 2,
      value: moment().year() + 2,
      text: moment().year() + 2,
    },
    {
      key: moment().year() + 3,
      value: moment().year() + 3,
      text: moment().year() + 3,
    },
  ];*/
  let yearList=[];
  for(let i=9;i>=0;i--){
    yearList.push({
      key: moment().year() - i,
      value: moment().year() - i,
      text: moment().year() - i,
    })
  }

  useEffect(() => {
    fetchData();
  }, [year, props.visible]);

  const fetchData = async () => {
    if (!props.visible) return false;
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/invoice/listByYear`,
        query: {
          year,
        },
      });
      if (res) {
        setInvoices(res.invoiceDTOList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (url) => {
    window.open(url);
  };

  return (
    <ModalCommon
      title={_l`Invoices`}
      visible={props.visible}
      okHidden={true}
      scrolling={false}
      description={false}
      onClose={props.onClose}
      paddingAsHeader
      size={'small'}
      className={css.modalRecept}
    >
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              selection
              options={yearList}
              value={year}
              onChange={(e, { value }) => setYear(value)}
              className={'position-clear'}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Grid columns={4}>
        <Grid.Row>
          {invoices.map((invoice, index) => {
            return (
              <Grid.Column key={index}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => handleClick(invoice.url)}
                >
                  <img src={iconPdf} width={75} height={75} />
                  <span style={{ marginTop: '5px' }}>{moment(invoice.invoiceDate).format('DD MMM YYYY')}</span>
                </div>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </ModalCommon>
  );
};
export default InvoiceModal;
