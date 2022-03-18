import React from 'react';
import { Dropdown, Grid, GridColumn, GridRow, Icon, Button, Popup } from 'semantic-ui-react';
import { RESOURCE_TAB } from '../../../Constants';
import styles from './Competence.css';
import css from './Experiences/Experiences.css';
import _l from 'lib/i18n';

const Competence = ({
  item,
  lastUsedOption,
  deleteCompetenceItem,
  index,
  levelOptions,
  conpetencesName,
  updateSingleCompetence,
  resourceId,
  tab,
}: any) => {
  const handleDeleteCompetenceItem = () => {
    deleteCompetenceItem && deleteCompetenceItem(index);
  };
  const handleChangeDropdown = (key, data) => {
    item[key] = data.value;
    updateSingleCompetence && updateSingleCompetence([item], resourceId);
  };
  return (
    <div className={styles.competenceItem} key={index}>
      <Grid>
        <GridRow>
          <GridColumn width={2} className={styles.clearPaddingRight}>
            <Dropdown
              placeholder="Level"
              value={item.competenceLevel}
              onChange={(e, val) => {
                handleChangeDropdown('competenceLevel', val);
              }}
              fluid
              selection
              search
              options={levelOptions}
            />
          </GridColumn>
          <GridColumn width={tab === RESOURCE_TAB.CV ? 6 : 6} className={styles.clearPaddingRight}>
            <Dropdown
              placeholder="Select competence"
              value={item.competenceId}
              onChange={(e, val) => {
                handleChangeDropdown('competenceId', val);
              }}
              search
              fluid
              selection
              options={conpetencesName}
            />
          </GridColumn>
          <GridColumn width={5} className={styles.clearPaddingRight}>
            <Dropdown
              placeholder="Select last used"
              search
              fluid
              selection
              options={lastUsedOption}
              onChange={(e, val) => {
                handleChangeDropdown('lastUsed', val);
              }}
              value={item.lastUsed}
            />
          </GridColumn>
          <GridColumn width={3}>
            {tab === RESOURCE_TAB.CV ? (
              <>
                <Icon name="check" circular color="grey" className={css.iconListItem} />
              </>
            ) : (
              <div className="actions" style={{ display: 'flex' }}>
                {/* <Icon circular className={styles.action} color="grey" name="list ul"></Icon>
                <Icon circular className={styles.action} color="grey" name="close" onClick={handleDeleteCompetenceItem}></Icon> */}

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
                      icon="close"
                      size="mini"
                      onClick={handleDeleteCompetenceItem}
                      circular
                      compact
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  }
                  hoverable
                  content={{ content: <p style={{ fontSize: 11 }}>{_l`Delete`}</p> }}
                />
              </div>
            )}
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
};

export default Competence;
