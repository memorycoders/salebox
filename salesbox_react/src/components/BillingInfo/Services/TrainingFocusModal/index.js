import Class from '../../../CallList/CallList.css';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import * as React from 'react';
import _l from 'lib/i18n';
import { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { FormPair } from 'components';
import css from '../OnlineTraniningModal/onlineTrainingModal.css';
import UserDropdown from '../../../User/UserDropdown';

type Props = {
  suggestForm: {
    status: Boolean,
    type: String,
  },
  handlerClose: void,
};

const TrainingFocusModal = (props) => {
  const [file, setFile] = useState(null);
  const [responsible, setResponsible] = useState(null);

  const { fnOk, fnCancel, visible } = props;
  const [errorResponsible, setErrorResponsible] = useState(false);
  const [errorFile, setErrorFile] = useState(false);
  const [errorFileType, setErrorFileType] = useState(false);



  const hanleSelectFile = (e) => {

    if(e.target.files[0] && e.target.files[0].name){
      if(!e.target.files[0].name.toLowerCase().endsWith('.csv')){
        setErrorFile(true);
        setErrorFileType(true);
        return;
      }
      setErrorFile(false);
      setErrorFileType(false);
    }
    let reader = new FileReader();
    setFile(e.target.files[0]);
  };
  const handleChangeResponsible = (e, { value }) => {
    setResponsible(value);
  };
  const removeFile = () => {
    setFile(null);
  };
  const clearValid = ()=>{
    setErrorFile(false);
    setErrorFileType(false);
    setErrorResponsible(false);
  }
  return (
    <ModalCommon
      visible={visible}
      size="tiny"
      title={_l`Training focus`}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Done`}
      onDone={() => {
        clearValid();
        if(!responsible){
          setErrorResponsible(true);
          return;
        }
        if(!file){
          setErrorFile(true);
          return;
        }
        fnOk(responsible, file);
        setErrorFile(false);
        setErrorResponsible(false);
        setResponsible(null);
        setFile(null);

      }}
      onClose={() => {
        fnCancel();
        setErrorFile(false);
        setErrorFileType(false);
        setErrorResponsible(false);
        setResponsible(null);
        setFile(null);
      }}
    >
      <FormPair left label={_l`Responsible`} required labelStyle={css.labelForm} className={css.formPair}>
        <UserDropdown value={responsible} onChange={handleChangeResponsible} />
        {errorResponsible && <span className={css.errorForm}>{_l`Responsible is required`}</span>}

      </FormPair>
      <FormPair left label={_l`File`} required labelStyle={css.labelForm}>
        {file && file.name}
        {errorFile && (errorFileType ?<span className={css.errorForm}>{_l`The selected file type is not supported, use .CSV`}</span>
        :<span className={css.errorForm}>{_l`File is required`}</span>)}
      </FormPair>
      <div className={Class.CL_Import}>
        <div className={Class.CL_Area_Import}>
          <form method="post" action="" encType="multipart/form-data">
            <div>
              <input
                hidden
                type="file"
                name="files[]"
                id="file"
                data-multiple-caption="{count} files selected"
                // multiple
                onChange={hanleSelectFile}
              />
              <label htmlFor="file">
                <strong>{_l`Choose a file .CSV`}</strong>
                <span> {_l`or drag it here`}</span>.
              </label>
            </div>
          </form>
        </div>
      </div>
    </ModalCommon>
  );
};

export default TrainingFocusModal;
