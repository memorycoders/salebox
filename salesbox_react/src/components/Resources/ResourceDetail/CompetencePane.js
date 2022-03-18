import React, { useEffect, useState, useRef } from 'react';
import CompetenceHeader from './CompetenceHeader';
import Sortable from 'sortablejs';
import {
  addSingleCompetence,
  createCompetenceName,
  deleteSingleCompetence,
  fetchCompetence,
  getAllCompetence,
  setCompetence,
  setCompetenceNameExist,
  updateCompetenceItem,
  updateMultipleCompetence,
  updateProfile,
  updateSingleCompetence,
} from '../resources.actions';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { Dropdown, Grid, Input, Popup } from 'semantic-ui-react';
import AddDropdown from '../../AddDropdown/AddDropdown';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import CompetenceList from './CompetenceList';

const levelOptions = [
  {
    key: 1,
    text: (
      <Popup
        hoverable
        content={{
          content: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 1 - Awareness`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>
                - {_l`Applies the competency in the simplest situations`}
              </p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires close and extensive guidance`}</p>
            </div>
          ),
        }}
        style={{ fontSize: 11 }}
        trigger={<p>1</p>}
      />
    ),
    des: 'test 1',
    value: 1,
  },
  {
    key: 2,
    text: (
      <Popup
        hoverable
        content={{
          content: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 2 - Basic`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>
                - {_l`Applies the competency in somewhat difficult situations`}
              </p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires frequent guidance`}</p>
            </div>
          ),
        }}
        style={{ fontSize: 11 }}
        trigger={<p>2</p>}
      />
    ),
    des: 'test 2',
    value: 2,
  },
  {
    key: 3,
    text: (
      <Popup
        hoverable
        content={{
          content: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 3 - Intermediate`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Applies the competency in difficult situations`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Requires occasional guidance`}</p>
            </div>
          ),
        }}
        style={{ fontSize: 11 }}
        trigger={<p>3</p>}
      />
    ),
    des: 'test 3',
    value: 3,
  },
  {
    key: 4,
    text: (
      <Popup
        hoverable
        content={{
          content: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 4 - Advanced`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>
                - {_l`Applies the competency in considerably difficult situations`}
              </p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Generally requires little or no guidance`}</p>
            </div>
          ),
        }}
        style={{ fontSize: 11 }}
        trigger={<p>4</p>}
      />
    ),
    des: 'test 4',
    value: 4,
  },
  {
    key: 5,
    text: (
      <Popup
        hoverable
        content={{
          content: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{_l`Level 5 - Expert`}</p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>
                - {_l`Applies the competency in exceptionally difficult situations`}
              </p>
              <p style={{ margin: 0, wordBreak: 'normal' }}>- {_l`Serves as a key resource and advises others`}</p>
            </div>
          ),
        }}
        style={{ fontSize: 11 }}
        trigger={<p>5</p>}
      />
    ),
    des: 'test 5',
    value: 5,
  },
];

let _sort;
const CompetencePane = (props) => {
  const {
    fetchCompetence,
    getAllCompetence,
    competences,
    createCompetenceName,
    match,
    conpetencesName,
    addSingleCompetence,
    deleteSingleCompetence,
    updateSingleCompetence,
    competenceItem,
    updateCompetenceItem,
    updateMultipleCompetence,
    isCompetenceNameExist,
    setCompetenceNameExist,
    LANGUAGE_RESOURCE_DETAIL
  } = props;

  const [isShowModalCompetence, showModalCompetence] = useState(false);
  const [isShowModalAddNewCompetenceItem, showModalAddNewCompetenceItem] = useState(false);
  const [lastUsedOption, setLastUsedOption] = useState([]);
  const [competenceName, updateCompetenceName] = useState('');
  const [isFieldError, setFieldError] = useState({
    competenceLevel: false,
    competenceId: false,
  });
  const [isShowConfirmDelete, showConfirmDelete] = useState(false);
  const [indexItemDelete, setIndexItemDelete] = useState(null);
  // const [competenceItem, updateCompetenceItem] = useState({
  //   competenceLevelId: null,
  //   competenceId: null,
  //   lastUsed: '',
  // });
  const [isEmptyCompetenceName, setEmptyCompetenceName] = useState(false);
  const refDropdownCompetence = useRef(null);
  useEffect(() => {
    let currentYear = new Date().getFullYear();
    let _lastUsedOption = [];
    for (let i = 0; i <= 50; i++) {
      let val = currentYear - i;
      _lastUsedOption.push({
        key: val,
        text: val,
        value: val,
      });
    }
    if (match.params && match.params.resourceId) {
      fetchCompetence(match.params.resourceId);
    }
    getAllCompetence(localStorage.getItem('language') || 'en');
    setLastUsedOption(_lastUsedOption);
  }, [LANGUAGE_RESOURCE_DETAIL]);


  useEffect(() => {
    // if (competences && competences.length > 0) {
    //   let _node = document.getElementById('list-competence');
    //   if (_sort) _sort.destroy();
    //   _sort = new Sortable(_node, {
    //     swap: true,
    //     swapClass: 'sortable-swap',
    //     onUpdate: (evt) => {
    //       let list = Array.from(competences);
    //       if (list[evt.newIndex] && list[evt.oldIndex]) {
    //         list[evt.newIndex].order = evt.oldIndex;
    //         list[evt.oldIndex].order = evt.newIndex;
    //         updateMultipleCompetence([list[evt.newIndex], list[evt.oldIndex]], match.params.resourceId);
    //       }
    //       // same properties as onEnd
    //     },
    //   });
    // }
  }, [competences]);

  const addCompetenceItem = () => {
    showModalCompetence(true);
  };
  const handleActionClose = () => {
    showModalCompetence(false);
    setFieldError({
      competenceLevel: false,
      competenceId: false,
    });
    updateCompetenceItem({
      ...competenceItem,
      competenceLevel:  '',
      competenceId:  '',
      lastUsed:  '',
    });
  };
  const handleActionDone = () => {
    if (!competenceItem?.competenceLevel) {
      setFieldError((isFieldError) => ({
        ...isFieldError,
        competenceLevel: true,
      }));
      return;
    }
    if (!competenceItem?.competenceId) {
      setFieldError((isFieldError) => ({
        ...isFieldError,
        competenceId: true,
      }));
      return;
    }
    handleActionClose();
    addSingleCompetence({
      ...competenceItem,
      resourceId: match.params.resourceId,
    });
  };
  const addNewCompetenceItem = () => {
    showModalCompetence(false);
    showModalAddNewCompetenceItem(true);
    updateCompetenceName(refDropdownCompetence?.current?.state.searchInput)
  };
  const handleActionCloseModalAddNew = () => {
    showModalCompetence(true);
    showModalAddNewCompetenceItem(false);
    setEmptyCompetenceName(false);
    updateCompetenceName('');
    setCompetenceNameExist(null);
  };
  const handleActionDoneModalAddNew = () => {
    if (competenceName.length === 0) {
      setEmptyCompetenceName(true);
      return;
    }
    createCompetenceName(competenceName, localStorage.getItem('language') || 'en');
  };

  useEffect(() => {
    if (isCompetenceNameExist === false) {
      showModalCompetence(true);
      showModalAddNewCompetenceItem(false);
      updateCompetenceName('');
      setCompetenceNameExist(null);
    }
  }, [isCompetenceNameExist]);

  const handleChangeCompetenceName = (e) => {
    updateCompetenceName(e.currentTarget.value);
    if (e.currentTarget.value.length > 0) {
      setEmptyCompetenceName(false);
    } else {
      setEmptyCompetenceName(true);
    }
  };

  const onChangeCompentenceDropdown = (field, item) => {
    setFieldError((isFieldError) => ({
      ...isFieldError,
      [field]: false,
    }));

    updateCompetenceItem({
      ...competenceItem,
      [field]: item?.value
    });

  };

  const deleteCompetenceItem = (index) => {
    showConfirmDelete(true);
    setIndexItemDelete(index);
  };

  const closeConfirmDeleteCompetence = () => {
    showConfirmDelete(false);
  };

  const doneConfirmDeleteCompetence = () => {
    showConfirmDelete(false);
    if (competences[indexItemDelete]) {
      deleteSingleCompetence({
        resourceId: match.params.resourceId,
        resourceCompetenceId: competences[indexItemDelete].uuid,
      });
    }
  };

  return (
    <>
      <div className="competenceContainer">
        <CompetenceHeader addCompetenceItem={addCompetenceItem} />
        <div id="list-competence" style={{ overflowY: 'auto', height: '85vh', overflowX: 'hidden' }}>
          <CompetenceList
            competences={competences}
            conpetencesName={conpetencesName}
            levelOptions={levelOptions}
            lastUsedOption={lastUsedOption}
            deleteCompetenceItem={deleteCompetenceItem}
            updateSingleCompetence={updateSingleCompetence}
            resourceId={match.params.resourceId}
          />
        </div>
      </div>
      <ModalCommon
        title={_l`Add competence`}
        visible={isShowModalCompetence}
        size="tiny"
        onClose={handleActionClose}
        onDone={handleActionDone}
      >
        <Grid className="position-unset">
          <Grid.Row className="position-unset">
            <Grid.Column width="3" verticalAlign="middle">
              <b>
                {_l`Level`}
                <span style={{ color: 'red' }}>*</span>
              </b>
            </Grid.Column>
            <Grid.Column width="13" className="position-unset">
              <Dropdown
                error={isFieldError.competenceLevel}
                id="dropdowm_level_competence"
                className="position-clear"
                placeholder={_l`Level`}
                fluid
                selection
                search
                options={levelOptions}
                value={competenceItem && competenceItem.competenceLevel}
                onChange={(e, item) => {
                  onChangeCompentenceDropdown('competenceLevel', item);
                }}
                onClick={() => {
                  calculatingPositionMenuDropdown('dropdowm_level_competence');
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="position-unset">
            <Grid.Column width="3" verticalAlign="middle">
              <b>
                {_l`Competence`}
                <span style={{ color: 'red' }}>*</span>
              </b>
            </Grid.Column>
            <Grid.Column width="13" className="position-unset">
              <AddDropdown
                error={isFieldError.competenceId}
                placeholder={_l`Competence`}
                fluid
                className="position-clear"
                selection
                search
                options={conpetencesName}
                onChange={(e, item) => {
                  onChangeCompentenceDropdown('competenceId', item);
                }}
                value={competenceItem && competenceItem.competenceId}
                onClickAdd={addNewCompetenceItem}
                colId="dropdowm_competence"
                onClick={() => {
                  calculatingPositionMenuDropdown('dropdowm_competence');
                }}
                ref={refDropdownCompetence}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="position-unset">
            <Grid.Column width="3" verticalAlign="middle">
              <b>{_l`Last used`}</b>
            </Grid.Column>
            <Grid.Column width="13" className="position-unset">
              <Dropdown
                className="position-clear"
                placeholder={_l`Last used`}
                fluid
                selection
                search
                value={competenceItem && competenceItem.lastUsed}
                onChange={(e, item) => {
                  onChangeCompentenceDropdown('lastUsed', item);
                }}
                options={lastUsedOption}
                id="dropdowm_last_used_competence"
                onClick={() => {
                  calculatingPositionMenuDropdown('dropdowm_last_used_competence');
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </ModalCommon>
      <ModalCommon
        title={_l`Add new competence`}
        visible={isShowModalAddNewCompetenceItem}
        size="tiny"
        onClose={handleActionCloseModalAddNew}
        onDone={handleActionDoneModalAddNew}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width="4" verticalAlign="middle">
              <b>
                {_l`Competence`} <span style={{ color: 'red' }}>*</span>
              </b>
            </Grid.Column>
            <Grid.Column width="12">
              <Input
                fluid
                value={competenceName}
                error={isEmptyCompetenceName || isCompetenceNameExist}
                onChange={handleChangeCompetenceName}
              ></Input>
              {isCompetenceNameExist ? <p style={{ color: 'red' }}> {_l`Name already exist.`}</p> : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </ModalCommon>
      <ModalCommon
        title={_l`Confirm`}
        size="tiny"
        visible={isShowConfirmDelete}
        onClose={closeConfirmDeleteCompetence}
        onDone={doneConfirmDeleteCompetence}
      >
        <p>{_l`Do you really want to delete competence?`}</p>
      </ModalCommon>
    </>
  );
};
const mapDispatchToProps = {
  fetchCompetence: fetchCompetence,
  createCompetenceName: createCompetenceName,
  getAllCompetence: getAllCompetence,
  updateProfile: updateProfile,
  addSingleCompetence: addSingleCompetence,
  deleteSingleCompetence: deleteSingleCompetence,
  setCompetence: setCompetence,
  updateSingleCompetence: updateSingleCompetence,
  updateCompetenceItem: updateCompetenceItem,
  updateMultipleCompetence: updateMultipleCompetence,
  setCompetenceNameExist: setCompetenceNameExist,
};

const mapStateToProps = (state) => {
  return {
    competences: state.entities.resources.competences,
    conpetencesName: state.entities.resources.competencesName,
    competenceItem: state.entities.resources.competenceItem,
    isCompetenceNameExist: state.entities.resources.isCompetenceNameExist,
    LANGUAGE_RESOURCE_DETAIL: state.entities?.resources?.LANGUAGE_RESOURCE_DETAIL
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompetencePane);
