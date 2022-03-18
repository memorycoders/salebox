import React, { Component } from 'react';
import { Popup } from 'semantic-ui-react';
import { Insight } from './Insight';
import insightSvg from '../../../../public/Insights.svg'

export class InsightPopup extends Component {

  render() {

    return (
      <Popup
        hoverable
        size="large"
        position="bottom center"
        trigger={
          <div className="qualifiedCircleButton">
            <img style={{ height: 16 }} src={insightSvg} />
          </div>
        }>
        <Popup.Content>
          <Insight />
        </Popup.Content>
      </Popup>
    );
  }
}
