import React, { memo, useCallback } from 'react';
import { Grid, GridColumn, GridRow, Input } from 'semantic-ui-react';
import styles from './Competence.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import * as ResourcesActionsTypes from '../resources.actions';
import _l from 'lib/i18n';

const CompetenceExperiences = ({ item, checked, updateCompetenceDTOListExperience, onClick }: any) => {
  const handleUpdate = useCallback(() => {
    onClick ? onClick(item) : updateCompetenceDTOListExperience(item);
  }, [updateCompetenceDTOListExperience, item, onClick]);

  return (
    <div className={styles.competenceItem}>
      <Grid>
        <GridRow style={{ paddingRight: 15 }}>
          <GridColumn width={2} className={styles.clearPaddingRight}>
            <Input placeholder={_l`Level`} readOnly fluid value={item.competenceLevel} />
          </GridColumn>
          <GridColumn width={8} className={styles.clearPaddingRight}>
            <Input placeholder={_l`Select competence`} readOnly fluid value={item.competenceName} />
          </GridColumn>
          <GridColumn width={5} className={styles.clearPaddingRight}>
            <Input placeholder={_l`Select last used`} readOnly fluid value={item.lastUsed} />
          </GridColumn>
          <GridColumn verticalAlign="middle" width={1}>
            <div
              onClick={handleUpdate}
              className={checked ? styles.circleButtonTaskDetailCheck : styles.circleButtonTaskDetail}
            >
              <img
                className={styles.detailIconSize}
                src={checked ? require('../../../../public/CheckHistory.svg') : require('../../../../public/Check.svg')}
              />
            </div>
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
};

export default compose(
  memo,
  connect(null, { updateCompetenceDTOListExperience: ResourcesActionsTypes.updateCompetenceDTOListExperience })
)(CompetenceExperiences);
