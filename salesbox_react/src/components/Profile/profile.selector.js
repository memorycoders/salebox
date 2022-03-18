// @flow
import { createSelector } from 'reselect';

const emptyProfile = {
  additionalPhoneList: [],
  additionalEmailList: [],
};

export const getUserProfile = createSelector(
  (state) => state.profile,
  (state) => state.auth.user.uuid,
  (profiles, userId) => {
    if (!profiles[userId]) return emptyProfile;
    return profiles[userId];
  }
);
