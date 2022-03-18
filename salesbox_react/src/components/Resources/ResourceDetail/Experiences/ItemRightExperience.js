import React, { Fragment, memo, useCallback, useState } from 'react';
import { Label, Grid, GridColumn, GridRow, Icon, TextArea, Form, Button, Popup } from 'semantic-ui-react';
import css from './Experiences.css';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import * as ResourcesActionsTypes from '../../resources.actions';
import _l from 'lib/i18n';
import ModalCommon from '../../../ModalCommon/ModalCommon';

const ItemRightExperience = ({ item, setUpdateExperience, removeItemExperience, tab }: any) => {
  const [visibleDeleteTag, setvisibleDeleteTag] = useState(false);

  const handleDoneRemoveTag = useCallback(() => {
    removeItemExperience(item.uuid);
    setvisibleDeleteTag(false);
  }, [removeItemExperience, item]);

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
              {/* <Icon circular className={css.action} color="grey" name="list ul" /> */}
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
                  <Button
                    style={{ backgroundColor: '#f0f0f0' }}
                    icon={<img src={require('../../../../../public/Edit.svg')} height={11} />}
                    size="mini"
                    className={css.deleteButton}
                    onClick={() => setUpdateExperience(item)}
                    circular
                    compact
                  />
                }
                hoverable
                content={{ content: <p style={{ fontSize: 11 }}>{_l`Update`}</p> }}
              />

              <Popup
                trigger={
                  <Button
                    style={{ backgroundColor: '#f0f0f0' }}
                    icon="close"
                    size="mini"
                    className={css.deleteButton}
                    onClick={() => setvisibleDeleteTag(true)}
                    circular
                    compact
                  />
                }
                hoverable
                content={{ content: <p style={{ fontSize: 11 }}>{_l`Delete`}</p> }}
              />
            </div>
          </GridColumn>
        </GridRow>

        <GridRow columns={10} className={css.rowTag}>
          <GridColumn width={13}>
            <div className={css.listTag}>
              {item.competenceDTOList.map((item, index) => (
                <Label key={index} className={css.detailTagLabel} style={{ height: 20, paddingTop: 4 }}>
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

      <ModalCommon
        title={_l`Confirm`}
        size="tiny"
        visible={visibleDeleteTag}
        onClose={() => setvisibleDeleteTag(false)}
        onDone={handleDoneRemoveTag}
      >
        <p>{_l`This experiences will be removed?`}</p>
      </ModalCommon>
    </Fragment>
  );
};

export default compose(
  memo,
  connect(null, {
    setUpdateExperience: ResourcesActionsTypes.setUpdateExperience,
    removeItemExperience: ResourcesActionsTypes.removeItemExperience,
  })
)(ItemRightExperience);
