var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var pageIndex = 1;
(function () {
    'use strict';
    console.log("add_note initializing");
    var pageInitialized = false;
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var uuid = globalAddin.getLocalStorageItem('contact_uuid');
    var contactName = globalAddin.getLocalStorageItem('contactName');
    var contactOrgId = globalAddin.getLocalStorageItem('contactoOrganisationId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');

    Office.initialize = function (reason) {
        console.log("add_note script initialized inside Office::initialize");
        $(document).ready(function () {
            app.initialize();

            delete window.alert;       // assures alert works
            delete window.confirm;     // assures confirm works
            delete window.prompt;      // assures prompt works

            if (!pageInitialized)
                initializePage();
        });
    };
    if (!pageInitialized) {
        console.log("add_note script initialized outside Office::initialize");
        $(document).ready(function () {
            if (!pageInitialized)
                initializePage();
        });
    }

    function initializePage() {
        // app.initialize();
        //
        // delete window.alert;       // assures alert works
        // delete window.confirm;     // assures confirm works
        // delete window.prompt;      // assures prompt works

        pageInitialized = true;

        // Setup Back Button
        globalAddin.updateBackButtonBasedOnApplicationMode(1);

        $(".notification-message-content").hide();

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
            addNote();
        });
        $("#account").val(globalAddin.getLocalStorageItem('contactOrganisationName'));
        $("#account").attr('data-uuid', contactOrgId);
        bindAccount(token,enterpriseId);
        if (contactOrgId && contactOrgId.length > 5) {
            bindContact(token, contactName, uuid, contactOrgId, enterpriseId);
        } else {
            bindContact(token, contactName, uuid, null, enterpriseId);
        }
    }

//    }

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
                                value: item.uuid
                            }
                        }));
                    },
                    cache: false,
                })
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
                bindContact(token, contactName, uuid, $(this).attr('data-uuid'),enterpriseId);
                $("#notecontact").parent().css("visibility", "hidden");
            });

            return data1;


        };
    }

    function bindContact(token, name, uuid, orgId,enterpriseId) {
        $("#ddlleadpriority .dropdown-item").on('click', function () {
            $("#leadpriority").val($(this).text().trim());
            $("#leadpriority").attr('data-uuid', $(this).attr('data-uuid'));
            $(".dropdown-menu").slideUp();
        });
        $("#ddlnotecontact tr").remove();

        if (orgId && orgId !== "null") {
            var contactlist = "";
            $.ajax({
                type: "GET",
                dataType: "json",
                url: serviceUrl + "contact-" + version + "/syncByOrganisation?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10&organisationId=" + orgId+"&enterpriseID="+enterpriseId,
                success: function (data) {
                    $.each(data.contactDTOList, function (i, obj) {
                        contactlist = contactlist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.firstName + " " + obj.lastName + '</td></tr>';
                    });
                    if (name != null && name.trim() != '') {
                        $("#notecontact").val(name);
                        $("#notecontact").attr('data-uuid', uuid);
                    } else {
                        $("#notecontact").parent().css("visibility", "hidden");
                    }
                    $("#ddlnotecontact").append(contactlist);

                    $("#ddlnotecontact td").on('click', function () {

                        $("#notecontact").val($(this).text());
                        $("#notecontact").attr('data-uuid', $(this).attr('data-uuid'));
                        $("#notecontact").parent().css("visibility", "visible");
                        $(".dropdown-menu").slideUp();
                    });
                },
                error: function (error) {
                    console.log(error);
                },
                cache: false,
            });
        } else {
            $("#notecontact").val(name);
            $("#notecontact").attr('data-uuid', uuid);
        }
    }

    function addNote() {
        var subject = "";
        var authorId = globalAddin.currentUser.uuid;

        var contactId = "";
        $('#subject-field').css('background-color', 'white');
        $('#content-filed').css('background-color', 'white');
        $('#content-filed textarea').css('background-color', 'white');
        $("#message").html("Saving your note to account/contact. Please wait...<img class='spinning-image' />");

        if ($('#notecontact').attr('data-uuid')) {
            contactId = $('#notecontact').attr('data-uuid');
        }
        if ($('#noteSubject').val() === null || $('#noteSubject').val() === undefined || $('#noteSubject').val() === '') {
            // $("#message").text("Subject is required");
            app.showNotification("", "Subject is required");
            $('#subject-field').css('background-color', 'rgba(255, 231, 224, 0.5)')
            return;
        }
        if ($('#appnote').val() === null || $('#appnote').val() === undefined || $('#appnote').val() === '') {
            // $("#message").text("Content is required");
            app.showNotification("", "Content is required");
            $('#content-filed').css('background-color', 'rgba(255, 231, 224, 0.5)')
            $('#content-filed textarea').css('background-color', 'rgba(253, 243, 240, 0.5)')
            return;
        }
        globalAddin.saveNote(authorId, contactId, $('#noteSubject').val(), $("#appnote").val(), function (data) {
                $("#message").text("Your note has been saved");
                if (!globalAddin.isCommandsAddin) {
                    if (globalAddin.getLocalStorageItem('appmode') === "read")
                        window.location = globalAddin.randomizeUrl("../openemail.html");
                    else if (globalAddin.getLocalStorageItem('appmode') === "mobileread")
                        window.location = globalAddin.randomizeUrl("../openemailmobile.html");
                    else
                        window.location = globalAddin.randomizeUrl("../composeemail.html");
                }
                else
                    Office.context.ui.messageParent("close");
            },
            function (status, errorThrown) {
                $("#message").text("Error! Your note has not been saved");
            }
        );
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
                        bindContact(token, contactName, uuid, $(this).attr('data-uuid'),enterpriseId);
                        $("#notecontact").parent().css("visibility", "hidden");
                    });
                });
            },
            cache: false,
        });
    }


})();
