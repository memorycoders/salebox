// @flow
import { createSelector } from 'reselect';

export const getNotifications = createSelector(
  (state) => state.entities.notification,
  (entities) => {
    return Object.keys(entities).filter((notificationId) => {
      const notification = entities[notificationId];
      return notification.active || notification.uuid;
    });
  }
);

export const getAppNotifications = createSelector(
  (state) => state.entities.notification,
  (entities) => {
    return Object.keys(entities).filter((notificationId) => {
      const notification = entities[notificationId];
      return notification.active && !notification.uuid;
    });
  }
);

export const getSystemNotifications = createSelector(
  (state) => state.entities.notification,
  (entities) => {
    return Object.keys(entities)
      .map((notificationId) => entities[notificationId])
      .filter((notification) => {
        return notification.uuid;
      });
  }
);

export const getUnreadNotificationCount = createSelector(
  (state) => state.entities.notification,
  (entities) => {
    return Object.keys(entities).filter(
      (notificationId) => entities[notificationId].uuid && !entities[notificationId].read
    ).length;
  }
);

export const makeGetNotification = () => {
  return createSelector(
    (state) => state.entities.notification,
    (state, id) => id,
    (entities, id) => {
      return entities[id];
    }
  );
};
