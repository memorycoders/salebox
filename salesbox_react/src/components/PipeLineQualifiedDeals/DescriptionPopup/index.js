//@flow
import * as React from 'react';
import { compose } from 'recompose';
import { Popup } from 'semantic-ui-react';

import css from '../../Contact/ContactPopup.css';

const DescriptionPopup = ({ triggerClassName, firstNextStep, descriptionFirstNextStep }: PropsT) => {
  if (!firstNextStep) {
    return <div />;
  }
  return (
    <Popup position='top center' hoverable trigger={<div className={`${triggerClassName}`}>{firstNextStep}</div>}>
      <Popup.Header>
        <span className={css.header}>{name}</span>
      </Popup.Header>
      <Popup.Content>
        <p className={css.descriptionFirstNextStep}>{descriptionFirstNextStep}</p>
      </Popup.Content>
    </Popup>
  );
};

export default compose()(DescriptionPopup);
