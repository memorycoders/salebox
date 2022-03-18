import React, { useCallback, useState, memo, useEffect } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immer';
import pick from 'lodash/pick';

import { isUnitDTOListOrganisation } from '../settings.selectors';
import ItemDropable from './ItemDropable';
import * as SettingsActions from 'components/Settings/settings.actions';
import _l from 'lib/i18n';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ListItemOrganisation = ({ unitDTOList, updateUserOrganisationSettings }) => {
  const [items, setItems] = useState(unitDTOList);
  const [activeIndex, setActiveIndex] = useState([]);

  useEffect(() => {
    setItems(unitDTOList);
  }, [unitDTOList]);

  const handleClickItem = useCallback(
    (index) => {
      let newActiveIndexs = [];

      if (activeIndex.some((i) => i === index)) {
        newActiveIndexs = activeIndex.filter((i) => i !== index);
      } else {
        newActiveIndexs = [...activeIndex, index];
      }

      setActiveIndex(newActiveIndexs);
    },
    [activeIndex, items]
  );

  const onDragEnd = useCallback(
    (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      let newItems = update(items, (draft) => {
        if (result.source.droppableId === result.destination.droppableId) {
          const findindexUserDTOList = draft.findIndex((i) => i.uuid === result.source.droppableId);
          if (findindexUserDTOList !== -1) {
            draft[findindexUserDTOList].userDTOList = reorder(
              draft[findindexUserDTOList].userDTOList,
              result.source.index,
              result.destination.index
            );
          }
        } else {
          const findindexDestination = draft.findIndex((i) => i.uuid === result.destination.droppableId);
          const findindexSource = draft.findIndex((i) => i.uuid === result.source.droppableId);
          let itemSelect;

          if (findindexSource !== -1) {
            const userDTOList = draft[findindexSource].userDTOList;
            const indexSource = userDTOList.findIndex((i) => i.uuid === result.draggableId);
            if (indexSource !== -1) {
              itemSelect = draft[findindexSource].userDTOList[indexSource];
              draft[findindexSource].userDTOList.splice(indexSource, 1);
            }
          }

          if (findindexDestination !== -1 && itemSelect) {
            updateUserOrganisationSettings({
              ...pick(itemSelect, [
                'email',
                'country',
                'discProfile',
                'firstName',
                'huntingFarmingRatio',
                'lastName',
                'manager',
                'phone',
                'uuid',
              ]),
              unitId: result.destination.droppableId,
            });
            draft[findindexDestination].userDTOList.splice(result.destination.index, 0, itemSelect);
          }
        }
      });

      setItems(newItems);
    },
    [items, updateUserOrganisationSettings]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {items.map((item, index) => (
        <ItemDropable
          key={index}
          item={item}
          index={index}
          handleClickItem={handleClickItem}
          activeIndex={activeIndex}
        />
      ))}
    </DragDropContext>
  );
};

export default compose(
  memo,
  connect((state) => ({ unitDTOList: isUnitDTOListOrganisation(state) }), {
    updateUserOrganisationSettings: SettingsActions.updateUserOrganisationSettings,
  })
)(ListItemOrganisation);
