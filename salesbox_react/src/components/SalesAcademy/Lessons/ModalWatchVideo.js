import React, { Component, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Loader } from 'semantic-ui-react';
import ReactPlayer from 'react-player/vimeo';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

export const ModalWatchVideo = (props) => {
  const { visible, item, onClose, onDone } = props;
  const ref = useRef(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [item]);

  const handleOnClose = async () => {
    try {
      console.log('----Video:', ref.current.getCurrentTime());
      let watchedDuration = ref.current.getCurrentTime();

      const res = await api.post({
        resource: `${Endpoints.Enterprise}/saveVideoProgress`,
        data: {
          videoId: item?.videoId,
          watchedDuration: watchedDuration,
        },
      });
      if (res) {
        onClose(res.finished, res.watchedDuration);
      } else {
        onClose(false, null);
      }
    } catch (e) {
      onClose(false, null);
    }
  };

  const onPause = () => {
    console.log('----Video:', ref.current.getCurrentTime());
  };

  const handleVideoReady = () => {
    let duration = ref.current.getDuration();
    ref.current.seekTo(item?.watchedDuration >= duration ? duration : item?.watchedDuration);
    setError(false);
    setLoadingVideo(false);
  };

  const handleError = () => {
    setError(true);
    setLoadingVideo(false);
  };

  return (
    <ModalCommon
      visible={visible}
      title={item?.videoName}
      hasNotFooter
      okLabel={_l`Close`}
      scrolling={false}
      description={false}
      onClose={handleOnClose}
      onDone={onClose}
      size="small"
    >
      {error && <p style={{ fontSize: '11px' }}>Error to load video. Please try again.</p>}
      {loadingVideo && (
        <div style={{ backgroundColor: '#0000008f', height: '400px' }}>
          <Loader active={loadingVideo} size="huge" />
        </div>
      )}
      {!loadingVideo && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactPlayer
            ref={ref}
            onPause={onPause}
            playing={true}
            url={item?.embeddedLink}
            controls={true}
            width={690}
            height={400}
            onPlay={() => setError(false)}
            onReady={handleVideoReady}
            onError={handleError}
          />
        </div>
      )}
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModalWatchVideo);
