// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
export const extractIndustry = createExtractor({
  name: "Name",
  type: "Type",
});

export const industrySchema = new schema.Entity(
  'industry',
  {},
  {
    idAttribute: 'uuid',
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        ...entity
      };
    },
  }
);

const industryArray = new schema.Array(industrySchema);

export const industryList = new schema.Object({
  workDataOrganisationDTOList: industryArray,
});
