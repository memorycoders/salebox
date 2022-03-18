//@flow
import * as React from 'react';
import { Icon, Input, Button } from 'semantic-ui-react';
import type { EventHandlerType } from 'types/semantic-ui.types';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import * as CustomFieldActions from 'components/CustomField/custom-field.actions';
import type { CustomFieldType } from '../../custom-field.types';
import { getValueForText } from '../../custom-field.helpers';
import css from '../../CustomField.css'

addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});

type PropsType = {
  customField: CustomFieldType,
  handleUpdate: EventHandlerType,
  object: {
    name?: string,
  },
};

const LinkedInIcon = <Icon name="linkedin" color="blue" size={18} />;
const SkypeButton = <Icon name="skype" color="blue" size={18} />;
const GoogleButton = <Icon name="google" color="blue" size={16} />;
const facebookButton = <Icon name="facebook" color="blue" size={18} />;
const twitterButton = <Icon name="twitter" color="blue" size={18} />;

const instagramButton = <Icon name="instagram" color="blue" size={18} />;
const webButton = <Icon name="globe" color="blue" size={18} />;

const BUTTON_STYLES ={
  width: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const INPUT_STYLES = {
  flex: 1,
  height: 28, 
  fontSize: 11,
  minWidth: 150
}


const CustomFieldUrl = ({ isUpdateAll, handleUpdate, customField, object, onChangeCustomField, isCustomFieldModel, objectType }: PropsType) => {
  const value = getValueForText(customField);

  if (customField.customFieldOptionDTO.urlType) {
    if (customField.customFieldOptionDTO.urlType === 'LINKEDIN') {
      const gotoButton = (
        <Button
          compact
          style={BUTTON_STYLES}
          disabled={value === ''}
          icon={LinkedInIcon}
          as="a"
          target="_blank"
          href={`//linkedin.com/in/${value ? value : ''}`}
        />
      );
      return <Input 
        onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} 
        style={INPUT_STYLES} 
        onChange={handleUpdate} 
        action={gotoButton} 
        fluid value={value || ''} />;
    } else if (customField.customFieldOptionDTO.urlType === 'SKYPE') {
      const gotoButton = <Button style={BUTTON_STYLES} disabled={value === ''} icon={SkypeButton} as="a" href={`skype:${value}?call`} />;
      return <Input onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} onChange={handleUpdate} action={gotoButton} fluid value={value || ''} />;
    } else if (customField.customFieldOptionDTO.urlType === 'GOOGLE_SEARCH') {
      let lastUrl = ''
      if (objectType === 'ACCOUNT'){
        lastUrl = object.name
      } else if (objectType === 'CONTACT'){
        lastUrl = object.firstName + object.lastName
      }
      const url = `https://www.google.com/search?q=${customField.customFieldOptionDTO.searchPrefix ? customField.customFieldOptionDTO.searchPrefix : ''}${lastUrl}`;
      const gotoButton = <Button style={BUTTON_STYLES} icon={GoogleButton} as="a" href={`${url}`} target="_blank" />;
      return <Input disabled onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} action={gotoButton} fluid value={''} />;
    } 
    else if (customField.customFieldOptionDTO.urlType === 'FACEBOOK') {
      const url = `https://www.facebook.com/${value}`;
      const gotoButton = <Button style={BUTTON_STYLES} icon={facebookButton} as="a" href={`${url}`} target="_blank" />;
      return <Input onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} action={gotoButton} fluid value={value} />;
    } 
    else if (customField.customFieldOptionDTO.urlType === 'TWITTER') {
      const url = `https://twitter.com/${value}`;
      const gotoButton = <Button style={BUTTON_STYLES} icon={twitterButton} as="a" href={`${url}`} target="_blank" />;
      return <Input onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} action={gotoButton} fluid value={value} />;
    }

    else if (customField.customFieldOptionDTO.urlType === 'INSTAGRAM') {
      const url = `https://www.instagram.com/${value}`;
      const gotoButton = <Button style={BUTTON_STYLES} icon={instagramButton} as="a" href={`${url}`} target="_blank" />;
      return <Input onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} action={gotoButton} fluid value={value} />;
    }

    else if (customField.customFieldOptionDTO.urlType === 'WEB') {
      const url = `${value.indexOf('http')>=0? value : '//' + value}`;
      const gotoButton = <Button style={BUTTON_STYLES} icon={webButton} as="a" href={`${url}`} target="_blank" />;
      return <Input onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} action={gotoButton} fluid value={value} />;
    }
  }
  return <Input onChange={handleUpdate} onBlur={isCustomFieldModel ? () => { } : () => onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)} style={INPUT_STYLES} fluid value={value || ''} />;
};
const mapDispatchToProps = {
  updateValue: CustomFieldActions.updateValue,
  onChangeCustomField: CustomFieldActions.connectSagaUpdate,
  updateValueMutilObject: CustomFieldActions.updateValueMutilObject
};

const CustomFieldUrlComponent = (props)=> {
  return <div style={{ width: '100%', height: '28px', position: 'relative' }}>
    <CustomFieldUrl {...props}/>
    {props.error && <div className={css.error}>{props.error}</div>}
  </div>
}

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withState('error', 'setError', ''),
  withHandlers({
    handleUpdate: ({ setError, object, updateValue, customField, updateValueMutilObject, isCustomFieldModel }) => (event, { value }) => {
      if (customField.required) {
        if (!value) {
          setError(`${customField.title} ${_l`is required`}`)
        } else {
          setError(``)
        }
      }
      if (isCustomFieldModel) {
        return updateValueMutilObject(customField.uuid, { value })
      }
      updateValue(customField.uuid, { value }, object.uuid);
    },

    onChangeCustomField: ({ onChangeCustomField, error, isUpdateAll }) => (uuid, objectId)=>{
      if (error){
        return;
      }
      onChangeCustomField(uuid, objectId, isUpdateAll)
    }
  })
)(CustomFieldUrlComponent);

