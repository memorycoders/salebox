/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FuzzySearch from 'fuzzy-search';
import _l from 'lib/i18n';
import localCss from './AddCallList.css';
import cx from 'classnames';
import css from '../../AddDropdown/AddDropdown.css';

addTranslations({
  'en-US': {
  },
});

/*
const selectNone = {
  uuid: null,
  key: null,
  value: null,
  name: _l`None`,
  // text: _l`None`,
};

const addNone =(choices, text) => {
  if (text !== undefined) {
    return [{ ...selectNone, text }, ...choices];
  }
  return [selectNone, ...choices];
};
*/

export default class AddCallList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      searchInput: '',
      accounts: props.accounts ? props.accounts : [],
      contacts: props.contacts ? props.contacts : [],
      selected: props.value ? props.value : {},
/*
      accounts: addNone(props.accounts ? props.accounts : []),
      contacts: addNone(props.contacts ? props.contacts : []),
      selected: props.value ? props.value : selectNone,
*/
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.setState({ accounts: nextProps.accounts });
    }
    if (nextProps.contacts !== this.props.contacts) {
      this.setState({ contacts: nextProps.contacts });
    }
/*
    if (nextProps.accounts !== this.props.accounts) {
      let resList= addNone(nextProps.accounts);
      this.setState({ accounts: resList });
    }
    if (nextProps.contacts !== this.props.contacts) {
      let resList= addNone(nextProps.contacts);
      this.setState({ contacts: resList });
    }
*/

  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.setState({ selected: this.props.selected });
    }
    if (prevProps.value !== this.props.value && this.props.value!=null) {
      this.setState({ selected: this.props.value });
    }

  }

  _onDocumentClick = (event) => {
    if (this.state.open && !this._inputRef.ref.contains(event.target)) {
      this.setState({ open: !open });
    }
  };

  _handleClick = (event, data, type) => {
    const newSelected = { value: data.value, text: data.text, type };
    this.setState({ selected: newSelected, searchInput: data.text }, () => {
      this.props.onChange(newSelected);
    });
    this.dropdown.setState({ open: false, value: data.value, text: data.text, searchInput: data.text });
  };

  onSearchChange = (event) => {
    const { contacts } = this.props;
    const searcher = new FuzzySearch(contacts, ['text'], {
      caseSensitive: false,
    });
    const result = searcher.search(event.target.value);
    this.setState({ contacts: result, searchInput: event.target.value });
  };

  componentDidMount(){
    document.addEventListener('keydown', e =>{
      this.handleKeyDown(e)
    })
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", ()=>{}, false);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.onChange(event, { value: this.state.value });
    }

    if (e.keyCode === 40) {
      const { selected, accounts, contacts } = this.state;
      const { value, type } = selected;
      if(!value){
        if (accounts.length === 0 ){
          if (contacts.length === 0) {
            return;
          }
          this.onNavigation(contacts[0], 'contact')
          return;
        }
        this.onNavigation(accounts[0], 'account')

      } else {
        if(type === 'account'){
          const findIndex = accounts.findIndex(account => account.uuid === value);
          if (findIndex < accounts.length - 1){
            this.onNavigation(accounts[findIndex + 1], 'account')
          } else {
            if (contacts.length === 0) {
              return;
            }
            this.onNavigation(contacts[0], 'contact')
          }
        } else {
          const findIndex = contacts.findIndex(contact => contact.uuid === value);
          if (findIndex < contacts.length - 1) {
            this.onNavigation(contacts[findIndex + 1], 'contact')
          }
        }
      }
    }

    if (e.keyCode === 38) {
      const { selected, accounts, contacts } = this.state;
      const { value, type } = selected;
      if (!value) {
        return;

      } else {
        if (type === 'account') {
          const findIndex = accounts.findIndex(account => account.uuid === value);
          if (findIndex > 0) {
            this.onNavigation(accounts[findIndex - 1], 'account')
          } else {
            this.onNavigation(accounts[0], 'account')
          }
        } else {
          const findIndex = contacts.findIndex(contact => contact.uuid === value);
          if (findIndex > 0) {
            this.onNavigation(contacts[findIndex - 1], 'contact')
          } else {
            if (accounts.length === 0){
              return
            }
            this.onNavigation(accounts[accounts.length - 1], 'account')
          }
        }
      }
    }
    if(e.keyCode === 37 || e.keyCode === 39 ){

    }
  };

  onClickInput=(e) => {
    const { selected, accounts, contacts } = this.state;
    const { value, type } = selected;
    if(!value){
      if (accounts.length === 0 ){
        if (contacts.length === 0) {
          return;
        }
        this.onNavigation(contacts[0], 'contact')
        return;
      }
      this.onNavigation(accounts[0], 'account')

    }
  }
  onNavigation = (data, type)=>{
    const newSelected = {
      value: data.uuid,
      text: data.name,
      type: type
    };
    this.setState({ selected: newSelected, searchInput: newSelected.text });
  }
  _addCompanyCallList = (e) => {
    console.log("_addCompanyCallList");
    this.props.addCompanyCallList(e);
  }
  _addContactCallList = (e) => {
    console.log("_addContactCallList");
    this.props.addContactCallList(e);
  }

  render() {
    const { accounts, onSearchChange, contacts, selected, searchInput } = this.state;
    return (
      <Dropdown
        ref={(ref) => (this.dropdown = ref)}
        // value={value}
        text={selected.text}
        fluid
        selection
        search
        size="small"
        searchInput={searchInput}
        onSearchChange={this.props.onSearchChange}
        className={localCss.dropdownContainer}
        // onKeyDown={this.handleKeyDown}
        error={this.props.error ? true : false}
        onClick={this.onClickInput}
      >
        <Dropdown.Menu className={css.content} scrolling={false}>
          <div className={localCss.rowContainer}>
            <div className={localCss.column}>
              <Dropdown.Menu role="listbox"  className={cx(css.options, localCss.options)} scrolling={true}>
                {accounts.map((option) => (
                  <Dropdown.Item
                    onClick={(event, data) => this._handleClick(event, data, 'account')}
                    key={option.uuid}
                    text={option.name}
                    value={option.uuid}
                    className={option.uuid === selected.value ? 'active' : ''}
                  />
                ))}
              </Dropdown.Menu>
              <Button onClick={(e) => this._addCompanyCallList(e)} className={cx(css.addButton, localCss.addButton)}>
                {_l`Add company call list`}
              </Button>
            </div>
            <div className={localCss.column}>
              <Dropdown.Menu role="listbox"  className={cx(css.options, localCss.options)} scrolling={true}>
                {contacts.map((option) => (
                  <Dropdown.Item
                    onClick={(event, data) => this._handleClick(event, data, 'contact')}
                    key={option.uuid}
                    text={option.name}
                    value={option.uuid}
                    className={option.uuid === selected.value ? 'active' : ''}
                  />
                ))}
              </Dropdown.Menu>
              <Button onClick={(e) => this._addContactCallList(e)} className={cx(css.addButton, localCss.addButton)}>
                {_l`Add contact call list`}
              </Button>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

AddCallList.propTypes = {
  addLabel: PropTypes.string,
  value: PropTypes.string,
};
AddCallList.defaultProps = {
  addLabel: 'Add',
};
