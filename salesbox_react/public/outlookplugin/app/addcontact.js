var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var contactName = globalAddin.getLocalStorageItem('contactName');
var contactEmail = globalAddin.getLocalStorageItem('contactEmail');
var title = globalAddin.getLocalStorageItem('title');
var accountName = globalAddin.getLocalStorageItem('accountName');
var phone = globalAddin.getLocalStorageItem('phone') === undefined ? "" : globalAddin.getLocalStorageItem('phone');
var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
var pageIndex = 1;

(function () {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    // The initialize function must be run each time a new page is loaded
    //Office.initialize = function (reason) {
    $(document).ready(function () {
        app.initialize();

            // Setup Back Button
            globalAddin.updateBackButtonBasedOnApplicationMode(1);

            localStorage['fromName'] = globalAddin.getLocalStorageItem('fromName');
            localStorage['fromEmail'] = globalAddin.getLocalStorageItem('fromEmail');
            localStorage['toName'] = globalAddin.getLocalStorageItem('toName');
            localStorage['toEmail'] = globalAddin.getLocalStorageItem('toEmail');
            localStorage['subject'] = globalAddin.getLocalStorageItem('subject');
            localStorage['date'] = globalAddin.getLocalStorageItem('date');
            // localStorage['title'] = globalAddin.getLocalStorageItem('title');

            if (typeof phone === undefined || phone == "undefined" || !phone) {
                localStorage['phone'] = '';
                localStorage['phonenumer'] = '';
            }
            else {
                localStorage['phone'] = phone;
                localStorage['phonenumer'] = phone;
            }

            // localStorage['street'] = globalAddin.getLocalStorageItem('street');
            // localStorage['zipcode'] = globalAddin.getLocalStorageItem('zipcode');
            // localStorage['city'] = globalAddin.getLocalStorageItem('city');
            // localStorage['region_state'] = globalAddin.getLocalStorageItem('region_state');
            // localStorage['firstname'] = globalAddin.getLocalStorageItem('firstname');
            // localStorage['lastname'] = globalAddin.getLocalStorageItem('lastname');

            // bind Account
            bindAccount(token,enterpriseId);
            //  bind country
            bindCountry(token,enterpriseId);
            //bind type
            bindType(token,enterpriseId);
            // Bind Industry
            bindIndustry(token,enterpriseId);
            // Bind Relation
            bindRelation(token,enterpriseId);

            $("[data-toggle='dropdown']").on('click', function () {
                var dropdown = $(this).siblings(".dropdown-menu");
                if (dropdown.is(":hidden")) {
                    $(".dropdown-menu").slideUp();
                    dropdown.slideDown();
                } else {
                    dropdown.slideUp();
                    pageIndex = 1;
                }
            });
            $("[data-toggle='form-group-addon']").on('click', function () {
                var target = $(this).attr('data-target');
                $(target).removeClass("hidden");
            });
            $("#relationshiplist a").on('click', function () {
                $(this).closest(".dropdown-menu").slideUp();
                $("#relationship").val($(this).text().trim());
            });
            $("#behaviourlist a").on('click', function () {
                $(this).closest(".dropdown-menu").slideUp();
                $("#behaviour").val($(this).text().trim());
            });
            $("#add-to-prospector").click(function () {
                addToProspector();
            });
            // var name = contactName.split(' ');
            if (contactName && contactName.length > 0) {
                $("#firstname").val(contactName.substring(0, contactName.indexOf(" ")));
                $("#lastname").val(contactName.substring(contactName.indexOf(" ") + 1));
            }

            if ((phone != null && phone != undefined && phone != "undefined") || phone === 0) {
                var objectPhone = JSON.parse(phone);
                if (!Array.isArray(objectPhone)) {
                    $("#phone").val(objectPhone);
                }
                else if (phone != null && phone != undefined && phone != "undefined" && objectPhone.length == 1) {
                    $("#phone").val(objectPhone[0]);
                } else {
                    objectPhone.forEach(function (element) {
                        $("#phonebox").append('<div class="inputfieldbox"><input type="text" class="form-control" placeholder="phone Number" value="' + element + '"/><div class="remove_btn">X</div></div>');
                    })
                }
            }

            if ((title != null && title != "null" && title != "undefined") || title  === 0)
                $("#title").val(title);

            if ((accountName != null && accountName != "null" && accountName != undefined) || accountName === 0)
                $("#account").val(accountName);
            if (contactEmail)
                $("#email").val(contactEmail);

    });
    //}

    function addToProspector() {
        var btn = $("#add-to-prospector");
        var fname = $("#firstname").val();
        var lname = $("#lastname").val();
        if (fname == '') {
            $("#firstname").css('background', 'rgba(255, 231, 224, 0.498039)');
            app.showNotification("", "First name is required");
            return;
        } else {
            $("#firstname").css('background', '');
        }
        if (lname == '') {
            $("#lastname").css('background', 'rgba(255, 231, 224, 0.498039)');
            app.showNotification("", "Last name is required");
            return;
        } else {
            $("#lastname").css('background', '');
        }

        var contact = {
            "firstName": fname,
            "lastName": lname,
            "discProfile": "NONE",
            "additionalEmailList": [],
            "additionalPhoneList": [],
            "relationship": "YELLOW",
            "participantList": [],
            "mediaType": "MANUAL"
        };
        if ($("#street").val()) {
            contact.street = $("#street").val();
        }
        if ($("#zip").val()) {
            contact.zipCode = $("#zip").val();
        }
        if ($("#city").val()) {
            contact.city = $("#city").val();
        }
        if ($("#country").val()) {
            contact.country = $("#country").val();
        }
        if ($("#title").val()) {
            contact.title = $("#title").val();
        }
        if ($("#behaviour").val()) {
            contact.discProfile = $("#behaviour").val().toUpperCase();
        }
        if ($("#state").val()) {
            contact.region = $("#state").val();
        }
        if ($("#email").val()) {
            contact.email = $("#email").val();
            contact.mainEmailType = "EMAIL_WORK";
            contact.additionalEmailList = [{
                "value": $("#email").val(),
                "type": "EMAIL_WORK",
                "main": true,
                "isPrivate": false
            }];
            $("#emailbox .inputfieldbox").each(function (index, element) {

                contact.additionalEmailList.push({
                    "value": $(this).children().val(),
                    "type": "EMAIL_WORK",
                    "main": false,
                    "isPrivate": false
                });

            });
        }
        if ($("#phone").val()) {
            contact.phone = $("#phone").val();
            contact.mainPhoneType = "PHONE_WORK";
            contact.additionalPhoneList = [{
                "value": $("#phone").val(),
                "type": "PHONE_WORK",
                "main": true,
                "isPrivate": false
            }];
            $("#phonebox .inputfieldbox").each(function (index, element) {
                contact.additionalPhoneList.push({
                    "value": $(this).children().val(),
                    "type": "PHONE_WORK",
                    "main": false,
                    "isPrivate": false
                });
            });
        }
        if ($("#account").attr('data-uuid')) {
            contact.organisationId = $("#account").attr('data-uuid');
            doAddContact(contact, token, enterpriseId);
        } else if ($("#account").val()) {
            addAccount(token, enterpriseId, $("#account").val(), function (result) {
                $("#account").attr('data-uuid', result.uuid);
                contact.organisationId = result.uuid;
                doAddContact(contact, token,enterpriseId)
            });

        } else {
            doAddContact(contact, token, enterpriseId);
        }

    }

    function doAddContact(contact, token,enterpriseId) {
        if ($("#type").attr('data-uuid')) {
            contact.type = {
                "uuid": $("#type").attr('data-uuid'),
                "type": $("#type").attr('data-type'),
                "name": $("#type").attr('data-name'),
                "code": $("#type").attr('data-code')
            };
        }
        if ($("#industry").val()) {
            contact.industry = {
                "uuid": $("#industry").attr('data-uuid'),
                "type": $("#industry").attr('data-type'),
                "name": $("#industry").attr('data-name'),
                "code": $("#industry").attr('data-code')
            };
        }
        if ($("#relation").attr('data-uuid')) {
            contact.relation = {
                "uuid": $("#relation").attr('data-uuid'),
                "type": $("#relation").attr('data-type'),
                "name": $("#relation").attr('data-name'),
                "code": $("#relation").attr('data-code')
            };
        }
        if ($("#relationship").val()) {
            if ($("#relationship").val() == 'Good')
                contact.relationship = 'GREEN';
            if ($("#relationship").val() == 'Neutral')
                contact.relationship = 'YELLOW';
            if ($("#relationship").val() == 'Bad')
                contact.relationship = 'RED';
        }

        $.ajax({
            type: "POST",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(contact),
            url: serviceUrl + "contact-" + version + "/add?token=" + token + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function (data) {
                if (!globalAddin.isCommandsAddin) {
                    if (globalAddin.getLocalStorageItem('appmode') == "read")
                        window.location = "../openemail.html";
                    else
                        window.location = "../composeemail.html";

                    // if (globalAddin.getLocalStorageItem('appmode') == "read") {
                    //     localStorage["contact_uuid"] = data.uuid;
                    //     window.open('composeemail/add_contact.html', '_self', '');
                    //     window.close();
                    // } else {
                    //     window.location = "../composeemail.html"
                    // }
                }
                else
                    Office.context.ui.messageParent("close");
            },
            error: function (error) {
                app.showNotification("", "This contact is already exist");
                //console.log(error);
            },
            cache: false
        });
    }

    function addAccount(token,enterpriseId, company, callback) {
        // var accountEmail =  globalAddin.getLocalStorageItem('accountEmail');
        var accountWebsite = globalAddin.getLocalStorageItem('website');
        var obj = {
            "name": company,
            "mediaType": "MANUAL",
            "additionalEmailList": [],
            "additionalPhoneList": [],
            "isPrivate": false,
            "isChanged": false,
            "participantList": [],
            "numberGoalsMeeting": 0,
            "web": accountWebsite ? accountWebsite : null
        };
        $.ajax({
            type: "Post",
            url: serviceUrl + "organisation-" + version + "/add?token=" + token+"&enterpriseID="+enterpriseId,
            dataType: 'json',
            contentType: "application/json",
            async: false,
            data: JSON.stringify(obj),
            success: function (result) {
                callback(result);
            },
            cache: false
        });
    }

    function bindType(token,enterpriseId) {
        var type = '';
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "administration-" + version + "/workData/organisations?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                //console.log(data.workDataOrganisationDTOList);
                $.each(data.workDataOrganisationDTOList, function (i, obj) {
                    if (obj.type == "TYPE")
                        type = type + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                });
                $("#typelist").append(type);
                $("#typelist a").on('click', function () {
                    $(this).closest(".dropdown-menu").slideUp();
                    $("#type").val($(this).text());
                    $("#type").attr('data-uuid', $(this).attr('data-uuid'));
                    $("#type").attr('data-type', $(this).attr('data-type'));
                    $("#type").attr('data-name', $(this).attr('data-name'));
                    $("#type").attr('data-code', $(this).attr('data-code'));
                });
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "../login.html";
                } else {
                    console.log(error);
                }
            },
            cache: false
        });
    }

    function bindIndustry(token,enterpriseId) {
        var industry = '';
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "administration-" + version + "/workData/workData/industries?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                //console.log(data.workDataOrganisationDTOList);
                $.each(data.workDataOrganisationDTOList, function (i, obj) {
                    industry = industry + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                    if (i == 0) {
                        $("#industry").attr('data-uuid', obj.uuid);
                        $("#industry").attr('data-type', obj.type);
                        $("#industry").attr('data-name', obj.name);
                        $("#industry").attr('data-code', obj.code);
                    }
                });
                $("#industrylist").append(industry);
                $("#industrylist a").on('click', function () {
                    $(this).closest(".dropdown-menu").slideUp();
                    $("#industry").val($(this).text());
                    $("#industry").attr('data-uuid', $(this).attr('data-uuid'));
                    $("#industry").attr('data-type', $(this).attr('data-type'));
                    $("#industry").attr('data-name', $(this).attr('data-name'));
                    $("#industry").attr('data-code', $(this).attr('data-code'));
                });
            },
            cache: false
        });
    }

    function bindRelation(token,enterpriseId) {
        var relation = '';
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "administration-" + version + "/workData/organisations?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                //console.log(data.workDataOrganisationDTOList);
                $.each(data.workDataOrganisationDTOList, function (i, obj) {
                    if (obj.type == "CONTACT_RELATIONSHIP")
                        relation = relation + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                });
                $("#relationlist").append(relation);
                $("#relationlist a").on('click', function () {
                    $(this).closest(".dropdown-menu").slideUp();
                    $("#relation").val($(this).text());
                    $("#relation").attr('data-uuid', $(this).attr('data-uuid'));
                    $("#relation").attr('data-type', $(this).attr('data-type'));
                    $("#relation").attr('data-name', $(this).attr('data-name'));
                    $("#relation").attr('data-code', $(this).attr('data-code'));
                });
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "../login.html";
                } else {
                    console.log(error);
                }
            },
            cache: false
        });
    }

    function bindAccount(token,enterpriseId) {

        $("#account-dropdown-menu").scroll(function () {
            var $this = $(this);
            var height = this.scrollHeight - $this.height(); // Get the height of the div
            var scroll = $this.scrollTop(); // Get the vertical scroll position

            var isScrolledToEnd = (scroll >= height);
            if (isScrolledToEnd) {
                var additionalContent = getAdditionalAccountData(token, pageIndex,enterpriseId); // Get the additional content
                pageIndex++;
            }
        });

        $("#account").autocomplete({
            minLength: 0,
            delay: 500,
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "name": request.term
                    }),
                    url: serviceUrl + "organisation-" + version + "/searchLocal?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10"+"&enterpriseID="+enterpriseId,
                    success: function (data) {
                        response($.map(data.organisationDTOList, function (item) {
                            return {
                                label: item.name,
                                value: item.uuid,
                                email: item.email
                            };
                        }));
                    },
                    cache: false
                });
            },
            search: function (event, ui) {
                $('#accountlist li').remove();
                $("#account").removeAttr("data-uuid");
            },
            focus: function (event, ui) {

            },
            select: function (event, ui) {
                return false;
            }
        }).focus(function () {
            //Use the below line instead of triggering keydown
            $(this).autocomplete("search");

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var data1 = $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a class='ui-menu-item' data-uuid=" + item.value + " data-email=" + item.email + " href='javascript:void(0)'>" + item.label + "</a>")
                .appendTo("#accountlist");
            $("#accountlist a").on('click', function (event) {
                event.stopImmediatePropagation();
                $("#account").val($(this).text());
                $("#account").attr('data-uuid', $(this).attr('data-uuid'));
                $("#account").attr('data-email', $(this).attr('data-email'));
                $(this).closest(".dropdown-menu").slideUp();
                bindTaskContact(token, contactName, uuid, $(this).attr('data-uuid'));
                $("#taskcontact").parent().css("visibility", "hidden");
            });

            return data1;
        };
    }

    function getAdditionalAccountData(token, pageIndex,enterpriseId) {
        var type = '';
        $.ajax({
            type: "POST",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": ""
            }),
            url: serviceUrl + "organisation-" + version + "/searchLocal?token=" + token + "&updatedDate=0&pageIndex=" + pageIndex + "&pageSize=10"+"&enterpriseID="+enterpriseId,
            success: function (data) {
                $.each(data.organisationDTOList, function (i, obj) {
                    var data1 = $("<li></li>")
                        .append("<a class='ui-menu-item' data-uuid=" + obj.uuid + " data-email=" + obj.email + " href='javascript:void(0)'>" + obj.name + "</a>")
                        .appendTo("#accountlist");
                    $("#accountlist a").on('click', function (event) {
                        pageIndex = 1;
                        event.stopImmediatePropagation();
                        $("#account").val($(this).text());
                        $("#account").attr('data-uuid', $(this).attr('data-uuid'));
                        $("#account").attr('data-email', $(this).attr('data-email'));
                        $(this).closest(".dropdown-menu").slideUp();
                        bindTaskContact(token, contactName, uuid, $(this).attr('data-uuid'));
                        $("#taskcontact").parent().css("visibility", "hidden");
                    });
                });


            },
            cache: false
        });
    }


    function bindCountry(token,enterpriseId) {
        var country;
        $.ajax({
            type: "Get",
            async: false,
            url: serviceUrl + "administration-" + version + "/workData/workData/countries?token=" + token+"&enterpriseID="+enterpriseId,
            success: function (data) {
                country = $.map(data.countryDTOList, function (item) {
                    return {
                        label: item.name,
                        value: item.name
                    };
                });

            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "../login.html";
                } else {
                    console.log(error);
                }
            },
            cache: false
        });


        $("#txt-country-search").autocomplete({
            minLength: 0,
            delay: 0,
            source: country,
            search: function (event, ui) {
                $('#countrylist li:not(:first)').remove();
            },
            focus: function (event, ui) {
                return false;
            },
            select: function (event, ui) {
                return false;
            }
        }).focus(function () {
            //Use the below line instead of triggering keydown
            $(this).autocomplete("search");

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var data1 = $("<li></li>")
                .data("item.autocomplete", item)
                .append("<a class='ui-menu-item'   href='javascript:void(0)'>" + item.label + "</a>")
                .appendTo("#countrylist");
            $("#countrylist a").on('click', function (event) {
                event.stopImmediatePropagation();
                $("#country").val($(this).text());
                $(this).closest(".dropdown-menu").slideUp();
            });
            return data1;


        };
    }
})();
