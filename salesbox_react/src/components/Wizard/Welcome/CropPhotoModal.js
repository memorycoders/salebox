
// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { Modal, Button, Image, Label, Divider, Input } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor'

import * as wizardActions from 'components/Wizard/wizard.actions';

import { getImageCropScale } from 'components/Wizard/wizard.selector';

type PropsT = {
  scale: number,
  fakePath: string,
  isCropEnabled: string,
  handleImageOnScale: (event: Event, {value: number}) => void,
  handleImageCancelUploadCrop: (event: Event, {}) => void,
  handleImageSaveUploadCrop: (event: Event, {}) => void,
  // handleImageOnCropChange: (event: Event, {}) => void,
  imageOnCropChange: (data: any) => void,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'Cancel': 'Cancel',
    'Save': 'Save',
  },
});

import css from './CropPhotoModal.css';

class CropPhotoModal extends React.Component<PropsT> {

  onImageCropChange = () => {
    const { imageOnCropChange } = this.props;

    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      // const canvas = this.editor.getImage()

      // const canvasData = this.editor.getImage().toDataURL();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      // const canvasScaled = this.editor.getImageScaledToCanvas()
      const canvasScaledData = this.editor.getImageScaledToCanvas().toDataURL();

      imageOnCropChange(canvasScaledData);
    }
  }

  setEditorRef = (editor) => this.editor = editor

  render() {

    const {
      scale,
      fakePath,
      fileData,
      isCropEnabled,
      handleImageOnScale,
      handleImageCancelUploadCrop,
      handleImageSaveUploadCrop,
      handleImageOnCropChange,
    } = this.props;


    return (
      <div className={css.root}>
        <Modal className={css.crop} open={isCropEnabled} size="small" centered={true}>
          <Modal.Header className={css.header}>{_l`Crop photo`}</Modal.Header>
          <Modal.Content className={css.content}>
            <AvatarEditor
              ref={this.setEditorRef}
              image={fileData}
              width={320}
              height={320}
              border={40}
              borderRadius={320}
              color={[0, 0, 0, 0.5]} // RGBA
              scale={scale}
              rotate={0}
              onImageReady={this.onImageCropChange}
              onImageChange={this.onImageCropChange}
            />
            <Divider />
            <Input type='range' min={0.5} max={10} step={0.1} value={scale} onChange={handleImageOnScale} />
          </Modal.Content>
          <Modal.Actions className={css.action}>
            {/* <Button onClick={handleImageCancelUploadCrop}>{_l`Cancel`}</Button> */}
            <Button primary onClick={handleImageSaveUploadCrop}>{_l`Save`}</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    scale: getImageCropScale(state),
    fakePath: state.wizard.__UPLOAD.fileFakePath,
    isCropEnabled: state.wizard.__UPLOAD.cropEnabled,
    fileData: state.wizard.__UPLOAD.fileData,
  }
};
const mapDispatchToProps = {
  imageOnScale: wizardActions.imageOnScale,
  imageCancelUploadCrop: wizardActions.imageCancelUploadCrop,
  imageSaveUploadCrop: wizardActions.imageSaveUploadCrop,
  imageOnCropChange: wizardActions.imageOnCropChange,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    handleImageOnScale: ({ imageOnScale }) => (event, {value: scale, min, max}) => {
      if (min <= scale && scale <= max) {
        imageOnScale(scale);
      } else if (min > scale) {
        scale = min;
      } else if (max < scale) {
        scale = max;
      } else {
        scale = 1.2; // Default value
      }
    },
    handleImageCancelUploadCrop: ({ imageCancelUploadCrop }) => (event, {}) => {
      imageCancelUploadCrop();
    },
    handleImageSaveUploadCrop: ({ imageSaveUploadCrop }) => (event, {}) => {
      imageSaveUploadCrop();
    },
  }),
)(CropPhotoModal);
