import React from 'react';
import { Popup } from 'semantic-ui-react';
import css from './DescriptionPopup.css';

type PropsT = {
  description: string,
};

const DescriptionPopup = ({ description, triggerClassName }: PropsT) => {
  const handleLongValue = (value) => {
    if (value.length < 40) return '';
    return value.slice(0, 40) + '...';
  };
  return (
    <Popup
      hoverable
      trigger={<div className={`${css.infoIcon} ${triggerClassName}`}>{handleLongValue(description)}</div>}
    >
      <Popup.Content>
        <p>{description}</p>
      </Popup.Content>
    </Popup>
  );
};

export default DescriptionPopup;
