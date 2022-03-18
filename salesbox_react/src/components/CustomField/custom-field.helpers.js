//@flow
export const getValueForText = (customField) => {
  const length = customField && customField.customFieldValueDTOList  ? customField.customFieldValueDTOList.length : 0;
  if (length > 0) {
    return customField.customFieldValueDTOList[0].value;
  }
  return '';
};

export default {};
