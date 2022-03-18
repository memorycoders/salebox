//@flow

import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import * as OverviewActions from '../../Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { Table, TableRow, TableCell, TableBody } from 'semantic-ui-react';
import { getHighlighted } from '../../Overview/overview.selectors';
import { Redirect } from 'react-router';
import css from './SuggestedActions.css';
const listSuugestActions = [
  {
    name: 'Add reminder',
    action: 'ADD_TASK',
  },
  {
    name: 'Add meeting',
    action: 'ADD_APPOINMENT',
  }
];
addTranslations({
  'en-US': {
    'Suggested actions': 'Suggested actions',
    Done: 'Done',
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

  };

  handleOnClickActions = (action) => {
    if (action === 'ADD_APPOINMENT'){
      this.props.createAppointment()
    } else {
      this.props.createTask();
    }
  };

  render() {
    const { visible } = this.props;

    return (
      <ModalCommon
        title={_l`Suggested actions`}
        visible={visible}
        onDone={this.props.onClose}
        onClose={this.props.onClose}
        scrolling={false}
        size="tiny"
        cancelHidden={true}
        paddingAsHeader={true}
      >
        <Table compact className={css.tableActions}>
          <TableBody>
            {listSuugestActions.map((e) => (
              <TableRow>
                <TableCell onClick={() => this.handleOnClickActions(e.action)}>{e.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ModalCommon>
    );
  }
}
export default index;
