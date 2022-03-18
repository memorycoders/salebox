// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import cx from 'classnames';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from '../../components/MoreMenu/MoreMenu';
import css from './filterActionMenu.css';

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


const ComminicationFilterAction = ({ className, setTag, propsValueSet, imageClass }: PropsT) => {
  let tags = [
    {
        text: _l`Dials`,
        value: 1
    },
    {
        text: _l`Calls`,
        value: 0
    },
    {
        text: _l`Received Mail`,
        value: 7
    },
    {
        text: _l`Sent Mail`,
        value: 6
    },
    {
        text: _l`iMessage/SMS`,
        value: 3
    },
    {
        text: _l`Facetime Call`,
        value: 5
    }
]
    return (
        <MoreMenu imageClass={imageClass} className={className} color={CssNames.Task} filter={true}>
            <Menu.Item className={css.itemDropdown} icon onClick={() => setTag(null)}>
                <div className={css.left}>
                    <span>{_l`All`}</span>

                </div>
                {(propsValueSet === null) && <Icon name="check" />}
            </Menu.Item>
            {tags.map((tag, index) => {
                const { value, text } = tag;
                return <Menu.Item className={css.itemDropdown} onClick={() => setTag(value)} key={index}>
                    <div className={css.left}>
                        <span>{text}</span>
                    </div>
                    {(propsValueSet === value) && <Icon name="check" />}
                </Menu.Item>
            })}
        </MoreMenu>
    );
};

export default compose(

)(ComminicationFilterAction);
