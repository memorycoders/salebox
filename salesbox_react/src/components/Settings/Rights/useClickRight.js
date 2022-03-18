import { useCallback } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useClickRight = ({ itemInRight, pushError, type, updatePermission }) => {
  const changeRead = useCallback(() => {
    if (type === 'own_objects') {
      pushError('Error', 'You cannot remove the "Read" ability from Own Objects.', 2000);
    }

    if (type === 'all_company') {
      if (!itemInRight.all_company.read) {
        if (!itemInRight.own_unit.read) {
          updatePermission({
            all_company: { ...itemInRight.all_company, read: true },
            own_unit: { ...itemInRight.own_unit, read: true },
            own_objects: { ...itemInRight.own_objects, read: true },
          });
        } else {
          updatePermission({ all_company: { ...itemInRight.all_company, read: true } });
        }
      } else if (itemInRight.all_company.read) {
        updatePermission({ all_company: { read: false, write: false, delete: false } });
      }
    }

    if (type === 'own_unit') {
      if (!itemInRight.own_unit.read) {
        updatePermission({ own_unit: { ...itemInRight.own_unit, read: true } });
      } else if (itemInRight.own_unit.read) {
        updatePermission({
          all_company: { ...itemInRight.all_company, write: false, read: false, delete: false },
          own_unit: { ...itemInRight.own_unit, write: false, read: false, delete: false },
        });
      }
    }
  }, [itemInRight, type, updatePermission, pushError]);

  const changeWrite = useCallback(() => {
    if (type === 'all_company') {
      if (!itemInRight.all_company.write) {
        updatePermission({
          all_company: { ...itemInRight.all_company, write: true, read: true },
          own_unit: { ...itemInRight.own_unit, write: true, read: true },
          own_objects: { ...itemInRight.own_objects, write: true, read: true },
        });
      } else {
        updatePermission({ all_company: { ...itemInRight.all_company, write: false } });
      }
    }

    if (type === 'own_unit') {
      if (!itemInRight.own_unit.write) {
        updatePermission({
          own_unit: { ...itemInRight.own_unit, write: true, read: true },
          own_objects: { ...itemInRight.own_objects, write: true, read: true },
        });
      } else {
        updatePermission({
          all_company: { ...itemInRight.all_company, write: false },
          own_unit: { ...itemInRight.own_unit, write: false },
        });
      }
    }

    if (type === 'own_objects') {
      if (!itemInRight.own_objects.write) {
        updatePermission({ own_objects: { ...itemInRight.own_objects, write: true, read: true } });
      } else {
        updatePermission({
          all_company: { ...itemInRight.all_company, write: false },
          own_unit: { ...itemInRight.own_unit, write: false },
          own_objects: { ...itemInRight.own_objects, write: false, read: true },
        });
      }
    }
  }, [updatePermission, itemInRight, type]);

  const changeDelete = useCallback(() => {
    if (type === 'all_company') {
      if (!itemInRight.all_company.delete) {
        updatePermission({
          all_company: { ...itemInRight.all_company, delete: true, read: true },
          own_unit: { ...itemInRight.own_unit, delete: true, read: true },
          own_objects: { ...itemInRight.own_objects, delete: true, read: true },
        });
      } else {
        updatePermission({ all_company: { ...itemInRight.all_company, delete: false } });
      }
    }

    if (type === 'own_unit') {
      if (!itemInRight.own_unit.delete) {
        updatePermission({
          own_unit: { ...itemInRight.own_unit, delete: true, read: true },
          own_objects: { ...itemInRight.own_objects, delete: true, read: true },
        });
      } else {
        updatePermission({
          all_company: { ...itemInRight.all_company, delete: false },
          own_unit: { ...itemInRight.own_unit, delete: false },
        });
      }
    }

    if (type === 'own_objects') {
      if (!itemInRight.own_objects.delete) {
        updatePermission({ own_objects: { ...itemInRight.own_objects, delete: true, read: true } });
      } else {
        updatePermission({
          all_company: { ...itemInRight.all_company, delete: false },
          own_unit: { ...itemInRight.own_unit, delete: false },
          own_objects: { ...itemInRight.own_objects, delete: false, read: true },
        });
      }
    }
  }, [updatePermission, itemInRight, type]);

  return { changeRead, changeWrite, changeDelete };
};
