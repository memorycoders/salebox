// @flow
import { createSelector } from 'reselect';

export const getTasks = createSelector(
  (state) => state.entities.task,
  (entities) => {
    return Object.keys(entities);
  }
);

const emptyTask = {
  tag: {},
  focus: {},
  contact: {},
  organisation: {},
  prospect: {},
  creator: {},
};

const makeGetFocusForTask = () => {
  const emptyFocus = {};
  return createSelector((state, taskId) => {
    const task = state.entities.task[taskId];
    if (task && task.focus) {
      return state.entities.focus[task.focus] || emptyFocus;
    }
    return emptyFocus;
  }, (focus) => focus);
};

const makeGetContactForTask = () => {
  const emptyContact = {};
  const emptyOrganisation = {};

  return createSelector(
    (state, taskId) => {
      const task = state.entities.task[taskId];
      if (task && task.contact) {
        return state.entities.contact[task.contact];
      }
      return emptyContact;
    },
    (state, taskId) => {
      const task = state.entities.task[taskId];
      if (task && task.contact) {
        const contact = state.entities.contact[task.contact];
        if (contact && contact.organisation) {
          return state.entities.organisation[contact.organisation];
        }
      }
      return emptyOrganisation;
    },
    (contact, organisation) => ({
      ...contact,
      organisation,
    })
  );
};

const makeGetProspectFortask = () => {
  const emptyOpportunity = {};
  return createSelector((state, taskId) => {
    const task = state.entities.task[taskId];
    if (task && task.prospect) {
      return state.entities.prospect[task.prospect];
    }
    return emptyOpportunity;
  }, (prospect) => prospect);
};

const makeGetCreatorForTask = () => {
  const emptyCreator = {};
  return createSelector((state, taskId) => {
    const task = state.entities.task[taskId];
    if (task && task.creator) {
      return state.entities.user[task.creator];
    }
    return emptyCreator;
  }, (user) => user);
};

const makeGetTagForTask = () => {
  const emptyTag = {};
  return createSelector((state, taskId) => {
    const task = state.entities.task[taskId];
    if (task && task.tag) {
      return state.entities.tag[task.tag];
    }
    return emptyTag;
  }, (tag) => tag);
};

const makeGetOrganisationForTask = () => {
  const emptyOrganisation = {};
  return createSelector((state, taskId) => {
    const task = state.entities.task[taskId];
    if (task && task.organisation) {
      return state.entities.organisation[task.organisation];
    }
    return emptyOrganisation;
  }, (organisation) => organisation);
};

export const makeGetTask = () => {
  const getFocus = makeGetFocusForTask();
  const getContact = makeGetContactForTask();
  const getProspect = makeGetProspectFortask();
  const getCreator = makeGetCreatorForTask();
  const getOrganisation = makeGetOrganisationForTask();
  const getTag = makeGetTagForTask();

  return createSelector(
    (state, taskId) => state.entities.task[taskId],
    getFocus,
    getContact,
    getProspect,
    getCreator,
    getOrganisation,
    getTag,
    (task, focus, contact, prospect, creator, organisation, tag) => {
      if (!task) {
        return emptyTask;
      }

      return {
        ...task,
        tag,
        focus,
        contact,
        organisation,
        prospect,
        creator,
      };
    }
  );
};

export const getCreateTask = createSelector(
  (state) => state.entities.task.__CREATE,
  (task) => {
    return task;
  }
);

export const getUpdateTask = createSelector(
  (state) => state.entities.task.__EDIT,
  (task) => {
    return task;
  }
);

export const getTaskErros = createSelector(
  (state) => state.entities.task.__ERRORS,
  (errors) => {
    return errors;
  }
);
export const getCompanyAvgDistributionDays = createSelector(
  (state, overviewType) => state.overview[overviewType],
  (overview) => {
    if (overview!=null && overview.otherParam != null) {
      return overview.otherParam.companyAvgDistributionDays;
    }
    return null;
  }
);
