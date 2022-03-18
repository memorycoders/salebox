// @flow
import { createSelector } from 'reselect';
import copy from '../../../public/copy.svg';
import noneAvatar from '../../../public/none_avatar.png';

export const getUsersForDropdown = createSelector(
  (state) => state.entities.user,
  (state) => state.entities.unit,
  (state, unitId) => unitId,
  (userEntities, unitEntities, unitId) => {
    let users = [];
    if (unitId) {
      if (Array.isArray(unitId)) {
        unitId.forEach((value) => {
          users = users?.concat(unitEntities?.[value]?.users?.map((userId) => userEntities[userId]));
        });
      } else {
        users = unitId === undefined ? [] : unitEntities?.[unitId]?.users?.map((userId) => userEntities[userId]);
      }
    } else {
      users = Object.keys(userEntities).map((userId) => userEntities[userId]);
    }
    let sort1 = [];
    if(!users) {
      users = [];
    }
    sort1 = users?.sort(function (a, b) {
      var nameA = a.name ? a.name.toUpperCase() : null; // ignore upper and lowercase
      var nameB = b.name ? b.name.toUpperCase() : null; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    return sort1
      .filter((value) => {
        return value.active || value.active === null;
      })
      .map((user) => {
        const { avatar, uuid, name, firstName = null, lastName = null } = user;
        const image = avatar && {
          avatar: true,
          src: `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`,
          style: {
            width: '22px',
          },
        };
        const noAvatar = !avatar && {
          size: 'small',
          content: `${firstName ? firstName.substring(0, 1).toUpperCase() : ''} ${
            lastName ? lastName.substring(0, 1).toUpperCase() : ''
            }`,
          class: 'label-user',
        };
        return {
          key: uuid,
          value: uuid,
          text: `${firstName} ${lastName}`,
          image: avatar ? image : null,
          label: !avatar ? noAvatar : null,
        };
      });
  }
);

const emptyUser = {};

export const makeGetUser = () => {
  return createSelector(
    (state, userId) => state.entities.user[userId],
    (user) => {
      if (!user) {
        return emptyUser;
      }
      return user;
    }
  );
};

export const getUsers = createSelector(
  (state) => state.entities.user,
  (entities) => Object.keys(entities)
);

export const getActiveUsers = createSelector(
  (state) => state.entities.user,
  (entities) => {
    return Object.keys(entities)
      .filter((userId) => entities[userId].active)
      .sort((a, b) => {
        let nameA = entities[a].name ? entities[a].name.toLowerCase() : '';
        let nameB = entities[b].name ? entities[b].name.toLowerCase() : '';

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
  }
);

export const getActiveUsersDTO = createSelector(
  (state) => state.entities.user,
  (entities) => {
    /* let mapVal={};
    let list = Object.keys(entities).filter((userId) => entities[userId].active).map(key=>entities[key]);
    list.forEach(obj => {
      if (obj != undefined) mapVal[obj.uuid]= obj;
    });

    return mapVal;*/
    return entities;
  }
);

export const getUsersDeactive = createSelector(
  (state) => state.entities.user,
  (entities) => {
    return Object.keys(entities).filter((userId) => !entities[userId].active);
  }
);
export default getUsersForDropdown;
