//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, pure, lifecycle, withHandlers } from 'recompose';
import { Collapsible } from 'components';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { Menu, Image, Loader } from 'semantic-ui-react';
import { fetchPhotos } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { requestFetchAccountPhotos } from '../../Organisation/organisation.actions';
import { requestFetchContactPhotos } from '../../Contact/contact.actions';
import css from '../../PipeLineQualifiedDeals/Cards/TasksCard.css';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';
import add from '../../../../public/Add.svg';
import { highlight } from '../../Overview/overview.actions';
import { PhotosListView } from './PhotoListView';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Photos: 'Photos',
  },
});

const RightMenu = ({ createPhoto }) => {
  return (
    <>
      <Menu.Item className={cx(css.rightIcon)} onClick={createPhoto}>
        <Image className={css.historyIcon} src={add} />
      </Menu.Item>
    </>
  );
};

const PhotosPane = ({ onCreatePhoto, overviewTypePhoto, data, isFetching }) => {
  const { photos } = data;
  // if (unqualifiedDeal.countOfActiveTask === 0 || tasks && tasks.length === 0) {
  let showRightMenu = true;
  if (
    overviewTypePhoto == OverviewTypes.Contact_Photo ||
    overviewTypePhoto == OverviewTypes.Account_Photo ||
    overviewTypePhoto == OverviewTypes.Pipeline.Qualified_Photo
  ) {
    showRightMenu = false;
  }

  if (!photos || photos.length === 0) {
    return (
      <Collapsible
        count="0"
        rightClassName={css.headerRight}
        right={showRightMenu && <RightMenu createPhoto={onCreatePhoto} />}
        width={308}
        title={_l`Photos`}
      >
        <div style={{ padding: '10px' }}>
          {isFetching ? (
            <div className={isFetching && css.isFetching}>
              <Loader active={isFetching}>Loading</Loader>
            </div>
          ) : (
            <Message active info>
              {_l`No photos`}
            </Message>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      rightClassName={css.headerRight}
      right={showRightMenu && <RightMenu createPhoto={onCreatePhoto} />}
      width={308}
      title={_l`Photos`}
      count={photos ? photos.length : ''}
      open={true}
    >
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <PhotosListView overviewType={overviewTypePhoto} data={data} photos={photos} />
      )}
    </Collapsible>
  );
};

const mapDispatchToProps = (dispatch, { overviewTypePhoto }) => {
  return {
    highlight: (overviewTypePhoto, id, type) => dispatch(highlight(overviewTypePhoto, id, type)),
    fetchPhotos: (id) => {
      const func =
        overviewTypePhoto === OverviewTypes.Pipeline.Qualified_Photo
          ? fetchPhotos
          : overviewTypePhoto === OverviewTypes.Account_Photo
          ? requestFetchAccountPhotos
          : overviewTypePhoto === OverviewTypes.Contact_Photo
          ? requestFetchContactPhotos
          : requestFetchContactPhotos;

      dispatch(func(id));
    },
  };
};
const mapStateToProps = (state, { overviewTypePhoto }) => {
  return {
    /*
    isFetching:
      overviewTypePhoto === OverviewTypes.Pipeline.Qualified_Photo
        ? state.overview.PIPELINE_QUALIFIED.isFetching
        : overviewTypePhoto === OverviewTypes.Account_Photo
        ? state.overview.ACCOUNTS.isFetching
        : overviewTypePhoto === OverviewTypes.Contact_Photo
        ? state.overview.CONTACTS.isFetching
        : false,
*/
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),

  //orderBy
  withGetData(({ fetchPhotos, data }) => () => {
    fetchPhotos(data.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { fetchPhotos, data } = this.props;
      if (data.uuid !== nextProps.data.uuid) {
        fetchPhotos(nextProps.data.uuid);
      }
    },
  }),
  withHandlers({
    onCreatePhoto: ({ highlight, overviewTypePhoto }) => () => {
      highlight(overviewTypePhoto, null, 'add_photo');
    },
  })
)(PhotosPane);
