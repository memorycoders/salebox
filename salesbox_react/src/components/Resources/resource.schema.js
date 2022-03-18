// @flow
import { schema } from 'normalizr';

export const resourceSchema = new schema.Entity(
  'resources',
  {},
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        uuid: entity.uuid,
        originalAvatar: entity.originalAvatar,
        firstName: entity.firstName,
        lastName: entity.lastName,
        enterpriseName: entity.enterpriseName,
        title: entity.title,
        occupied: entity.occupancy,
        pipeline: entity.pipeline,
        ownerAvatar: entity.ownerAvatar,
        email: entity.email,
        phone: entity.phone,
        ownerFirstName: entity.ownerFirstName,
        ownerLastName: entity.ownerLastName,
        favorite: entity.favorite,
        discProfile: entity.discProfile,
        resourceType: entity.resourceType
      };
    },
  }
);

export const resourceList = new schema.Object({
  resourceItemDTOList: new schema.Array(resourceSchema),
});
