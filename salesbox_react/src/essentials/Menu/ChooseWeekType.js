// @flow
import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from '../../components/MoreMenu/MoreMenu';
import { withGetData } from 'lib/hocHelpers';
import css from './filterActionMenu.css';
import { getPeriod } from '../../components/PeriodSelector/period-selector.selectors';
import { ObjectTypes, OverviewTypes } from '../../Constants';
import { updateWeekType } from '../../components/PeriodSelector/period-selector.actions'

type PropsT = {
    filterByTags: (string) => void,
    className: string,
    tags: Array<CategoryT>,
};

addTranslations({
    'en-US': {
        All: 'All',
    },
});

const ChooseWeekType = ({ className, weekType, imageClass, updateWeekType, objectType }: PropsT) => {
    return (
        <MoreMenu imageClass={imageClass} className={className} color={CssNames.Task} filter={true}>
            <Menu.Item className={css.itemDropdown} icon onClick={() => updateWeekType(objectType, '5_DAYS')}>
                <div className={css.left}>
                    {_l`5 days`}
                </div>
                {weekType === '5_DAYS' && <Icon name="check" />}
            </Menu.Item>
            <Menu.Item className={css.itemDropdown} icon onClick={() => updateWeekType(objectType, '7_DAYS')}>
                <div className={css.left}>
                    {_l`7 days`}
                </div>
                {weekType === '7_DAYS' && <Icon name="check" />}
            </Menu.Item>
        </MoreMenu>
    );
};

export default compose(
    connect((state, { objectType }) => {
        const period = getPeriod(state, objectType);
        return {
            weekType: period.weekType ? period.weekType : '7_DAYS'
        }
    },
        {
            updateWeekType
        }
    ),
    withHandlers({

    })
)(ChooseWeekType);
