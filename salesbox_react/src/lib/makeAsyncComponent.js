// @ flow
import importedComponent from 'react-imported-component';
import { Loading, ErrorMessage } from 'components';

export default (importFunc) => {
  return importedComponent(importFunc, {
    LoadingComponent: Loading,
    ErrorComponent: ErrorMessage,
  });
};
