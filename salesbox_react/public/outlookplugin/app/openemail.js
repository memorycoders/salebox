var serviceUrl = "";
var version = "";
var senderAddress = "";
var senderName = "";
var token = "";
var serviceRequest;
localStorage["contact_uuid"] = "";
(function () {
    'use strict';
    var pageInitialized = false;
    var requestApiDone = false;
    // Use in Production
    Office.initialize = function (reason) {
        console.log("Open script initialized inside Office::initialize");
        try {
            $(document).ready(function () {
                try {
                    initializePage();
                    pageInitialized = true;
                } catch (e) {
                    window.location = "login.html";
                }
            });
        } catch (e) {
            window.location = "login.html";
        }
    };

    //// Use in Development
    //Office.initialize = function(reason) {
    //    console.log("ComposeEmail script initialized inside Office::initialize");
    //    $(document).ready(function() {
    //        if (!pageInitialized)
    //            initializePage();
    //    });
    //};

    if (!pageInitialized) {
        console.log("OpenEmail script initialized outside Office::initialize");
        $(document).ready(function() {
            if (!pageInitialized) {
                initializePage();
                pageInitialized = true;
            }
        });
    }



    String.prototype.getNums = function () {
        var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
            mapN = this.match(rx) || [];
        return mapN.map(Number);
    };

    function initializePage() {
        try {
            if (!pageInitialized) {
                app.initialize();
                $("#notification-message-content").hide();
            }

            var token = localStorage['currentUserId'];

            serviceUrl = globalAddin.serviceUrl;
            version = globalAddin.version;
            token = localStorage['currentUserId'];
            serviceRequest = new Object();

            // Get the current page
            var currentLocation = window.location.href;
            if (currentLocation && currentLocation.indexOf("openemailmobile") !== -1) {
                localStorage["appmode"] = "mobileread";
            } else {
                localStorage["appmode"] = "read";
            }

            // initialize empty ContactData
            globalAddin.contactData = null;
            mailHook.runLoop();

            senderName = Office.context.mailbox.item.sender.displayName;
            senderAddress = Office.context.mailbox.item.sender.emailAddress;
            localStorage['contactName'] = senderName;
            localStorage['contactEmail'] = senderAddress ? senderAddress.toLowerCase() : "" ;
            initApp();
            localStorage['subject'] = "";
            localStorage['location'] = "";
            localStorage['startdate'] = "";
            localStorage['enddate'] = "";
            localStorage['note'] = "";
            localStorage['phonenumer'] = "";
            localStorage['title'] = "";
            localStorage['accountName'] = "";

            // gets the user's profile details from the server
            disableAllButton();
            globalAddin.getProfileDetail(localStorage['contactEmail'] , function(data) {
                    if(data) {
                        localStorage["contact_uuid"] = data.uuid;
                        localStorage['contactEmail'] = data.email;
                        localStorage['contactName'] = data.firstName + " " + data.lastName;
                        if (data.organisationName) {
                            localStorage['contactOrganisationName'] = data.organisationName;
                            localStorage['contactoOrganisationId'] = data.organisationId;
                        } else {
                            localStorage['contactOrganisationName'] = "";
                            localStorage['contactoOrganisationId'] = "";
                        }
                    }
                freeAllButton();
                }, function(status, errorThrown) {
                freeAllButton();
                }
            );


            // get appointment information
            if (Office.context.mailbox.item.start) {
                localStorage['subject'] = Office.context.mailbox.item.subject;
                localStorage['location'] = Office.context.mailbox.item.location;
                localStorage['startdate'] = Date.parse(Office.context.mailbox.item.start).toString("dd MMM yyyy HH:mm");
                localStorage['enddate'] = Date.parse(Office.context.mailbox.item.end).toString("dd MMM yyyy HH:mm");
                Office.context.mailbox.item.body.getAsync("text", function callback(result1) {
                    Office.context.mailbox.item.body.getAsync("html", function callback(result) {
                        var apptitle = $(result.value).find('h3 [itemprop="name"]');
                        var note = $(result.value).find('h3').next().find("span");
                        localStorage['note'] = result1.value.trim();
                        if (apptitle && apptitle.length > 0) {
                            localStorage['subject'] = apptitle[0].innerText;
                        }
                        if (note && note.length > 0) {
                            localStorage['note'] = note[0].innerText;
                        }
                    });
                });

            }
            if (localStorage['loggedIn'] != "true") {
                window.location = globalAddin.randomizeUrl("login.html");
            }
            localStorage['popup'] = "No";

            $("#btnLogout").click(function() {
                localStorage['loggedIn'] = false;
                localStorage['lastSentTime']= '';
                window.location = globalAddin.randomizeUrl("login.html");
            });
            $("#addcontact").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    if (Office.context.requirements.isSetSupported("mailbox", 1.3))
                    {
                        Office.context.mailbox.item.body.getAsync("html", function(result) {
                            if (result.status == Office.AsyncResultStatus.Succeeded) {
                                var htmlBody = result.value;
                                globalAddin.setLocalStorageItem('htmlEmailBody', htmlBody);
                                globalAddin.getEmailSignature(htmlBody);
                                window.location = globalAddin.randomizeUrl("composeemail/add_contact.html");
                            }
                        });
                    }

                } else {
                    if (localStorage['contactEmail'])
                        app.showNotification("", "This contact already exist <a href='composeemail/edit_contact.html?email='" + localStorage['contactEmail'] + ">Edit Now</a>.");
                    else
                        app.showNotification("", "This contact already exist>Edit Now</a>.");
                }
            });

            $(document).on('click','.addContact',function () {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    if (Office.context.requirements.isSetSupported("mailbox", 1.3))
                    {
                        Office.context.mailbox.item.body.getAsync("html", function(result) {
                            if (result.status == Office.AsyncResultStatus.Succeeded) {
                                var htmlBody = result.value;
                                globalAddin.setLocalStorageItem('htmlEmailBody', htmlBody);
                                globalAddin.getEmailSignature(htmlBody);
                                window.location = globalAddin.randomizeUrl("composeemail/add_contact.html");
                            }
                        });
                    }

                } else {
                    if (localStorage['contactEmail'])
                        app.showNotification("", "This contact already exist <a href='composeemail/edit_contact.html?email='" + localStorage['contactEmail'] + ">Edit Now</a>.");
                    // else
                    //     app.showNotification("", "This contact already exist>Edit Now</a>.");
                }
            });

            $("#addlead").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    var left = (screen.width / 2) - 250;
                    var top = 0;
                    // window.open('composeemail/add_lead.html', '_blank', 'scrollbars=0,resizable=0,width=500,height=400,top=' + top + ',left=' + left);
                    window.location = globalAddin.randomizeUrl("composeemail/add_lead.html");
                }
            });
            $("#addtask").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    var left = (screen.width / 2) - 250;
                    var top = 0;
                    // window.open('composeemail/add_task.html', '_blank', 'scrollbars=0,resizable=0,width=500,height=400,top=' + top + ',left=' + left);
                    window.location = globalAddin.randomizeUrl("composeemail/add_task.html");
                }

            });
            $("#addappointment").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    var left = (screen.width / 2) - 250;
                    var top = 0;
                    //window.open('composeemail/add_appointment.html', '_blank', 'scrollbars=0,resizable=0,width=500,height=500,top=' + top + ',left=' + left);
                    window.location = globalAddin.randomizeUrl("composeemail/add_appointment.html");
                }
            });
            $("#addnote").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    var left = (screen.width / 2) - 250;
                    var top = 0;
                    // globalAddin.runForm(true, 'notes/add_note.html', 'scrollbars=0,resizable=0,width=500,height=500,top=' + top + ',left=' + left);
                    window.location = globalAddin.randomizeUrl("notes/add_note.html");
                }
            });
            $("#viewcontact").click(function() {
                if(!requestApiDone){
                    return;
                }
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    var left = (screen.width / 2) - 250;
                    var top = 0;
                    // window.open('detail.html', 'window_open', 'scrollbars=auto,resizable=no,width=500,height=600,top=' + top + ',left=' + left);
                    window.location = globalAddin.randomizeUrl("detail.html");
                }
            });
            $("#saveemail").click(function() {
                if(!requestApiDone){
                    return;
                }
                //app.showNotification("", "This feature is coming soon");
                //return;
                if (localStorage["contact_uuid"] == "") {
                    app.showNotification("", "This contact does not exist <a href='javascript:void(0)' class='addContact'>Add Now</a>.");
                } else {
                    /*serviceRequest.messageId = Office.context.mailbox.item.itemId;
                     serviceRequest.ToEmail = Office.context.mailbox.userProfile.emailAddress;
                     serviceRequest.toName = Office.context.mailbox.userProfile.displayName;
                     serviceRequest.fromEmail = senderAddress;
                     serviceRequest.fromName = Office.context.mailbox.item.sender.displayName;
                     serviceRequest.subject = Office.context.mailbox.item.subject;
                     serviceRequest.date = Office.context.mailbox.item.dateTimeCreated;
                     Office.context.mailbox.item.body.getAsync("text", function callback(result) {
                     serviceRequest.content = result.value;
                     });

                     localStorage['serviceRequest'] = JSON.stringify(serviceRequest);
                     var left = (screen.width / 2)-250;
                     var top = 0;
                     window.open('save_email.html', '_blank', 'scrollbars=0,resizable=0,width=500,height=500,top='+top+',left='+left);*/


                    globalAddin.saveEmailToContact(function (resultMessage) {
                        app.showNotification(resultMessage);
                    });
                }
            });

            Office.context.mailbox.item.body.getAsync("html", function calbody(body) {
                var signature = body.value;
                var data = signature.split('x_Signature');
                if (data.length < 2) {
                    data = signature.split('x_gmail_signature');
                }
                console.log(data);
                if (data.length > 1) {
                    var num = data[1].getNums();
                    console.log(num);
                    var i;
                    for (i = 0; i < num.length; ++i) {
                        console.log(num[i].toString().length);
                        if (num[i].toString().length > 8) {
                            if (validatePhone(num[i])) {
                                localStorage['phonenumer'] = "+" + num[i];
                            }
                        }
                    }
                    var ttac = data[1].split(' at ');
                    console.log(ttac);
                    if (ttac.length > 1) {
                        var title = ttac[0].split('>')[ttac[0].split('>').length - 1];
                        var company = ttac[1].split('<')[0];
                        localStorage['title'] = title;
                        localStorage['accountName'] = company;
                    }
                }
            });
        } catch (e) {
            console.log(e.name);
            //localStorage['loggedIn'] = false;
            //window.location = globalAddin.randomizeUrl("login.html");
        }
    }
    function disableAllButton() {
        $('#loading').fadeIn();
        requestApiDone = false;
    }

    function freeAllButton() {
        $('#loading').fadeOut();
        requestApiDone = true;
    }
    function validatePhone(txtPhone) {
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(txtPhone)) {
            return true;
        }
        else {
            return false;
        }
    }

    function checkIfPhoneInString(text) {
        var regexPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        if (regexPhone.test(text)) {
            return '1';
        } else {
            regexPhone = /\b\d{2}[-.]?\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
            if (regexPhone.test(text)) {
                return '2';
            }
        }
        return false;
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
        // Get EWS callback token.
        Office.context.mailbox.getCallbackTokenAsync(
            function (asyncResult) {
                if (asyncResult.status === "succeeded") {
                    serviceRequest.attachmentToken = asyncResult.value;
                } else {
                    console.log(asyncResult);
                }
            });
    }
})();
