import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import React, { Component } from 'react';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import './styles.less';

class ToggleSwitch extends Component {
  state = { enabled: this.enabledFromProps()};
  componentDidUpdate(prevProps) {
    console.log('id', this.props.id);
    if (prevProps.enabled !== this.props.enabled || prevProps.id !== this.props.id) {
      const e = this.enabledFromProps();
      this.setState({ enabled: e });
    }
  }
  isEnabled = () => this.state.enabled;

  enabledFromProps() {
    let { enabled } = this.props;

    // If enabled is a function, invoke the function
    enabled = isFunction(enabled) ? enabled() : enabled;

    // Return enabled if it is a boolean, otherwise false
    return isBoolean(enabled) && enabled;
  }

  toggleSwitch = (evt) => {
    evt.persist();
    evt.preventDefault();

    const { onClick, onStateChanged, disable } = this.props;
    if(disable) return;

    this.setState({ enabled: !this.state.enabled }, () => {
      const state = this.state;

      // Augument the event object with SWITCH_STATE
      const switchEvent = Object.assign(evt, { SWITCH_STATE: state });

      // Execute the callback functions
      isFunction(onClick) && onClick(switchEvent);
      isFunction(onStateChanged) && onStateChanged(state);
    });
  };

  render() {
    const { enabled,  } = this.state;

    // Isolate special props and store the remaining as restProps
    const { enabled: _enabled, theme, onClick, className, onStateChanged, disable, ...restProps } = this.props;

    // Use default as a fallback theme if valid theme is not passed
    const switchTheme = theme && isString(theme) ? theme : 'default';

    const switchClasses = classnames(`switch switch--${switchTheme}`, className);

    const togglerClasses = classnames('switch-toggle', `switch-toggle--${enabled ? 'on' : 'off'}`, `${disable ? 'switch-toggle-disable' : '' }`);

    return (
      <div className={switchClasses} onClick={this.toggleSwitch} {...restProps}>
        <div className={togglerClasses} />
      </div>
    );
  }
}

ToggleSwitch.propTypes = {
  theme: PropTypes.string,
  enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onStateChanged: PropTypes.func,
  id: PropTypes.number,
};

export default ToggleSwitch;
