/*
 * Copyright (c) Microsoft.  All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var app = (function(){  // jshint ignore:line
  'use strict';

  var self = {};
  console.log("app initialize");
  // Common initialization function (to be called from each page)
  self.initialize = function(){
    jQuery('body').append(
      '<div id="notification-message">' +
      '<div class="notification-message-content" style="padding:15px">' +
      '<div id="notification-message-close"></div>' +
      '<div id="notification-message-header"></div>' +
      '<div id="notification-message-body"></div>' +
      '</div>' +
      '</div>');

    jQuery('#notification-message-close').click(function(){
      jQuery('#notification-message').hide();
    });
    jQuery('#notification-message').hide();
    // After initialization, expose a common notification function
    self.showNotification = function(header, text){
      jQuery('#notification-message-header').text(header);
      jQuery('#notification-message-body').html(text);
      jQuery('#notification-message').fadeIn('fast');
      setTimeout(function(){
        jQuery('#notification-message').fadeOut('fast');
       }, 3000);
    };
  };

  return self;
})();
