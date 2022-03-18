var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
(function () {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var email = globalAddin.getLocalStorageItem('contactEmail');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    var contactId = '';
    var isShowAppointmentHistory = false;
    var isShowTaskHistory = false;
    // The initialize function must be run each time a new page is loaded
    console.log(email);

    $(document).ready(function () {

        // Setup Back Button
        globalAddin.updateBackButtonBasedOnApplicationMode(0);

        localStorage['popup'] = "No";

        //$("#actionpopup").load("quickaction.html");
        app.initialize();
        var qs = getQueryStrings();
        if (globalAddin.getLocalStorageItem('loggedIn') != "true") {
            window.location = "login.html";
        }
        //email = qs["email"];
        loadProfile(email);
        $("#pagerlead").click(function () {
            window.location = "composeemail/add_lead.html";
        });
        $("#pagertask").click(function () {
            window.location = "composeemail/add_task.html";
        });
        $("#pagerapp").click(function () {
            window.location = "composeemail/add_appointment.html";
        });
        $("#pagernote").click(function () {
            window.location = "notes/add_note.html";
        });
        $("#showAppointmentHistory").click(function () {
            isShowAppointmentHistory = (isShowAppointmentHistory != true);
            showAppointmentHistory(contactId, isShowAppointmentHistory);
        });

        $("#showTaskHistory").click(function () {
            isShowTaskHistory = (isShowTaskHistory != true);
            showTaskHistory(contactId, isShowTaskHistory,enterpriseId);
        });
        mailHook.runLoop();
    });


    function getQueryStrings() {
        var assoc = {};
        var decode = function (s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };
        var queryString = location.search.substring(1);
        var keyValues = queryString.split('&');

        for (var i in keyValues) {
            var key = keyValues[i].split('=');
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }

        return assoc;
    }

    function loadProfile(email) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-" + version + "/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function (data) {
                if(data && data.uuid) {
                    globalAddin.contactData = data;
                    contactId = data.uuid
                    getProfile(token, data);
                    if (data.organisationName) {
                        localStorage['contactoOrganisationId'] = data.organisationId;
                        localStorage['contactOrganisationName'] = data.organisationName;
                    } else {
                        localStorage['contactoOrganisationId'] = "";
                        localStorage['contactOrganisationName'] = "";
                    }
                }
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                } else {
                    console.log(error);
                }
            },
            cache: false
        });
    }

    function getProfile(token, data) {
        $("#pname").text(data.firstName + ' ' + data.lastName);
        var headline = '';
        if (data.title && data.organisationName)
            headline = data.title + ' at ' + data.organisationName;
        else if (data.title)
            headline = data.title;
        else if (data.organisationName)
            headline = data.organisationName;
        if (data.relation)
            headline = headline + " (" + data.relation.name + ")";
        $("#headline").text(headline);

        if (data.industry && data.type)
            $("#industry").text(data.type.name + ' in ' + data.industry.name);
        else if (data.type)
            $("#industry").text(data.type.name);
        else if (data.industry)
            $("#industry").text(data.industry.name);

        if (data.phone)
            $("#phone").text(data.phone);
        if (data.email)
            $("#email").text(data.email);
        var address = '';
        if (data.street)
            address = address + data.street + ",";
        if (data.city)
            address = address + data.city + ",";
        if (data.region)
            address = address + data.region + ",";
        if (data.zipCode)
            address = address + data.zipCode + ",";
        if (data.country)
            address = address + data.country;

        $("#address").text(address);
        if (data.avatar) {
            var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
            /* var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';*/
            var folder = data.avatar.substring(data.avatar.length - 3, data.avatar.length);
            $("#profileimage").attr('src', imageCdn + folder + '/' + data.avatar);
        }
        if (data.contactGrowth) {
            switch (data.contactGrowth) {
                case 'GREEN':
                    $('.growth').removeClass('background-red').addClass('background-green');
                    $('.growth').find('.fa').removeClass('growth-down').addClass('growth-up');
                    break;
                case 'YELLOW':
                    $('.growth').removeClass('background-red').addClass('background-yellow');
                    $('.growth').find('.fa').removeClass('growth-down').removeClass('fa-long-arrow-up').addClass('fa-minus');
                    break;
                case 'NONE':
                    $('.growth').removeClass('background-red').addClass('background-gray');
                    break;
                default:
                    break;
            }
        }

        if (data.relationship) {
            switch (data.relationship) {
                case 'GREEN':
                    $('#avatar-relationship-ring').addClass('border-green');
                    break;
                case 'YELLOW':
                    $('#avatar-relationship-ring').addClass('border-yellow');
                    break;
                case 'RED':
                    $('#avatar-relationship-ring').addClass('border-red');
                    break;
                default:
                    break;
            }
        }

        //  Sales
        $("#dealsize").text(nFormatter(data.medianDealSize));

        $("#dealtime").text(Math.round(convertMedianDealTimetoMonthDay(data.medianDealTime)) + ' Days');
        $("#totalsales").text(nFormatter(data.orderIntake));
        $("#salemargin").text(Math.round((data.closedMargin)) + ' %');
        $("#saleprofilt").html('<b>Profit : ' + formatNumber(Math.round(data.wonProfit)) + "</b>");

        // pipe
        $("#grasspipe").text(nFormatter(Math.round(data.grossPipeline)));
        $("#weightedpipe").text(nFormatter(Math.round(data.netPipeline)));
        $("#pipeprofit").text(nFormatter(Math.round(data.pipeProfit)));
        $("#pipemargin").text(Math.round(data.pipeMargin) + '%');
        //statistics
        $("#dials").text(data.numberPick);
        $("#calls").text(data.numberCall);
        $("#appointment").text(data.numberActiveMeeting);
        // Last communication
        var lastCommunication = '';
        var pubDate = '';

        var latestCommunicationAdditionalData = getLatestCommunication(data.sharedContactId, token, data.ownerId,enterpriseId);

        $.each(data.latestCommunicationHistoryDTOList, function (i, obj) {
                var sentOrReceived = '';
                if(obj.type === "EMAIL_SENDER"){
                    sentOrReceived = "SENT";
                }
                if(obj.type === "EMAIL_RECEIVER"){
                    sentOrReceived = "RECEIVED";
                }
            var typeCommunication =   getCommunicationHistoryType(obj.type);

            var whenOpened = "";
            var envelop = "";
            var globe = "";
            var trackingAttachmentCode = "";

            if (latestCommunicationAdditionalData) {

                var communication = $.grep(latestCommunicationAdditionalData, function(e) { return e.uuid === obj.uuid; });

                if (communication) {
                    if (communication.trackingCode && !communication.receiveDate)
                        whenOpened = "Not opened yet";
                    if (!communication.receiveAttachmentDate && !communication.receiveUrlDate)
                        whenOpened = communication.receiveUrlDate.toString("hh:mm tt") + ',' + communication.receiveUrlDate.toString("dd MMM,yyyy");

                    if (communication.trackingCode && !communication.receiveDate)
                        envelop = '<i class="fa fa-envelope-o" > </i>';
                    if (communication.trackingCode && communication.receiveDate)
                        envelop = '<i class="fa fa-envelope-open-o color-green" > </i>';

                    if (communication.trackingUrlCode && !communication.receiveUrlDate)
                        globe = '<i class="fa fa-globe" > </i>';
                    if (communication.trackingCode && communication.receiveDate)
                        globe = '<i class="fa fa-globe color-green" > </i>';

                    if (communication.trackingAttachmentCode && !communication.receiveAttachmentDate)
                        trackingAttachmentCode = '<i class="fa fa-file-text-o" > </i>';
                    if (communication.trackingAttachmentCode && communication.receiveAttachmentDate)
                        trackingAttachmentCode = '<i class="fa fa-file-text-o color-green" > </i>';
                }
            }

            pubDate = new Date(obj.startDate);
            lastCommunication = lastCommunication + ' <tr> <td> <p>' + typeCommunication + '</p><p>' + obj.sharedContactName + ' </p></td><td> <p>' + sentOrReceived + '</p><p>' + envelop + globe + trackingAttachmentCode + ' </p></td><td><p class="text-right">' + pubDate.toString("hh:mm tt") + ',' + pubDate.toString("dd MMM,yyyy") + '</p><p>' + whenOpened + ' </p></td> </tr>';
        });
        $("#lastCommunication").append(lastCommunication);
        var participant = '';
        $("#contactcount").text('Contact team (' + data.participantList.length + ')');
        var imagescr = 'https://placehold.it/60x60';
        $.each(data.participantList, function (i, obj) {
            if (obj.avatar) {
                //var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                var folder = obj.avatar.substring(obj.avatar.length - 3, obj.avatar.length);
                imagescr = imageCdn + folder + '/' + obj.avatar;
            }
            participant = participant + '<div class=""><div class="col-xs-3"><img class="img-circle avatar-medium" style="margin-left: 0px" src="' + imagescr + '"></div>' +
                '<div class="col-xs-9"><table class="table contact-team-table"><tbody>' +
                '<tr><td class="width-20">&nbsp;</td><td class="width-60"><strong class="color-red">' + obj.firstName + ' ' + obj.lastName + '</strong></td><td class="width-10"></td><td class="width-10"><!-- ngIf: contact.isSystemContact == false --></td></tr>' +
                '<tr><td class="text-center"> <i class="fa-envelope-o icon"></i> </td><td><a href="javascript:void(0)">' + obj.email + '</a> </td><td> </td><td></td></tr>' +
                '<tr> <td class="text-center"><i class="text-14 fa fa-phone icon"></i></td><td colspan="3"><a href="javascript:void(0)">' + obj.phone + '</a></td></tr>' +
                '</tbody></table></div></div>';
        });
        $("#participantlist").append(participant);
        // Leads
        getLead(token, data.uuid,enterpriseId);
        //Appointment
        getAppointment(token, data.uuid,enterpriseId);
        getOpportunity(token, data.uuid,enterpriseId);
        getTask(token, data.uuid,enterpriseId,enterpriseId)
        getClosed(token, data.uuid);
        getNote(token, data.uuid,enterpriseId);
        $("#colleagues .badge").hide();
        if (data.organisationId) {
            getColleagues(token, data.organisationId,enterpriseId);
        }
        getCirclesData(token, data, enterpriseId);

    }

     function getCommunicationHistoryType(keyType) {
        switch (keyType) {
            case "CALL":
                return "Call";
            case "DIAL":
                return "Dial";
            case "EMAIL":
                return "Email";
            case "EMAIL_SENDER":
                return "Email";
            case "EMAIL_RECEIVER":
                return "Email";
            case "I_MESSAGE":
                return "iMessage";
            case "FACE_TIME_DIAL":
                return "Face time dial";
            case "FACE_TIME_CALL":
                return "Face time call";
        }
    };

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    function nFormatter(num) {
        var isNegative = false;
        var formattedNumber;
        if (num < 0) {
            isNegative = true;
        }
        num = Math.abs(num);
        if (num >= 1000000000) {
            formattedNumber = (num / 1000000000).toFixed(0).replace(/\.0$/, '') + ' G';
        } else if (num >= 1000000) {
            formattedNumber = (num / 1000000).toFixed(0).replace(/\.0$/, '') + ' M';
        } else if (num >= 1000) {
            formattedNumber = (num / 1000).toFixed(0).replace(/\.0$/, '') + ' K';
        } else {
            formattedNumber = num;
        }
        if (isNegative) {
            formattedNumber = '-' + formattedNumber
        }
        return formattedNumber;
    }

    function getLead(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "lead-" + version + "/listByContactAndYear?token=" + token + "&contactId=" + contactid+"&enterpriseID="+enterpriseId,
            success: function (data) {
                //console.log(data);
                var lead = '';
                $("#leadlist").empty();
                var leadsCount = 0;

                $(".color-lead").text(data.leadDTOList.length);
                $.each(data.leadDTOList, function (i, obj) {
                    if(obj.finished) return true;

                    var leadClockColor = getLeadColor(obj);

                    var pubDate = new Date(obj.createdDate);
                    var priority = '';
                    if (obj.priority <= 20) priority = "fa fa-thermo-1";
                    if (obj.priority > 20 && obj.priority <= 40) priority = "fa fa-thermo-2";
                    if (obj.priority > 40 && obj.priority <= 60) priority = "fa fa-thermo-3";
                    if (obj.priority > 60 && obj.priority <= 80) priority = "fa fa-thermo-4";
                    if (obj.priority > 80 && obj.priority <= 100) priority = "fa fa-thermo-5";
                    var imagescr = '../img/Gray_Photo.png';
                    if (obj.creatorAvatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.creatorAvatar.substring(obj.creatorAvatar.length - 3, obj.creatorAvatar.length);
                        imagescr = imageCdn + folder + '/' + obj.creatorAvatar;
                    }
                    var org = "";
                    if (obj.organisationName)
                        org = obj.organisationName;

                    var productGroup = "";
                    if (obj.lineOfBusiness && obj.lineOfBusiness.name)
                        productGroup = obj.lineOfBusiness.name;

                    var firstProductName = "";

                    if (obj.productList && obj.productList[0])
                        firstProductName = obj.productList[0].name;

                    // lead = lead + '<tr><td width="15%"><div class="lead-icon"><i style="display: inline-block;" class="fa fa-clock color-red"></i><i style="display: inline-block; margin-left:15px; margin-top:-35px;" class="' + priority + '"></i></div></td>' +
                    //     '<td width="20%">' + pubDate.toString("dd MMM, yyyy hh:mm") + ' </td><td width="50%"><p class="contact">' + obj.contactFirstName + ' ' + obj.contactLastName + '</p><p class="account">' + org + '</p></td>' +
                    //     '<td width="5%"><a href="javascript:void(0);" data-toggle="popover" data-content="<p><i class=\'fa fa-phone\'></i> ' + obj.contactPhone + '</p><p><i class=\'fa fa-envelope\'></i> ' + obj.contactEmail + '</p>" data-placement="top" data-trigger="hover" data-html="true" data-original-title="" title=""> <i class="fa fa-info-circle info-icon"></i></a></td>' +
                    //     '<td width="10%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';
                    lead = lead + '<tr><td width="15%"><div class="lead-icon"><i style="display: inline-block;" class="fa fa-clock color-' + leadClockColor + '"></i><i style="display: inline-block; margin-left:15px; margin-top:-35px;" class="' + priority + ' fa-dark-grey"></i></div></td>' +
                        '<td width="20%">' + pubDate.toString("dd MMM, yyyy hh:mm") + ' </td><td width="40%"><p class="contact">' + productGroup + '</p><p class="account">' + firstProductName + '</p></td>' +
                        '<td width="5%"></td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';

                    leadsCount++;
                });
                $("#leadlist").append(lead);

                $("#lead .badge").text(leadsCount);
                if (leadsCount == 0)
                    $("#lead .badge").hide();
            },
            cache: false
        });
    }

    function getAppointment(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "appointment-" + version + "/syncByContact?&contactId=" + contactid + "&showHistory=false&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var appointment = '';
                var num_appointments =0;
                $("#appointmentslist").empty();

                $.each(data.appointmentDTOList, function (i, obj) {

                    if(obj.location == null)
                    {
                        return true;
                    }
                    num_appointments++;

                    var startdt = new Date(obj.startDate);
                    var enddt = new Date(obj.endDate);
                    var imagecontact = '../img/Gray_Photo.png';
                    if (obj.contactList.length > 0 && obj.contactList[0].avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.contactList[0].avatar.substring(obj.contactList[0].avatar.length - 3, obj.contactList[0].avatar.length);
                        imagecontact = imageCdn + folder + '/' + obj.contactList[0].avatar;
                    }
                    var imageowner = '../img/Gray_Photo.png';
                    if (obj.owner.avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.owner.avatar.substring(obj.owner.avatar.length - 3, obj.owner.avatar.length);
                        imageowner = imageCdn + folder + '/' + obj.owner.avatar;
                    }
                    var focus = '';
                    if (obj.focusWorkData)
                        focus = obj.focusWorkData.name;

					appointment = appointment + '<tr>'+
                       // '<td width="15%"><img class="avatar-small img-circle" src="' + imagecontact + '"></td>' +
                        '<td width="20%"><p class="text-appointment">' + focus + '</p></td>' +
                        '<td width="25%">' + startdt.toString("dd MMM,yyyy") + ', ' + startdt.toString("hh:mm") + ' ' + enddt.toString("hh:mm") + '</td>' +
						'<td width="25%"><p>' + obj.location + '</p></td>' +
                        '<td width="15%" class="text-center"><img class="avatar-small img-circle" src="' + imageowner + '" ></td></tr>';


                   /* appointment = appointment + '<tr><td width="5%"><p class="timeline-badge"/>;</td>' +
                        '<td width="15%"><img class="avatar-small img-circle" src="' + imagecontact + '"></td>' +
                        '<td width="20%"><p class="text-appointment">' + focus + '</p></td>' +
                        '<td width="20%">' + startdt.toString("dd MMM,yyyy") + ', ' + startdt.toString("hh:mm") + ' ' + enddt.toString("hh:mm") + '</td><td width="20%"><p>' + obj.location + '</p></td>' +
                        '<td width="15%" class="text-center"><img class="avatar-small img-circle" src="' + imageowner + '" ></td></tr>';
						*/
                });

                $("#appointments .badge").text(num_appointments);
                if (num_appointments == 0)
                    $("#appointments .badge").hide();
                $(".color-appointment").text(num_appointments);

                $("#appointmentslist").append(appointment);
            },
            cache: false
        });
    }

    function showAppointmentHistory(contactId, isShowAppointmentHistory) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "appointment-" + version + "/syncByContact?&contactId=" + contactId + "&showHistory=" + isShowAppointmentHistory +"&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var appointment = '';
                var num_appointments =0;
                $("#appointmentslist").empty();

                $.each(data.appointmentDTOList, function (i, obj) {

                    if(obj.location == null)
                    {
                        return true;
                    }
                    num_appointments++;

                    var startdt = new Date(obj.startDate);
                    var enddt = new Date(obj.endDate);
                    var imagecontact = '../img/Gray_Photo.png';
                    if (obj.contactList.length > 0 && obj.contactList[0].avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.contactList[0].avatar.substring(obj.contactList[0].avatar.length - 3, obj.contactList[0].avatar.length);
                        imagecontact = imageCdn + folder + '/' + obj.contactList[0].avatar;
                    }
                    var imageowner = '../img/Gray_Photo.png';
                    if (obj.owner.avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.owner.avatar.substring(obj.owner.avatar.length - 3, obj.owner.avatar.length);
                        imageowner = imageCdn + folder + '/' + obj.owner.avatar;
                    }
                    var focus = '';
                    if (obj.focusWorkData)
                        focus = obj.focusWorkData.name;

                    appointment = appointment + '<tr><td class="timeline-badge" width="5%">&nbsp;</td>' +
                        '<td width="15%"><img class="avatar-small img-circle" src="' + imagecontact + '"></td>' +
                        '<td width="20%"><p class="focus">' + focus + '</p></td>' +
                        '<td width="20%">' + startdt.toString("dd MMM,yyyy") + ', ' + startdt.toString("hh:mm") + ' ' + enddt.toString("hh:mm") + '</td><td width="20%"><p>' + obj.location + '</p></td>' +
                        '<td width="15%" class="text-center"><img class="avatar-small img-circle" src="' + imageowner + '" ></td></tr>';
                });

                $("#appointments .badge").text(num_appointments);
                if (num_appointments == 0)
                    $("#appointments .badge").hide();
                $(".color-appointment").text(num_appointments);

                $("#appointmentslist").append(appointment);

                $(".panel-body").show();
            },
            cache: false
        });

    }


    function getOpportunity(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "prospect-" + version + "/listByContact/" + contactid + "?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var opportunity = '';
                $("#opportunitieslist").empty();
                $("#opportunities .badge").text(data.prospectDTOList.length);
                if (data.prospectDTOList.length == 0)
                    $("#opportunities .badge").hide();
                $(".color-opportunity").text(data.prospectDTOList.length);
                var numIter = 0;

                $.each(data.prospectDTOList, function (i, obj) {
                    var imagescr = '../img/Gray_Photo.png';
                    if (obj.participantList[0].avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/d2a';
                        //var folder = obj.ownerAvatar.substring(obj.ownerAvatar.length - 3, obj.ownerAvatar.length);
                        //imagescr = imageCdn + folder + '/' + obj.ownerAvatar;
                        imagescr = imageCdn + '/' + obj.participantList[0].avatar;
                    }
                    var fillPercentage = Math.round(obj.prospectProgress * 360 / 100);
                    var mRatio = describeArc(0, 0, 24, 0, fillPercentage);
                    var pathColor = getColor(obj.prospectProgress, false);
                    var opprotrunityContractDate = new Date(obj.contractDate).toString("dd MMM, yyyy hh:mm");

                opportunity = opportunity + '<tr><td width="20%">' +
                    '<svg width="54" height="54" viewBox="0 0 54 54" preserveAspectRatio="xMinYMin" style="margin: 0px auto;">' +
                    '<g transform="translate(27,27)">'+
                    '<circle r="27" fill="transparent"></circle>' +
                        '<circle r="20" fill="#173849"></circle>'+
                        '<text text-anchor="middle" class="" dy="5" dx="0" style="fill: rgb(255, 255, 255); font-size: 15px;">'+ obj.prospectProgress + '%</text>' +
                    '<path id="opportunityPath' + numIter + '" style="fill: none;" class="circle-' + pathColor +'"  stroke-width="4" d="' + mRatio + '"></path></g>'+
                        '</svg></td>' +
                    '<td width="30%"><p class="account">' + obj.description + '</p> <p>' + opprotrunityContractDate + '</p></td>' +
                        '<td width="10%" class="text-center"><strong>' + obj.grossValue + '</strong></td>' +
                   //     '<td width="10%" class="text-center"><strong>' + obj.netValue + '</strong></td>' +
                  //      '<td width="10%"></td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';

                    numIter++;
                });
                $("#opportunitieslist").append(opportunity);
            },
            cache: false
        });
    }

    function getTask(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "task-" + version + "/listByContact?contactId=" + contactid + "&orderBy=dateAndTime&pageIndex=0&pageSize=45&showHistory=false&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var task = '';
                $("#tasklist").empty();

                $(".color-task").text(data.taskDTOList.length);
                $.each(data.taskDTOList, function (i, obj) {
                    var imagescr = '../img/Gray_Photo.png';

                    if (obj.ownerAvatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.ownerAvatar.substring(obj.ownerAvatar.length - 3, obj.ownerAvatar.length);
                        imagescr = imageCdn + folder + '/' + obj.ownerAvatar;
                    }
                    var focus = '';
                    if (obj.focusWorkData && obj.focusWorkData.name && obj.focusWorkData.name !='null') {
                        focus = obj.focusWorkData.name;
                    }
                    var categoryName = '';
                    if (obj.categoryName && obj.categoryName !='null') {
                        categoryName = obj.categoryName;
                    }

                    var taskdate = new Date(obj.dateAndTime).toString("dd MMM, yyyy hh:mm");
                    task = task + '<tr><td class="border-task-green" width="30%">' + taskdate + '</td>' +
                        /*'<td width="25%"> <p class="contact">' + obj.contactName + '</p><p class="account">' + obj.organisationName + '</p></td>' +*/
                        //  '<td width="5%"><a href="#" data-toggle="popover" data-content="<p><i class=\'fa fa-phone\'></i> ' + obj.contactPhone + '</p><p><i class=\'fa fa-envelope\'></i> ' + obj.contactEmail + '</p>"data-placement="top" data-trigger="hover" data-html="true"> <i class="fa fa-info-circle info-icon"></i></a></td>' +
                        '<td width="40%"> <p class="text-red">' + focus + '</p><p class="category">' + categoryName + '</p></td>' +
                        //  '<td><a href="#" class="check-icon"><i class="fa fa-check-circle"></i></a></td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';
                });
                $("#tasklist").append(task);

                $("#task .badge").text(data.taskDTOList.length);
                if (data.taskDTOList.length == 0)
                    $("#task .badge").hide();
            },
            cache: false
        });
    }

    function showTaskHistory(contactId, isShowTaskHistory,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "task-" + version + "/listByContact?contactId=" + contactid + "&orderBy=dateAndTime&pageIndex=0&pageSize=45&showHistory=" +isShowTaskHistory +"&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var task = '';
                $("#tasklist").empty();

                $(".color-task").text(data.taskDTOList.length);
                $.each(data.taskDTOList, function (i, obj) {
                    var imagescr = '../img/Gray_Photo.png';
                    if (obj.ownerAvatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.ownerAvatar.substring(obj.ownerAvatar.length - 3, obj.ownerAvatar.length);
                        imagescr = imageCdn + folder + '/' + obj.ownerAvatar;
                    }
                    var focus = '';
                    if (obj.focusWorkData) {
                        focus = obj.focusWorkData.name;
                    }
                    var taskdate = new Date(obj.dateAndTime).toString("dd MMM, yyyy hh:mm");
                    task = task + '<tr><td class="border-task-green" width="30%">' + taskdate + '</td>' +
                       /* '<td width="25%"> <p class="contact">' + obj.contactName + '</p><p class="account">' + obj.organisationName + '</p></td>' +*/
                        //  '<td width="5%"><a href="#" data-toggle="popover" data-content="<p><i class=\'fa fa-phone\'></i> ' + obj.contactPhone + '</p><p><i class=\'fa fa-envelope\'></i> ' + obj.contactEmail + '</p>"data-placement="top" data-trigger="hover" data-html="true"> <i class="fa fa-info-circle info-icon"></i></a></td>' +
                        '<td width="40%"> <p class="focus">' + focus + '</p><p class="category">' + obj.categoryName + '</p></td>' +
                        //  '<td><a href="#" class="check-icon"><i class="fa fa-check-circle"></i></a></td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" style="width:1.5rem;height:1.5rem;" src="' + imagescr + '"></td></tr>';
                });
                $("#tasklist").append(task);

                $("#task .badge").text(data.taskDTOList.length);
                if (data.taskDTOList.length == 0)
                    $("#task .badge").hide();

                $(".panel-body").show();

            },
            cache: false
        });
    }


    function getColleagues(token, organisationId, enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "contact-" + version + "/listByOrganisation?&customFilter=active&organisationId=" + organisationId + "&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var colleagues = '';
                var num_collegues =0;
                $("#colleagueslist").empty();

                $.each(data.contactDTOList, function (i, obj) {

                    if(email == obj.email)
                    {
                        return true;
                    }
                    num_collegues++;
                    var imagescr = '../img/Gray_Photo.png';

                    if (obj.avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.avatar.substring(obj.avatar.length - 3, obj.avatar.length);
                        imagescr = imageCdn + folder + '/' + obj.avatar;
                    }

                    var ownerscr = '../img/Gray_Photo.png';
                    if (obj.ownerAvatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.ownerAvatar.substring(obj.ownerAvatar.length - 3, obj.ownerAvatar.length);
                        ownerscr = imageCdn + folder + '/' + obj.ownerAvatar;
                    }
                    colleagues = colleagues + '<tr><td width="20%"><div class="relationship-ring border-relationship-yellow"><img class="avatar-small img-circle" src="' + imagescr + '"></div></td>' +
                        '<td width="30%"><p class="contact">' + obj.firstName + ' ' + obj.lastName + '</p></td>' +
                        '<td width="5%" class="text-center">' + obj.participantList.length + '</td>' +
                        '<td width="5%" class="text-center">' + obj.numberActiveTask + '</td>' +
                        '<td width="5%" class="text-center">' + obj.numberActiveMeeting + '</td>' +
                        '<td width="5%" class="text-center">' + obj.numberActiveProspect + '</td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + ownerscr + '"></td></tr>';
                });

                $("#colleagues .badge").text(num_collegues);

                if (num_collegues == 0)
                    $("#colleagues .badge").hide();
                else
                    $("#colleagues .badge").show();

                $(".color-contact").text(num_collegues);

                $("#colleagueslist").append(colleagues);
            },
            error: function (error) {
                console.log(error);
            },
            cache: false
        });
    }

    function getClosed(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "prospect-" + version + "/listClosedByContactFull/" + contactid + "?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var closed = '';
                $("#closedlist").empty();
                $("#closed .badge").text(data.prospectDTOList.length);
                if (data.prospectDTOList.length == 0)
                    $("#closed .badge").hide();
                $(".color-closed").text(data.prospectDTOList.length);
                var grass = 0;
                var profit = 0;
                $.each(data.prospectDTOList, function (i, obj) {
                    var imagescr = '../img/Gray_Photo.png';
                    var opprotrunityContractDate = new Date(obj.contractDate).toString("dd MMM, yyyy hh:mm");

                    if (obj.participantList[0].avatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.participantList[0].avatar.substring(obj.participantList[0].avatar.length - 3, obj.participantList[0].avatar.length);
                        imagescr = imageCdn + folder + '/' + obj.participantList[0].avatar;
                    }
                    grass = grass + obj.grossValue;
                    profit = profit + obj.profit;
                    var status = "";
                    if (obj.won == true)
                        status = "color-green";
                    else
                        status = "color-red";
                    closed = closed + '<tr><td width="20%"><i class="fa fa-star-circle-ban won-lost-icon ' + status + '"></i> </td> <td width="45%"><p class="account">' + obj.description + '</p><p>' + opprotrunityContractDate + '</p></td>' +
                        '<td width="15%" class="text-center"><strong>' + obj.grossValue + '</strong></td>' +
                        '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';

                    //closed = closed + '<tr><td width="20%"><i class="fa fa-star-circle-ban won-lost-icon ' + status + '"></i> </td> <td width="45%"><p class="account">' + obj.sponsorList[0].firstName + ' ' + obj.sponsorList[0].lastName + '</p><p>' + obj.description + '</p></td>' +
                    //    '<td width="15%" class="text-center"><strong>' + obj.grossValue + '</strong></td>' +
                    //    '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';

                    //closed = closed + '<tr><td width="20%"><i class="fa fa-star-circle-ban won-lost-icon ' + status + '"></i> </td> <td width="30%"><p class="account">' + obj.sponsorList[0].firstName + ' ' + obj.sponsorList[0].lastName + '</p><p>' + obj.description + '</p></td>' +
                    //    '<td width="15%" class="text-center"><strong>' + obj.grossValue + '</strong></td><td width="15%" class="text-center"><strong>' + obj.profit + '</strong> </td>' +
                    //    '<td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '"></td></tr>';
                });
               // $("#grass").text("Gross: " + grass);
               // $("#profit").text("profit: " + profit);
                $("#closedlist").append(closed);
            },
            cache: false
        });
    }

    function getNote(token, contactid,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "document-" + version + "/note/listByContactFull/" + contactid + "?pageIndex=0&pageSize=45&token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var note = '';
                $("#notelist").empty();

                $(".color-note").text(data.noteDTOList.length);
                $.each(data.noteDTOList, function (i, obj) {
                    var imagescr = '../img/Gray_Photo.png';
                    if (obj.authorAvatar) {
                        var imageCdn = 'https://d3si3omi71glok.cloudfront.net/salesboxfiles/';
                        var folder = obj.authorAvatar.substring(obj.authorAvatar.length - 3, obj.authorAvatar.length);
                        imagescr = imageCdn + folder + '/' + obj.authorAvatar;
                    }
                    var createddt = new Date(obj.createdDate);
                    note = note + '<tr><td width="20%" class="text-center"><img class="avatar-small img-circle" src="' + imagescr + '">' +
                        '<p> ' + createddt.toString("hh:mm dd MMM,yyyy") + '</p></td><td width="80%"> <div class="note"><p class="subject">' + obj.subject + '</p><p>' + obj.content + '</p></div></td></tr>';
                });
                $("#notelist").append(note);

                $("#note .badge").text(data.noteDTOList.length);
                if (data.noteDTOList.length == 0)
                    $("#note .badge").hide();
            },
            cache: false
        });
    }

    function getLatestCommunication(sharedContactId, token, userId, enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "call-lists-" + version + "/history/contact/" + sharedContactId + "?token=" + token + "?userId=" + userId+"&enterpriseID="+enterpriseId,
            success: function (data) {
                return data;
            },
            cache: false
        });
    }

    function convertMedianDealTimetoMonthDay(medianDealTime) {
        var sec_num = parseInt(medianDealTime, 10);
        return (sec_num / 1000 / 3600 / 24);
    }

    /* Render Meters */
    function getCirclesData(token, contact, enterpriseId) {
        var radius = 70;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "contact-" + version + "/getAverageValues?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                var medianDealTimePercent = convertMedianDealTimetoMonthDay(contact.medianDealTime) / convertMedianDealTimetoMonthDay(data.medianDealTime);
                var medianDealSizePercent = contact.medianDealSize / data.medianDealSize;
                var closedMarginPercent = (contact.closedMargin / data.closeMargin) / 100;
                var orderIntakePercent = contact.orderIntake / data.closedSales;
                var dealSizeTooltip = $('<div></div>');
                var wrapper = $('<div></div');
                wrapper.attr('class', 'tooltip-wrapper top');
                dealSizeTooltip.attr('class', 'tooltip');
                var text = '<p>' + contact.firstName + ' ' + contact.lastName + ' has closed sales on ' + Math.round(medianDealSizePercent * 100) + '% of your company\'s average for deal size on contacts</p><br> (Outer circle)';
                dealSizeTooltip.html(text);
                wrapper.append(dealSizeTooltip);
                $('.dealCircles').append(wrapper);

                var dealTimeTooltip = $('<div></div>');
                var wrapper = $('<div></div');
                wrapper.attr('class', 'tooltip-wrapper bottom');
                dealTimeTooltip.attr('class', 'tooltip');
                var text = '<p>' + contact.firstName + ' ' + contact.lastName + ' has closed sales on ' + Math.round(medianDealTimePercent * 100) + '% of your company\'s average for deal time on contacts</p><br> (Inner circle)';
                dealTimeTooltip.html(text);
                wrapper.append(dealTimeTooltip);
                $('.dealCircles').append(wrapper);

                var closedMarginTooltop = $('<div></div>');
                var wrapper = $('<div></div');
                wrapper.attr('class', 'tooltip-wrapper bottom');
                closedMarginTooltop.attr('class', 'tooltip');
                var text = '<p>' + contact.firstName + ' ' + contact.lastName + ' has closed a margin on ' + Math.round(closedMarginPercent * 100) + '% of your company\'s average for margin on contacts</p><br> (Inner circle)';
                closedMarginTooltop.html(text);
                wrapper.append(closedMarginTooltop);
                $('.saleCircles').append(wrapper);

                var orderIntakeTooltip = $('<div></div>');
                var wrapper = $('<div></div');
                wrapper.attr('class', 'tooltip-wrapper top');
                orderIntakeTooltip.attr('class', 'tooltip');
                var text = '<p>' + contact.firstName + ' ' + contact.lastName + ' has closed sales on ' + Math.round(orderIntakePercent * 100) + '% of your company\'s average for closed sales on contacts</p><br> (Outer circle)';
                orderIntakeTooltip.html(text);
                wrapper.append(orderIntakeTooltip);
                $('.saleCircles').append(wrapper);

                var marginColor = getColor(closedMarginPercent, false);
                $('#salemargin').attr('class', 'text-' + marginColor + ' small-text text-24 weight-700');
                var saleColor = getColor(orderIntakePercent, false);
                $('#totalsales').attr('class', 'text-' + saleColor + ' small-text text-24 weight-700');

                fillArcInner('#saleInnerArc', closedMarginPercent, false, radius);
                fillPathInner('#saleInnerPath', closedMarginPercent, false, radius);
                fillArcOuter('#saleOuterArc', orderIntakePercent, false, radius);
                fillPathOuter('#saleOuterPath', orderIntakePercent, false, radius);

                var dealTimeColor = getColor(medianDealTimePercent, true);
                $('#dealtime').attr('class', 'text-' + dealTimeColor + ' small-text text-24 weight-700');
                var dealSizeColor = getColor(medianDealSizePercent, false);
                $('#dealsize').attr('class', 'text-' + dealSizeColor + ' small-text text-24 weight-700');

                fillArcInner('#dealTimeArc', medianDealTimePercent, true, radius);
                fillPathInner('#dealTimePath', medianDealTimePercent, true, radius);
                fillArcOuter('#dealSizeArc', medianDealSizePercent, false, radius);
                fillPathOuter('#dealSizePath', medianDealSizePercent, false, radius);
            },
            error: function () {
                var medianDealTimePercent = 0;
                var medianDealSizePercent = 0;
                var closedMarginPercent = 0;
                var orderIntakePercent = 0;
                return {
                    medianDealSizePercent: medianDealSizePercent,
                    medianDealTimePercent: medianDealTimePercent,
                    closedMarginPercent: closedMarginPercent,
                    orderIntakePercent: orderIntakePercent
                };
            },
            cache: false
        });

    }

    function converToRads(angle) {
        return angle * (Math.PI / 180);
    }

    function findDegree(percentage) {
        return 360 * percentage;
    }

    function getArcValue(index, radius, spacing) {
        return {
            innerRadius: (index + spacing) * radius,
            outerRadius: (index + spacing) * radius
        };
    }

    function getColor(ratio, reverse) {
        if (!ratio) {
            return 'gray';
        }
        if (ratio < 0.8) {
            return reverse ? 'green' : 'red';
        }
        if (ratio >= 1) {
            return reverse ? 'red' : 'green';
        }
        return 'yellow';
    }

    function getLeadColor (lead) {

        if (lead) {
            //var medianLeadTime = getMedianLeadTimeByOwner($scope.userList, lead.ownerId);
            var medianLeadTime = lead.ownerMedianLeadTime;

            var timeRate = 0;
            if (lead.finished || lead.prospectId) {
                timeRate = -1;
            } else {
                if (medianLeadTime !== 0) {
                    timeRate = (new Date().getTime() - lead.createdDate) / medianLeadTime;
                }
            }
            if (timeRate > 1) {
                return 'red';
            } else if (timeRate >= 0.75 && timeRate <= 1) {
                return 'yellow';
            } else if (timeRate == -1) {
                return 'grey';
            } else {
                return 'green';
            }
        }
    }

    function getMedianLeadTimeByOwner(userList, ownerId) {
        var medianLeadTime = 0;
        if (!userList) {
            userList.forEach(function (user) {
                if (user.uuid == ownerId) {
                    medianLeadTime = user.medianLeadTime;
                }
            });
        }
        return medianLeadTime;
    }

    function buildArc() {
        return d3
            .svg
            .arc()
            .innerRadius(function (d) {
                return d.innerRadius;
            })
            .outerRadius(function (d) {
                return d.outerRadius;
            })
            .startAngle(0)
            .endAngle(function (d) {
                return d.endAngle;
            });
    }

    function getArcInfo(index, value, radius, spacing) {
        var end = findDegree(value),
            arcValue = getArcValue(index, radius, spacing);

        return {
            innerRadius: arcValue.innerRadius,
            outerRadius: arcValue.outerRadius,
            endAngle: converToRads(end),
            startAngle: 0
        };
    }

    function tweenArc(b, arc) {
        return function (a) {
            var i = d3.interpolate(a, b);
            for (var key in b) {
                a[key] = b[key];
            }
            return function (t) {
                return arc(i(t));
            };
        };
    }

    function fillArcInner(elem, value, reverse, radius) {
        if (isNaN(value)) {
            value = 0;
        }
        if (reverse) {
            value = value / 1.25;
        }
        var color = getColor(value, reverse);
        var arc = d3.select(elem),
            arcObject = buildArc(),
            innerArc = getArcInfo(0.8, value, radius, 0.05),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
            .datum(innerArc)
            .attr('class', function (d) {
                return 'circle-' + color + ' progress-bar inner-bar thick-stroke';
            })
            .attr('d', arcObject)
            .transition()
            .delay(100)
            .duration(2000)
            .attrTween('d', tweenArc({
                endAngle: end
            }, arcObject));
    }

    function fillPathInner(elem, value, reverse, radius) {
        var color = getColor(value, reverse);
        var arc = d3.select(elem),
            arcObject = buildArc(),
            innerArc = getArcInfo(0.8, 1, radius, 0.05),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
            .datum(innerArc)
            .attr('class', function (d) {
                return 'circle-' + color + ' progress-bar inner-bar normal thick-stroke'
            })
            .attr('d', arcObject)
            .transition()
            .delay(0)
            .duration(0)
            .attrTween('d', tweenArc({
                endAngle: end
            }, arcObject));
    }

    function fillArcOuter(elem, value, reverse, radius) {
        if (isNaN(value)) {
            value = 0;
        }
        if (reverse) {
            value = value / 1.25;
        }
        var color = getColor(value, reverse);
        var arc = d3.select(elem),
            arcObject = buildArc(),
            innerArc = getArcInfo(0.9, value, radius, 0.1),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
            .datum(innerArc)
            .attr('class', function (d) {
                return 'circle-' + color + ' progress-bar inner-bar thick-stroke'
            })
            .attr('d', arcObject)
            .transition()
            .delay(100)
            .duration(2000)
            .attrTween('d', tweenArc({
                endAngle: end
            }, arcObject));
    }

    function fillPathOuter(elem, value, reverse, radius) {
        var color = getColor(value, reverse);
        var arc = d3.select(elem),
            arcObject = buildArc(),
            innerArc = getArcInfo(0.9, 1, radius, 0.1),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
            .datum(innerArc)
            .attr('class', function (d) {
                return 'circle-' + color + ' progress-bar inner-bar normal thick-stroke'
            })
            .attr('d', arcObject)
            .transition()
            .delay(0)
            .duration(0)
            .attrTween('d', tweenArc({
                endAngle: end
            }, arcObject));
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = "0";
        if (endAngle >= startAngle) {
            largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        } else {
            largeArcFlag = (endAngle + 360.0) - startAngle <= 180 ? "0" : "1";
        }

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }


    $(document).ready(function () {
        fillArcInner('#innerArc', 0.5, true, 70);
        fillPathInner('#innerPath', 0.5, true, 70);
        fillArcOuter('#outerArc', 1, false, 70);
        fillPathOuter('#outerPath', 1, false, 70);
    });

    $(document).on('mouseenter', '#dealsize', function () {
        $('.dealCircles .tooltip-wrapper.top').addClass('show');
    });
    $(document).on('mouseleave', '#dealsize', function () {
        $('.dealCircles .tooltip-wrapper.top').removeClass('show');
    });

    $(document).on('mouseenter', '#dealtime', function () {
        $('.dealCircles .tooltip-wrapper.bottom').addClass('show');
    });
    $(document).on('mouseleave', '#dealtime', function () {
        $('.dealCircles .tooltip-wrapper.bottom').removeClass('show');
    });


    $(document).on('mouseenter', '#totalsales', function () {
        $('.saleCircles .tooltip-wrapper.top').addClass('show');
    });
    $(document).on('mouseleave', '#totalsales', function () {
        $('.saleCircles .tooltip-wrapper.top').removeClass('show');
    });

    $(document).on('mouseenter', '#salemargin', function () {
        $('.saleCircles .tooltip-wrapper.bottom').addClass('show');
    });
    $(document).on('mouseleave', '#salemargin', function () {
        $('.saleCircles .tooltip-wrapper.bottom').removeClass('show');
    });


})();
