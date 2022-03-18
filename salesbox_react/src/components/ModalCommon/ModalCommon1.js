//@flow
import React from 'react';
import { Transition, Modal, Button, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import cx from 'classnames';
import css from './ModalCommon.css';
import { classCommonModalContent, calculatingPositionMenuDropdown } from '../../Constants';
import { compose, lifecycle } from 'recompose';
import CustomFieldPane from '../CustomField/CustomFieldsPane';

addTranslations({
    'en-US': {
        'Add note': 'Add note',
        Cancel: 'Cancel',
        Done: 'Done',
    },
});


const ModalCommon = ({
    visible,
    onClose,
    onDone,
    children,
    title,
    className,
    size,
    scrolling = true,
    yesLabel,
    noLabel,
    cancelLabel = _l`Cancel`,
    okLabel = _l`Done`,
    cancelHidden = false,
    paddingAsHeader = false,
    hideIconClose = false,
    closeOnDimmerClick = true,
    onClickIconClose,
    hasNotFooter,
    unmountOnHide = true,
    contenStyle = "",
    trigger,
    description = true,
    rightCustomfield
}) => {
    return (
        <Transition className={css.modalBackground} unmountOnHide={unmountOnHide} visible={visible} animation="fade down" duration={0}>
            <Modal
                onClose={onClose}
                className={cx(css.modalContainer, className)}
                open={visible}
                closeOnDimmerClick={closeOnDimmerClick}
                size={size ? size : 'large'}
            >
                <div style={{ display: 'flex', height: '100%', background: '#fff' }}>
                    <div style={{ width: '70%' }}>
                        <Modal.Header className={css.commonModalHeader}>
                            <span className={css.commonModaltitle}>{title}</span>
                            {!hideIconClose && (
                                <Icon onClick={onClickIconClose ? onClickIconClose : onClose} className={css.closeIcon} name="close" />
                            )}
                        </Modal.Header>
                        <Modal.Content style={{ padding: '0px 10px' }} id={`CommonModalContent-${title}`} className={`${description && css.description} ${contenStyle} ${classCommonModalContent}`} scrolling={scrolling}>
                            <Modal.Description className={`${paddingAsHeader && css.paddingAsHeader} ${contenStyle} `}>{children}</Modal.Description>
                        </Modal.Content>
                        {!hasNotFooter && <Modal.Actions className={css.commonActionModal}>
                            {cancelHidden == false && (
                                <Button className={cx(css.commonCloseButton, css.commonButton)} onClick={onClose} tabIndex={0}>
                                    {noLabel ? noLabel : cancelLabel}
                                </Button>
                            )}
                            <Button className={cx(css.commonDoneButton, css.commonButton)} onClick={onDone} tabIndex={0}>
                                {yesLabel ? yesLabel : okLabel}
                            </Button>
                        </Modal.Actions>}
                    </div>
                    <div style={{ minHeight: '100%', width: 350, padding: '10px 10px 0px 10px', background: 'rgb(239,240,240)' }}>
                        <div style={{ background: '#fff', height: 'calc(100% - 0px)', borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: 10 }}>
                            <div style={{ padding: '0px 0px 0px 10px' }}>Custom Field</div>
                            <Modal.Content className={`${description && css.description} ${contenStyle} ${classCommonModalContent}`} scrolling={scrolling}>
                                <CustomFieldPane objectType={'TASK'} />
                            </Modal.Content>
                        </div>
                    </div>
                </div>
            </Modal>
        </Transition>
    );
};

export default compose(
    lifecycle({
        componentWillReceiveProps(nextProps) {
            if (nextProps.visible !== this.props.visible) {
                if (nextProps.visible) {
                    let _timeoutScroll;
                    setTimeout(() => {
                        document.getElementById(`CommonModalContent-${nextProps.title}`) && document.getElementById(`CommonModalContent-${nextProps.title}`).addEventListener('scroll', function () {
                            clearTimeout(_timeoutScroll);
                            _timeoutScroll = setTimeout(() => {
                                calculatingPositionMenuDropdown()
                            }, 100)
                        }, false)
                    })
                } else {
                    document.getElementById(`CommonModalContent-${nextProps.title}`) && document.getElementById(`CommonModalContent-${nextProps.title}`).removeEventListener('scroll', function () { })
                }
            }
        }
    })
)(ModalCommon);
