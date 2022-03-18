//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { defaultProps, compose, pure, branch, renderNothing, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import { withRouter } from 'react-router';
import { Collapsible } from 'components';
import { Icon, Loader, Button, Menu } from 'semantic-ui-react';
import { ObjectTypes } from 'Constants';
import * as MultiRelationActions from './multi-relation.actions';
import css from './MultiRelation.css';
import { makeGetMultiRelations, isFetching } from './multi-relation.selectors';
import { DeleteCallListModal } from './DeleteRelation';
import { highlight } from '../Overview/overview.actions';
import add from '../../../public/Add.svg';

type PropsType = {
  multiRelations: Array<{}>,
  fetching: boolean,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Other relations': 'Other relations',
  },
});

const RightMenu = ({ createRelation }) => {
  return (
    <>
      <Menu.Item className={css.rightIcon} onClick={createRelation}>
        <img className={css.historyIcon} src={add} />
      </Menu.Item>
    </>
  );
};

const MultiRelationPane = ({
  createRelation,
  multiRelations,
  fetching,
  parentName,
  objectType,
  goto,
  onCloseDeleteModal,
  onSaveDeleteModal,
  visiable,
  openDeleteModal,
}: PropsType) => {

  const contacts = multiRelations.filter((multiRelation) => multiRelation && multiRelation.targetType === ObjectTypes.Contact);
  const accounts = multiRelations.filter((multiRelation) => multiRelation && multiRelation.targetType === ObjectTypes.Account);
  const onlyAccount = objectType === ObjectTypes.Account;

  return (
    <Collapsible
      hasDragable
      right={<RightMenu createRelation={createRelation} />}
      width={308}
      title={_l`Other relations`}
    >
      {fetching && (
        <div className={css.loader}>
          <Loader size="massive" inline active />
        </div>
      )}
      {!fetching && (
        <div className={css.wrapper}>
          <div className={css.spacer} />
          {multiRelations && multiRelations.length > 0 && (
            <Button
              style={{
                backgroundColor: objectType === ObjectTypes.Account ? '#5F6A7C' : 'rgb(97, 153, 139)',
                color: '#fff',
              }}
              className={`${css.relationInfo} ${css.relationParent} ${onlyAccount ? css.onlyAccount : ''}`}
              color="grey"
            >
              {parentName}
            </Button>
          )}
          {!onlyAccount && (
            <div className={css.contacts}>
              {contacts.map((relation) => {
                const { multiRelationDTO } = relation;
                return (
                  <div key={relation.uuid} className={css.item}>
                    <div>
                      <div>
                        <div>{multiRelationDTO.name}</div>
                        <div>
                          <Button.Group size="mini">
                            <Button
                              onClick={() => goto(relation.targetId, 'contact')}
                              className={`${css.relationInfo}`}
                              style={{ backgroundColor: 'rgb(97, 153, 139)', color: '#fff' }}
                              color="green"
                            >
                              {relation.targetName}
                            </Button>
                            <Button onClick={() => openDeleteModal(relation)} icon>
                              <Icon name="remove" />
                            </Button>
                          </Button.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className={css.accounts}>
            {accounts.map((relation) => {
              const { multiRelationDTO } = relation;
              return (
                <div key={relation.uuid} className={css.item}>
                  <div>
                    <div>
                      <div>{multiRelationDTO.name}</div>
                      <div>
                        <Button.Group size="mini">
                          <Button onClick={() => openDeleteModal(relation)} icon>
                            <Icon name="remove" />
                          </Button>
                          <Button
                            onClick={() => goto(relation.targetId)}
                            style={{ backgroundColor: '#5F6A7C', color: '#fff' }}
                            className={`${css.relationInfo} ${onlyAccount && css.onlyAccountButton}`}
                            color="#fff"
                          >
                            {relation.targetName}
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={css.spacer} />
        </div>
      )}
      <DeleteCallListModal visible={visiable} onClose={onCloseDeleteModal} onSave={onSaveDeleteModal} />
    </Collapsible>
  );
};

const makeMapStateToProps = () => {
  const getMultiRelations = makeGetMultiRelations();
  const mapStateToProps = (state, { objectType, objectId, multiRelations }) => ({
    multiRelations: getMultiRelations(state, multiRelations),
    fetching: isFetching(state, objectType, objectId),
  });
  return mapStateToProps;
};

export default compose(
  withRouter,
  defaultProps({
    multiRelations: [],
  }),
  connect(makeMapStateToProps, {
    requestFetch: MultiRelationActions.requestFetch,
    deleteRelation: MultiRelationActions.deleteRelation,
    highlight,
  }),
  withState('visiable', 'setVisiable', false),
  withState('itemChoise', 'setItemChoise', null),
  withGetData(({ requestFetch, objectType, objectId }) => () => requestFetch(objectType, objectId)),
  // branch(
  //   ({ multiRelations }) =>
  //     !multiRelations || !multiRelations.length,
  //   renderNothing
  // ),
  withHandlers({
    createRelation: ({ highlight, overviewType, objectId }) => () => {
      highlight(overviewType, objectId, 'add_relation');
    },

    goto: ({ history }) => (id, type) => {
      event.stopPropagation();
      if (type === 'contact') {
        return history.push(`/contacts/${id}`);
      }
      history.push(`/accounts/${id}`);
    },
    onSaveDeleteModal: ({ deleteRelation, objectType, objectId, itemChoise, setVisiable }) => () => {
      deleteRelation(itemChoise.uuid, objectType, objectId);
      setVisiable(false);
    },

    onCloseDeleteModal: ({ setVisiable }) => () => {
      setVisiable(false);
    },

    openDeleteModal: ({ setItemChoise, setVisiable }) => (item) => {
      setItemChoise(item);
      setVisiable(true);
    },
  }),
  pure
)(MultiRelationPane);
