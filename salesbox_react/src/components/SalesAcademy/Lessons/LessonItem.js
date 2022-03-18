import React, { Component, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/vimeo';
import _l from 'lib/i18n';
import { Button, Progress, Image, Popup } from 'semantic-ui-react';
import css from '../academy.css';
import playVimeoBlack from '../../../../public/play-vimeo-black.png';
import playVimeoBlue from '../../../../public/play-vimeo-blue.png';
import moment from 'moment';

export const LessonItem = (props) => {
  const { index, item } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [imagePlay, setImagePlay] = useState(playVimeoBlack);
  const [progress, setProgress] = useState(0);

  const ref = useRef(null);

  useEffect(() => {
    if (item) {
      setProgress((item.watchedDuration / item.totalDuration) * 100);
    }
  }, [item]);
  // const src = useMemo(() => {
  //   return props.item?.embeddedLink;
  // }, [item]);

  let screenWidth = window.innerWidth;
  let witdthVideo = 180;
  if (screenWidth) {
  }

  let limit = 35;
  const formatName = (e) => {
    if (e?.length > limit) {
      return `${e.slice(0, limit)}...`;
    }
    return e;
  };

  let formatTotalDuration = moment
    .utc(moment.duration(item?.totalDuration, 'seconds').asMilliseconds())
    .format('mm:ss');

  const handleDownloadDocument = () => {
    if (item?.documentUrls?.length === 0) {
      props.notiError('The document is on its way');
    } else {
      item?.documentUrls?.map((e) => {
        // window.open(e, '_blank');
        download(e);
      });
    }
  };
  function download(url) {
    try {
      fetch(url).then(function(t) {
        return t.blob().then((b) => {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(b);
          let filename = url.substr(
            'https://salesboxstaging.s3-eu-west-1.amazonaws.com/salesbox/templates/academy_documents/'.length
          );
          a.setAttribute('download', filename);
          a.click();
        });
      });
    } catch (error) {
      // window.open(url, '_blank');
    }
  }
  return (
    <div className={css.containerItem}>
      <div
        className={css.labelVideoItem}
        onClick={() => {
          props.onClick(item);
        }}
      >
        <span>{index}</span>
        {item?.videoName?.length > limit ? (
          <Popup
            content={<p style={{ fontSize: '11px' }}>{item?.videoName}</p>}
            trigger={<p>{formatName(item?.videoName)}</p>}
          />
        ) : (
          <p>{item?.videoName}</p>
        )}
      </div>

      <ReactPlayer
        ref={ref}
        url={item?.embeddedLink}
        controls={false}
        width={260}
        height={160}
        onClick={() => {
          props.onClick(item);
        }}
      />
      <div className={css.divButton}>
        <Button className={css.button} onClick={handleDownloadDocument}>{_l`Download document`}</Button>
      </div>
      <div className={css.buttonPlayVideoDiv}>
        <Image
          src={imagePlay}
          className={css.buttonPlayVideo}
          onClick={() => {
            props.onClick(item);
          }}
          onMouseEnter={() => {
            setImagePlay(playVimeoBlue);
          }}
          onMouseLeave={() => {
            setImagePlay(playVimeoBlack);
          }}
        />
      </div>
      <div className={css.progressDiv}>
        <Progress id="videoProgressBar" size="tiny" color="blue" percent={progress} />
      </div>
      <div className={css.videoDuration}>{formatTotalDuration}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);
