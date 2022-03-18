var globalAddin = (function () {
    'use strict';
    //https://production.salesbox.com/contact-v3.6/
    //https://production.salesbox.com/contact-v3.6/outlook/trackingIncomingEmail
    var self = {};
    var mailboxItem;
    console.log("globalAddin initializing");

    self.officeControllerTimeout = 5000;
    self.isLoopRunning = false;


    Office.initialize = function (reason) {
        mailboxItem = Office.context.mailbox.item;
    };

    function getItemBeforeSend(event) {
        mailboxItem.body.getAsync("html", { asyncContext: event }, checkBodyOnlyOnSendCallBack);
    }
    function checkBodyOnlyOnSendCallBack(asyncResult) {
        console.log(asyncResult);
        asyncResult.asyncContext.completed({ allowEvent: true });
    }
    /* define object properties */

    Object.defineProperty(self, 'version', {
        __proto__: null,
        value: 'v3.0'
    });

    Object.defineProperty(self, 'serviceUrl', {
        __proto__: null,
        value: "https://production.salesbox.com/"
    });

    // relative urls to call server
    var ServiceApiMethods = {
        getDetailsFromEmail: "/getDetailsFromEmail",
        searchLocal: "/searchLocal",
        syncByOrganisation: "/syncByOrganisation",
        noteAdd: "/note/add"
    };

    /* Properties to hold addin's logic data */

    var AddinStoragePropertiesNames = {
        CurrentUser: 'salesbox_currentUser',
        ContactData: 'salesbox_contactData',
        IsCommandsAddin: "salesbox_isCommandsAddin"
    };

    Object.defineProperty(self, 'currentUser', {
        get: function () {
            return getStorageItem(AddinStoragePropertiesNames.CurrentUser);
        },
        set: function (newValue) {
            setStorageItem(AddinStoragePropertiesNames.CurrentUser, newValue);
        }
    });

    Object.defineProperty(self, 'contactData', {
        get: function () {
            return getStorageItem(AddinStoragePropertiesNames.ContactData);
        },
        set: function (newValue) {
            setStorageItem(AddinStoragePropertiesNames.ContactData, newValue);
        }
    });

    Object.defineProperty(self, 'contactFullName', {
        get: function () {
            if (self.contactData && self.contactData.uuid)
                return self.contactData.firstName + " " + self.contactData.lastName;
            return "";
        }
    });

    Object.defineProperty(self, 'isCommandsAddin', {
        get: function () {
            return getStorageItem(AddinStoragePropertiesNames.IsCommandsAddin);
        },
        set: function (newValue) {
            setStorageItem(AddinStoragePropertiesNames.IsCommandsAddin, newValue);
        }
    });

    /* Object functions */

    // Runs the form - in current window or as popup new window
    self.runForm = function (isPopup, location, winParams) {
        window.open(location, isPopup ? '_blank' : "_self", isPopup ? winParams : "");
    };

    /* helper functions of addin logic */

    self.isUserLogged = function () {
        return self.currentUser && self.currentUser.token;
    };
    self.getAccounts = function () {
    };

    // Returns information about available contact by email
    self.getProfileDetail = function (email, successCallback, errorCallback) {
        console.log("getProfileDetail called");
        // check is the user logged
        if (!self.isUserLogged()) {
            if (errorCallback != null)
                errorCallback("Error isn't logged");
            return;
        }

        $.ajax({
            type: "GET",
            url: self.serviceUrl + "contact-" + self.version + ServiceApiMethods.getDetailsFromEmail + "?token=" + self.currentUser.token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+self.currentUser.enterpriseId,
            cache: false
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("getDetailsFromEmail done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                if (jqXHR.status === 200) {
                    self.contactData = data;
                    successCallback(data);
                }
                if (jqXHR.status === 403) {
                    localStorage['loggedIn'] = false;
                    window.location = "login.html";
                }
            }, function (jqXHR, textStatus, errorThrown) {
                console.log("getDetailsFromEmail failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
                if (errorCallback != null)
                    errorCallback(jqXHR.status, errorThrown);
            });
    };

    self.getProfileDetailSync = function (email) {
        console.log("getProfileDetail called");
        // check is the user logged
        if (!self.isUserLogged()) {
            return;
        }

        var value = $.ajax({
            type: "GET",
            url: self.serviceUrl + "contact-" + self.version + ServiceApiMethods.getDetailsFromEmail + "?token=" + self.currentUser.token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+self.currentUser.enterpriseId,
            async: false
        })
            .responseText;

        var data = JSON.parse(value);

        if (!data.uuid) {
            localStorage["contact_uuid"] = "";
            localStorage['contactName'] = Office.context.mailbox.item.sender.displayName;
            localStorage['contactEmail'] = Office.context.mailbox.item.sender.emailAddress;
        }
        else {
            self.contactData = data;
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
    };

    // Returns loac accounts/orgatizations
    self.getAccounts = function (term, successCallback) {
        console.log("getAccounts called");
        // check is the user logged
        if (!self.isUserLogged())
            return;

        $.ajax({
            type: "POST",
            crossDomain: true,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": term
            }),
            url: self.serviceUrl + "organisation-" + self.version + ServiceApiMethods.searchLocal + "?token=" + self.currentUser.token + "&updatedDate=0&pageIndex=0&pageSize=10"+"&enterpriseID="+self.currentUser.enterpriseId,
            cache: false
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("getAccounts done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                if (jqXHR.status === 200) {
                    successCallback(data);
                }
            }, function (jqXHR, textStatus, errorThrown) {
                console.log("getAccounts failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
            });
    };

    self.getContacts = function (uuid, organizationId, successCallback) {
        console.log("getContacts called");
        // check is the user logged
        if (!organizationId || !self.isUserLogged())
            return;

        $.ajax({
            type: "GET",
            dataType: "json",
            cache: false,
            url: self.serviceUrl + "contact-" + self.version + ServiceApiMethods.syncByOrganisation + "?token=" + self.currentUser.token + "&updatedDate=0&pageIndex=0&pageSize=10&organisationId=" + organizationId+"&enterpriseID="+self.currentUser.enterpriseId,
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("getContacts done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                if (jqXHR.status === 200) {
                    successCallback(data);
                }
            }, function (jqXHR, textStatus, errorThrown) {
                console.log("getContacts failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
            });
    };

    // Saves a note
    self.saveNote = function (authorId, contactId, subject, content, successCallback, errorCallback) {

        var noteDTO = {
            "subject": subject,
            "content": content,
            "authorId": authorId,
            "contactId": contactId
        };

        var data = JSON.stringify(noteDTO);

        $.ajax({
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            url: self.serviceUrl + "document-" + self.version + ServiceApiMethods.noteAdd + "?token=" + self.currentUser.token+"&enterpriseID="+self.currentUser.enterpriseId,
            data: JSON.stringify(noteDTO),
            cache: false,
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("saveNote done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                if (jqXHR.status === 200) {
                    successCallback(data);
                }
            }, function (jqXHR, textStatus, errorThrown) {
                console.log("saveNote failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
                errorCallback(jqXHR.status, errorThrown);
            });
    };

    function escapeHtml(text) {
        var map = {
            //'&': '&amp;',
            //'<': '&lt;',
            //'>': '&gt;',
            //'"': '&quot;',
            //"'": '&#039;'

            '&': '',
            '<': '',
            '>': '',
            '"': '',
            "'": ''

        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }

    self.autoSaveEmail = function (subject, fromName, fromEmail, toName, toEmail, content, dateTimeCreated, currentFolder, id) {

        var html = $.parseHTML(content);
        var tempInnerText = html.innerHTML;


        var domparser = new DOMParser();
        var mydoc = domparser.parseFromString(content, 'text/html');
        //var justText2 = mydoc.body.innerHTML;
        //-----------------------------------------------------------------------------------------
        var trackId = '';
        $(mydoc).find('a').each(function (element) {
            var idATag = $(this).attr('id');
            if(!idATag){
                idATag =  $(this).attr('data-sign');
            }
            if (idATag && (idATag.indexOf('trackImageAtt') !== -1 || idATag.indexOf('trackImageUrl') !== -1)) {
                var href = $(this).attr('href');
                trackId = href ? href.substring(href.lastIndexOf('GIFTCODE') + 8, href.lastIndexOf('.gif')) : null;
                console.log(trackId);
            }else {
                var href = $(this).attr('href');
                    if(href && href.indexOf('trackingRedirect/GIFTCODE') >=0){
                        trackId = href ? href.substring(href.lastIndexOf('GIFTCODE') + 8, href.lastIndexOf('.gif')) : null;
                    }
            }
        });
        // trackImageContent
        $(mydoc).find('img').each(function (element) {
            var idATag = $(this).attr('id');
            if(!idATag){
                idATag =  $(this).attr('data-sign');
            }
            if (idATag && (idATag.indexOf('trackImageContent') !== -1 )) {
                var href = $(this).attr('src');
                trackId = href ? href.substring(href.lastIndexOf('GIFTCODE') + 8, href.lastIndexOf('.gif')) : null;
                console.log(trackId);
            }else {
                var href = $(this).attr('src');
                if(href && href.indexOf('tracking/GIFTCODE') >=0){
                    trackId = href ? href.substring(href.lastIndexOf('GIFTCODE') + 8, href.lastIndexOf('.gif')) : null;
                }
            }
        });
        //--------------------------------------------------------------------------------------
        var trackEmailId = trackId ? trackId : localStorage["IdTrackEmail"];
        var parsedContent = mydoc.body.innerText;
        parsedContent = parsedContent.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        parsedContent = parsedContent.replace(/(?:\\[rn])+/g, "");
        //parsedContent.substring(0,1000);

        var myDate = Math.round(new Date(dateTimeCreated).getTime() / 1000);
        // var parsedContent = content.replace(/(<([^>]+)>)/ig,"");
        // parsedContent = parsedContent.replace(/(?:\\[rn])+/g, "");
        // parsedContent = escapeHtml(parsedContent);
        // var parsedContent = HtmlEncode(content);
        // parsedContent = parsedContent.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');

        //content = content.replace(/(<([^>]+)>)/ig, "");

        // var contentMail = '';
        // if($(mydoc) && $(mydoc).text()){
        //     contentMail = $(mydoc).text().replace(/(<([^>]+)>)/ig, "");
        // }

        var emailDTO = {
            "outLookMailId": id,
            "subject": subject,
            "fromName": fromName,
            "fromEmail": fromEmail,
            "toName": toName,
            "toEmail": toEmail,
            "date": myDate ? myDate : dateTimeCreated,
            "content": content
        };

        var baseUrl = '';


        if (currentFolder == 'inbox') {
            baseUrl = self.serviceUrl + "contact-" + self.version + '/outlook/trackingIncomingEmail?token=';
        } else if (trackEmailId && trackEmailId != 'null') {
            baseUrl = self.serviceUrl + "contact-" + self.version + '/plugin/trackingOutgoingEmailPluginByTrackingId?token=';
        } else {
            baseUrl = self.serviceUrl + "contact-" + self.version + '/outlook/trackingOutgoingEmail?token=';
        }

        var receiverOrsender = currentFolder == 'inbox' ? '&sender=' : '&receivers=';

        var idTrackingEmail = (currentFolder !== 'inbox' && trackEmailId && trackEmailId != 'null') ? "&id=" + trackEmailId : "";

        var email = currentFolder == 'inbox' ? fromEmail : toEmail;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            url: baseUrl + self.currentUser.token + receiverOrsender + email + idTrackingEmail+"&enterpriseID="+self.currentUser.enterpriseId,
            data: JSON.stringify(emailDTO),
            cache: false,
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("autoSaveEmail done: textStatus = " + textStatus + "; status = " + jqXHR.status);

                // After sending to API remove the TrackingId
                localStorage["IdTrackEmail"] = "";
                localStorage['lastSentTime'] = new Date().getTime();
                console.log("IdTrackEmail = " + localStorage["IdTrackEmail"]);
            }, function (jqXHR, textStatus, errorThrown) {
                localStorage["IdTrackEmail"] = "";
                console.log("saveNote failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
            });

        if (currentFolder !== 'inbox' && trackEmailId && trackEmailId != 'null')
            localStorage["IdTrackEmail"] = "";
    };

    self.getDiskId = function () {
        return $.ajax({
            type: "GET",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            cache: false,
            url: self.serviceUrl + "contact-" + self.version + "/outlook/getListSentOutLookIdByUser?token=" + self.currentUser.token + "&userId=1"+"&enterpriseID="+self.currentUser.enterpriseId,
        });
    }

    function HtmlEncode(s) {
        var el = document.createElement("div");
        el.innerText = el.textContent = s;
        s = el.innerHTML;
        return s;
    }

    self.saveEmail = function (subject, fromName, fromEmail, toName, toEmail, dateTimeCreated, content) {
        var myDate = Math.round(new Date(dateTimeCreated).getTime() / 1000);
        var emailDTO = {
            "fromName": fromEmail,
            "fromEmail": fromEmail,
            "toName": toName,
            "toEmail": toEmail,
            "subject": subject,
            "date": myDate ? myDate : dateTimeCreated,
            "content": content.replace(/(<([^>]+)>)/ig, "")
        };

        //var baseUrl = "https://production.salesbox.com/contact-v3.0/outlook/trackingOutgoingEmail?token="
        var baseUrl = self.serviceUrl + "contact-" + self.version + "/outlook/trackingOutgoingEmail?token=";
        $.ajax({
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            url: baseUrl + self.currentUser.token + "&sender=" + fromEmail+"&enterpriseID="+self.currentUser.enterpriseId,
            data: JSON.stringify(emailDTO),
            cache: false,
        })
            .then(function (data, textStatus, jqXHR) {
                // callback for done
                console.log("saveNote done: textStatus = " + textStatus + "; status = " + jqXHR.status);
            }, function (jqXHR, textStatus, errorThrown) {
                console.log("saveNote failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
            });
    };

    self.saveEmailFromComposeView = function (resultCallback) {

        Office.context.mailbox.item.saveAsync({}, function (result) {
            if (result.status == Office.AsyncResultStatus.Succeeded) {
                console.log("Get Attachment");
                var itemId = result.value;

                console.log("sendGetItemRequest : " + itemId);
                var mailbox = Office.context.mailbox;
                var request = getGetItemRequest(itemId);
                var envelope = getSoapEnvelope(request);
                var attachmentIds = [];

                mailbox.makeEwsRequestAsync(envelope, function (result) {
                    if (result.status == Office.AsyncResultStatus.Succeeded) {
                        console.log("callbackGetItem");
                        var response = result.value;
                        var attachments = '';
                        // Process the returned response here.
                        var doc = $.parseXML(response);

                        var i = 0;
                        $(doc).find("FileAttachment").each(function () {
                            attachmentIds[i] = $(this).find("AttachmentId").attr("Id");
                            i++;
                        });

                        var item = Office.context.mailbox.item;
                        var subject = item.subject;
                        var fromName = item._data$p$0._data$p$0.userDisplayName;
                        var fromEmail = item._data$p$0._data$p$0.userEmailAddress;
                        var toName = '';
                        var toEmail = '';
                        var content = '';

                        var dateTimeCreated = Math.round(new Date().getTime() / 1000);

                        $(doc).find("Message").each(function () {
                            content = $(this).find("Body").text().replace(/(<([^>]+)>)/ig, "");
                        });

                        Office.context.mailbox.item.to.getAsync({}, function (result) {
                            if (result.status == Office.AsyncResultStatus.Succeeded) {
                                var arrayOfCcRecipients = result.value[0];
                                if (arrayOfCcRecipients) {
                                    toEmail = arrayOfCcRecipients._data$p$0.address;
                                    toName = arrayOfCcRecipients._data$p$0.name;
                                }
                                console.log("Get Receipents");

                                Office.context.mailbox.item.subject.getAsync({}, function (result) {
                                    if (result.status == Office.AsyncResultStatus.Succeeded) {
                                        subject = result.value;
                                        console.log("Get Subject");

                                        // initialize form data
                                        var emailDTO = {
                                            "fromName": fromName,
                                            "fromEmail": fromEmail,
                                            "toName": toName,
                                            "toEmail": toEmail,
                                            "subject": subject,
                                            "date": dateTimeCreated,
                                            "content": content
                                        };

                                        Office.context.mailbox.item.body.getAsync("text", function (result) {
                                            emailDTO.content = result.value;
                                            console.log("preparingthe request to get attachments");
                                            var envelope =
                                                '<?xml version="1.0" encoding="utf-8"?>' +
                                                '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                                ' xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" ' +
                                                ' xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types" ' +
                                                ' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> ' +
                                                '    <soap:Header>' +
                                                '<t:RequestServerVersion Version="Exchange2013" />' +
                                                '    </soap:Header>' +
                                                '<soap:Body>' +
                                                '<m:GetAttachment>' +
                                                '<m:AttachmentIds>';
                                            if (attachmentIds.length > 0) {
                                                for (var i = 0; i < attachmentIds.length; ++i) {
                                                    envelope += '<t:AttachmentId Id="' + attachmentIds[i] + '"/>';
                                                }
                                            }
                                            envelope +=
                                                '    </m:AttachmentIds>' +
                                                '</m:GetAttachment>' +
                                                '</soap:Body>' +
                                                '</soap:Envelope>';


                                            Office.context.mailbox.makeEwsRequestAsync(envelope, function (asyncResult) {
                                                var doc = $.parseXML(asyncResult.value);
                                                console.log("got attachments");

                                                var formData = new FormData();
                                                console.log("prepare data to save email to server");

                                                formData.append('email', JSON.stringify(emailDTO));
                                                $.ajax({
                                                    url: self.serviceUrl + "contact-" + self.version + "/outlook/saveEmailToContact/" + localStorage["contact_uuid"] + "?token=" + self.currentUser.token+"&enterpriseID="+self.currentUser.enterpriseId,
                                                    data: formData,
                                                    processData: false,
                                                    type: 'POST',
                                                    contentType: false,
                                                    // Now you should be able to do this:
                                                    mimeType: 'multipart/form-data',
                                                    cache: false,
                                                })
                                                    .then(function (data, textStatus, jqXHR) {
                                                        // callback for done
                                                        console.log("saveEmail done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                                                        resultCallback("Email was saved successfully");
                                                    }, function (jqXHR, textStatus, errorThrown) {
                                                        console.log("saveEmail failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
                                                        resultCallback("Email wasn't saved.");
                                                    });

                                            });
                                        });
                                    }
                                    else {
                                        console.log("Failed at Get Subject");
                                    }
                                });
                            }
                            else {
                                console.log("Failed at Get Receipents");
                            }
                        });
                    }
                    else {
                        console.log("Failed at Get Attachments");
                    }
                });
            } else {
                console.log("Failed at Saving Email");
            }
        });
    };

    // save current selected email to the server
    self.saveEmailToContact = function (resultCallback) {
        // initialize form data
        var emailDTO = {
            "fromName": Office.context.mailbox.item.sender.displayName,
            "fromEmail": Office.context.mailbox.item.sender.emailAddress,
            "toName": Office.context.mailbox.userProfile.displayName,
            "toEmail": Office.context.mailbox.userProfile.emailAddress,
            "subject": Office.context.mailbox.item.subject,
            "date": Office.context.mailbox.item.dateTimeCreated,
            "content": ""
        };

        var attachmentIds = [];

        for (var i = 0; i < Office.context.mailbox.item.attachments.length; i++) {
            attachmentIds[i] = Office.context.mailbox.item.attachments[i].id;
        }

        Office.context.mailbox.item.body.getAsync("text", function (result) {
            emailDTO.content = result.value;
            console.log("preparingthe request to get attachments");
            var envelope =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
                '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
                '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
                '  <soap:Header>' +
                '  <t:RequestServerVersion Version="Exchange2013"/>' +
                '  </soap:Header>' +
                '  <soap:Body>' +
                '<GetAttachment xmlns="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
                '  <AttachmentShape/>' +
                '  <AttachmentIds>';
            if (attachmentIds.length > 0) {
                for (var i = 0; i < attachmentIds.length; ++i) {
                    envelope += '<t:AttachmentId Id="' + attachmentIds[i] + '"/>';
                }
            }
            envelope += '  </AttachmentIds>' +
                '  </AttachmentShape>' +
                '</GetAttachment>' +
                '  </soap:Body>' +
                '</soap:Envelope>';

            Office.context.mailbox.makeEwsRequestAsync(envelope, function (asyncResult) {
                var doc = $.parseXML(asyncResult.value);
                console.log("got attachments");
                var formData = new FormData();
                console.log("prepare data to save email to server");

                formData.append('email', JSON.stringify(emailDTO));
                $.ajax({
                    url: self.serviceUrl + "contact-" + self.version + "/outlook/saveEmailToContact/" + localStorage["contact_uuid"] + "?token=" + self.currentUser.token+"&enterpriseID="+self.currentUser.enterpriseId,
                    data: formData,
                    processData: false,
                    type: 'POST',
                    contentType: false,
                    // Now you should be able to do this:
                    mimeType: 'multipart/form-data',
                    cache: false,
                })
                    .then(function (data, textStatus, jqXHR) {
                        // callback for done
                        console.log("saveEmail done: textStatus = " + textStatus + "; status = " + jqXHR.status);
                        resultCallback("Email was saved successfully");
                    }, function (jqXHR, textStatus, errorThrown) {
                        console.log("saveEmail failed: textStatus = " + textStatus + "; status = " + jqXHR.status);
                        resultCallback("Email wasn't saved.");
                    });

            });
        });
    };


    // helper fnction to get storage iten avaiable for ie, ff and safari
    self.getLocalStorageItem = function (key) {
        var value = null;
        try {
            value = localStorage.getItem(key);
            if (!value) {
                value = window.opener.localStorage.getItem(key);
            }
            if (!value) {
                value = parent.window.opener.localStorage.getItem(key);
            }
        }
        catch (e) {
            value = null;
        }
        return value;
    };

    self.setLocalStorageItem = function (key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch (e) {
            window.opener.localStorage.setItem(key, value);
        }
    };
    var getIndex = 0;

    self.getIncomingEmails = function (timeout) {
        console.log("getIncomingEmails called");
        getIndex++;

        $.ajax({
            type: "GET",
            contentType: "application/json",
            crossDomain: true,
            headers: {
                "Access-Control-Allow-Headers": "x-requested-with",
            },
            url: "https://outlook.office365.com/api/v1.0/me/messages",
            success: function (data) {
                console.log("getIncomingEmails success");
            },
            error: function (error) {
                console.log("getIncomingEmails failed");
            },
            cache: false,
        });
    };

    self.getEmailSignature = function (htmlBody) {
        console.log("Getting Email Signature");

        // initialize form data
        var emailDTO = {
            firstname: '',
            lastname: '',
            fromName: '',
            fromEmail: '',
            toName: '',
            toEmail: '',
            subject: '',
            date: '',
            content: '',
            street: '',
            zipcode: '',
            city: '',
            region_state: '',
            country: ''
        };

        if (Office.context.mailbox.item) {
            emailDTO.fromName = Office.context.mailbox.item.sender.displayName;
            emailDTO.fromEmail = Office.context.mailbox.item.sender.emailAddress;
            emailDTO.toName = Office.context.mailbox.userProfile.emailAddress;
            emailDTO.toEmail = Office.context.mailbox.userProfile.displayName;
            emailDTO.subject = Office.context.mailbox.item.subject;
            emailDTO.date = Office.context.mailbox.item.dateTimeCreated;
        }

        var data = JSON.stringify(emailDTO);

        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlBody, "text/html");
        //doc.body.innerHTML;
        // var mailSignature = $(htmlBody).evaluate("div[data-smartmail='gmail_signature'] > div");
        var mailSignature = '';
        // gmail
        var temp = doc.querySelector('div[class="x_gmail_signature"]');
        if(temp === null || temp == undefined){
            temp = doc.querySelector('div[class="gmail_signature"]');
        }
        // outlook - yahoo
        if (temp === null || temp === undefined) {
            $(doc).find('div').each(function () {
                var classDiv = $(this).attr('class');
                var idDiv = $(this).attr('id');
                classDiv = classDiv ? classDiv.toString().toLowerCase() : null;
                idDiv = idDiv ? idDiv.toString().toLowerCase() : null;
                if ((classDiv && classDiv.indexOf('signature') >= 0) || (idDiv && idDiv.indexOf('signature') >= 0)) {
                    temp = this;
                }
            })
        }
        // icloud
        if (temp === null || temp === undefined) {
            $(doc).find('br').each(function () {
                if ($(this).attr('class') == 'x_Apple-interchange-newline') {
                    temp = $(this).closest('div').get(0);
                }
            })
        }
        if (temp != null) {

            var addressInfo = {
                street: '',
                zipcode: '',
                city: '',
                region_state: '',
                country: ''
            };
            var extractedData = extractDataFromGmailSignature(temp.innerText);

            //fill data address  -- commend because we don't care about address any more
            // if (extractedData.address != "" && extractedData.address.status == 'OK') {
            //     var address_com = extractedData.address.results[0].address_components;
            //     for (var i in address_com) {
            //         if (address_com[i].types.indexOf('street_number') != -1) {
            //             addressInfo.street = address_com[i].long_name;
            //         }
            //
            //         if (address_com[i].types.indexOf('route') != -1) {
            //             addressInfo.street += ' ' + address_com[i].long_name;
            //         }
            //
            //         if (address_com[i].types.indexOf('postal_code') != -1) {
            //             addressInfo.zipcode = address_com[i].long_name;
            //         }
            //
            //         if (address_com[i].types.indexOf('administrative_area_level_2') != -1) {
            //             addressInfo.city = address_com[i].long_name;
            //         }
            //
            //         if (address_com[i].types.indexOf('administrative_area_level_1') != -1) {
            //             addressInfo.region_state = address_com[i].long_name;
            //         }
            //
            //         if (address_com[i].types.indexOf('country') != -1) {
            //             addressInfo.country = address_com[i].long_name;
            //         }
            //     }
            // }
            var title = $('div[data-smartmail="gmail_signature"]').text();

            emailDTO.title = extractedData.title;
            emailDTO.phone = extractedData.phone;
            if (emailDTO.fromEmail.indexOf('gmail') >= 0 || emailDTO.fromEmail.indexOf('outlook') >= 0 || emailDTO.fromEmail.indexOf('icloud') >= 0 || emailDTO.fromEmail.indexOf('yahoo') >= 0) {
                emailDTO.account_name = extractedData.account_name;
            } else {
                var accountNameArr = emailDTO.fromEmail.split(/(?:@|.com)/);
                emailDTO.account_name = accountNameArr[1];
            }

            // emailDTO.street = extractedData.street;
            // emailDTO.zipcode = extractedData.zipcode;
            // emailDTO.city = extractedData.city;
            // emailDTO.region_state = extractedData.region_state;
            // emailDTO.email = extractedData.email;

            emailDTO.phone = getPhoneFromString(temp.innerText);
            emailDTO.accountEmail = extractEmail(temp.innerText);
            emailDTO.website = extractWebsite(temp.innerText);
        }

        // extractDataFromAnyDataSignature(htmlBody);

        var name = emailDTO.fromName.split(' ');
        if (name.length > 1) {
            emailDTO.firstname = name[0];
            emailDTO.lastname = name[1];
        }

        localStorage['fromName'] = (emailDTO.fromName) ? emailDTO.fromName : '';
        localStorage['fromEmail'] = (emailDTO.fromEmail) ? emailDTO.fromEmail : '';
        localStorage['toName'] = (emailDTO.toName) ? emailDTO.toName : '';
        localStorage['toEmail'] = (emailDTO.toEmail) ? emailDTO.toEmail : '';
        localStorage['subject'] = (emailDTO.subject) ? emailDTO.subject : '';
        localStorage['date'] = (emailDTO.date) ? emailDTO.date : '';
        localStorage['title'] = (emailDTO.title) ? emailDTO.title : '';
        localStorage['phone'] = (emailDTO.phone) ? JSON.stringify(emailDTO.phone) : localStorage['phonenumber'];
        localStorage['accountName'] = emailDTO.account_name ? emailDTO.account_name : '';
        localStorage['accountEmail'] = emailDTO.accountEmail ? emailDTO.accountEmail : '';
        // localStorage['street'] = (emailDTO.street) ? emailDTO.street : '';
        // localStorage['zipcode'] = (emailDTO.zipcode) ? emailDTO.zipcode : '';
        // localStorage['city'] = (emailDTO.city) ? emailDTO.city : '';
        // localStorage['region_state'] = (emailDTO.region_state) ? emailDTO.region_state : '';
        localStorage['website'] = emailDTO.website ? emailDTO.website : '';
        localStorage['firstname'] = (emailDTO.firstname) ? emailDTO.firstname : '';
        localStorage['lastname'] = (emailDTO.lastname) ? emailDTO.lastname : '';
    };

    self.updateBackButtonBasedOnApplicationMode = function (pageLevel) {
        // pageLevel 0 : Route folder
        // pageLevel 1 : Sub folder (default)
        var pageUrl = "";

        if (localStorage["appmode"] === "read") {
            pageUrl = pageLevel === 1 ? self.randomizeUrl("../openemail.html") : self.randomizeUrl("openemail.html");
        }

        if (localStorage["appmode"] === "mobileread") {
            pageUrl = pageLevel === 1 ? self.randomizeUrl("../openemailmobile.html") : self.randomizeUrl("openemailmobile.html");
        }

        if (localStorage["appmode"] === "compose") {
            pageUrl = pageLevel === 1 ? self.randomizeUrl("../composeemail.html") : self.randomizeUrl("composeemail.html");
        }

        $(".back-button").attr("href", pageUrl);
    };

    self.randomizeUrl = function (url) {
        try {
            var randomVersion = Math.random().toString(36).substring(7);
            return url + "?v=" + randomVersion;
        } catch (e) {
            return url + "?v=123456";
        }
    };

    /* Private stuff here */


    // Returns a GetItem EWS operation request
    var getGetItemRequest = function (id) {
        var result =
            '<GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
            '		xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
            '	<ItemShape>' +
            '		<t:BaseShape>IdOnly</t:BaseShape>' +
            '		<t:AdditionalProperties>' +
            '           <t:FieldURI FieldURI="item:Subject"/>' +
            '			<t:FieldURI FieldURI="message:Sender"/>' +
            '			<t:FieldURI FieldURI="message:From"/>' +
            '			<t:FieldURI FieldURI="message:ToRecipients"/>' +
            '			<t:FieldURI FieldURI="message:CcRecipients"/>' +
            '			<t:FieldURI FieldURI="message:BccRecipients"/>' +
            '			<t:FieldURI FieldURI="message:IsRead"/>' +
            '			<t:FieldURI FieldURI="item:Body"/>' +
            '			<t:FieldURI FieldURI="item:Attachments"/>' +
            '		</t:AdditionalProperties>' +
            '	</ItemShape>' +
            '	<ItemIds>' +
            '		<t:ItemId Id="' + id + '" />' +
            '	</ItemIds>' +
            '</GetItem>';
        return result;
    };

    var getSoapEnvelope = function (request) {
        // Wrap an Exchange Web Services request in a SOAP envelope.
        var result =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
            '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
            '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
            '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
            '  <soap:Header>' +
            '  <t:RequestServerVersion Version="Exchange2013"/>' +
            '  </soap:Header>' +
            '  <soap:Body>' +
            request +
            '  </soap:Body>' +
            '</soap:Envelope>';

        return result;
    };

    var callbackGetItem = function (asyncResult) {

    };

    // gets data from storage by key
    var getStorageItem = function (key) {
        var retVal = null;
        try {
            var value = localStorage.getItem(key);
            retVal = value && JSON.parse(value);
            if (!retVal) {
                value = window.opener.localStorage.getItem(key);
                retVal = value && JSON.parse(value);
            }
            if (!retVal) {
                value = parent.window.opener.localStorage.getItem(key);
                retVal = value && JSON.parse(value);
            }
        }
        catch (e) {

        }
        return retVal;
    };

    // sets data to storage by key
    var setStorageItem = function (key, value) {
        var strValue = JSON.stringify(value);
        localStorage.setItem(key, JSON.stringify(value));
    };


    /*
     First line is Contact name
     Second line is Title
     Second line after “-“ is Account name or
     Third line is account name
     Numbers that looks like phone number
     Email that has email validation
     Website that has website validation
     Anything else is address ( Address validation maybe be number, street address, Postal code, city, state, country)

     Magnus Wingmark
     Hectronic
     Key Account Manager
     Mobile: +46 (0)700-929573
     Email: magnus.wingmark@hectronic.se
     http://www.hectronic.se
     */
    function extractDataFromGmailSignature(data) {
        var extractedData = {
            "contact_name": "",
            "title": "",
            "account_name": "",
            "phone": "",
            "email": "",
            "website": "",
            "address": ""
        };

        //split string contains html tags div,p,br
        // var signatureParts = data.split(/<\/?(?:div|p|br)[^>]*>\s*/im);
        var signatureParts = data.split("\n");

        //filter splited string for remove undefined, empty element in splited array
        signatureParts = signatureParts.filter(function (x) {
            // clear row empty or undefined or -------------- or ++++++++++++ or ************* or =================
            return (x !== undefined && x !== '' && x !== null && x.indexOf('--') < 0 && x.indexOf('**') < 0 && x.indexOf('==') < 0 && x.indexOf('++')<0 && x != '\r');
        });
        if(signatureParts && (signatureParts[0].indexOf('Thank')>=0 || signatureParts[0].indexOf('thank')>=0 || signatureParts[0].indexOf('regards') >=0 || signatureParts[0].indexOf('Regards') >=0)){
            signatureParts.splice(0,1);
        }
        console.log(JSON.stringify(signatureParts));
        for (var i in signatureParts) {
            if (!signatureParts[i].length) {
                break;
            }

            // if (i == 0) {
            //     extractedData.contact_name = isHTML(signatureParts[i]) ? $(signatureParts[i]).text() : signatureParts[i];
            // }

            if (i == 1) {
                extractedData.title = isHTML(signatureParts[i]) ? $(signatureParts[i]).text() : signatureParts[i];
                extractedData.title = isNotEmailPhoneWeb(extractedData.title) ? extractedData.title : '';
            }

            if (i == 2) {
                extractedData.account_name = isHTML(signatureParts[i]) && isNotEmailPhoneWeb(signatureParts[i]) ? $(signatureParts[i]).text() : signatureParts[i];
                extractedData.account_name = isNotEmailPhoneWeb(extractedData.account_name) ? extractedData.account_name : '';
            }

            // if (!extractedData.email.length && i >= 3) {
            //     extractedData.email = extractEmail(signatureParts[i]);
            // }

            if (!extractedData.phone.length && i >= 3) {
                extractedData.phone = extractPhone(signatureParts[i]);
            }

            if (!extractedData.website.length && i >= 3) {
                extractedData.website = extractWebsite(signatureParts[i]);
            }
            // if (!extractedData.address.length && i >= 6) {
            //     var extractedAddress = signatureParts[i];
            //     var seperatorRemoves = [':'];
            //     for (var i in seperatorRemoves) {
            //         var charAt = extractedAddress.indexOf(seperatorRemoves[i]);
            //         if (charAt != -1) {
            //             extractedAddress = extractedAddress.slice(charAt + 1);
            //             break;
            //         }
            //     }
            //     extractedData.address = getAddressInfo(extractedAddress);
            // }
        }
        console.log(extractedData);
        return extractedData;
    }

    function extractDataFromAnyDataSignature(inData) {
        var signature = inData;
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
                        localStorage['phonenumber'] = "+" + num[i];
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

    function isHTML(str) {
        return /^<.*?>$/.test(str) && !!$(str)[0];
    }

    //getAddressInfo by other string
    function getAddressInfo(address) {
        address = encodeURIComponent(address);
        var gettedAddress = '';
        $.ajax({
            type: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false',
            dataType: 'json',
            async: false,
            cache: false,

        }).success(function (data) {
            gettedAddress = data;
        });
        return gettedAddress;
    }

    //get email on incoming email
    function extractEmail(text) {
        var email,
            pattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

        if (email = pattern.exec(text)) {
            return email[0];
        }

        return '';
    }

    //get website on incoming email
    function extractWebsite(text) {
        var url,
            regexp = /((http|ftp|https):\/\/)?[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?/gi;

        if (text) {
            if(url = text.match(regexp)){
                var midUrl ;
                var rootLenth = 0;
                url.forEach(function (element) {
                    if(element.length > rootLenth){
                        midUrl = element;
                        rootLenth = element.length;
                    }
                });
                return midUrl;
            }
        }

        return '';
    }

    //get phone on incoming email
    function extractPhone(text) {
        var phone = text.getNums().join('');
        if (validatePhone(phone)) {
            phone = '+' + phone.slice(0, 2) + ' ' + phone.slice(2);
            return phone;
        }
        return '';
    }

    function getPhoneFromString(text) {
        var phone;
        var regex = /(\+?(\d*)? ?(\d+)?\d*(\(\d*\))*([\s./-]?\d{2,})+){3,}/g;
        if (phone = text.match(regex)) {
            return phone;
        }
        return '';
    }

    function isNotEmailPhoneWeb(text) {
        var midText = text;
        if(text ||  text === 0){
            var emailResult =  extractEmail(midText);
            if(emailResult){
                return false;
            }
            var phoneResult = getPhoneFromString(midText);
            if(phoneResult){
                return false;
            }
            var webResult = extractWebsite(midText)
            if(webResult){
                return false;
            }
            return true;
        }
        return true;
    }


    // function extractDataFromGmail(data)
    // {
    //     var text = $('font').clone();
    //     text.children('br').remove();
    //     name = text.html()
    //
    //     var el = document.createElement( 'html' );
    //     el.innerHTML = data;
    //     var allData = el.getElementsByTagName('font');
    //     allData.children('br').remove();
    //
    // }
    return self;
}());
