/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { imageCancelUploadCrop, imageSaveUploadCrop, updateCompanyInfo } from '../settings.actions';
import api from 'lib/apiClient';
import * as authActions from '../../Auth/auth.actions';
import * as SettingActions from '../../Settings/settings.actions';

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
    this.props.imageCancelUploadCrop();
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
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  onSave = async () => {
    const img = await this.getCroppedImg(this.imageRef, this.state.crop);
    this.props.imageSaveUploadCrop(img);
    let newAvatar = await this.uploadAvatar(this.props.fileData);

    if (this.props.type === 'USER') {
      this.props.updateProfile({ avatar: newAvatar });
      this.props.requestUpdatePersonalInfo();
    } else if (this.props.type === 'COMPANY') {
      this.props.updateCompanyInfo({ key: 'avatar', value: newAvatar });
      this.props.requestUpdateCompanyInfo();
    }
  };
  uploadAvatar = async (fileData) => {
    if (!fileData) return null;
    try {
      const formData = new FormData();
      formData.append('avatar', this.dataURLtoFile(this.props.dataURL, fileData.name));
      const res = await api.post({
        resource: `document-v3.0/photo/uploadAvatar`,
        data: formData,
        options: {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      });
      if (res) {
        return res.avatar;
      }
    } catch (error) {}
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
    fakePath: state.settings.__UPLOAD ? state.settings.__UPLOAD.fileFakePath : '',
    isCropEnabled: state.settings.__UPLOAD ? state.settings.__UPLOAD.cropEnabled : false,
    fileData: state.settings.__UPLOAD ? state.settings.__UPLOAD.fileData : '',
    dataURL: state.settings.__UPLOAD ? state.settings.__UPLOAD.dataURL : '',
  };
};
export default connect(mapStateToProps, {
  imageCancelUploadCrop,
  imageSaveUploadCrop,
  updateProfile: authActions.updateProfile,
  requestUpdatePersonalInfo: authActions.requestUpdatePersonalInfo,
  updateCompanyInfo,
  requestUpdateCompanyInfo: SettingActions.requestUpdateCompanyInfo,
})(CropPhotoModal);
