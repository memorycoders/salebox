//@flow
import React from 'react';
import { Transition, Modal, Button, Icon, Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
import cx from 'classnames';
import css from './ModalCommon.css';
import { classCommonModalContent, calculatingPositionMenuDropdown, TYPE_EXPORT_CV } from '../../Constants';
import { compose, lifecycle } from 'recompose';

addTranslations({
  'en-US': {
    'Add note': 'Add note',
    Cancel: 'Cancel',
    Done: 'Done',
  },
});

let isMouseDown = false;
const ModalCommon = ({
  id,
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
  okHidden = false,
  paddingAsHeader = false,
  hideIconClose = false,
  closeOnDimmerClick = true,
  onClickIconClose,
  hasNotFooter,
  unmountOnHide = true,
  contenStyle="",
  trigger,
  description=true,
  clickDimmerNotCallActionOnClose = false,
  isLoadingCloseButton,
  isLoadingDoneButton,
  isPreviewCV,
  onDownload,
  handleSend,
  isSending,
  isDownloading
}) => {
  const handlerClose = () => {
    clickDimmerNotCallActionOnClose ? onClickIconClose : isMouseDown ? null : onClose(true);
    isMouseDown = false;
  }

  const handlerOnMount = () => {
    isMouseDown = false;
    let modalCommon = document.getElementsByClassName("modal-common");
    if(modalCommon) {
      modalCommon[0].addEventListener("mousedown", _mouseDown)
      modalCommon[0].addEventListener("mouseup", _mouseUp)
    }
  }

  const handlerOnUnMount = () => {
    let modalCommon = document.getElementsByClassName("modal-common");
    if(modalCommon && modalCommon[0]) {
      modalCommon[0].removeEventListener("mousedown", _mouseDown)
      modalCommon[0].removeEventListener("mouseup", _mouseUp)
    }

  }

  const _mouseDown = (e) => {
    isMouseDown = true;
  }
  const _mouseUp = (e) => {
    isMouseDown = false;
  }

  return (
    <Transition className={css.modalBackground} unmountOnHide={unmountOnHide} visible={visible} animation="fade down" duration={0}>
      <Modal
        id={id}
        onClose={handlerClose}
        className={`modal-common ${cx(css.modalContainer, className)}`}
        open={visible}
        onUnmount={handlerOnUnMount}
        onMount={handlerOnMount}
        closeOnDimmerClick={closeOnDimmerClick}
        size={size ? size : 'large'}
      >
        <Modal.Header className={css.commonModalHeader}>
          <span className={css.commonModaltitle}>{title}</span>
          {!hideIconClose && (
            <Icon onClick={onClickIconClose ? onClickIconClose : () => onClose(true)} className={css.closeIcon} name="close" />
          )}
        </Modal.Header>
        <Modal.Content id={`CommonModalContent-${title}`} className={`${description && css.description} ${contenStyle} ${classCommonModalContent}`} scrolling={scrolling}>
          <Modal.Description className={`${paddingAsHeader && css.paddingAsHeader} ${contenStyle} `}>{children}</Modal.Description>
        </Modal.Content>
        {!hasNotFooter && <Modal.Actions className={css.commonActionModal}>
          {cancelHidden == false && (
            <Button className={cx(css.commonCloseButton, css.commonButton)} onClick={() => onClose(false)} tabIndex={0} loading={isLoadingCloseButton}>
              {noLabel ? noLabel : cancelLabel}
            </Button>
          )}
          {okHidden === false && (
            <Button className={cx(css.commonDoneButton, css.commonButton)} onClick={onDone} tabIndex={0} loading={isLoadingDoneButton}>
              {yesLabel ? yesLabel : okLabel}
            </Button>
          )}
        </Modal.Actions>}

        {
          isPreviewCV && <Modal.Actions className={css.listAction}>
            <Button className={cx(css.commonCloseButton, css.commonButton)} onClick={() => onClose(false)} tabIndex={0} loading={isLoadingCloseButton}>
                {noLabel ? noLabel : cancelLabel}
            </Button>
            <div className={css.Dropdown}>
            <Dropdown loading={isDownloading} text={_l`Download`} floating icon={null}  button className={cx(css.commonDoneButton, css.commonButton)}>
              <Dropdown.Menu className='right'>
                <Dropdown.Item value="0" onClick={() => {onDownload(TYPE_EXPORT_CV.PDF)}}>{_l`PDF`}</Dropdown.Item>
                <Dropdown.Item value="1" onClick={() => {onDownload(TYPE_EXPORT_CV.WORD)}}>{_l`Word`}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className={`${css.Dropdown} dropdown-send-cv`}>
            <Dropdown loading={isSending} text={_l`Send`}  floating icon={null} button className={cx(css.commonDoneButton, css.commonButton)}>
              <Dropdown.Menu className='right'>
                <Dropdown.Item onClick={() => {handleSend(TYPE_EXPORT_CV.PDF)}}>{_l`PDF`}</Dropdown.Item>
                <Dropdown.Item onClick={() => {handleSend(TYPE_EXPORT_CV.WORD)}}>{_l`Word`}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </Modal.Actions>
        }
      </Modal>
    </Transition>
  );
};

export default compose(
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if(nextProps.visible !== this.props.visible) {
        if(nextProps.visible) {
          let _timeoutScroll;
          setTimeout(() => {
            document.getElementById(`CommonModalContent-${nextProps.title}`) && document.getElementById(`CommonModalContent-${nextProps.title}`).addEventListener('scroll', function() {
              clearTimeout(_timeoutScroll);
              _timeoutScroll = setTimeout(() => {
                calculatingPositionMenuDropdown()
              }, 100)
            }, false)
          })
        } else {
          document.getElementById(`CommonModalContent-${nextProps.title}`) && document.getElementById(`CommonModalContent-${nextProps.title}`).removeEventListener('scroll', function(){})
        }
      }
    }
  })
)(ModalCommon);
