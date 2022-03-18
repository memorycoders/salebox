import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid, GridRow, GridColumn } from 'semantic-ui-react';
import RightContentCv from './CV/RightContentCv';
import RightContentExperiences from './Experiences/RightContentExperiences';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { setOverviewType } from 'components/Common/common.actions'
import { OverviewTypes } from '../../../Constants';

export const ResourceDetail = ({ match, setOverviewType }) => {
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    setOverviewType(OverviewTypes.Resource)
  }, [])
  return (
    <>
      <Grid>
        <GridRow columns={2} divided>
          <GridColumn width={8} style={{ paddingRight: 0 }}>
            <LeftContent setTabIndex={setTabIndex} match={match} tabIndex={tabIndex}/>
          </GridColumn>
          <GridColumn width={8}>
            {tabIndex === 0 && <RightContent match={match} />}
            {tabIndex === 1 && <RightContentExperiences />}
            {tabIndex === 2 && <RightContentCv />}
          </GridColumn>
        </GridRow>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setOverviewType: setOverviewType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceDetail);
