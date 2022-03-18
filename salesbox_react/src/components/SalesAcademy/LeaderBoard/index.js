import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { ListItem } from './ListItem';
import css from '../academy.css';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

export const LeaderBoard = (props) => {
  const [listData, setListData] = useState([]);
  const [totalVideo, setTotalVideo] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data here
  const fetchData = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/getLeaderBoard`,
      });
      if (res) {
        setListData(res.leaderBoardDTOList);
        setTotalVideo(res.totalVideos);
      }
    } catch (e) {}
  };
  return (
    <div className={css.subContainer}>
      <Grid style={{ marginTop: '2em' }}>
        {listData?.map((e, index) => {
          console.log(e);
          return <ListItem totalVideo={totalVideo} key={index} item={e} />;
        })}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
