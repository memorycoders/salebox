//@flow
export type CustomFieldType = {
  title?: string,
  customFieldOptionDTO: {
    customFieldOptionValueDTOList: Array<{
      value?: string,
    }>,
    multiChoice: boolean,
  },
};
