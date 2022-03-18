import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import SaleProcess from '../../components/CompanySettings/DefaultValues/SaleProcess';
import DataWork from '../../components/CompanySettings/DefaultValues/DataWork';
import Account from '../../components/CompanySettings/DefaultValues/Account';
import Activity from '../../components/CompanySettings/DefaultValues/Activity';
import MultiRelations from '../../components/CompanySettings/DefaultValues/MultiRelations';
import RelationMode from '../../components/CompanySettings/DefaultValues/RelationMode';
import AccountAndContactType from "../../components/CompanySettings/DefaultValues/AccountAndContactType";
// import  CompetenceLevel  from '../../components/CompanySettings/DefaultValues/CompetenceLevel';

const DefaultValues = () => {
  return (
    <div style={{ padding: '0px 10px', marginTop: '10px' }}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <SaleProcess />
          </Grid.Column>
          <Grid.Column width={6}>
            <DataWork />
            <br/>
            {/* <CompetenceLevel/> */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column >
             {/*<Account />*/}
             <AccountAndContactType type={'TYPE'}/>
          </Grid.Column>
          <Grid.Column >
             <Activity type={'CATEGORY'}/>
          </Grid.Column>
          <Grid.Column >
             <MultiRelations objectType={'ACCOUNT'}/>
          </Grid.Column>
          {/*<Grid.Column >*/}
             {/*<RelationMode />*/}
          {/*</Grid.Column>*/}
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column >
            <AccountAndContactType type={'CONTACT_RELATIONSHIP'}/>
          </Grid.Column>
          <Grid.Column >
            <Activity type={'FOCUS'}/>
          </Grid.Column>
          <Grid.Column>
            <MultiRelations objectType={'CONTACT'}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default DefaultValues;
