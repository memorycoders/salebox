import React from 'react';
import { Grid, GridColumn, GridRow, Icon } from 'semantic-ui-react';
import addIcon from '../../../../public/Add.svg';
import styles from './Competence.css';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { sortCompetenceList } from '../resources.actions';

const CompetenceHeader = ({ addCompetenceItem, valueSortedCompetenceList, sortCompetenceList }) => {
  return (
    <div className="competenceHeader">
      <div className={styles.title}>
        <h4>{_l`Competences`}</h4>
        {/* <img onClick={addCompetenceItem} src={addIcon} style={{height: "15px"}}/> */}
        <img src={addIcon} onClick={addCompetenceItem} style={{ height: '24px' }} />
      </div>
      <Grid>
        <GridRow>
          <GridColumn style={{ cursor: 'pointer' }} width={2} onClick={() => sortCompetenceList('level')}>
            {_l`Level`}
            {valueSortedCompetenceList === 'level' && <Icon name="angle down" />}
          </GridColumn>
          <GridColumn style={{ cursor: 'pointer' }} width={6} onClick={() => sortCompetenceList('competence')}>
            {_l`Competence`}
            {valueSortedCompetenceList === 'competence' && <Icon name="angle down" />}
          </GridColumn>
          <GridColumn style={{ cursor: 'pointer' }} width={4} onClick={() => sortCompetenceList('lastUsed')}>
            {_l`Last used`}
            {valueSortedCompetenceList === 'lastUsed' && <Icon name="angle down" />}
          </GridColumn>
          <GridColumn width={4}></GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  valueSortedCompetenceList: state.entities?.resources?.valueSortedCompetenceList,
});
const mapDispatchToProps = {
  sortCompetenceList,
};
export default connect(mapStateToProps, mapDispatchToProps)(CompetenceHeader);
