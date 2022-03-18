import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import {showHideSuggestForm, createQualifyDealTaskOrIdentifyContactTask} from '../Common/common.actions'
import ModalCommon from '../ModalCommon/ModalCommon';
addTranslations({
	'en-US': {
	  'Want to create a qualify prospect reminder?': 'Want to create a qualify prospect reminder?',
	  'Want to create a identify contact reminder?': 'Want to create a identify contact reminder?',
	  Yes: 'Yes',
	  No: 'No',
	  Confirm: 'Confirm',
	},
  });
class SuggestForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
			data: {}
		}
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.isShowSuggestForm && nextProps.isShowSuggestForm !== this.props.isShowSuggestForm) {
			let _data = nextProps.dataSuggestForm;
			this.setState({
				data: _data
			})
			if(_data.contactId) {
				this.setState({
					content: `Want to create a qualify prospect reminder?`
				})
			} else {
				this.setState({
					content: `Want to create a identify contact reminder?`
				})
			}
		}
	}

	hanndelClickYes = () => {
		this.props.createQualifyDealTaskOrIdentifyContactTask(this.state.data)
	}

	hanndelNo = () => {
		this.props.showHideSuggestForm(false, null)
	}

	render() {
		return (
			<div>
			<ModalCommon
			visible={this.props.isShowSuggestForm}
			children={this.state.content}
			title={_l`Confirm`}
			yesLabel={_l`Yes`}
			noLabel={_l`No`}
			onDone={this.hanndelClickYes}
			onClose={this.hanndelNo}
			size="tiny"
			></ModalCommon>
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	isShowSuggestForm: state.common.isShowSuggestForm,
	dataSuggestForm: state.common.dataSuggestForm
})

export default connect(mapStateToProps, {
	showHideSuggestForm,
	createQualifyDealTaskOrIdentifyContactTask
})
(SuggestForm);
