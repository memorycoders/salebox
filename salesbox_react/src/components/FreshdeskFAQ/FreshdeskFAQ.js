import * as React from 'react';
import questionCircleGray from '../../../public/faq_icon.svg';
import css from "../AppBar/AppBar.css";
import setting from "../AppBar/Settings.svg";
import {IconButton} from "../Common/IconButton";

const initLoadFreshdeskFAQ = () =>{

  var langBrow=navigator.language || navigator.browserLanguage;
  var currLang='en'
  langBrow=langBrow.toLowerCase();
  if(langBrow.startsWith("en")){
    currLang ='en';
  }else
  if(langBrow.toLowerCase().startsWith("se") || langBrow.toLowerCase().startsWith("sv")){
    currLang ='se';
  }else
  if(langBrow.toLowerCase().startsWith("de")){
    currLang ='de';
  }else
  if(langBrow.toLowerCase().startsWith("es")){
    currLang ='es-LA';
  }else
  if(langBrow.toLowerCase().startsWith("pt")){
    currLang ='pt';
  }
  console.log("FreshworksWidget currLang ",currLang);

  window.fwSettings={
    'widget_id':9000000162, 'locale': currLang
  };
  !function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}()
  FreshworksWidget('hide', 'launcher');

  const script = document.createElement("script");
  script.src = "https://widget.freshworks.com/widgets/9000000162.js";
  script.async = true;
  script.defer = true;
  script.dataContact = false;
  script.dataRemove= false;

  document.body.appendChild(script);
  console.log("freshdesk componentDidMount");

}
class FreshdeskFAQ extends React.Component {
  constructor(props) {
    super(props)
/*

*/

  }
  componentDidMount(): void {
    // initLoadFreshdeskFAQ();
  }

  openWidget = () => {
    FreshworksWidget('open');
  }

  render() {

    return (
      <>
        <IconButton imageClass={css.faqIcon} name="profile" size={36} src={questionCircleGray}  onClick={this.openWidget}  />

      </>
    )
  }

}
export {initLoadFreshdeskFAQ};
export default FreshdeskFAQ;
