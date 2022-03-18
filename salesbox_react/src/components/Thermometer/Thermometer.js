// @flow
import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import css from './Thermometer.css';
import { ClockIcon } from './clock-icon';
import { ThermometerIcon } from './thermometer-icon';
import { connect } from 'react-redux';

type PropsType = {
  degree: string,
  unQualified: Object
};

const Thermometer = ({ degree, unQualified, users, small }: PropsType) => {
  let color = '#aad141';
  if(unQualified){
    const { ownerId } = unQualified;

    if (ownerId) {
      const user = users[ownerId];
      const { medianLeadTime } = user || {};
      let timeRate = 0;
      if (unQualified.finished || unQualified.prospectId) {
        timeRate = -1;
      } else {
        if (medianLeadTime !== 0) {
          timeRate = (new Date().getTime() - unQualified.createdDate) / medianLeadTime
        }
      }

      if (timeRate > 1) {
        color = '#eb6953';
      }
      else if (timeRate >= 0.75 && timeRate <= 1) {
        color = '#F5B342'; //#F5B342
      }
      else if (timeRate == -1) {
        color = '#333333';
      }
      else {
        color = '#aad041';
      }
    }
  }


  return <div className={css.thermonterContainer}>
    <ClockIcon color={color} width={small ? 25 : 45} height={small ? 25 : 45}/>
    <ThermometerIcon small={small} degree={degree}/>
  </div>
};
const mapStateToProps = state => {

  return {
    users: state.entities.user
  }
};

export default connect(mapStateToProps)(Thermometer);
