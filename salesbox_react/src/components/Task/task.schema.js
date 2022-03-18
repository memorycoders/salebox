// @flow
import { schema } from 'normalizr';
import { organisationSchema, extractOrganisation } from '../Organisation/organisation.schema';
import { tagSchema } from '../Tag/tag.schema';
import { focusSchema } from '../Focus/focus.schema';
import { contactSchema, extractContact } from '../Contact/contact.schema';
import { prospectSchema, extractProspect } from '../Prospect/prospect.schema';
import { categorySchema } from '../Category/category.schema';
import { userSchema, extractUser } from '../User/user.schema';
import { unitSchema } from '../Unit/unit.schema';

export const taskSchema = new schema.Entity(
  'task',
  {
    organisation: organisationSchema,
    category: categorySchema,
    tag: tagSchema,
    prospect: prospectSchema,
    contact: contactSchema,
    focus: focusSchema,
    creator: userSchema,
    owner: userSchema,
    unit: unitSchema,
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        // ...entity,
        ...entity,
        uuid: entity.uuid,
        tag: entity.tagDTO,
        category: entity.categoryName ? entity.categoryName : (
          entity.category ? entity.category.name: null
        ),
        note: entity.note,
        creator: extractUser(entity, 'creator', 'creator'),
        owner: extractUser(entity, 'owner', 'owner'),
        unit: entity.unit,
        focus: entity.focusActivity || entity.focusWorkData,
        prospect: extractProspect(entity, 'prospectDTO', 'prospect'),
        dateAndTime: entity.dateAndTime,
        contact: extractContact(entity, 'contactDTO', 'contact'),
        organisation: extractOrganisation(entity, 'organisationDTO', 'organisation'),
        organisationDTO: entity.organisationDTO,
        accepted: entity.accepted,
        type: entity.type,
      };
    },
  }
);

export const taskList = new schema.Object({
  taskDTOList: new schema.Array(taskSchema),
});
