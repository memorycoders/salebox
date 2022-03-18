export const ActionTypes = {
  LIST_BY_CONTACTS: 'prospect/listByContacts',
  LIST_BY_CONTACTS_DATA: 'prospect/listByContacts/data',
  PROSPECT_CONCAT_ITEM: 'prospect/concatItem',
}

export const getListByContacts = ( contactId: sting)=>({
  type: ActionTypes.LIST_BY_CONTACTS,
  contactId
});
export const prospectConcatItem = (data) => ({
  type: ActionTypes.PROSPECT_CONCAT_ITEM,
  data,
});
export default ActionTypes;
