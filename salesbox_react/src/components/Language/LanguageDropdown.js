//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getLanguageOptions } from 'lib/common';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
    'en-US': {
        'Select language': 'Select language',
    },
});

const LanguageDropdown = (props) => {
    return <Dropdown lazyLoad placeholder={_l`Select language`} fluid search selection {...props} />;
};

export default compose(
    connect((state) => ({
        options: getLanguageOptions(state),
    })),
    // eslint-disable-next-line no-unused-vars
    mapProps(({ dispatch, ...other }) => ({
        ...other,
    }))
)(LanguageDropdown);
