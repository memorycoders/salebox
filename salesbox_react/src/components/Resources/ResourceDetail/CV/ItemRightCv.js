import React, { Fragment, memo, useCallback } from 'react';
import { Label, Grid, GridColumn, GridRow, Icon, TextArea, Form, Button, Popup } from 'semantic-ui-react';
import css from './Cv.css';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import * as ResourcesActionsTypes from '../../resources.actions';

const ItemRightCv = ({ item, updateExperienceCv }: any) => {
  const handleFavorite = useCallback(() => {
    updateExperienceCv({ ...item, reference: !item.reference });
  }, [item, updateExperienceCv]);

  const handleView = useCallback(() => {
    updateExperienceCv({ ...item, checked: !item.checked });
  }, [item, updateExperienceCv]);

  return (
    <Fragment>
      <Grid>
        <GridRow className={css.rowItem}>
          <GridColumn width={3}>
            <span style={{ fontWeight: 'bold' }}>{item.title}</span>
          </GridColumn>
          <GridColumn width={3}>{item.company}</GridColumn>
          <GridColumn width={1}>{item.occupancy}%</GridColumn>
          <GridColumn width={6} style={{ textAlign: 'right' }}>
            {moment(item.startDate).format('DD MMM YYYY')} - {item.endDate ? moment(item.endDate).format('DD MMM YYYY') : _l`Current`}
            {
              item.location && ` | ${item.location}`
            }
          </GridColumn>
        </GridRow>

        <GridRow className={css.rowItem}>
          <GridColumn width={13}>
            <Form style={{ width: '100%', marginBottom: 5 }}>
              <TextArea value={item.description || ''} readOnly className={css.description} rows={4} />
            </Form>
          </GridColumn>
          <GridColumn verticalAlign="middle" width={3}>
            <div className="actions" style={{ display: 'flex' }}>
              <Popup
                trigger={
                  <Button
                    onClick={handleFavorite}
                    circular
                    compact
                    size="mini"
                    className={item.reference ? css.starButtonActive : css.starButton}
                  >
                    <div className={css.star}></div>
                  </Button>
                }
                hoverable
                content={{ content: <p style={{ fontSize: 11 }}>{_l`Mark as highlighted reference experience`}</p> }}
              />

              <Popup
                trigger={
                  <div className={css.iconList}>
                    <Icon name="list ul" color="grey" className={css.iconItem} />
                  </div>
                }
                hoverable
                content={{ content: <p style={{ fontSize: 11 }}>{_l`Drag & Drop`}</p> }}
              />

              <Popup
                trigger={
                  <div onClick={handleView} className={item.checked ? css.iconEyeCheck : css.iconEyeUnCheck}>
                    <Icon name="eye" style={{ color: '#fff' }} className={css.iconItem} />
                  </div>
                }
                hoverable
                content={{
                  content: (
                    <p style={{ fontSize: 11 }}>
                      {item.checked ? _l`Experience is included in CV` : _l`Experience is excluded from CV`}
                    </p>
                  ),
                }}
              />
            </div>
          </GridColumn>
        </GridRow>

        <GridRow columns={10} className={css.rowTag}>
          <GridColumn width={13}>
            <div className={css.listTag}>
              {item.competenceDTOList.map((item, index) => (
                <Label key={index} className={css.detailTagLabel} style={{height:20, paddingTop: 4}}>
                  {item.competenceName}
                </Label>
              ))}
            </div>
          </GridColumn>
        </GridRow>

        <GridRow className={css.rowItem}>
          <GridColumn width={16}>
            <div style={{ width: '100%', height: 0.5, backgroundColor: '#d6d6d6', marginTop: 0 }} />
          </GridColumn>
        </GridRow>
      </Grid>
    </Fragment>
  );
};

export default compose(
  memo,
  connect(null, { updateExperienceCv: ResourcesActionsTypes.updateExperienceCv })
)(ItemRightCv);
