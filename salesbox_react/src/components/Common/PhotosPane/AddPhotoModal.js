//@flow
import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { OverviewTypes, ObjectTypes } from 'Constants';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getItemSelected } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from '../../../lib/apiClient';
import { refreshQualifiedDetail } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { AddPhotoComponent } from './AddPhotoComponent';
import { refreshOrganisation } from '../../Organisation/organisation.actions'
import { refreshContact } from '../../Contact/contact.actions';
type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Add Photo': 'Add Photo',
    No: 'No',
    Yes: 'Yes',
    'Description': 'Description'
  },
});

const AddPhotoModal = ({ visible, hide, onSave, setErrors, errors }: PropsT) => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('')

  return (
    <ModalCommon title={_l`Add Photo`}
      cancelLabel={_l`No`} okLabel={_l`Yes`}
      visible={visible}
      onDone={() => onSave(files, description)}
      onClose={hide}
      size="tiny"
      paddingAsHeader={true} >
      <AddPhotoComponent
        errors={errors}
        setErrors={setErrors}
        changeDescription={(descriptionDraft) => setDescription(descriptionDraft)} changeFiles={(listFile) => setFiles(listFile)} />
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'add_photo');
    let data = {};
    if (overviewType === OverviewTypes.Pipeline.Qualified_Photo) {
      data = state.entities.qualifiedDeal.__DETAIL;
    } else if (overviewType === OverviewTypes.Account_Photo) {
      data = state.entities.organisation.__DETAIL;
    } else if (overviewType === OverviewTypes.Contact_Photo) {
      data = state.entities.contact.__DETAIL;
    }

    return {
      visible,
      data
    };
  };
  return mapStateToProps;
};
export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      refreshQualifiedDetail,
      refreshOrganisation,
      refreshContact
    }
  ),
  withState('errors', 'setErrors', {
    description: '',
    photos: ''
  }),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ refreshContact, clearHighlightAction, overviewType, refreshQualifiedDetail, data, setErrors, errors, refreshOrganisation }) => async (files, description) => {

      if (description === ''){
        setErrors({
          ...errors,
          description: 'Description is required'
        })
      }

      if (files.length === 0) {
        setErrors({
          ...errors,
          photos: 'Photos is required'
        })
      }

      if (!description || files.length === 0){

        return;
      }

      try {
        let entity = overviewType === OverviewTypes.Pipeline.Qualified_Photo ? 'PROSPECT' : (
          overviewType === OverviewTypes.Account_Photo ? 'ORGANISATION' : (
            overviewType === OverviewTypes.Contact_Photo  ? 'CONTACT' : 'CONTACT'
          )
        )
        if (files.length > 0) {
          let formData = new FormData();
          formData.append('photo', files[0]);
          formData.append('id', data.uuid);
          formData.append('entity', entity);
          formData.append('type', 'NORMAL');
          formData.append('description', description);

          var result = await api.post({
            resource: 'document-v3.0/photo/add',
            data: formData,
            options: {
              headers: {
                'content-type': 'multipart/form-data;'
              }
            }
          });
        }
        Promise.all(files.filter((value, idx) => idx > 0).map(value => {
          let formData = new FormData();
          formData.append('photo', files[0]);
          formData.append('id', data.uuid);
          formData.append('entity', entity);
          formData.append('type', 'NORMAL');
          formData.append('description', description);
          formData.append('uploadId', result.uuid);

          return api.post({
            resource: 'document-v3.0/photo/add',
            data: formData,
            options: {
              headers: {
                'content-type': 'multipart/form-data;'
              }
            }
          });

        })).then(results => {
          clearHighlightAction(overviewType);
          if (overviewType === OverviewTypes.Pipeline.Qualified_Photo) {
            refreshQualifiedDetail('photo')
          } else if (overviewType === OverviewTypes.Account_Photo) {
            refreshOrganisation('photo')
          } else if (overviewType === OverviewTypes.Contact_Photo){
            refreshContact('photo')
          }
        }).finally(results => {
          clearHighlightAction(overviewType);
          if (overviewType === OverviewTypes.Pipeline.Qualified_Photo) {
            refreshQualifiedDetail('photo')
          } else if (overviewType === OverviewTypes.Account_Photo) {
            refreshOrganisation('photo')
          } else if (overviewType === OverviewTypes.Contact_Photo) {
            refreshContact('photo')
          }
        })

      } catch (error) {
      }
    },
  })
)(AddPhotoModal);
