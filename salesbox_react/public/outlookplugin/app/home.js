var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var email = '';
var action = "";
(function() {
    'use strict';
    var token = localStorage['currentUserId'];
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    var pageInitialized = false;
    // The initialize function must be run each time a new page is loaded

    //Use in Production
    Office.initialize = function (reason) {
        console.log("ComposeEmail script initialized inside Office::initialize");
        $(document).ready(function () {
            try {
                initializePage();
                pageInitialized = true;

            } catch (e) {
                window.location = "login.html";
            }
        });
    };
    localStorage["IdTrackEmail"] = null;
    //mailHook.runLoop();
    //// Use in Development
    //Office.initialize = function(reason) {
    //    console.log("ComposeEmail script initialized inside Office::initialize");
    //    $(document).ready(function() {
    //        if (!pageInitialized)
    //            initializePage();
    //    });
    //};

    if (!pageInitialized) {
        console.log("ComposeEmail script initialized outside Office::initialize");
        $(document).ready(function() {
            if (!pageInitialized) {
                initializePage();
                pageInitialized = true;
            }
        });
    }

    function initializePage() {
        try {
            if (!pageInitialized) {
                app.initialize();
                $("#notification-message-content").hide();
            }

            pageInitialized = true;

            // Clear Tracking Options
            localStorage['IsTrackContent'] = false;
            localStorage['trackEmailURL'] = false;
            localStorage['trackEmailAtt'] = false;
            //localStorage["IdTrackEmail"] = "";

            localStorage['appmode'] = "compose";
            localStorage['popup']="No";
            localStorage['contactName'] = "";
            localStorage['contactEmail'] = "";
            localStorage['subject']="";
            localStorage['location']="";
            localStorage['startdate']="";
            localStorage['enddate']="";
            localStorage['note']="";
            localStorage['phonenumer']="";
            localStorage['title']="";
            if (localStorage['loggedIn'] != "true") {
                window.location = "login.html";
            }

            $("#btnLogout").click(function() {
                localStorage['loggedIn'] = false;
                localStorage['lastSentTime'] = '';
                window.location = "login.html";
            });

            $("#addcontact").click(function() {
                action = "AddContact";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                else
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
            });
            $("#addlead").click(function() {
                action = "AddLead";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }
            });

            $("#addtask").click(function() {
                action = "AddTask";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }

            });
            $("#addappointment").click(function() {
                action = "AddAppoitment";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }

            });
            $("#addnote").click(function() {
                action = "AddNote";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }

            });
            $("#viewcontact").click(function() {
                action = "ViewContact";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }
            });
            $("#saveemail").click(function() {
                action = "SaveEmail";
                //app.showNotification("", "This feature is coming soon");

                Office.context.mailbox.item.to.getAsync(getComposeEmail);

                // if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                // {
                //     globalAddin.saveEmailFromComposeView(function(resultMessage) {
                //         app.showNotification(resultMessage);
                //     });
                // }
            });
            $("#trackemail").click(function() {
                action = "TrackEmail";
                if (Office.context.mailbox.item.itemType == Office.MailboxEnums.ItemType.Message)
                {
                    Office.context.mailbox.item.to.getAsync(getComposeEmail);
                }
                else
                {
                    Office.context.mailbox.item.requiredAttendees.getAsync(getComposeAppointment);
                }
            });

        } catch (e) {
            console.log(e.name);
            //localStorage['loggedIn'] = false;
            //window.location = "login.html";
        }
    }

		function validatePhone(phoneNumber){
		   var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
		   return phoneNumberPattern.test(phoneNumber);
		}


    function getComposeEmail(asyncResult) {
        var arrayOfCcRecipients = asyncResult.value[0];
        if (arrayOfCcRecipients) {
            email = arrayOfCcRecipients.emailAddress;
            if (email)
                email = email.toLowerCase();

            localStorage['contactEmail'] = email;
            localStorage['contactName'] = arrayOfCcRecipients.displayName;
        } else
            email = "";

        if (action == "AddContact") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                addContact(email,enterpriseId);
            }
        }
        if (action == "ViewContact") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                viewContact(email,enterpriseId);
            }
        }
        if (action == "SaveEmail") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                globalAddin.saveEmailFromComposeView(function(resultMessage) {
                    app.showNotification(resultMessage);
                });

                //globalAddin.saveEmailFromComposeView(subject.text(), sender.text(), fromEmail.text(), dateTimeCreated.text());
                //saveEmail(email);
            }
        }
        if (action == "TrackEmail") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                $.ajax({
                    type: "GET",
                    url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
                    success: function(data) {
                        if(data && data.uuid) {
                            localStorage["IsTrackContent"]=false;
                            localStorage["IsTrackURL"]=false;
                            localStorage["IsTrackAttachment"]=false;
                            window.location = "composeemail/track_options.html";
                        } else {
                            app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                        }
                    },
                    error: function (jqXhr, status, error) {
                        if (jqXhr.status && jqXhr.status === 403) {
                            app.showNotification("", "Error! Lost communication with Salesbox.");
                            console.log(error);
                            localStorage['loggedIn'] = false;
                            window.location = "login.html";
                        } else {
                            app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                        }
                    },
                    cache: false
                });

            }
        }

		if (action == "AddNote") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            }
			else {
				addNote(email,enterpriseId);
            }
        }

        if (action == "AddLead" || action == "AddTask" || action == "AddAppoitment" || action=="TrackEmail") {
            if (email != "") {
                getProfileDetail(token, email,enterpriseId);
            } else {
                if (action == "AddLead") {
                    window.location = "composeemail/add_lead.html";
                }
                if (action == "AddTask") {
                    window.location = "composeemail/add_task.html";
                }
                if (action == "AddAppoitment") {
                    window.location = "composeemail/add_appointment.html";
                }
                //if (action == "TrackEmail") {
                //    localStorage["IsTrackContent"] = false;
                //    localStorage["IsTrackURL"] = false;
                //    localStorage["IsTrackAttachment"] = false;
                //    window.location = "composeemail/track_options.html";
                //}
            }
        }
    }

	function getComposeAppointment(asyncResult) {
        console.log("getComposeAppointment -> asyncResult", asyncResult)
		if (asyncResult.value.length > 0) {
		    email = asyncResult.value[0].emailAddress;
            localStorage['contactEmail'] = email;
            localStorage['contactName'] = asyncResult.value[0].displayName;
        } else
            email = "";

		if (action == "AddContact") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                addContact(email);
            }
        }
        if (action == "ViewContact") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                viewContact(email,enterpriseId);
            }
        }
        if (action == "SaveEmail") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
                saveEmail(email,enterpriseId);
            }
        }
        if (action == "TrackEmail") {
            if (email == '') {
                app.showNotification("", "To/email address field can not be blank");
            } else {
               // var fromEmail = Office.context.mailbox.userProfile.emailAddress;
               // trackEmail(fromEmail, email);
			   localStorage["IsTrackContent"]=false;
			   localStorage["IsTrackURL"]=false;
			   localStorage["IsTrackAttachment"]=false;
			   //window.location = "composeemail/track_options.html";
            }
        }
        if (action == "AddLead" || action == "AddTask" || action == "AddAppoitment" || action=="TrackEmail") {
            if (email != "") {
                getProfileDetail(token, email,enterpriseId)
            } else {
                if (action == "AddLead") {
                    window.location = "composeemail/add_lead.html";
                }
                if (action == "AddTask") {
                    window.location = "composeemail/add_task.html";
                }
                if (action == "AddAppoitment") {
                    window.location = "composeemail/add_appointment.html";
                }
				if (action == "TrackEmail") {
                    window.location = "composeemail/track_options.html";
                }
            }
        }
    }

    function getProfileDetail(token, email,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data && data.uuid) {
                    globalAddin.contactData = data;
                    localStorage["contact_uuid"] = data.uuid;
                    localStorage['contactEmail'] = email ? email.toLowerCase() : "";
                    localStorage['contactName'] = data.firstName + " " + data.lastName;
                    if(data.organisationName) {
                        localStorage['contactOrganisationName'] = data.organisationName;
                        localStorage['contactoOrganisationId'] = data.organisationId;
                    }	else {
                        localStorage['contactOrganisationName'] = "";
                        localStorage['contactoOrganisationId'] = "";
                    }
                    if (action == "AddLead") {
                        window.location = "composeemail/add_lead.html";
                    }
                    if (action == "AddTask") {
                        window.location = "composeemail/add_task.html";
                    }
                    if (action == "AddAppoitment") {
                        window.location = "composeemail/add_appointment.html";
                    }
                    if (action == "TrackEmail") {
                        window.location = "composeemail/track_options.html";
                    }
                } else {
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                }
            },
            statusCode: {
                500: function() {
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                },
                403: function () {
                   app.showNotification("", "Error! Lost communication with SalesBox!");
                   localStorage['loggedIn'] = false;
                   window.location = "login.html";
                }
            },
            error: function(e) {
                console.log(e);
            },
            cache: false
        });

    }

    function addContact(email,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data && data.uuid) {
                    app.showNotification("", "This contact already exist <a href='composeemail/edit_contact.html?email='" + email + ">Edit Now</a>.");
                } else {
                    window.location = "composeemail/add_contact.html";
                }
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    app.showNotification("", "Error! Lost communication with Salesbox.");
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                } else {
                    window.location = "composeemail/add_contact.html";
                }
            },
            cache: false
        });
    }

	function addNote(email,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data && data.uuid) {
                    globalAddin.contactData = data;
                    localStorage["contact_uuid"] = data.uuid;
                    window.location = "notes/add_note.html";
                }else {
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                }
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    app.showNotification("", "Error! Lost communication with Salesbox.");
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                } else {
                    // window.location = "composeemail/add_contact.html";
                    // app.showNotification("", "This contact does not exist.");
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                }
            },
            cache: false

        });
    }

    function viewContact(email,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data && data.uuid) {
                    globalAddin.contactData = data;
                    localStorage["contact_uuid"] = data.uuid;
                    localStorage['contactEmail'] = email;
                    localStorage['contactName'] = data.firstName + " " + data.lastName;
                    window.location = "detail.html";
                }else {
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                }
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    app.showNotification("", "Error! Lost communication with Salesbox.");
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                } else {
                    app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
                }
            },
            cache: false
        });
    }

    function saveEmail(email,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data && data.uuid) {
                    globalAddin.contactData = data;
                    localStorage["contact_uuid"] = data.uuid;
                // window.location = "save_email.html";
                }else {
                    window.location = "save_email.html";
                    app.showNotification("", "This contact does not exist.");
                }
            },
            error: function (jqXhr, status, error) {
                if (jqXhr.status && jqXhr.status === 403) {
                    app.showNotification("", "Error! Lost communication with Salesbox.");
                    console.log(error);
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                } else {
                    window.location = "save_email.html";
                    app.showNotification("", "This contact does not exist.");
                }
            },
            cache: false
        });
    }
})();
