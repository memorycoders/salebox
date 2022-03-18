import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Progress } from 'semantic-ui-react';
import css from '../academy.css';

export const ListItem = (props) => {
  const { item, totalVideo } = props;

  let difference = item?.endDate - item?.startDate;
  let days = Math.ceil(difference / (1000 * 3600 * 24));
  return (
    <Grid.Row className={css.leaderBoardItem} verticalAlign="top">
      <Grid.Column width={3} verticalAlign="top">
        <p style={{ fontWeight: 700 }}>
          {item?.userFirstName} {item?.userLastName}
        </p>
      </Grid.Column>
      <Grid.Column width={12} verticalAlign="top">
        <Progress
          className="progressLeaderBoard"
          color="blue"
          value={item?.numberOfFinishedVideos || 0}
          total={totalVideo}
          progress='ratio'
          // value='0' total='5' progress='ratio'
          // percent={(item?.numberOfFinishedVideos * 100) / totalVideo}
        />
      </Grid.Column>
      <Grid.Column width={1} verticalAlign="top">
        <p style={{ fontWeight: 700 }}>{`${days} days`}</p>
      </Grid.Column>
    </Grid.Row>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
