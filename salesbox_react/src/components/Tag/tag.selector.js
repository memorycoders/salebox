// @flow
import { createSelector } from 'reselect';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    None: 'None',
    Sales: 'Sales',
    'Internal follow up': 'Internal follow up',
    'External follow up': 'External follow up',
    Issues: 'Issues',
    Collaboration: 'Collaboration',
    Unqualified: 'Unqualified',
    Qualified: 'Qualified',
  },
});

const getLookup = () => ({
  NONE: _l`None`,
  SALES: _l`Sales`,
  INTERNAL_FOLLOW_UP: _l`Internal follow up`,
  EXTERNAL_FOLLOW_UP: _l`External follow up`,
  ISSUES: _l`Issues`,
  COLLABORATION: _l`Collaboration`,
  // name unqualifiedDeal
  UNQUALIFIED: _l`Prospect`,
  QUALIFIED: _l`Deal`,
});

const sortArray = ['NONE', 'SALES', 'INTERNAL_FOLLOW_UP', 'EXTERNAL_FOLLOW_UP', 'ISSUES', 'COLLABORATION'];

const sorting = (tags, tagsObj) => {
  const result = [];
  sortArray.forEach((key) => {
    let found = false;
    tagsObj.filter((item) => {
      if (!found && tags[item].name === key) {
        result.push(tags[item]);
        found = true;
        return false;
      }
      return true;
    });
  });
  return result;
};

export const getTags = createSelector(
  (state) => state.entities.tag,
  (tags) => {
    const lookup = getLookup();
    return Object.keys(tags).map((catId) => {
      const tag = tags[catId];
      const isNone = tag.color === 'NONE';
      return {
        // key: tag.uuid,
        value: tag.uuid,
        icon: isNone ? 'minus' : undefined,
        label: !isNone
          ? { color: tag.color.toLowerCase(), empty: true, circular: true, colorCode: tag.colorCode }
          : undefined,
        text: lookup[tag.name],
      };
    });
  }
);

export const getTagsSort = createSelector(
  (state) => state.entities.tag,
  (tags) => {
    const lookup = getLookup();
    const items = sorting(tags, Object.keys(tags));
    return items.map((tag) => {
      const isNone = tag.color === 'NONE';
      return {
        // key: tag.uuid,
        value: tag.uuid,
        icon: isNone ? 'minus' : undefined,
        label: !isNone
          ? { color: tag.color.toLowerCase(), empty: true, circular: true, colorCode: tag.colorCode }
          : undefined,
        text: lookup[tag.name],
      };
    });
  }
);
const listFiterUquanlified = [
  {
    // label: 'None',
    text: 'none',
    value: 'none',
    color: 'NONE',
  },
  {
    // label: 'unqualified',
    text: 'unqualified',
    value: 'unqualified',
    color: 'yellowUnqualified',
    // colorCode: "E6D55F"
  },
  {
    // label: 'qualified',
    text: 'qualified',
    value: 'qualified',
    color: 'greenQualified',
    // colorCode: "8CC18F"
  },
];
export const getTagsUnqualified = function() {
  const lookup = getLookup();
  return listFiterUquanlified.map((tag) => {
    const isNone = tag.color === 'NONE';
    return {
      // key: tag.uuid,
      value: tag.value,
      icon: isNone ? 'minus' : undefined,
      label: !isNone
        ? { color: tag.color.toLowerCase(), empty: true, circular: true, colorCode: tag.colorCode }
        : undefined,
      // text: lookup[tag.value.toUpperCase()],
      text: tag.value === 'none' ? `Not contacted` : tag.value === 'unqualified' ? `Nothing booked` : `Agreed action`,
    };
  });
};

const listFiterQualified = [
  {
    text: 'Responsible',
    value: 'owner',
  },
  {
    text: 'Next action',
    value: 'contractDate',
  },
  {
    text: 'Fewest Activities Left',
    value: 'fewestActivitiesLeft',
  },
  {
    text: 'Fewest Activities Left',
    value: 'fewestActivitiesLeft',
  },
  {
    text: 'Fewest Appointment Left',
    value: 'fewestAppointmentLeft',
  },
  {
    text: 'Opportunity Progress',
    value: 'opportunityProgress',
  },
  {
    text: 'Opportunity Progress',
    value: 'opportunityProgress',
  },
  {
    text: 'Value',
    value: 'grossValue',
  },
  {
    text: 'Weighted',
    value: 'netValue',
  },
  {
    text: 'Profit',
    value: 'profit',
  },
  {
    text: 'Account/ContactName',
    value: 'accountContactName',
  },
];

export const getTagsQualified = function() {
  return listFiterQualified.map((tag) => {
    const isNone = tag.color === 'NONE';
    return {
      value: tag.value,
      icon: isNone ? 'minus' : undefined,
      label: tag.text,
      text: tag.text,
    };
  });
};

const listFiterOrder = [
  {
    text: 'Won',
    value: 'WON',
  },
  {
    text: 'Lost',
    value: 'LOSS',
  },
];

export const getFilterOrder = function() {
  return listFiterOrder.map((tag) => {
    const isNone = tag.color === 'NONE';
    return {
      value: tag.value,
      icon: isNone ? 'minus' : undefined,
      label: tag.text,
      text: tag.text,
    };
  });
};

const listFiterRecruitmentClose = [
  {
    text: 'Yes',
    value: 'YES',
  },
  {
    text: 'No',
    value: 'NO',
  },
];

export const getFilterRecruitmentClose = function() {
  return listFiterRecruitmentClose.map((tag) => {
    const isNone = tag.color === 'NONE';
    return {
      value: tag.value,
      icon: isNone ? 'minus' : undefined,
      label: tag.text,
      text: tag.text,
    };
  });
};

export const getFilterTags = createSelector(getTags, (items) => {
  return [
    {
      value: null,
      icon: 'check',
      text: _l`All`,
    },
    ...items,
  ];
});

const listFilterSublistCalllist = [
  {
    text: 'Dials',
    value: 'DIALS',
  },
  {
    text: 'Calls',
    value: 'CALLS',
  },
  {
    text: 'No Dials',
    value: 'NO_DIALS',
  },
  {
    text: 'No Calls',
    value: 'NO_CALLS',
  },
  {
    text: 'No Dials and Calls',
    value: 'NO_DIALS_AND_CALLS',
  },
];
export const getFilterSublistCalllist = function() {
  return listFilterSublistCalllist.map((item) => {
    return {
      value: item.value,
      text: item.text,
      label: item.text,
    };
  });
};
export default getTags;

const listFilterResources = [
  {
    text: 'Employees',
    value: 'EMPLOYEE'
  },
  {
    text: 'Contractors',
    value: 'CONTRACTOR'
  }
];

export const getFilterResourceList = function() {
  return listFilterResources.map((item) => {
    return {
      value: item.value,
      text: item.text,
      label: item.text,
    };
  });
};
