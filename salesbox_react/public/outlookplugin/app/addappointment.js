var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var pageInviteesIndex = 1;
var pageAccountsIndex = 1;

(function() {
  'use strict';
  var token = globalAddin.getLocalStorageItem('currentUserId');
  var ownerName = globalAddin.getLocalStorageItem('ownerName');
  var contactName = globalAddin.getLocalStorageItem('contactName');
  var contactEmail = globalAddin.getLocalStorageItem('contactEmail');
  var uuid = globalAddin.getLocalStorageItem('contact_uuid');
  var contactOrgId = globalAddin.getLocalStorageItem('contactoOrganisationId');
  var orgId = globalAddin.getLocalStorageItem('organisationId');
  var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
  var currentUserIuid = globalAddin.currentUser.uuid;

  // The initialize function must be run each time a new page is loaded
  //Office.initialize = function (reason) {
  $(document).ready(function() {
    app.initialize();
    // Setup Back Button
    globalAddin.updateBackButtonBasedOnApplicationMode(1);

    // if(globalAddin.getLocalStorageItem('appmode')=="read" || globalAddin.getLocalStorageItem('popup')=="Yes")
    // 	$(".back-button").hide();
    $('#appowner').val(ownerName);
    $('#appowner').attr('data-uuid', globalAddin.getLocalStorageItem('ownerid'));

    $("[data-toggle='dropdown']").on('click', function() {
      var dropdown = $(this).siblings('.dropdown-menu');
      if (dropdown.is(':hidden')) {
        $('.dropdown-menu').slideUp();
        dropdown.slideDown();
      } else {
        dropdown.slideUp();
        pageInviteesIndex = 1;
        pageAccountsIndex = 1;
      }
    });

    $('#apptitle').val(globalAddin.getLocalStorageItem('subject'));
    $('#appstart').val(globalAddin.getLocalStorageItem('startdate'));
    $('#append').val(globalAddin.getLocalStorageItem('enddate'));
    $('#appnote').val(globalAddin.getLocalStorageItem('note'));
    $('#applocation').val(globalAddin.getLocalStorageItem('location'));
    $('#add-to-prospector').on('click', function() {
      addAppointment();
    });
    $('#account').val(globalAddin.getLocalStorageItem('contactOrganisationName'));
    $('#account').attr('data-uuid', globalAddin.getLocalStorageItem('contactoOrganisationId'));
    bindAccount(token);
    if (contactOrgId && contactOrgId.length > 5) {
      bindAppContact(token, contactName, uuid, contactOrgId);
    } else {
      bindAppContact(token, contactName, uuid, orgId);
    }
    Invitee(token);
    bindAppFocus(token);

    $('#appfocus').on('click', function() {
      bindAppFocus(token);
    });

    $('#focus-caret-down').on('click', function() {
      bindAppFocus(token);
    });

    // $("#ddlappfocus .dropdown-item").on('click', function() {
    //     bindAppFocus(token);
    // }
  });
  //}

  function bindAccount(token) {
    $('#account-dropdown-menu').scroll(function() {
      var $this = $(this);
      var height = this.scrollHeight - $this.height(); // Get the height of the div
      var scroll = $this.scrollTop(); // Get the vertical scroll position

      var isScrolledToEnd = scroll >= height;
      if (isScrolledToEnd) {
        var additionalContent = getAdditionalAccountData(token, pageAccountsIndex); // Get the additional content
        pageAccountsIndex++;
      }
    });

    $('#account')
      .autocomplete({
        minLength: 0,
        delay: 0,
        source: function(request, response) {
          $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              name: request.term,
            }),
            url:
              serviceUrl +
              'organisation-' +
              version +
              '/searchLocal?token=' +
              token +
              '&updatedDate=0&pageIndex=0&pageSize=10' +
              '&enterpriseID=' +
              enterpriseId,
            success: function(data) {
              response(
                $.map(data.organisationDTOList, function(item) {
                  return {
                    label: item.name,
                    value: item.uuid,
                  };
                })
              );
            },
            cache: false,
          });
        },
        search: function(event, ui) {
          $('#accountlist li').remove();
          $('#account').removeAttr('data-uuid');
        },
        focus: function(event, ui) {},
        select: function(event, ui) {
          return false;
        },
      })
      .focus(function() {
        //Use the below line instead of triggering keydown
        $(this).autocomplete('search');
      })
      .data('ui-autocomplete')._renderItem = function(ul, item) {
      var data1 = $('<li></li>')
        .data('item.autocomplete', item)
        .append(
          "<a class='ui-menu-item' data-uuid=" + item.value + "  href='javascript:void(0)'>" + item.label + '</a>'
        )
        .appendTo('#accountlist');
      $('#accountlist a').on('click', function(event) {
        event.stopImmediatePropagation();
        $('#account').val($(this).text());
        $('#account').attr('data-uuid', $(this).attr('data-uuid'));
        $(this)
          .closest('.dropdown-menu')
          .slideUp();
        bindAppContact(token, contactName, '', $(this).attr('data-uuid'));
        $('#appcontact').css('visibility', 'hidden');
      });

      return data1;
    };
  }

  function bindAppContact(token, name, uuid, orgId) {
    var contactlist = '';
    $('#ddlappcontact tr').remove();
    if (orgId && orgId !== 'null') {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url:
          serviceUrl +
          'contact-' +
          version +
          '/syncByOrganisation?token=' +
          token +
          '&updatedDate=0&pageIndex=0&pageSize=10&organisationId=' +
          orgId +
          '&enterpriseID=' +
          enterpriseId,
        success: function(data) {
          $.each(data.contactDTOList, function(i, obj) {
            contactlist =
              contactlist +
              '<tr class="dropdown-item" data-uuid="' +
              obj.uuid +
              '"><td>' +
              obj.firstName +
              ' ' +
              obj.lastName +
              '</td></tr>';
          });
          //$("#appinvitee").html('<label class="label label-default background-contact" data-uuid="'+ uuid +'"><span class="contact-name app-invitee"  >'+ name +'</span><span class="remove-contact">x</span>  </label>');
          $('#ddlappcontact').append(contactlist);
          var alluuid = [];
          if (name != null && name.trim() != '' && uuid.length > 5) {
            $('#appcontact').html(
              '<label class="label label-default background-contact" data-uuid="' +
                uuid +
                '"><span class="contact-name app-contact"  >' +
                name +
                '</span><span class="remove-contact">x</span>  </label>'
            );
            alluuid.push(uuid);
            bindAppOpportunity(token, alluuid);
          }

          $('#ddlappcontact td').on('click', function() {
            var indicator1 = 0;
            var indicator2 = 0;
            alluuid = [];
            $('#appcontact').css('visibility', 'visible');
            var currUUID = $(this)
              .parent()
              .attr('data-uuid');
            $('#appcontact label').each(function(index) {
              if ($(this).attr('data-uuid') == currUUID) indicator1 = 1;
              alluuid.push($(this).attr('data-uuid'));
            });
            if (indicator1 == 0)
              $('#appcontact').append(
                '<label class="label label-default background-contact" data-uuid="' +
                  currUUID +
                  '"><span class="contact-name app-contact" >' +
                  $(this)
                    .parent()
                    .text() +
                  '</span><span class="remove-contact">x</span>  </label>'
              );
            $('#appinvitee label').each(function(index) {
              if ($(this).attr('data-uuid') == currUUID) indicator2 = 1;
            });
            if (indicator2 == 0)
              $('#appinvitee').append(
                '<label class="label label-default background-contact" data-uuid="' +
                  currUUID +
                  '" ><span class="contact-name app-invitee"  >' +
                  $(this)
                    .parent()
                    .text() +
                  '</span><span class="remove-contact">x</span>  </label>'
              );
            $('#appcontact label').each(function(index) {
              alluuid.push($(this).attr('data-uuid'));
            });
            $('#appcontact .remove-contact').on('click', function() {
              var currid = $(this)
                .parent()
                .attr('data-uuid');
              if ($('#appcontact label').size() > 1)
                $(this)
                  .parent()
                  .remove();
              $('#appinvitee label').each(function(index) {
                if ($(this).attr('data-uuid') == currid) $(this).remove();
              });
            });

            $('#appinvitee .remove-contact').on('click', function() {
              var currid = $(this)
                .parent()
                .attr('data-uuid');
              $(this)
                .parent()
                .remove();
            });
            bindAppOpportunity(token, alluuid);
            $('.dropdown-menu').slideUp();
          });
        },
        cache: false,
      });
    } else {
      var alluuid = [];
      if (name != null && name.trim() != '' && uuid.length > 5) {
        $('#appcontact').html(
          '<label class="label label-default background-contact" data-uuid="' +
            uuid +
            '"><span class="contact-name app-contact"  >' +
            name +
            '</span><span class="remove-contact">x</span>  </label>'
        );
        alluuid.push(uuid);
        bindAppOpportunity(token, alluuid);
      }

      $('#ddlappcontact td').on('click', function() {
        var indicator1 = 0;
        var indicator2 = 0;
        alluuid = [];
        $('#appcontact').css('visibility', 'visible');
        var currUUID = $(this)
          .parent()
          .attr('data-uuid');
        $('#appcontact label').each(function(index) {
          if ($(this).attr('data-uuid') == currUUID) indicator1 = 1;
          alluuid.push($(this).attr('data-uuid'));
        });
        if (indicator1 == 0)
          $('#appcontact').append(
            '<label class="label label-default background-contact" data-uuid="' +
              currUUID +
              '"><span class="contact-name app-contact" >' +
              $(this)
                .parent()
                .text() +
              '</span><span class="remove-contact">x</span>  </label>'
          );
        $('#appinvitee label').each(function(index) {
          if ($(this).attr('data-uuid') == currUUID) indicator2 = 1;
        });
        if (indicator2 == 0)
          $('#appinvitee').append(
            '<label class="label label-default background-contact" data-uuid="' +
              currUUID +
              '" ><span class="contact-name app-invitee"  >' +
              $(this)
                .parent()
                .text() +
              '</span><span class="remove-contact">x</span>  </label>'
          );
        $('#appcontact label').each(function(index) {
          alluuid.push($(this).attr('data-uuid'));
        });
        $('#appcontact .remove-contact').on('click', function() {
          var currid = $(this)
            .parent()
            .attr('data-uuid');
          if ($('#appcontact label').size() > 1)
            $(this)
              .parent()
              .remove();
          $('#appinvitee label').each(function(index) {
            if ($(this).attr('data-uuid') == currid) $(this).remove();
          });
        });

        $('#appinvitee .remove-contact').on('click', function() {
          var currid = $(this)
            .parent()
            .attr('data-uuid');
          $(this)
            .parent()
            .remove();
        });
        bindAppOpportunity(token, alluuid);
        $('.dropdown-menu').slideUp();
      });
    }
  }

  function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum;
  }

  function Invitee(token) {
    $('#invitee-dropdown-menu').scroll(function() {
      var $this = $(this);
      var height = this.scrollHeight - $this.height(); // Get the height of the div
      var scroll = $this.scrollTop(); // Get the vertical scroll position

      var isScrolledToEnd = scroll >= height;
      if (isScrolledToEnd) {
        var additionalContent = getAdditionalInviteesData(token, pageInviteesIndex); // Get the additional content
        pageInviteesIndex++;
      }
    });

    $('#inviteeauto')
      .autocomplete({
        minLength: 0,
        delay: 0,
        source: function(request, response) {
          $.ajax({
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              roleFilterType: 'Person',
              roleFilterValue: currentUserIuid,
              customFilter: 'active',
              orderBy: 'orderIntake',
              searchText: request.term,
            }),
            url:
              serviceUrl +
              'contact-' +
              version +
              '/fts?&pageIndex=0&pageSize=10&token=' +
              token +
              '&sessionKey=1424aa0d-cac1-34f9-7829-9eff03b6d7f9' +
              '&enterpriseID=' +
              enterpriseId,
            success: function(data) {
              response(
                $.map(data.contactDTOList, function(item) {
                  return {
                    label: item.firstName + ' ' + item.lastName,
                    value: item.uuid,
                    email: item.email,
                    phone: item.phone,
                  };
                })
              );
            },
            cache: false,
          });
        },
        search: function(event, ui) {
          console.log('Search!');
          $('#ddlappinvitee tr').remove();
        },
        focus: function(event, ui) {
          console.log('Focused!');
        },
        select: function(event, ui) {
          console.log('select!');
          return false;
        },
      })
      .focus(function() {
        //Use the below line instead of triggering keydown
        $(this).autocomplete('search');
      })
      .data('ui-autocomplete')._renderItem = function(ul, item) {
      var elementInvitee = '<td>';
      if (item.label) {
        elementInvitee += '<strong>' + item.label + '</strong>';
      }
      if (item.email) {
        elementInvitee += '<p>' + item.email + '</p>';
      }
      if (item.phone) {
        elementInvitee += '<p>' + item.phone + '</p>';
      }
      elementInvitee += '</td>';

      var data1 = $('<tr class="dropdown-item" data-uuid="' + item.value + '" data-name="' + item.label + '"></tr>')
        .data('item.autocomplete', item)
        .append(elementInvitee)
        .appendTo('#ddlappinvitee');
      $('#ddlappinvitee .dropdown-item').on('click', function(event) {
        event.stopImmediatePropagation();
        var currId = $(this).attr('data-uuid');
        var allowAdd = true;
        $('#appinvitee label').each(function() {
          if ($(this).attr('data-uuid') == currId) {
            allowAdd = false;
          }
        });
        if (allowAdd) {
          $('#appinvitee').append(
            '<label class="label label-default background-contact" data-uuid="' +
              $(this).attr('data-uuid') +
              '" ><span class="contact-name app-invitee"  >' +
              $(this).attr('data-name') +
              '</span><span class="remove-contact">x</span>  </label>'
          );
          $('#appinvitee .remove-contact').on('click', function() {
            var currid = $(this)
              .parent()
              .attr('data-uuid');
            $(this)
              .parent()
              .remove();
          });
        }
        $('.dropdown-menu').slideUp();
      });
      return data1;
    };
  }

  function bindAppOpportunity(token, alluuid) {
    var opportunitylist = '';
    console.log(alluuid);
    $('#ddlappopportunity tr').remove();
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(alluuid),
      url:
        serviceUrl +
        'prospect-' +
        version +
        '/listByContacts?token=' +
        token +
        '&pageIndex=0&pageSize=10' +
        '&enterpriseID=' +
        enterpriseId,
      success: function(data) {
        $.each(data.prospectLiteDTOList, function(i, obj) {
          opportunitylist =
            opportunitylist +
            '<tr class="dropdown-item" data-uuid="' +
            obj.uuid +
            '"><td>' +
            obj.description +
            '</td></tr>';
        });

        $('#ddlappopportunity').append(opportunitylist);
        $('#appopportunity').val('');
        $('#ddlappopportunity .dropdown-item').on('click', function() {
          $('#appopportunity').val($(this).text());
          $('#appopportunity').attr('data-uuid', $(this).attr('data-uuid'));
          $('.dropdown-menu').slideUp();
        });
      },
      cache: false,
    });
  }

  function bindAppFocus(token) {
    var focuslist = '';
    var tempOp = $('#appopportunity');
    var taskopp = tempOp.val();
    if (!taskopp) {
      taskopp = 'NULL';
    } else {
      taskopp = tempOp.attr('data-uuid');
    }

    $('#ddlappfocus tr').remove();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url:
        serviceUrl +
        'task-' +
        version +
        '/list/focus/' +
        taskopp +
        '?&pageIndex=0&pageSize=10000&token=' +
        token +
        '&enterpriseID=' +
        enterpriseId,
      success: function(data) {
        $.each(data.workDataActivityDTOList, function(i, obj) {
          focuslist =
            focuslist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
        });
        $.each(data.activityDTOList, function(i, obj) {
          focuslist =
            focuslist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
        });

        $('#ddlappfocus').append(focuslist);
        $('#ddlappfocus .dropdown-item').on('click', function() {
          $('#appfocus').val($(this).text());
          $('#appfocus').attr('data-uuid', $(this).attr('data-uuid'));
          $('.dropdown-menu').slideUp();
        });
      },
      cache: false,
    });
  }

  function toValidDate(datestring) {
    return datestring.replace(/(\d{2})(\/)(\d{2})/, '$3$2$1');
  }

  function addAccount(token, company) {
    var obj = {
      name: company,
      mediaType: 'MANUAL',
      additionalEmailList: [],
      additionalPhoneList: [],
      isPrivate: false,
      isChanged: false,
      participantList: [],
      numberGoalsMeeting: 0,
    };

    $.ajax({
      type: 'Post',
      url: serviceUrl + 'organisation-' + version + '/add?token=' + token + '&enterpriseID=' + enterpriseId,
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      data: JSON.stringify(obj),
      success: function(result) {
        $('#account').attr('data-uuid', result.uuid);
      },
      cache: false,
    });
  }

  function addAppointment() {
    var apptitle = $('#apptitle').val();
    var appstart = $('#appstart').val();
    var append = $('#append').val();
    var startdate = new Date(toValidDate(appstart));
    var enddate = new Date(toValidDate(append));
    var currentTime = new Date();

    if (apptitle == '') {
      $('#apptitle').css('background', 'rgba(255, 231, 224, 0.498039)');
      app.showNotification('', 'Title is required');
      return;
    } else {
      $('#apptitle').css('background', '');
    }

    if (appstart == '') {
      $('#appstart').css('background', 'rgba(255, 231, 224, 0.498039)');
      app.showNotification('', 'Start date is required');
      return;
    } else {
      $('#appstart').css('background', '');
    }

    if (append == '') {
      $('#append').css('background', 'rgba(255, 231, 224, 0.498039)');
      app.showNotification('', 'End date is required');
      return;
    } else {
      $('#append').css('background', '');
    }
    if (startdate < currentTime) {
      app.showNotification('', 'Cannot select date from the past');
      $('#appstart').css('background', 'rgba(255, 231, 224, 0.498039)');
      return;
    } else {
      $('#appstart').css('background', '');
    }
    if (enddate < currentTime) {
      app.showNotification('', 'Cannot select date from the past');
      $('#append').css('background', 'rgba(255, 231, 224, 0.498039)');
      return;
    } else {
      $('#append').css('background', '');
    }
    var contactl = [];
    var inviteel = [];
    $('#appinvitee label').each(function(index) {
      inviteel.push({
        uuid: $(this).attr('data-uuid'),
      });
    });
    $('#appcontact label').each(function(index) {
      contactl.push({
        uuid: $(this).attr('data-uuid'),
      });
    });

    var appDTO = {
      title: $('#apptitle').val(),

      location: $('#applocation').val(),
      contactList: contactl,
      inviteeList: {
        contactInviteeDTOList: inviteel,
        communicationInviteeDTOList: [],
      },
      startDate: toTimestamp($('#appstart').val()),
      endDate: toTimestamp($('#append').val()),
      note: $('#appnote').val(),
      owner: {
        uuid: $('#appowner').attr('data-uuid'),
      },

      firstContactId: contactl[0].uuid,
    };
    if (
      $('#account').attr('data-uuid') &&
      $('#account')
        .val()
        .trim() != ''
    ) {
      appDTO.organisation = {
        uuid: $('#account').attr('data-uuid'),
      };
    } else if (
      $('#account')
        .val()
        .trim() != ''
    ) {
      addAccount(token, $('#account').val());
      appDTO.organisation = {
        uuid: $('#account').attr('data-uuid'),
      };
    }
    if ($('#appopportunity').attr('data-uuid')) {
      appDTO.prospect = {
        uuid: $('#appopportunity').attr('data-uuid'),
      };
    }
    if ($('#appfocus').attr('data-uuid')) {
      appDTO.focusWorkData = {
        uuid: $('#appfocus').attr('data-uuid'),
      };
    }

    var d = new Date();
    var timezone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
    var res = encodeURIComponent(timezone);
    var url = 'appointment-' + version + '/add?&timezone=' + res + '&token=' + token + '&enterpriseID=' + enterpriseId;

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      crossDomain: true,
      dataType: 'json',
      url: serviceUrl + url,
      data: JSON.stringify(appDTO),
      success: function(data) {
        if (!globalAddin.isCommandsAddin) {
          if (globalAddin.getLocalStorageItem('appmode') === 'read')
            window.location = globalAddin.randomizeUrl('../openemail.html');
          else if (globalAddin.getLocalStorageItem('appmode') === 'mobileread')
            window.location = globalAddin.randomizeUrl('../openemailmobile.html');
          else window.location = globalAddin.randomizeUrl('../composeemail.html');
        } else Office.context.ui.messageParent('close');
      },
      error: function(error) {
        var rdata = JSON.parse(error.responseText);
        if (rdata.errorMessage == 'ALREADY_HAS_A_APPOINTMENT_WITH_SAME_FOCUS')
          app.showNotification('', 'Meeting exist with same focus');
        if (rdata.errorMessage == 'START_DATE_IS_AFTER_END_DATE')
          app.showNotification('', 'End date cannot be before start date');
      },
      cache: false,
    });
  }

  function getAdditionalAccountData(token, pageAccountsIndex) {
    var type = '';
    $.ajax({
      type: 'POST',
      crossDomain: true,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        name: '',
      }),
      url:
        serviceUrl +
        'organisation-' +
        version +
        '/searchLocal?token=' +
        token +
        '&updatedDate=0&pageIndex=' +
        pageAccountsIndex +
        '&pageSize=10' +
        '&enterpriseID=' +
        enterpriseId,
      success: function(data) {
        $.each(data.organisationDTOList, function(i, obj) {
          var data1 = $('<li></li>')
            .append(
              "<a class='ui-menu-item' data-uuid=" +
                obj.uuid +
                ' data-email=' +
                obj.email +
                " href='javascript:void(0)'>" +
                obj.name +
                '</a>'
            )
            .appendTo('#accountlist');
          $('#accountlist a').on('click', function(event) {
            pageAccountsIndex = 1;
            event.stopImmediatePropagation();
            $('#account').val($(this).text());
            $('#account').attr('data-uuid', $(this).attr('data-uuid'));
            $('#account').attr('data-email', $(this).attr('data-email'));
            $(this)
              .closest('.dropdown-menu')
              .slideUp();
            bindTaskContact(token, contactName, uuid, $(this).attr('data-uuid'));
            $('#taskcontact')
              .parent()
              .css('visibility', 'hidden');
          });
        });
      },
      cache: false,
    });
  }

  function getAdditionalInviteesData(token, pageInviteesIndex) {
    var type = '';
    $.ajax({
      type: 'POST',
      crossDomain: true,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        roleFilterType: 'Person',
        roleFilterValue: currentUserIuid,
        customFilter: 'active',
        orderBy: 'orderIntake',
        searchText: '',
      }),
      url:
        serviceUrl +
        'contact-' +
        version +
        '/fts?&pageIndex=' +
        pageInviteesIndex +
        '&pageSize=10&token=' +
        token +
        '&sessionKey=1424aa0d-cac1-34f9-7829-9eff03b6d7f9' +
        '&enterpriseID=' +
        enterpriseId,
      success: function(data) {
        $.each(data.contactDTOList, function(i, item) {
          var inviteeElement = '<td>';
          inviteeElement +=
            '<strong>' + item.firstName ? item.firstName : '' + ' ' + item.lastName ? item.lastName : '' + '</strong>';
          if (item.email) {
            inviteeElement += '<p>' + item.email + '</p>';
          }
          if (item.phone) {
            inviteeElement += '<p>' + item.phone + '</p>';
          }
          inviteeElement += '</td>';

          var data1 = $(
            '<tr class="dropdown-item" data-uuid="' +
              item.uuid +
              '" data-name="' +
              item.firstName +
              ' ' +
              item.lastName +
              '"></tr>'
          )
            .data('item.autocomplete', item)
            .append(inviteeElement)
            .appendTo('#ddlappinvitee');
          $('#ddlappinvitee .dropdown-item').on('click', function(event) {
            event.stopImmediatePropagation();
            var currId = $(this).attr('data-uuid');
            var allowAdd = true;
            $('#appinvitee label').each(function() {
              if ($(this).attr('data-uuid') == currId) {
                allowAdd = false;
              }
            });
            if (allowAdd) {
              $('#appinvitee').append(
                '<label class="label label-default background-contact" data-uuid="' +
                  $(this).attr('data-uuid') +
                  '" ><span class="contact-name app-invitee"  >' +
                  $(this).attr('data-name') +
                  '</span><span class="remove-contact">x</span>  </label>'
              );
              $('#appinvitee .remove-contact').on('click', function() {
                var currid = $(this)
                  .parent()
                  .attr('data-uuid');
                $(this)
                  .parent()
                  .remove();
              });
            }
            $('.dropdown-menu').slideUp();
          });
        });
      },
      cache: false,
    });
  }
})();
