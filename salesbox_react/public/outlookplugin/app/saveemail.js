var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var email = '';
var messageId = '';
var serviceRequest = new Object();
var action = "";
(function() {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    // The initialize function must be run each time a new page is loaded
    $(document).ready(function() {
        app.initialize();
        if (globalAddin.getLocalStorageItem('appmode') == "read") {
            serviceRequest = JSON.parse(globalAddin.getLocalStorageItem('serviceRequest'));
            saveEmail(token, globalAddin.getLocalStorageItem('contactEmail'),enterpriseId);
        } else {
            Office.initialize = function(reason) {
                saveEmail(token, globalAddin.getLocalStorageItem('contactEmail'),enterpriseId);
                //initApp();
                LoadComposeMessge("");

            };
        }
    });

    function LoadComposeMessge(uuid) {

        Office.context.mailbox.item.saveAsync(function(result) {
            messageId = result.value;
            serviceRequest.messageId = messageId;
            serviceRequest.ToEmail = globalAddin.getLocalStorageItem('contactEmail');
            serviceRequest.toName = globalAddin.getLocalStorageItem('contactName');
            serviceRequest.fromEmail = Office.context.mailbox.userProfile.emailAddress;
            serviceRequest.fromName = Office.context.mailbox.userProfile.displayName;
            serviceRequest.date = "";
            Office.context.mailbox.item.subject.getAsync(function callback(result) {
                serviceRequest.subject = result.value;
                Office.context.mailbox.item.body.getAsync("text", function callback(result) {
                    serviceRequest.content = result.value;
                    if (action == "Contact") {
                        addEmailltoContact(token, uuid,enterpriseId);
                    }
                    if (action == "Account") {
                        addEmailltoAccount(token, uuid,enterpriseId);
                    }
                    if (action == "Opp") {
                        addEmailltoOpportunity(token, uuid,enterpriseId);
                    }
                });
            });
        });
    }


    function initApp() {
        // Make sure the attachments API is available.
        // Currently the API is available for mail apps running
        // on OWA, if the user's mailbox is on Exchange Online.
        if (Office.context.mailbox.item.attachments == undefined) {
            // Handle as appropriate for your app if
            // API is not available.
            console.log("API is not available.");
        } else if (Office.context.mailbox.item.attachments.length != 0) {
            // The selected item has attachments.
            // Initialize a request object.
            serviceRequest.attachmentToken = "";
            serviceRequest.ewsUrl = Office.context.mailbox.ewsUrl;
            // Array of attachment ids.
            serviceRequest.attachmentIDs = new Array();

            clientGetAttachments(serviceRequest);
        }

    }

    function clientGetAttachments(serviceRequest) {
        // Get the attachment IDs for all the attachments
        // for the user-selected item.
        var item = Office.context.mailbox.item;
        for (var i = 0; i < item.attachments.length; i++)
            serviceRequest.attachmentIDs.push(item.attachments[i].id);
        console.log(serviceRequest);
        // Get EWS callback token.
        Office.context.mailbox.getCallbackTokenAsync(
            function(asyncResult) {
                if (asyncResult.status === "succeeded") {
                    // Cache the result from the server.
                    serviceRequest.attachmentToken = asyncResult.value;
                    //serviceRequest.state = 3;
                    // With callback token, attachment IDs and
                    // EWS URL end point all ready, call backend
                    // service. Backend service will call EWS GetAttachment
                    // operation to get the actual attachments.
                    //makeServiceRequest(serviceRequest);
                    console.log(serviceRequest);
                    // Handle any errors from getting the attachments.
                } else {
                    // Handle any errors with the callback token.
                    console.log(asyncResult);
                }
            });
    }

    function makeServiceRequest(serviceRequest) {
        // Format the attachment details for sending.
        for (var i = 0; i < mailbox.item.attachments.length; i++) {
            serviceRequest.attachments[i] = JSON.parse(JSON.stringify(mailbox.item.attachments[i].$0_0));
        }

        $.ajax({
            url: '../../api/Default',
            type: 'POST',
            data: JSON.stringify(serviceRequest),
            contentType: 'application/json;charset=utf-8',
            cache: false
        }).done(function(response) {
            if (!response.isError) {
                var names = "<h2>Attachments processed using " +
                    serviceRequest.service +
                    ": " +
                    response.attachmentsProcessed +
                    "</h2>";
                for (i = 0; i < response.attachmentNames.length; i++) {
                    names += response.attachmentNames[i] + "<br />";
                }
                document.getElementById("names").innerHTML = names;
            } else {
                app.showNotification("Runtime error", response.message);
            }
        }).fail(function(status) {

        }).always(function() {
            $('.disable-while-sending').prop('disabled', false);
        })
    };


    function saveEmail(token, email,enterpriseId) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "contact-"+ version  +"/getInfoFromEmail?token=" + token + "&email=" + email+"&enterpriseID="+enterpriseId,
            cache: false,
            success: function(data) {
                $("#add-to-contact").hide();
                $("#add-to-account").hide();
                $("#add-to-opportunity").hide();

                var oppuuid = '';
                if (data.contactUUID) {
                    $("#add-to-contact").show();
                    $("#add-to-contact").attr('data-contact', data.contactUUID);
                    $("#add-to-contact").on('click', function() {
                        $("#message").html("Saving your email to contact please wait...<img class='spinning-image' />");
                        if (globalAddin.getLocalStorageItem('appmode') == "compose") {
                            action = "Contact";
                            LoadComposeMessge(data.contactUUID);
                        } else
                            addEmailltoContact(token, data.contactUUID,enterpriseId);
                    });
                }
                if (data.accountUUID) {
                    $("#add-to-account").show();
                    $("#add-to-account").attr('data-account', data.accountUUID);
                    $("#add-to-account").on('click', function() {
                        $("#message").html("Saving your email to account please wait...<img class='spinning-image' />");
                        if (globalAddin.getLocalStorageItem('appmode') == "compose") {
                            action = "Account";
                            LoadComposeMessge(data.accountUUID);
                        } else
                            addEmailltoAccount(token, data.accountUUID,enterpriseId);
                    });
                }
                for (var name in data.opportunities) {
                    oppuuid = name;
                }
                if (oppuuid) {
                    $("#add-to-opportunity").show();
                    $("#add-to-opportunity").attr('data-opportunity', oppuuid);
                    $("#add-to-opportunity").on('click', function() {
                        if (globalAddin.getLocalStorageItem('appmode') == "compose") {
                            action = "Opp";
                            LoadComposeMessge(oppuuid);
                        } else
                            addEmailltoOpportunity(token, oppuuid,enterpriseId);
                        $("#message").html("Saving your email to opportunity please wait...<img class='spinning-image' />");
                    });
                }
            }
        });
    }

    function addEmailltoContact(token, uuid,enterpriseId) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(serviceRequest),
            url: serviceUrl + "contact-"+ version  +"/outlook/saveEmailToContact/" + uuid + "?token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                $("#message").text("Your email has been saved");
            },
            error: function(error) {
                $("#message").text("Your email has been saved");
            },
            cache: false
        });
    }

    function addEmailltoAccount(token, uuid,enterpriseId) {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(serviceRequest),
            url: serviceUrl + "contact-"+ version  +"/outlook/saveEmailToAccount/" + uuid + "?token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                $("#message").text("Your email has been saved");
            },
            error: function(error) {
                $("#message").text("Your email has been saved");
            },
            cache: false
        });
    }

    function addEmailltoOpportunity(token, uuid,enterpriseId) {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(serviceRequest),
            url: serviceUrl + "contact-"+ version  +"/outlook/saveEmailToOpportunity/" + uuid + "?token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                $("#message").text("Your email has been saved");
            },
            error: function(error) {
                $("#message").text("Your email has been saved");
            },
            cache: false
        });
    }
})();
