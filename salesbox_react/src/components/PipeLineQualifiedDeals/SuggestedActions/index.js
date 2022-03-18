//@flow

import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import * as OverviewActions from '../../Overview/overview.actions';
import {fetchProspectLite, setLostDeal, setWonDeal} from './../qualifiedDeal.actions';
import { isHighlightAction, getTempDataQualifiedDeal } from 'components/Overview/overview.selectors';
import { Table, TableRow, TableCell, TableBody } from 'semantic-ui-react';
import { getQualified } from '../qualifiedDeal.selector';
import { getHighlighted } from '../../Overview/overview.selectors';
import { Router, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { setWonLostDone } from '../TaskSteps/TrelloElement/trello-action';
import { OverviewTypes, Endpoints } from 'Constants';
import { refreshOrganisation } from 'components/Organisation/organisation.actions';
import { refreshContact } from 'components/Contact/contact.actions';
import css from './SuggestedActions.css';
import {compose, withHandlers} from "recompose";
import { updateCreateEntity } from '../../Task/task.actions';
import api from 'lib/apiClient';
import { contactItem } from '../../Contact/contact.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import { prospectConcatItem } from '../../Prospect/prospect.action';
import {getUser} from "../../Auth/auth.selector";


addTranslations({
  'en-US': {
    'Suggested actions': 'Suggested actions',
    Done: 'Done',
    'Sorry to see you lost this one! Perhaps it’s not lost forever?':
      'Sorry to see you lost this one! Perhaps it’s not lost forever?',
    'It might be good to add a reason or a follow up reminder in the future.':
      'It might be good to add a reason or a follow up reminder in the future.',
    'Congratulations and well done! Do you want to add something more?':
      'Congratulations and well done! Do you want to add something more?',
    '- For single deals: Add a follow up reminder to yourself or a colleague?':
      '- For single deals: Add a follow up reminder to yourself or a colleague?',
    '- For recurring deals: Create copies for each invoice period or for the renewal?':
      '- For recurring deals: Create copies for each invoice period or for the renewal?',
  },
});

class index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };
  }

  onDone = () => {
    const { overviewType, clearHighlight, tempData, setLostDeal, qualifiedDeal, setWonLostDone, refreshOrganisation, refreshContact } = this.props;

    const body = {
      won: tempData.selectedWon,
      isUseToday: tempData.isUseToday,
      uuid: qualifiedDeal.uuid,
      isOrder: qualifiedDeal.won != null
    };

    //action for trello
    setWonLostDone(qualifiedDeal.uuid);
    setLostDeal(overviewType, body);
    clearHighlight(overviewType);
/*    if(overviewType === OverviewTypes.Account_Qualified){
      refreshOrganisation('qualified');
    }
    if(overviewType === OverviewTypes.Contact_Qualified){
      refreshContact('qualified');
    }*/
    if (qualifiedDeal.won == null) {
      this.setState({
        redirect: overviewType === OverviewTypes.Pipeline.Order ? true : false,
      });
    }
    // const history = createBrowserHistory();
    // history.push('/pipeline/overview');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ redirect: false });
    }
  }
  handleOnClickActions = (action) => {
    console.log('action: ',action);
    switch (action) {
      case 'ADD_TASK':
        this.addTask(this.props);
        break;
      case 'ADD_APPOINTMENT':
        this.addAppointment(this.props)
        break;
      case 'COPY':
        this.onCopy(this.props);
        break;
      case 'ADD_NOTE':
        this.addNote(this.props);
        break;
    }

    // return () => {
    // };
  };

  addTask = ({overviewType, setActionForHighlight, qualifiedDeal, updateCreateEntity,
               organisationItem,
               contactItem,
               prospectConcatItem,}) => {
    // let overviewT = overviewType == OverviewTypes.Pipeline.Order || qualifiedDeal.won != null ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
    const qualifiedDealState = this.state.qualifiedDeal || qualifiedDeal;
    // console.log("this.state.qualifiedDeal",this.state.qualifiedDeal);
    // console.log('addTask overviewType',overviewType);
    // console.log('addTask qualifiedDeal',qualifiedDealState);
    contactItem(qualifiedDealState.sponsorList);
    organisationItem(qualifiedDealState.organisation || { uuid: qualifiedDealState.organisationId, name: qualifiedDealState.organisationName });
    prospectConcatItem(qualifiedDealState);


    let overviewT = OverviewTypes.Pipeline.Qualified_Task;
    switch (overviewType) {
      case OverviewTypes.Account_Qualified:
        overviewT = OverviewTypes.Account_Qualified_Task;
        break;
      case OverviewTypes.Account_Order:
        overviewT = OverviewTypes.Account_Order_Task;
        break;
      case OverviewTypes.Contact_Qualified:
        overviewT = OverviewTypes.Contact_Qualified_Task;
        break;
      case OverviewTypes.Contact_Order:
        overviewT = OverviewTypes.Contact_Order_Task;
        break;
    }
    updateCreateEntity(qualifiedDealState, overviewT);
    setActionForHighlight(overviewT, 'create');
  };
  addNote = ({highlight, qualifiedDeal,overviewType}) => {
    // console.log("=====overviewType: ",overviewType)
    let overviewT = OverviewTypes.Pipeline.Qualified_Note;
    switch (overviewType) {
      case OverviewTypes.Account_Qualified:
        overviewT = OverviewTypes.Account_Qualified;
        break;
      case OverviewTypes.Contact_Qualified:
        overviewT = OverviewTypes.Contact_Qualified_Copy;
        break;
      case OverviewTypes.Contact_Order:
        overviewT = OverviewTypes.Contact_Order_Copy;
        break;
      case OverviewTypes.Pipeline.Order:
        overviewT = OverviewTypes.Pipeline.Order;
        break;
      case OverviewTypes.Account_Order:
        overviewT = OverviewTypes.Account_Order;
        break;
    }
    highlight(overviewT, qualifiedDeal.uuid, 'add_note');
  };
  addAppointment = ({
                      overviewType,
                      createEntityOverview, userAccount, organisationItem, highlight,
                      contactItem,
                      qualifiedDeal,
                      prospectConcatItem,
                    }) => {
    const qualifiedDealState = this.state.qualifiedDeal || qualifiedDeal;
    // console.log("this.state.qualifiedDeal: ",this.state.qualifiedDeal);
    // console.log("qualifiedDealState: ",qualifiedDealState);
    contactItem(qualifiedDealState.sponsorList || []);
    organisationItem(qualifiedDealState.organisation || { uuid: qualifiedDealState.organisationId, name: qualifiedDealState.organisationName });
    prospectConcatItem(qualifiedDealState);
    // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
    let overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
    switch (overviewType) {
      case OverviewTypes.Account_Qualified:
      case OverviewTypes.Account_Order:
        overviewT = OverviewTypes.Account_Appointment;
        break;
      case OverviewTypes.Pipeline.Order:
        overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
        break;
      // case OverviewTypes.Contact_Qualified:
      //   overviewT = OverviewTypes.Contact_Qualified_Task;
      //   break;
      // case OverviewTypes.Contact_Order:
      //   overviewT = OverviewTypes.Contact_Order_Task;
      //   break;
    }
    createEntityOverview(overviewT, {
      // contactList: qualifiedDeal.sponsorList != null ? qualifiedDeal.sponsorList.map(value => value.uuid) : [],
      contacts: qualifiedDealState.sponsorList != null ? qualifiedDealState.sponsorList.map(value => value.uuid) : [],
      responsible: userAccount.uuid,
      organisation: qualifiedDealState.organisation != null ? qualifiedDealState.organisation.uuid : qualifiedDealState.organisationId,
      prospect: {prospectId: qualifiedDealState.uuid}
    });
    highlight(overviewT, null, 'create');

  };
  onCopy = ({fetchProspectLite, qualifiedDeal, overviewType}) => {
    // let overviewT = OverviewTypes.Pipeline.Qualified;
    // console.log("onCopy overviewType: ",overviewType);
    let overviewT = overviewType;
    switch (overviewType) {
      case OverviewTypes.Pipeline.Qualified:
        overviewT = OverviewTypes.Pipeline.Qualified_Copy;
        break;

      case OverviewTypes.Account_Qualified:
        overviewT = OverviewTypes.Account_Qualified_Copy;
        break;
      case OverviewTypes.Contact_Qualified:
        overviewT = OverviewTypes.Contact_Qualified_Copy;
        break;
      case OverviewTypes.Contact_Order:
        overviewT = OverviewTypes.Contact_Order_Copy;
        break;
      case OverviewTypes.Pipeline.Order:
        overviewT = OverviewTypes.Pipeline.Order;
        break;
      case OverviewTypes.Account_Order:
        overviewT = OverviewTypes.Account_Order;
        break;
    }
    fetchProspectLite(qualifiedDeal.uuid, overviewT);
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.visible &&
      nextProps.qualifiedDeal != null && nextProps.qualifiedDeal.uuid != null &&
      (this.props.qualifiedDeal == null || this.props.qualifiedDeal.uuid != nextProps.qualifiedDeal.uuid || !this.props.visible)) {
      // console.log("fetchQualified for states: ", nextProps.qualifiedDeal.uuid);
      this.fetchDeal(nextProps.qualifiedDeal.uuid);
    }
  }

  fetchDeal = async (qualifiedDealId) => {
    if (qualifiedDealId) {
      try{

      console.log("fetchDeal");
      const data = await api.get({
        resource: `${Endpoints.Prospect}/getDetails/${qualifiedDealId}`,
      });
      this.setState({qualifiedDeal: data});
      }catch (e) {
        console.log(e)
      }
    }
  }

  render() {
    const listSuugestActionsDeal = [
      {
        name: `Add reminder`,
        action: 'ADD_TASK',
      },
      {
        name: `Add meeting`,
        action: 'ADD_APPOINTMENT',
      },
      {
        name: `Copy`,
        action: 'COPY',
      },
      {
        name: `Add note`,
        action: 'ADD_NOTE',
      },
    ];
    const { visible, tempData } = this.props;
    if (this.state.redirect) {
      return <Redirect to="/pipeline/overview" />;
    }
    return (
      <ModalCommon
        title={_l`Suggested actions`}
        visible={visible}
        onDone={this.onDone}
        onClose={this.onClose}
        scrolling={false}
        size="tiny"
        cancelHidden={true}
        paddingAsHeader={true}
        hideIconClose={true}
      >
        {tempData &&
          !tempData.selectedWon && (
            <div>
              <p>{_l`Sorry to see you lost this one! Perhaps it’s not lost forever?`}</p>
              <p>{_l`It might be good to add a reason or a follow up reminder in the future.`}</p>
            </div>
          )}
        {tempData &&
          tempData.selectedWon && (
            <div>
              <p>{_l`Congratulations and well done! Do you want to add something more?`}</p>
              <p>{_l`- For single deals: Add a follow up reminder to yourself or a colleague?`}</p>
              <p>{_l`- For recurring deals: Create copies for each invoice period or for the renewal?`}</p>
            </div>
          )}
        <Table compact className={css.tableActions}>
          <TableBody>
            {listSuugestActionsDeal.map((e) => (
              <TableRow>
                <TableCell onClick={()=>this.handleOnClickActions(e.action)}>{_l.call(this, [e.name])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'select_suggest_actions');
  const tempData = getTempDataQualifiedDeal(state, overviewType);
  const highlightedId = getHighlighted(state, overviewType);
  const qualifiedDealFromState = getQualified(state, highlightedId);
  const qualifiedDeal = qualifiedDealFromState.uuid != null ? qualifiedDealFromState : { uuid: highlightedId };

  return {
    userAccount: getUser(state),
    visible,
    tempData,
    qualifiedDeal,
  };
};
export default connect(
  mapStateToProps,
  {
    clearHighlight: OverviewActions.clearHighlightAction,
    highlight: OverviewActions.highlight,
    setLostDeal,
    setWonLostDone,
    refreshOrganisation,
    refreshContact,
    updateCreateEntity,
    fetchProspectLite,
    setActionForHighlight: OverviewActions.setActionForHighlight,
    contactItem,
    organisationItem,
    prospectConcatItem,
    createEntityOverview: OverviewActions.createEntity,

  }
)(index);
