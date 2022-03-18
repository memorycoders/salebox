/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import { Portal } from 'react-portal';
import { removeFlashMessage } from '../FlashMessages/flashMessage.action';
import Flash from './Flash';
import './style.less';

class FlashMessages extends Component {
  render() {
    const containerClass = classNames({
      'flash-container': true,
      'flash-container--front': this.props.front,
      'flash-container--noheader': this.props.noheader,
    });
    const flashMessageClass = classNames({
      'flash--front': this.props.front,
    });

    return (
      <Portal>
        <TransitionGroup className={containerClass}>
          {this.props.flashMessages.map((message) => (
            <Flash
              key={message.id}
              className={flashMessageClass}
              removeFlashMessage={this.props.removeFlashMessage}
              message={message}
            />
          ))}
        </TransitionGroup>
      </Portal>
    );
  }
}

export default connect(
  ({ flashMessages }) => ({
    flashMessages: flashMessages.messages,
  }),
  (dispatch) => ({
    removeFlashMessage: (id) => dispatch(removeFlashMessage(id)),
  })
)(FlashMessages);
