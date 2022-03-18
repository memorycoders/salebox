/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import Sortable from 'sortablejs';
import { Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FuzzySearch from 'fuzzy-search';
import css from './AddDropdown.css';
import _l from 'lib/i18n';

export default class AddDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchInput: '',
      options: props.options ? props.options : [],
      value: props.value || '',
      firstActive: props.value ? null : props.options && props.options[0],
      page: 0,
      filter: '',
      mutialValue: props.value || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.setState({ options: nextProps.options, searchInput: '', mutialValue: this.props.value });
      const { multiple } = this.props;
      if (multiple) {
        this.dropdown.setState({ value: this.props.value });
        return;
      }
      this.dropdown.setState({ value: null });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      const { multiple } = this.props;
      if (multiple){
        return this.setState({ mutialValue: this.props.value });
      }
      this.setState({ value: this.props.value });
    }
  }

  _onDocumentClick = (event) => {
    if (this.state.open && !this._inputRef.ref.contains(event.target)) {
      this.setState({ open: !open });
    }
  };

  _handleClick = (event, data) => {
    const { multiple } = this.props;
    if (multiple) {
      this.setState({
        mutialValue: this.state.mutialValue ? this.state.mutialValue.concat(data.value) : [data.value],
      }, () => {
        this.props.onChange(event, { value: this.state.mutialValue });
        this.dropdown.setState({
          open: false,
          value: this.state.mutialValue,
          searchQuery: ''
        });
      });
      this.handleSwapLabel()

      return;
    }
    this.setState({
      searchInput: data.value === null ? '' : data.text,
      value: data.value, firstActive: null
    });

    this.dropdown.setState({ open: false, value: data.value, searchQuery: data.value === null ? '' : data.text });
    this.props.onChange(event, data);
  };

  onSearchChange = (event) => {
    const { options } = this.props;
    const searcher = new FuzzySearch(options, ['text'], {
      caseSensitive: false,
    });

    const result = searcher.search(event.target.value);
    this.setState({ options: result, searchInput: event.target.value });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.onChange(event, { value: this.state.value });
    }
  };

  handleSwapLabel = () => {
    let el = document.getElementById("user-dropdown-deal")
    if(el) {
      new Sortable(el, {
        swap: true, // Enable swap mode
        swapClass: "label"
      });
    }
  }
  _handleChange = (event, data) => {
    const { multiple } = this.props;
    if (multiple) {
      this.setState({ searchInput: '', mutialValue: data.value }, () => {
        this.dropdown.setState({ value: data.value });
        this.props.onChange(event, { value: data.value });
        // const { value } = this.state;
        // const element = document.getElementById(value);
        // const { colId } = this.props;
        // const menu = document.getElementById(`${colId}-list`);
        // if (element) {
        //   const offsetPositionOfElement = element.offsetTop;
        //   menu.scrollTop = offsetPositionOfElement - 130 > 0 ? offsetPositionOfElement - 130 : 0;
        // }
      });
      this.handleSwapLabel()
      return;
    }
    this.dropdown.setState({ value: data.value });
    this.setState({ searchInput: data.value === null ? '' : data.text, value: data.value }, () => {
      const { value } = this.state;
      const element = document.getElementById(value);
      const { colId } = this.props;
      const menu = document.getElementById(`${colId}-list`);
      if (element) {
        const offsetPositionOfElement = element.offsetTop;
        menu.scrollTop = offsetPositionOfElement - 130 > 0 ? offsetPositionOfElement - 130 : 0;
      }
    });
  };

  _handleOnScroll = () => {
    const { colId } = this.props;
    const menu = document.getElementById(`${colId}-list`);
    if (menu.offsetHeight + menu.scrollTop === menu.scrollHeight) {
      this.setState({ page: this.state.page + 1 }, () => {
        if (typeof this.props.handleSearch === 'function') this.props.handleSearch(this.state.filter, this.state.page);
      });
    }
  };

  render() {
    const { addLabel, onClickAdd, _class, colId, calculatingPositionMenuDropdown, multiple, overviewType, type, defaultValue } = this.props;
    const { firstActive, options, searchInput, value, mutialValue } = this.state;
    return (
      <Dropdown
        id={colId}
        className={_class}
        onClick={() => {
          calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
        }}
        multiple={multiple}
        ref={(ref) => (this.dropdown = ref)}
        {...this.props}
        closeOnChange
        value={multiple ? mutialValue : value}
        defaultValue={defaultValue}
        onSearchChange={
          this.props.isLoadMore
            ? (e) => {
              this.setState({ filter: e.target.value }, () => {
                this.props.handleSearch(this.state.filter, 0);
              });
            }
            : this.onSearchChange
        }
        text={searchInput || this.props.text}
        onChange={this._handleChange}
        onKeyDown={this.handleKeyDown}
        trigger={this.props.trigger ? this.props.trigger : null}
      >
        <Dropdown.Menu className={css.content} scrolling={false}>
          <Dropdown.Menu
            id={`${colId}-list`}
            role="listbox"
            className={css.options}
            scrolling={true}
            onScroll={this._handleOnScroll}
          >
            {multiple ? options.filter(item => {
              const find = (mutialValue || []).find(valueItem => valueItem === item.value);
              return !find;
            }).map((option) => (
              <Dropdown.Item
                onClick={(event, data) => this._handleClick(event, data)}
                key={option.value}
                {...option}
                id={option.value}
                className={option.value === value || (firstActive && firstActive.key === option.key) ? 'active' : ''}
              />
            )) : options.map((option) => (
              <Dropdown.Item
                onClick={(event, data) => this._handleClick(event, data)}
                key={option.value}
                {...option}
                id={option.value}
                className={option.value === value || (firstActive && firstActive.key === option.key) ? 'active' : ''}
              />
            ))}
          </Dropdown.Menu>
          {(overviewType === 'CONTACTS' || overviewType === 'ACCOUNTS' || type === 'notAdd') ? '' : <Button
            onClick={() => {
              this.dropdown.setState({ open: false });
              if (typeof onClickAdd === 'function') onClickAdd();
            }}
            className={css.addButton}
          >
            + {_l.call(this, [addLabel])}
          </Button>}

        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

AddDropdown.propTypes = {
  addLabel: PropTypes.string,
  onClickAdd: PropTypes.func,
  value: PropTypes.string,
};
AddDropdown.defaultProps = {
  addLabel: `Add`,
};
