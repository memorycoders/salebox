//@flow
import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getItemSelected } from '../../Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from '../../../lib/apiClient';
import { refeshDescriptionPhoto } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { refeshDescriptionAccountPhoto } from '../../Organisation/organisation.actions';
import { refeshDescriptionContactPhoto } from '../../Contact/contact.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Edit Description': 'Edit Description',
    No: 'No',
    Yes: 'Yes',
    Description: 'Description',
  },
});

const ModalEditPhoto = ({ visible, hide, onSave, selected }: PropsT) => {
  const [description, setDescription] = useState(selected ? selected.description : '');

  useEffect(() => {
    setTimeout(() => setDescription(selected ? selected.description : ''), 100);
  }, [selected]);

  const charLeft = 140 - description.length;
  return (
    <ModalCommon
      title={_l`Update description`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      visible={visible}
      onDone={() => onSave(description)}
      onClose={hide}
      size="tiny"
      paddingAsHeader={true}
    >
      <div className="edit-photo">
        <div className="label-edit-photo">{_l`Description`}</div>
        <Input
          maxLength={140}
          className="text-input"
          onChange={(value) => setDescription(value.target.value)}
          value={description}
        />
        <span className="span-charLeft">{charLeft}</span>
      </div>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'photo_edit');
    return {
      visible,
      selected: getItemSelected(state, overviewType),
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { overviewType }) => {
  return {
    clearHighlightAction: (overviewType) => dispatch(OverviewActions.clearHighlightAction(overviewType)),
    refeshDescriptionPhoto: (id, description) => {
      const func =
        overviewType === OverviewTypes.Pipeline.Qualified_Photo
          ? refeshDescriptionPhoto
          : overviewType === OverviewTypes.Account_Photo
          ? refeshDescriptionAccountPhoto
          : overviewType === OverviewTypes.Contact_Photo
          ? refeshDescriptionContactPhoto
          : refeshDescriptionContactPhoto;
      dispatch(func(id, description));
    },
  };
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),

  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ clearHighlightAction, overviewType, selected, refeshDescriptionPhoto }) => async (description) => {
      try {
        const result = await api.post({
          resource: 'document-v3.0/photo/editDescription',
          data: {
            uuid: selected.uuid,
            description,
          },
        });
        clearHighlightAction(overviewType);
        refeshDescriptionPhoto(selected.uuid, description);
      } catch (error) {
        console.log(error);
      }
    },
  })
)(ModalEditPhoto);
