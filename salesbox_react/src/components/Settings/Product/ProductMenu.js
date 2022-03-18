import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import MoreMenu from 'components/MoreMenu/MoreMenu';
import _l from 'lib/i18n';
import editBtn from '../../../../public/Edit.svg';
import ModalCommon from '../../ModalCommon/ModalCommon';

import css from './index.css';

const ProductMenu = ({ updateAction, deleteAction, deleteConfirmText, showDelete, checkType }: any) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const onDone = () => {
    setIsModalOpen(false);
    deleteAction();
  };

  return (
    <>
      <MoreMenu className={css.bgMore} color="task">
        <Menu.Item onClick={updateAction} icon>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>

        {checkType ? (
          !!showDelete && (
            <Menu.Item onClick={() => setIsModalOpen(true)} icon>
              <div className={css.actionIcon}>
                {_l`Delete`}
                <Icon name="trash alternate" color="grey" />
              </div>
            </Menu.Item>
          )
        ) : (
          <Menu.Item onClick={() => setIsModalOpen(true)} icon>
            <div className={css.actionIcon}>
              {_l`Delete`}
              <Icon name="trash alternate" color="grey" />
            </div>
          </Menu.Item>
        )}
      </MoreMenu>
      <ModalCommon
        title={_l`Confirm`}
        visible={isModalOpen}
        onDone={onDone}
        onClose={() => setIsModalOpen(false)}
        size="tiny"
        cancelLabel={_l`No`}
        okLabel={_l`Yes`}
        paddingAsHeader={true}
      >
        <p>{_l`${deleteConfirmText}`}</p>
      </ModalCommon>
    </>
  );
};

export default React.memo(ProductMenu);
