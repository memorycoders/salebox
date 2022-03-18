//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import ModalCommon from '../ModalCommon/ModalCommon';

type PropsT = {
    visible: boolean,
    onClose: () => void,
    onSave?: () => void,
};

addTranslations({
    'en-US': {
        'Confirm': 'Confirm',
        No: 'No',
        Yes: 'Yes',
        'Do you really want to delete?': 'Do you really want to delete?',
    },
});

export const DeleteCallListModal = ({ visible, onClose, onSave }: PropsT) => {
    return (
        <ModalCommon
            title={_l`Confirm`}
            visible={visible}
            onDone={onSave}
            onClose={onClose}
            size="tiny"
            paddingAsHeader={true}
        >
            <p>{_l`Do you really want to delete?`}</p>

        </ModalCommon>
    );
};