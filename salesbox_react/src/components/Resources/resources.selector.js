// @flow
import { createSelector } from 'reselect';
import { UIDefaults, ObjectTypes } from 'Constants';
import addNone from 'lib/addNone';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

const { isArray } = Array;

export const getResources = createSelector(
  (state) => state.entities.resources,
  (state, selected) => selected,
  (resources, selected) => {
    return Object.keys(resources)
      .filter((resourceId, index) => resourceId === selected || index < UIDefaults.DropdownMaxItems)
      .map((resourceId) => {
        const resource = resources[resourceId];
        return {
          key: resource.uuid,
          value: resource.uuid,
          text: resource.displayName,
        };
      });
  }
);

const dropdownSort = (a, b) => {
  const aFirst = (a.text || '').toLowerCase();
  const bFirst = (b.text || '').toLowerCase();
  if (aFirst < bFirst) return -1;
  if (aFirst > bFirst) return 1;
  return 0;
};

const emptyResource = {
  originalAvatar: null,
  firstName: '',
  lastName: '',
  enterpriseName: '',
  title: null,
  occupied: null,
  pipeline: null,
  ownerAvatar: null,
};

export const getResource = (state, resourceId) => state.entities.resources && state.entities.resources[resourceId];

export const makeGetResource = () => {
  return createSelector(getResource, (resource, organisation, owner) => {
    if (!resource) {
      return emptyResource;
    }
    return {
      ...emptyResource,
      ...resource,
      organisation,
      owner,
    };
  });
};

export const getItemsResourceCount = createSelector(
  (state) => (state.overview.RESOURCES ? state.overview.RESOURCES.itemCount : 0),
  (total) => {
    return total;
  }
);

export default getResources;
