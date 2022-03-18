// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { contactSchema } from 'components/Contact/contact.schema';

const msInADay = 24 * 60 * 60 * 1000;

export const extractProspect = createExtractor({});

export const prospectSchema = new schema.Entity(
  'prospect',
  {
    contacts: [contactSchema],
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {

      return {
        
        contacts: entity.contacts,
        uuid: entity.uuid,
        description: entity.description,
        profit: entity.profit,
        margin: entity.margin,
        grossValue: entity.grossValue,
        daysInPipeline: (entity.daysInPipeline || 0) / msInADay,
        contractDate: entity.contractDate,
        realProspectProgress: entity.realProspectProgress,
        neededWorkEffort: entity.neededWorkEffort,
      };
    },
  }
);

const prospectArray = new schema.Array(prospectSchema);

export const prospectList = new schema.Object({
  prospectLiteDTOList: prospectArray,
});
