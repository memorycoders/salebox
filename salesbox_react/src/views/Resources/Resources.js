import React from 'react';
import { PaneledList } from 'components';
import { withRouter, Route, Switch } from 'react-router';
import InfiniteResourcesList from '../../components/Resources/InfiniteResourcesList';
import ResourceDetail from '../../components/Resources/ResourceDetail/ResourceDetail';

const Resources = ({ location, hasDetail }) => {
  const list = (
    <Switch>
      <Route exact path="/resources" component={InfiniteResourcesList} />
      <Route exact path="/resources/:resourceId" component={ResourceDetail} />
    </Switch>
  );
  const detail = <></>;
  return <PaneledList list={list} detail={detail} hasDetail={hasDetail} />;
};

export default Resources;
