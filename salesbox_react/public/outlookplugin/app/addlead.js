var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var pageIndex = 1;
(function () {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var ownerName = globalAddin.getLocalStorageItem('ownerName');
    var ownerid = globalAddin.getLocalStorageItem('ownerid');
    var uuid = globalAddin.getLocalStorageItem('contact_uuid');
    var contactName = globalAddin.getLocalStorageItem('contactName');
    var contactEmail = globalAddin.getLocalStorageItem('contactEmail');
    var contactOrgId = globalAddin.getLocalStorageItem('contactoOrganisationId');
    var orgId = globalAddin.getLocalStorageItem('organisationId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    // The initialize function must be run each time a new page is loaded
//    Office.initialize = function (reason) {
    $(document).ready(function () {
        app.initialize();

        // Setup Back Button
        globalAddin.updateBackButtonBasedOnApplicationMode(1);

        $("#leadowner").val(ownerName);
        $("#leadowner").attr("data-uuid", globalAddin.getLocalStorageItem('ownerid'));
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

        $("#add-to-prospector").on('click', function () {
            addLead();
        });
        $("#account").val(globalAddin.getLocalStorageItem('contactOrganisationName'));
        $("#account").attr('data-uuid', contactOrgId);
        bindAccount(token, enterpriseId);
        if (contactOrgId && contactOrgId.length > 5) {
            bindLeadContact(token, contactName, uuid, contactOrgId, enterpriseId);
        } else {
            bindLeadContact(token, contactName, uuid, null, enterpriseId);
        }

        bindLeadProductGroup(token, contactName, uuid, enterpriseId);
    });

//    }

    function bindAccount(token, enterpriseId) {
        $("#account-dropdown-menu").scroll(function () {
            var $this = $(this);
            var height = this.scrollHeight - $this.height(); // Get the height of the div
            var scroll = $this.scrollTop(); // Get the vertical scroll position

            var isScrolledToEnd = (scroll >= height);
            if (isScrolledToEnd) {
                var additionalContent = getAdditionalAccountData(token, pageIndex, enterpriseId); // Get the additional content
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
                    url: serviceUrl + "organisation-" + version + "/searchLocal?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10" + "&enterpriseID=" + enterpriseId,
                    success: function (data) {
                        response($.map(data.organisationDTOList, function (item) {
                            return {
                                label: item.name,
                                value: item.uuid
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
                .append("<a class='ui-menu-item' data-uuid=" + item.value + "  href='javascript:void(0)'>" + item.label + "</a>")
                .appendTo("#accountlist");
            $("#accountlist a").on('click', function (event) {
                event.stopImmediatePropagation();
                $("#account").val($(this).text());
                $("#account").attr('data-uuid', $(this).attr('data-uuid'));
                $(this).closest(".dropdown-menu").slideUp();
                bindLeadContact(token, contactName, uuid, $(this).attr('data-uuid'), enterpriseId);
                $("#leadcontact").parent().css("visibility", "hidden");
            });

            return data1;
        };
    }

    function bindLeadContact(token, name, uuid, orgId, enterpriseId) {
        $("#ddlleadpriority .dropdown-item").on('click', function () {
            $("#leadpriority").val($(this).text().trim());
            $("#leadpriority").attr('data-uuid', $(this).attr('data-uuid'));
            $(".dropdown-menu").slideUp();
        });
        $("#ddlleadcontact tr").remove();

        if (orgId && orgId !== "null") {
            var contactlist = "";
            $.ajax({
                type: "GET",
                dataType: "json",
                url: serviceUrl + "contact-" + version + "/syncByOrganisation?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10&organisationId=" + orgId + "&enterpriseID=" + enterpriseId,
                success: function (data) {
                    $.each(data.contactDTOList, function (i, obj) {
                        contactlist = contactlist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.firstName + " " + obj.lastName + '</td></tr>';
                    });
                    if (name != null && name.trim() != '') {
                        $("#leadcontact").val(name);
                        $("#leadcontact").attr('data-uuid', uuid);
                    } else {
                        $("#leadcontact").parent().css("visibility", "hidden");
                    }
                    $("#ddlleadcontact").append(contactlist);

                    $("#ddlleadcontact td").on('click', function () {

                        $("#leadcontact").val($(this).text());
                        $("#leadcontact").attr('data-uuid', $(this).attr('data-uuid'));
                        $("#leadcontact").parent().css("visibility", "visible");
                        $(".dropdown-menu").slideUp();
                    });
                },
                error: function (error) {
                    console.log(error);
                },
                cache: false
            });
        } else {
            $("#leadcontact").val(name);
            $("#leadcontact").attr('data-uuid', uuid);
        }
    }

    function bindLeadProductGroup(token, name, uuid, enterpriseId) {
        var productgroup = '';

        $('#dllleadpgroup tr').remove();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "administration-" + version + "/lineOfBusiness/list?token=" + token + "&enterpriseID=" + enterpriseId,
            success: function (data) {
                $.each(data.lineOfBusinessDTOList, function (i, obj) {
                    productgroup = productgroup + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                });

                $("#dllleadpgroup").append(productgroup);
                bindProductList(token, uuid, enterpriseId);
                $("#dllleadpgroup .dropdown-item").on('click', function () {

                    $("#leadpgroup").val($(this).text());
                    $("#leadpgroup").attr('data-uuid', $(this).attr('data-uuid'));
                    bindProductList(token, $(this).attr('data-uuid'), enterpriseId);
                    $(".dropdown-menu").slideUp();
                });
            },
            cache: false
        });
    }

    function bindProductList(token, pgroupid, enterpriseId) {
        var productlist = '';
        //$('#ddleadproduct tr').remove();

        $.ajax({
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: serviceUrl + "administration-" + version + "/product/listByLineOfBusiness/" + pgroupid + "?token=" + token + "&enterpriseID=" + enterpriseId,
            success: function (data) {
                $.each(data.productDTOList, function (i, obj) {
                    if (!obj.active) return true;
                    productlist = productlist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                });

                $("#ddleadproduct").append(productlist);
                $("#leadproduct").val('');
                $("#ddleadproduct .dropdown-item").on('click', function () {
                    $("#leadproduct").val($(this).text());
                    $("#leadproduct").attr('data-uuid', $(this).attr('data-uuid'));
                    $(".dropdown-menu").slideUp();
                });
            },
            cache: false
        });
    }

    function addAccount(token, company, enterpriseId) {
        var obj = {
            "name": company,
            "mediaType": "MANUAL",
            "additionalEmailList": [],
            "additionalPhoneList": [],
            "isPrivate": false,
            "isChanged": false,
            "participantList": [],
            "numberGoalsMeeting": 0
        };
        $.ajax({
            type: "Post",
            url: serviceUrl + "organisation-" + version + "/add?token=" + token + "&enterpriseID=" + enterpriseId,
            dataType: 'json',
            contentType: "application/json",
            async: false,
            data: JSON.stringify(obj),
            success: function (result) {
                $("#account").attr('data-uuid', result.uuid);
            },
            cache: false
        });
    }

    function addLead() {
        var leadpgroup = $("#leadpgroup").val();
        // if (leadpgroup == '') {
        //     $("#leadpgroup").css('background', 'rgba(255, 231, 224, 0.498039)');
        //     app.showNotification("", "Product group is required");
        //     return;
        // } else {
        //     $("#leadpgroup").css('background', '');
        // }
        $("#leadpgroup").css('background', '');
        var leadpriority = $("#leadpriority").val();
        if (leadpriority == '') {
            $("#leadpriority").css('background', 'rgba(255, 231, 224, 0.498039)');
            app.showNotification("", "Priority is required");
            return;
        } else {
            $("#leadpriority").css('background', '');
        }

        var leadDTO = {
            "contactId": $("#leadcontact").attr("data-uuid"),
            "note": $("#leadnote").val(),
            "ownerId": $("#leadowner").attr("data-uuid"),
            "lineOfBusiness": $("#leadpgroup").attr("data-uuid") ? {
                "uuid": $("#leadpgroup").attr("data-uuid")
            } : null,
            "type": "MANUAL",
            "priority": $("#leadpriority").attr('data-uuid')

        };
        if ($("#leadproduct").attr("data-uuid")) {
            leadDTO.productList = [{
                "uuid": $("#leadproduct").attr("data-uuid")
            }];
        }

        if ($("#account").attr('data-uuid') && $("#account").val().trim() != "") {
            leadDTO.organisationId = $("#account").attr('data-uuid');
        } else if ($("#account").val().trim() != "") {
            addAccount(token, $("#account").val(), enterpriseId);
            leadDTO.organisationId = $("#account").attr('data-uuid');
        }
        var timeZone = new Date().getTimezoneOffset() / (-60);
        leadDTO.gmt = timeZone;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            url: serviceUrl + "lead-" + version + "/add?token=" + token + "&isAutoAddTask=true" + "&enterpriseID=" + enterpriseId,
            data: JSON.stringify(leadDTO),
            success: function (data) {

                if (globalAddin.getLocalStorageItem('appmode') === "read")
                    window.location = globalAddin.randomizeUrl("../openemail.html");
                else if (globalAddin.getLocalStorageItem('appmode') === "mobileread")
                    window.location = globalAddin.randomizeUrl("../openemailmobile.html");
                else
                    window.location = globalAddin.randomizeUrl("../composeemail.html");
            },
            error: function (error) {
                var rdata = JSON.parse(error.responseText);
                app.showNotification("", rdata.errorMessage);
            },
            cache: false
        });
    }

    function getAdditionalAccountData(token, pageIndex, enterpriseId) {
        var type = '';
        $.ajax({
            type: "POST",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": ""
            }),
            url: serviceUrl + "organisation-" + version + "/searchLocal?token=" + token + "&updatedDate=0&pageIndex=" + pageIndex + "&pageSize=10" + "&enterpriseID=" + enterpriseId,
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
                        bindLeadContact(token, contactName, uuid, $(this).attr('data-uuid'), enterpriseId);
                        $("#leadcontact").parent().css("visibility", "hidden");
                    });
                });
            },
            cache: false
        });
    }
})();
