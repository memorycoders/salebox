//@flow
import * as React from 'react';
import { compose, branch, renderNothing, renderComponent } from 'recompose';
import { Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import FocusDescription from './FocusDescription';
import css from './FocusPopup.css';
import otherCss from "../CompanySettings/DefaultValues/SaleProcess/Detail/style.css";

type PropsT = {
  focus: {},
};

addTranslations({
  'en-US': {
    Focus: 'Focus',
  },
});

const FocusPopup = ({ focus ,showIcon, isDescriptionPopup} : PropsT) => {
  let focusName = focus.name
  return (
    <Popup trigger={<div>{ showIcon ?
      <div className={`${otherCss.infoIcon}`} style={{ marginLeft: '10' }} />
      :_l`${focusName}`} </div>} wide>
      <Popup.Header><span className={css.header}>{isDescriptionPopup ? _l`Description` :_l`Focus`}</span></Popup.Header>
      <Popup.Content><span className={css.content}>{focus.description}</span></Popup.Content>
      <FocusDescription discProfile={focus.discProfile} />
    </Popup>
  );
};

const FocusName = ({ focus }: PropsT) => <div>{focus.name}</div>;

export default compose(
  branch(({ focus }) => !focus, renderNothing),
  branch(({ focus }) => !focus.description, renderComponent(FocusName))
)(FocusPopup);
