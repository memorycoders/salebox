import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Modal, Input, Checkbox, Icon } from 'semantic-ui-react'
import css from './AdvancedSearch.css';
import PropTypes from 'prop-types';
import _l from 'lib/i18n';
import ModalCommon from 'components/ModalCommon/ModalCommon';
const modules = {
  toolbar: [
    ['bold', 'italic', 'link', 'image'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
	[{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
  ]
}

const formats = [
	'header',
	'bold', 'italic', 'underline', 'strike', 'blockquote',
	'list', 'bullet', 'indent',
	'link', 'image'
]

const TAGS = {
	FNAME: 'Fname',
	LNAME: 'Lname',
	ANAME: 'Aname'
}

addTranslations({
	'en-US': {
		'Send': 'Send'
	},
  });





class MassPersonalEmail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subject: '',
			content: '',
			trackOpenEmail: false,
			trackClickLink: false,
			attachments: [],
			heightToolbar: 0,
			tags: []
		}
		this.fileInput = null;
		this.intervalGetToolbar = null,
		this.reactQuillRef = null
	}



	
	CheckboxType = {
		TrackMail: 'TrackMail',
		TrackLink: 'TrackLink'
	}


	handleChangeCheckbox(type, value) {
		switch(type) {
			case this.CheckboxType.TrackMail:
				this.setState({
					trackOpenEmail: value.checked
				})
				break;
			case this.CheckboxType.TrackLink:
				this.setState({
					trackClickLink: value.checked
				})
				break;
		}
	}

	handleSubject = (event, data) => {
		this.setState({
			subject: data.value
		})
	}

	handleContent = (content) => {
		if(this.props.isShowMassPersonalEmail) {
		this.setState({
			content: content
		})
		}
	}

	handleAttachFile = () =>{
		this.fileInput.click()
	}

	handleChangeFile = (event) => {
		if(event.target.files) {
			let _attachments = this.state.attachments;
			Object.keys(event.target.files).forEach(key => {
				_attachments.push(event.target.files[key])
			});
			this.setState({
				attachments: _attachments
			})
		}
	}

	removeAttachFile($index) {
		let _attachments = this.state.attachments;
		_attachments.splice($index, 1)
		this.setState({
			attachments: _attachments
		})
	}

	handleOpenModal() {
		this.setState({
			subject: '',
			content: '',
			trackOpenEmail: false,
			trackClickLink: false,
			attachments: [],
			tag: []
		})
		if(this.state.heightToolbar === 0) {
			this.intervalGetToolbar  = setInterval(() => {
				let _toolbar = document.getElementsByClassName('ql-toolbar')
				if(_toolbar) {
					clearInterval(this.intervalGetToolbar)
					let _style = getComputedStyle(_toolbar[0])
					let _heightToolbar = parseFloat(_style.height.replace('px', ''))
					this.setState({
						heightToolbar: _heightToolbar
					})
					let _container = document.getElementsByClassName('ql-container')
					_container[0].style.paddingTop = `${_heightToolbar}px`;
					_container = null
					_toolbar = null;
				}
			})
		} else {
			this.intervalGetToolbar  = setInterval(() => {
				let _container = document.getElementsByClassName('ql-container')
				if(_container) {
					clearInterval(this.intervalGetToolbar)
					_container[0].style.paddingTop = `${this.state.heightToolbar}px`;
					_container = null
				}
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.isShowMassPersonalEmail !== nextProps.isShowMassPersonalEmail && nextProps.isShowMassPersonalEmail) {
			this.handleOpenModal()
			if(nextProps.fileAttach) {
				this.setState({
					attachments: [
						...this.state.attachments,
						...nextProps.fileAttach
					]
				})
			}
			
		}
	}

	handleAddTag(tag) {
		const quill = this.reactQuillRef.getEditor()
		quill.focus()
		let range = quill.getSelection()
		let position = range ? range.index : 0;
		quill.insertText(position, tag)
		this.updateListTag(tag)

	}

	updateListTag(tag) {
		let _fullTagTitle;
		switch (tag) {
			case TAGS.FNAME:
				_fullTagTitle = 'FIRST_NAME';
				break;
			case TAGS.LNAME:
				_fullTagTitle = 'LAST_NAME';
				break;
			case TAGS.ANAME:
				_fullTagTitle = 'ACCOUNT_NAME'
				break;
		}
		let _listTag = this.state.tags;
		let index = _listTag.indexOf(_fullTagTitle);
		if (index === -1){
			_listTag.push(_fullTagTitle);
		}
		this.setState({
			tags: _listTag
		})
	}

	sendEmail = () => {
		let _content = `<div style="line-height: 1.42;tab-size: 4; font-size: 13px "> ${this.state.content} </div>`
		let _mail = {
            subject: this.state.subject,
            attachments: this.state.attachments,
            content: _content,
            tag: this.state.tags,
            trackOpenEmail: this.state.trackOpenEmail,
            trackClickLink: this.state.trackClickLink
		}
		this.props.sendEmailInBatch(_mail)
	}

	onClose= () => {
		this.props.showHideMassPersonalMail(false)
		this.setState({
			attachments: []
		})
	}

    render() {

		return (
			<ModalCommon size="small"
			title={_l`Send email`}
			yesLabel={_l`Send`}
			noLabel={_l`Cancel`}
			className={'mass_personal_email'}
			yesEnabled={name !== ''}
			visible={this.props.isShowMassPersonalEmail}
			onClose={this.onClose}
			onOpen={ () => { this.handleOpenModal()}}
			onDone={this.sendEmail}
			>
			<Modal.Content>
					<Input placeholder={_l`Subject`} fluid value={this.state.subject} onChange={this.handleSubject}></Input>
					<div style={{position: 'relative', marginTop: '20px'}}>
						<div className={css.tags} style={{ height: this.state.heightToolbar}}>
							<div className='bg_contact_color' onClick={() => {this.handleAddTag(TAGS.FNAME)}}>{_l`First name`}</div>
							<div className='bg_contact_color' onClick={() => {this.handleAddTag(TAGS.LNAME)}}>{_l`Last name`}</div>
							<div className='bg_account_color' onClick={() => {this.handleAddTag(TAGS.ANAME)}}>{_l`Company name`}</div>
						</div>
						<ReactQuill className={css.mpe_area_content} theme="snow" value={this.state.content} onChange={this.handleContent} modules={modules} ref={(el) => { this.reactQuillRef = el }}></ReactQuill>
					</div>
					<div>
						<div className={css.attach}>
							<div className={css.labelAttach} onClick={this.handleAttachFile}>
								<Icon  name="paperclip"/><span>{_l`Attach document`}</span>
								<input ref={fileInput => this.fileInput = fileInput}  type="file" hidden multiple onChange={this.handleChangeFile}/>
							</div>
							<div className={css.listFileAttach}>
								{
									this.state.attachments.map((file, index) => (
										<div key={`${index}`}>
											<span>{file.name}</span>
											<span onClick={() => {this.removeAttachFile(index) }}><Icon name="close"/></span>
										</div>
									))
								}
							</div>
						</div>
						<div >
							<Checkbox className={css._checkbox} label={_l`Track open email`} onChange={(e, value) => {this.handleChangeCheckbox(this.CheckboxType.TrackMail, value)}}/>
						</div>
						<div>
							<Checkbox className={css._checkbox} label={_l`Track click on link`} onChange={(e, value) => {this.handleChangeCheckbox(this.CheckboxType.TrackLink, value)}}/>
						</div>
					</div>
					</Modal.Content>
			</ModalCommon>
		)
    }
}

export default MassPersonalEmail
MassPersonalEmail.PropTypes = {
    overviewType: PropTypes.string,
    isShowMassPersonalEmail: PropTypes.bool,
	showHideMassPersonalMail: PropTypes.func,
	sendEmailInBatch: PropTypes.func,
	fileAttach: PropTypes.array
}
