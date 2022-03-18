// @flow
import { schema } from 'normalizr';
import { createExtractor } from 'lib';
import { unitSchema } from '../Unit/unit.schema';

export const extractUser = createExtractor(
  {
    name: 'Name',
    avatar: 'Avatar',
    discProfile: 'DiscProfile',
  },
  (entity, extracted, prefix) => {

    const firstName = entity[`${prefix}FirstName`];
    const lastName = entity[`${prefix}LastName`];
    return {
      ...extracted,
      name: extracted.name || (firstName ? `${firstName} ${lastName}` : extracted.email),
      firstName,
      lastName,

    };
  }
);

export const userSchema = new schema.Entity(
  'user',
  {
    unit: unitSchema,
  },
  {
    idAttribute: 'uuid',
    processStrategy: (entity) => {
      return {
        uuid: entity.uuid,
        active: entity.active,
        name: entity.name || (entity.firstName ? `${entity.firstName} ${entity.lastName}` : entity.email),
        firstName: entity.firstName,
        lastName: entity.lastName,
        firstLogin: entity.firstLogin,
        type: entity.type,
        avatar: entity.avatar,
        unit: entity.unitId || entity.unit,
        email: entity.email,
        phone: entity.phone,
        discProfile: entity.discProfile,
        token: entity.token,
        enterpriseID: entity.enterpriseID,
        isMainContact: entity.isMainContact,
        medianLeadTime: entity.medianLeadTime,
        colorCode: entity.colorCode,
        username: entity.username,
        maestranoUserId: entity.maestranoUserId,
        isAdmin: entity.permission?.permission?.admin == false ? false : true,
        newIndustry: entity.newIndustry,
        permission: entity.permission?.permission
      };
    },
  }
);

unitSchema.define({ users: [userSchema] });

export const userList = new schema.Object({
  userLiteDTOList: [userSchema],
});
