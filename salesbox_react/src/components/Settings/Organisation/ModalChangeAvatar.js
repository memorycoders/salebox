import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import _l from 'lib/i18n';

import api from 'lib/apiClient';
import ModalCommon from '../../ModalCommon/ModalCommon';

const ModalChangeAvatar = ({ openModal, setOpenModal, onDone, fileData }) => {
  const [src, setSrc] = useState(null);
  const editor = useRef();
  const [imageRef, setImageRef] = useState();

  const [crop, setCrop] = useState({ aspect: 1 / 1, width: 50, height: 50, unit: 'px', x: 50, y: 50 });

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.addEventListener('load', () => {
        setSrc(reader.result);
      });
    }
  }, [fileData]);

  const getCroppedImg = useCallback(async (image, crop) => {
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
  }, []);

  const dataURLtoFile = useCallback((dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  const uploadAvatar = useCallback(
    async (dataUrl) => {
      const formData = new FormData();
      formData.append('avatar', dataURLtoFile(dataUrl, fileData.name));

      const res = await api.post({
        resource: `document-v3.0/photo/uploadAvatar`,
        data: formData,
        options: {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      });

      return res.avatar;
    },
    [fileData]
  );

  const onSave = useCallback(async () => {
    const img = await getCroppedImg(imageRef, crop);
    const avatar = await dataURLtoFile(img, fileData.name);
    onDone(avatar);
  }, [getCroppedImg, imageRef, crop, onDone, fileData]);

  return (
    <ModalCommon
      title={`Crop photo`}
      visible={openModal}
      onDone={onSave}
      onClose={() => setOpenModal(false)}
      size="tiny"
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      paddingAsHeader={true}
    >
      <div style={{ textAlign: 'center', height: 'auto' }}>
        {fileData && (
          <ReactCrop ref={editor} src={src} crop={crop} circularCrop onChange={setCrop} onImageLoaded={setImageRef} />
        )}
      </div>
    </ModalCommon>
  );
};

export default memo(ModalChangeAvatar);
