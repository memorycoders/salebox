import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Progress } from 'semantic-ui-react';
import css from '../academy.css';
import { LessonItem } from './LessonItem';
import ModalWatchVideo from './ModalWatchVideo';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import * as NotificationActions from '../../Notification/notification.actions';
import cx from 'classnames';

export const Lessons = (props) => {
  const [listVideo, setListVideo] = useState([]);
  const [totalPercentDone, setTotalPercentDone] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleWatchVideo, setVisibleWatchVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!mounted) {
      fetchListVideo();
    }
    setMounted(true);
  }, []);

  const fetchListVideo = async () => {
    console.log('Load video here');
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/getAllAcademyVideosForUser`,
      });
      if (res) {
        setListVideo(res.academyUserVideoProgressDTOList);
        let totalVideoDone = res.academyUserVideoProgressDTOList.filter((e) => e.finished).length;

        setTotalPercentDone(totalVideoDone);
      }
      // setListVideo(mockData);
    } catch (error) {}
  };

  const selectVideo = (item) => {
    if (item?.embeddedLink) {
      setSelectedVideo(item);
      setVisibleWatchVideo(true);
    }
  };
  const onDone = () => {};

  const onClose = (finished, watchedDuration) => {
    setVisibleWatchVideo(false);
    console.log('Finished video:', finished);
    let index = listVideo.findIndex((e) => e.videoId === selectedVideo.videoId);

    let newList = [
      ...listVideo.slice(0, index),
      {
        ...selectedVideo,
        finished: finished,
        watchedDuration:
          watchedDuration > selectedVideo.watchedDuration ? watchedDuration : selectedVideo.watchedDuration,
      },
      ...listVideo.slice(index + 1, listVideo.length),
    ];
    let totalVideoDone = newList.filter((e) => e.finished).length;

    setTotalPercentDone(totalVideoDone);
    setListVideo(newList);
    setSelectedVideo(null);
  };

  return (
    <>
      <div className={css.container}>
        <Progress
          id="progressBarLessonList"
          color="blue"
          progress="ratio"
          total={listVideo?.length || 0}
          value={totalPercentDone}
          style={{ marginBottom: 10 }}
        />
        <div className={css.subContainer}>
          <div className={listVideo?.length > 6 ? css.listItem : css.listItemLess}>
            {listVideo.map((e, index) => {
              return (
                <LessonItem notiError={props.notiError} key={index} index={index + 1} item={e} onClick={selectVideo} />
              );
            })}
          </div>
        </div>
      </div>
      <ModalWatchVideo visible={visibleWatchVideo} item={selectedVideo} onDone={onDone} onClose={onClose} />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  notiError: NotificationActions.error,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
