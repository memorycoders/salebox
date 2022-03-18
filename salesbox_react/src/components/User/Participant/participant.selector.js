// @flow
import { createSelector } from 'reselect';

export const getUsersForDropDown = createSelector(
  (state) => state.entities.participant,
  (participantEntities) => {
    let participants = Object.keys(participantEntities).map((userId) => participantEntities[userId]);
    return participants.map((participant) => {
      const { avatar, uuid, firstName } = participant;
      const image = avatar && {
        avatar: true,
        src: `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`,
      };
      return {
        key: uuid,
        value: uuid,
        text: firstName,
        image: image || undefined,
      };
    });
  }
);

export const defaultParticipant = {
  'avatar': null,
  'firstName': '',
  'lastName': '',
  'email': '',
  'phone': '',
  'discProfile': 'NONE',
  'sharedPercent': 0,
};

const emptyParticipant = {};
