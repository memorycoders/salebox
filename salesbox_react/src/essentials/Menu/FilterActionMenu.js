// @flow
import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import * as TagActions from 'components/Tag/tag.actions';
import {
  getTags,
  getFilterTags,
  getTagsSort,
  getTagsUnqualified,
  getTagsQualified,
  getFilterOrder,
  getFilterSublistCalllist,
  getFilterResourceList,
  getFilterRecruitmentClose
} from 'components/Tag/tag.selector';
import { getSearch } from '../../components/AdvancedSearch/advanced-search.selectors';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Menu, Icon } from 'semantic-ui-react';
import { setTag, setOrderBy } from '../../components/AdvancedSearch/advanced-search.actions';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from '../../components/MoreMenu/MoreMenu';
import { withGetData } from 'lib/hocHelpers';
import css from './filterActionMenu.css';
import { ObjectTypes, OverviewTypes } from '../../Constants';
import wonIcon from '../../../public/star_circle_won_active.svg';
import lostIcon from '../../../public/star_circle_lost_active.svg';
import { filterSublistOrder } from '../../components/Organisation/organisation.actions';
import { filterSublistOrderInContact } from '../../components/Contact/contact.actions';
import { filterSublistAccountCalllist } from '../../components/CallListAccount/callListAccount.actions';
import { filterSublistContactCalllist } from '../../components/CallListContact/callListContact.actions';
import call from '../../../public/answer_call_16.svg';
import dial from '../../../public/unanswer_call_16.svg';
import noCall from '../../../public/green_block.svg';
import noDial from '../../../public/red_block.svg';

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

const FilterActionMenu = ({ className, tags, setTag, tagState, propsValueSet, imageClass }: PropsT) => {
  return (
    <MoreMenu imageClass={imageClass} className={className} color={CssNames.Task} filter={true}>
      <Menu.Item className={css.itemDropdown} icon onClick={() => setTag(null)}>
        <div className={css.left}>
          <span className={cx(css.tagCircle)}></span>
          {_l`All`}
        </div>
        {!tagState && !propsValueSet && <Icon name="check" />}
      </Menu.Item>
      {tags.map((tag, index) => {
        const { label, text, value } = tag;
        return (
          <Menu.Item className={css.itemDropdown} onClick={() => setTag(value)} key={index}>
            <div className={css.left}>
              {(label === 'Won' || label === 'Yes') ? (
                <img className={css.tagCircle} style={{ height: '15px', width: '15px' }} src={wonIcon} />
              ) : (label === 'Lost' || label === 'No') ? (
                <img className={css.tagCircle} style={{ height: '15px', width: '18px' }} src={lostIcon} />
              ) : label === 'Dials' ? (
                <img className={`${css.tagCircle}`} src={dial} />
              ) : label === 'Calls' ? (
                <img className={`${css.tagCircle}`} src={call} />
              ) : label === 'No Dials' ? (
                <img className={`${css.tagCircle}`} src={noDial} />
              ) : label === 'No Calls' ? (
                <img className={`${css.tagCircle}`} style={{ width: '18px', height: '18px' }} src={noCall} />
              ) : label === 'No Dials and Calls' ? (
                <div>
                  <img className={`${css.tagCircle}`} src={noDial} />
                  <img className={`${css.tagCircle}`} src={noCall} />
                </div>
              ) : (
                <span className={cx(css.tagCircle, css[label ? label.color : ''])}></span>
              )}
              <span>{_l.call(this, [text])}</span>

              {/* {label === 'Won' ? (
                <img className={css.tagCircle} style={{ height: '15px', width: '15px' }} src={wonIcon} />
              ) : label === 'Lost' ? (
                <img className={css.tagCircle} style={{ height: '15px', width: '18px' }} src={lostIcon} />
              ) : (
                <span className={cx(css.tagCircle, css[label ? label.color : ''])}></span>
              )}
              <span>{text}</span> */}
            </div>
            {(tagState === value || propsValueSet === value) && <Icon name="check" />}
          </Menu.Item>
        );
      })}
    </MoreMenu>
  );
};

export default compose(
  connect(
    (state, { filter, objectType }) => {
      const search = getSearch(state, objectType);
      let tagFiter = null;
      switch (objectType) {
        case ObjectTypes.Task:
        case ObjectTypes.Delegation:
          tagFiter = filter ? getFilterTags(state) : getTagsSort(state);
          break;
        case ObjectTypes.PipelineLead:
        case ObjectTypes.DelegationLead:
          tagFiter = getTagsUnqualified();
          break;
        case ObjectTypes.PipelineQualified:
          tagFiter = getTagsQualified();
          break;
        case ObjectTypes.PipelineOrder:
          tagFiter = getFilterOrder();
          break;
        case ObjectTypes.AccountOrder:
          tagFiter = getFilterOrder();
          break;
        case ObjectTypes.ContactOrder:
          tagFiter = getFilterOrder();
          break;
        case ObjectTypes.SubCallListAccount:
          tagFiter = getFilterSublistCalllist();
          break;
        case ObjectTypes.SubCallListContact:
          tagFiter = getFilterSublistCalllist();
          break;
        case ObjectTypes.RecruitmentClosed:
          tagFiter = getFilterRecruitmentClose();
          break;
        case ObjectTypes.Resource:
          tagFiter = getFilterResourceList();
          break;
        default:
          tagFiter = filter ? getFilterTags(state) : getTagsSort(state);
          break;
      }
      return {
        /*

        tags: objectType == ObjectTypes.PipelineLead || ObjectTypes.DelegationLead ? getTagsUnqualified() :
          (filter ? getFilterTags(state) : getTagsSort(state)),
*/
        tags: tagFiter,
        tagState: search.tag,
      };
    },
    {
      requestFetchDropdown: TagActions.requestFetchDropdown,
      setTag: setTag,
      setOrderBy,
      filterSublistOrder,
      filterSublistOrderInContact,
      filterSublistAccountCalllist,
      filterSublistContactCalllist,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { setTag, objectType } = this.props;
      // setTag(objectType,null)
    },
  }),
  withGetData(({ requestFetchDropdown }) => () => requestFetchDropdown()),
  withHandlers({
    setTag: ({
      objectType,
      setTag,
      setTagManual,
      setOrderBy,
      filterSublistOrder,
      data,
      filterSublistOrderInContact,
      filterSublistAccountCalllist,
      filterSublistContactCalllist,
    }) => (tagId) => {
      // if(ObjectTypes.AccountOrder === objectType){
      if (ObjectTypes.AccountOrder === objectType) {
        setTag(objectType, tagId);
        filterSublistOrder(data.uuid, tagId);
        return;
      }
      if (ObjectTypes.ContactOrder === objectType) {
        setTag(objectType, tagId);
        filterSublistOrderInContact(data.uuid, tagId);
        return;
      }
      if (ObjectTypes.PipelineQualified === objectType) {
        setOrderBy(objectType, tagId);
        if (setTagManual) {
          return setTagManual(tagId);
        }
        setTag(objectType, tagId);
      } else if (ObjectTypes.SubCallListAccount === objectType) {
        setTag(objectType, tagId);
        filterSublistAccountCalllist(data.uuid, tagId);
        return;
      } else if (ObjectTypes.SubCallListContact === objectType) {
        setTag(objectType, tagId);
        filterSublistContactCalllist(data.uuid, tagId);
      } else {
        if (setTagManual) {
          return setTagManual(tagId);
        }
        setTag(objectType, tagId);
      }
    },
  })
)(FilterActionMenu);
