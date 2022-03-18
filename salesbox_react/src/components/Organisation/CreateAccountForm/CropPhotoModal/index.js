/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import {
  imageCancelUploadCrop as imageCancelUploadCropOrganisation,
  imageOnCropChange as imageOnCropChangeOrganisation,
  imageSaveUploadCrop as imageSaveUploadCropOrganisation,
} from '../../organisation.actions';
import {
  imageCancelUploadCrop as imageCancelUploadCropContact,
  imageSaveUploadCrop as imageSaveUploadCropContact,
} from '../../../Contact/contact.actions';

addTranslations({
  'en-US': {
    save: 'Save',
    'Crop photo': 'Crop photo',
  },
});

class CropPhotoModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasScaledData: null,
      crop: { aspect: 1 / 1, width: 50, height: 50, unit: 'px', x: 50, y: 50 },
      src: null,
    };
  }

  componentDidMount() {
    if (this.props.fileData) {
      const reader = new FileReader();
      reader.readAsDataURL(this.props.fileData);
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.fileData !== prevProps.fileData && this.props.fileData) {
      const reader = new FileReader();
      reader.readAsDataURL(this.props.fileData);
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
    }
  }

  setEditorRef = (editor) => (this.editor = editor);

  hideEditForm = () => {
    if (this.props.type === 'organisation') {
      this.props.imageCancelUploadCropOrganisation();
    } else if (this.props.type === 'contact') {
      this.props.imageCancelUploadCropContact();
    }
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onImageCropChange = () => {
    if (this.editor) {
      const canvasScaledData = this.editor.getImageScaledToCanvas().toDataURL();
      this.setState({ canvasScaledData });
    }
  };

  getCroppedImg = async (image, crop) => {
    const canvas = document.createElement('canvas');
    return new Promise((resolve, reject) => {
      // const reader = new FileReader();
      // reader.readAsDataURL(image);
      // reader.onloadend = (e) => {
      //   const img = new Image();
      //   img.src = e.target.result;
      //   img.onload = (ev) => {
      //     const scaleX = img.naturalWidth / img.width;
      //     const scaleY = img.naturalHeight / img.height;
      //     canvas.width = crop.width;
      //     canvas.height = crop.height;
      //     const ctx = canvas.getContext('2d');
      //     ctx.drawImage(
      //       img,
      //       crop.x * scaleX,
      //       crop.y * scaleY,
      //       crop.width * scaleX,
      //       crop.height * scaleY,
      //       0,
      //       0,
      //       crop.width,
      //       crop.height
      //     );
      //     resolve(canvas.toDataURL('image/png'));
      //   };
      // };
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      resolve(canvas.toDataURL('image/png'));
    });
  };

  onSave = async () => {
    const img = await this.getCroppedImg(this.imageRef, this.state.crop);
    if (this.props.type === 'organisation') {
      this.props.imageSaveUploadCropOrganisation(img);
    } else if (this.props.type === 'contact') {
      this.props.imageSaveUploadCropContact(img);
    }
  };

  render() {
    const { isCropEnabled, fileData } = this.props;
    const { crop } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Crop photo`}
          visible={isCropEnabled}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          okLabel={_l`save`}
          scrolling={true}
          size="small"
          centered={true}
          closeOnDimmerClick={false}
          paddingAsHeader
        >
          <div style={{ textAlign: 'center', height: 'auto' }}>
            {fileData && (
              <ReactCrop
                ref={this.setEditorRef}
                src={this.state.src}
                crop={crop}
                circularCrop
                onChange={(newCrop) => this.setState({ crop: newCrop })}
                onImageLoaded={this.onImageLoaded}
              />
            )}
          </div>
        </ModalCommon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { type }) => {
  return {
    fakePath: state.entities[type].__UPLOAD ? state.entities[type].__UPLOAD.fileFakePath : '',
    isCropEnabled: state.entities[type].__UPLOAD ? state.entities[type].__UPLOAD.cropEnabled : false,
    fileData: state.entities[type].__UPLOAD ? state.entities[type].__UPLOAD.fileData : '',
  };
};
export default connect(mapStateToProps, {
  imageCancelUploadCropOrganisation,
  imageOnCropChangeOrganisation,
  imageSaveUploadCropOrganisation,
  imageCancelUploadCropContact,
  imageSaveUploadCropContact,
})(CropPhotoModal);
