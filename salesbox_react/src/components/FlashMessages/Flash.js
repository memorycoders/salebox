/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import moment from 'moment';

const oddBoldRegExp = /(#!!.*?)#!!/gm;
const everyRegExp = /#!!/gm;

export default class Flash extends Component {
  componentDidMount() {
    setTimeout(this.handleClose, 5000);
  }

  handleClose = () => this.props.removeFlashMessage(this.props.message.id);

  createMarkup = (content) => ({
    __html: this.sanitize(content),
  });

  sanitize = (content) => {
    return content.replace(oddBoldRegExp, '$1</b>').replace(everyRegExp, '<b>');
  };

  render() {
    const { type, messages } = this.props.message;
    const flashClass = classNames({
      fa: true,
      'fa-hx': true,
      'fa-check': type === 'success',
      'fa-info-circle': type === 'info',
      'fa-exclamation-triangle': type === 'warning',
      'fa-times': type === 'error',
    });

    return (
      <CSSTransition in={this.props.in} onExited={this.props.onExited} timeout={300} classNames="animate">
        <div className={`flash flash--${type} ${this.props.className}`}>
          <i className={flashClass} />
          <div className="flash__message">
            <p dangerouslySetInnerHTML={this.createMarkup(messages.content)} />
            <p className="flash__message__date">{`${moment(messages.notificationDate).format('DD MMM YYYY,  HH:mm')}`}</p>
          </div>
        </div>
      </CSSTransition>
    );
  }
}
