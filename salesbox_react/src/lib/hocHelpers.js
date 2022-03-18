// @flow
import * as React from 'react';
import { lifecycle, withProps, withHandlers, compose, renderComponent, branch } from 'recompose';
import { Loader } from 'semantic-ui-react';
import { ErrorBoundary } from 'components';

type GetDataT = ({}) => any;
type IsLoadingT = ({}) => boolean;

export const withGetData = (getData: GetDataT) =>
  compose(
    withHandlers({
      getData,
    }),
    lifecycle({
      componentDidMount() {
        const { getData } = this.props;
        getData();
      },
    })
  );

export const withErrorBoundary = () =>
  compose(
    lifecycle({
      componentDidCatch(error, info) {
        this.setState({ error, info });
      },
    }),
    branch(({ error }) => error, renderComponent(({ error, info }) => <ErrorBoundary error={error} info={info} />))
  );

export const spinnerWhileLoading = (isLoading: IsLoadingT) => branch(isLoading, renderComponent(Loader));

export const debug = withProps(console.log);
