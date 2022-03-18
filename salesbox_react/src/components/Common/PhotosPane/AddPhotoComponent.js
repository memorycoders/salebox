import React, { useState } from 'react';
import Dropzone from "react-dropzone";
import { Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import add from '../../../../public/Add.svg';


addTranslations({
  'en-US': {
    'Add Photo': 'Add Photo',
    No: 'No',
    Yes: 'Yes',
    'Description': 'Description'
  },
});
export const AddPhotoComponent = ({ changeDescription, changeFiles, errors, setErrors }) => {
  const [files, setFiles] = useState([]);
  const [urls, setUrl] = useState([]);
  const [description, setDescription] = useState('');
  const onPreviewDrop = list => {
    const filesPreview = list.map(file => {
      console.log('file: ', file)
      return URL.createObjectURL(file)
    });


    setFiles(files.concat(list))
    changeFiles(files.concat(list));
    setUrl(urls.concat(filesPreview))
    setErrors({
      description: description ? '' : 'Description is required',
      photos: ''
    })
  }


  return <div className="add-photo">
    <div className="description-content">
      <div className="label-edit-photo">
        {_l`Description`}
      </div>
      <Input
        maxLength={140}
        className="text-input"
        onChange={(value) => {
          if (value.target.value){
            setDescription(value.target.value);
            changeDescription(value.target.value);
            setErrors({
              description: '',
              photos: files.length > 0 ? '' : 'Photos is required'
            })
          } else {
            setDescription(value.target.value);
            changeDescription(value.target.value);
            setErrors({
              description: 'Description is required',
              photos: files.length > 0 ? '' : 'Photos is required'
            })
          }

        }}
        value={description}
      />
      <span className="span-charLeft">{140 - description.length}</span>
      <span className="description-error bottom-16">{errors.description}</span>
    </div>
    <div className="preview-list">
      {urls.length > 0 &&
        <>
        {urls.map((file) => (
            <img
              alt="Preview"
              key={file}
              src={file}
              className="image-preview"
            />
          ))}
        </>
      }
      <Dropzone accept="image/*" onDrop={onPreviewDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className="image-preview photo-drop-drag" {...getRootProps()}>
            <input {...getInputProps()} />
            <img className="add-icon" src={add} />
          </div>
        )}
      </Dropzone>
      <span className="description-error">{errors.photos}</span>
    </div>
  </div>
}
