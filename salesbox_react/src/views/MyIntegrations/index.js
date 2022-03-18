import * as React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import ImportContacts from '../../components/MyIntegrations/ImportContacts';
import Addons from '../../components/MyIntegrations/Addons';
import CompanyIntegrations from '../../components/MyIntegrations/CompanyIntegrations';
import api from '../../lib/apiClient';
import { popupWindow } from '../../Constants';
import { connect } from 'react-redux';
import { getUser } from '../../components/Auth/auth.selector';

const MyIntegrations = ({ user }) => {
  const [userStorageIntegrationDTOList, setUserStorageIntegrationDTOList] = React.useState([]);
  React.useEffect(() => {
    listPersonalStorage();
  }, []);
  const listPersonalStorage = async () => {
    try {
      const res = await api.get({
        resource: 'enterprise-v3.0/storage/listPersonalStorage',
      });
      if (res && res.userStorageIntegrationDTOList) {
        setUserStorageIntegrationDTOList(res.userStorageIntegrationDTOList);
      }
    } catch (ex) {
      console.log('listPersonalStorage -> ex', ex);
    }
  };

  return (
    <Segment basic style={{ fontSize: '11px' }}>
      <Grid columns={user?.isAdmin ? 3 : 2}>
        <Grid.Row>
          <Grid.Column style={{ paddingRight: '0px' }}>
            <ImportContacts
              userStorageIntegrationDTOList={userStorageIntegrationDTOList}
              listPersonalStorage={listPersonalStorage}
            />
          </Grid.Column>
          <Grid.Column style={{ paddingRight: '0px', paddingLeft: '0px' }}>
            <Addons />
          </Grid.Column>
          <Grid.Column style={{ paddingLeft: '0px' }}>
            {user?.isAdmin && (
              <CompanyIntegrations
                userStorageIntegrationDTOList={userStorageIntegrationDTOList}
                listPersonalStorage={listPersonalStorage}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: getUser(state),
  };
};
export default connect(mapStateToProps, null)(MyIntegrations);
