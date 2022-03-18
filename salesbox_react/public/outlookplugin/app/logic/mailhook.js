// Imlementation the functionality of mail hook

var mailHook = (function () {
    'use strict';

    var self = {};
    var gotDistId = false;
    console.log("mailHook initializing");

    var officeControllerTimeout = 5000; // 5s
    var ids_dict = {};
    var getDistId = function () {
        return globalAddin.getDiskId();
    }


    var currentFolder = '';

    self.runLoop = function () {
        console.log("run loop to check incoming and outgoing emails");
        setTimeout(function checkEmails() {
            sendFindItemRequest('inbox');
            sendFindItemRequest('sentitems');
            setTimeout(checkEmails, officeControllerTimeout);
        }, officeControllerTimeout);
    }


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

    // Returns a FindItem EWS operation request
    var getFindFolderItemsRequest = function (folderId) {
        var result =
            '<FindItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
            '           xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"' +
            '          Traversal="Shallow">' +
            '	<ItemShape>' +
            '   	<t:BaseShape>IdOnly</t:BaseShape>' +
            '	</ItemShape>' +
            '	<ParentFolderIds>' +
            '    <t:DistinguishedFolderId Id="' + folderId + '"/>' +
            '	</ParentFolderIds>' +
            '	<SortOrder>';
        if (folderId == 'inbox') {
            result += '		<FieldOrder Order="Descending">' +
                '			<FieldURI FieldURI="item:DateTimeReceived" />' +
                '		</FieldOrder>';
        }
        if (folderId == 'sentitems') {
            result += '		<FieldOrder Order="Descending">' +
                '			<FieldURI FieldURI="item:DateTimeSent" />' +
                '		</FieldOrder>';
        }

       result += '	</SortOrder>';
        if (folderId == 'sentitems') {
            // filter by lastSyntime
            if (localStorage['lastSentTime'] != null && localStorage['lastSentTime'] != undefined && localStorage['lastSentTime'] != 'null' && localStorage['lastSentTime'] != 'undefined' && localStorage['lastSentTime'] != '') {
                var lastSysDate = new Date(new Number(localStorage['lastSentTime']));
                var month = lastSysDate.getMonth() + 1;
                var date = lastSysDate.getDate();
                var year = lastSysDate.getFullYear();
                var dateQuery = month + '/' + date + '/' + year;
                result += ' <QueryString>Sent:>' + dateQuery + ' OR Sent:'+dateQuery+'</QueryString>';
            }
        }
        result += ' </FindItem>';
        return result;
    };

    // Returns a GetItem EWS operation request
    var getGetItemRequest = function (id) {
        var result =
            '<GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
            '		xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
            '	<ItemShape>' +
            '		<t:BaseShape>IdOnly</t:BaseShape>' +
            '		<t:AdditionalProperties>' +
            '			<t:FieldURI FieldURI="item:Subject"/>' +
            '			<t:FieldURI FieldURI="message:Sender"/>' +
            '			<t:FieldURI FieldURI="message:From"/>' +
            '			<t:FieldURI FieldURI="message:ToRecipients"/>' +
            '			<t:FieldURI FieldURI="message:CcRecipients"/>' +
            '			<t:FieldURI FieldURI="message:BccRecipients"/>' +
            '			<t:FieldURI FieldURI="message:IsRead"/>' +
            '			<t:FieldURI FieldURI="item:Body"/>' +
            '			<t:FieldURI FieldURI="item:DateTimeCreated"/>' +
            '		</t:AdditionalProperties>' +
            '	</ItemShape>' +
            '	<ItemIds>' +
            '		<t:ItemId Id="' + id + '" />' +
            '	</ItemIds>' +
            '</GetItem>';
        return result;
    }

    // Send the request to EWS
    var sendFindItemRequest = function (folderId) {
        console.log("sendFindItemRequest : " + folderId);
        var mailbox = Office.context.mailbox;
        var request = getFindFolderItemsRequest(folderId);
        var envelope = getSoapEnvelope(request);

        if (folderId == 'inbox')
            mailbox.makeEwsRequestAsync(envelope, InboxcallbackFindItem);
        else
            mailbox.makeEwsRequestAsync(envelope, SentcallbackFindItem);
    };

    // Function called when the EWS request is complete.
    var InboxcallbackFindItem = function (asyncResult) {
        console.log("InboxcallbackFindItem");
        var response = asyncResult.value;
        var context = asyncResult.asyncContext;

        var isOneSent = false;
        // Process the returned response here.
        var doc = $.parseXML(response);
        // gets attributes
        if (!gotDistId) {
            getDistId().done(function (listId) {
                gotDistId = true;
                if (listId && listId.length > 0) {
                    listId.forEach(function (element) {
                        if (element) {
                            ids_dict[element] = element;
                        }
                    });
                }
                $(doc).find("t\\:Message").each(function () {
                    var id = $(this).find("t\\:ItemId").attr("Id");
                    if (id != null) {
                        // check is ids_dict contains id
                        if (ids_dict[id] == null) {
                            console.log(" get info about item : " + id);
                            // send to the server
                            ids_dict[id] = id;
                            InboxsendGetItemRequest(id);
                            isOneSent = true;
                        }
                    }
                });
            }).fail(function (error) {
                console.log(error);
                gotDistId = true;
            });
        } else {
            $(doc).find("t\\:Message").each(function () {
                var id = $(this).find("t\\:ItemId").attr("Id");
                if (id != null) {
                    // check is ids_dict contains id
                    if (ids_dict[id] == null) {
                        console.log(" get info about item : " + id);
                        // send to the server
                        ids_dict[id] = id;
                        InboxsendGetItemRequest(id);
                        isOneSent = true;
                    }
                }
            });
        }
        if(isOneSent == false){
            localStorage['lastSentTime'] = new Date().getTime();
        }

    };

    var InboxsendGetItemRequest = function (id) {
        console.log("sendGetItemRequest : " + id);
        var mailbox = Office.context.mailbox;
        var request = getGetItemRequest(id);
        var envelope = getSoapEnvelope(request);
        var context = {id: id};
        mailbox.makeEwsRequestAsync(envelope, InboxcallbackGetItem, context);
    };

    var InboxcallbackGetItem = function (asyncResult) {
        if (asyncResult && asyncResult.asyncContext && asyncResult.status == 'failed') {
            ids_dict[asyncResult.asyncContext.id] = null;
        }
        console.log("callbackGetItem");
        var response = asyncResult.value;
        var context = asyncResult.context;

        // Process the returned response here.
        var doc = $.parseXML(response);
        // gets attributes
        $(doc).find("t\\:Message").each(function () {
            var id = $(this).find("t\\:ItemId").attr("Id");
            var subject = $(this).find("t\\:Subject");
            var fromName = $(this).find("t\\:From").find("t\\:Name");
            var fromEmail = $(this).find("t\\:From").find("t\\:EmailAddress");
            var toRecipients = $(this).find("t\\:ToRecipients");
            var toRecipientsName = $(this).find("t\\:ToRecipients");
            var ccRecipients = $(this).find("t\\:CcRecipients");
            var cccRecipients = $(this).find("t\\:BccRecipients");

            // Assume for now it is only 1 receipent
            var toName = $(this).find("t\\:ToRecipients").find("t\\:Name");
            var toEmail = $(this).find("t\\:ToRecipients").find("t\\:EmailAddress");


            var content = $(this).find("t\\:Body");
            var dateTimeCreated = $(this).find("t\\:DateTimeCreated");

            globalAddin.autoSaveEmail(subject.text(), fromName.text(), fromEmail.text(), toName.text(), toEmail.text(), content.text(), dateTimeCreated.text(), 'inbox', id);
        });
    };


    // Function called when the EWS request is complete. limit 3 calls : https://docs.microsoft.com/en-us/outlook/add-ins/limits-for-activation-and-javascript-api-for-outlook-add-ins
    var SentcallbackFindItem = function (asyncResult) {
        if (asyncResult.status != 'failed') {
            var response = asyncResult.value;
            var context = asyncResult.asyncContext;
            var doc = $.parseXML(response);
            if (!gotDistId) {
                getDistId().done(function (listId) {  //get id from salesbox
                    gotDistId = true;
                    if (listId && listId.length > 0) {
                        listId.forEach(function (element) {
                            if (element) {
                                ids_dict[element] = element;
                            }
                        });
                    }
                    $(doc).find("t\\:Message").each(function () {
                        var id = $(this).find("t\\:ItemId").attr("Id");
                        if (id != null) {
                            // check is ids_dict comtains id
                            if (ids_dict[id] == null) {
                                // send to the server
                                ids_dict[id] = id;
                                SentSendGetItemRequest(id);
                                // isOneSent = true;
                            }
                        }
                    });
                }).fail(function (error) {
                    console.log(error);
                    gotDistId = true;
                });
            } else {
                $(doc).find("t\\:Message").each(function () {
                    var id = $(this).find("t\\:ItemId").attr("Id");
                    if (id != null) {
                        //console.log("	find item : " + id);
                        // check is ids_dict comtains id
                        if (ids_dict[id] == null) {
                            //console.log("	get info about item : " + id);
                            // send to the server
                            ids_dict[id] = id;
                            SentSendGetItemRequest(id);
                            // isOneSent = true;
                        }
                    }
                });
            }
        } else {
            console.error(asyncResult.error)
        }

    };

    var SentSendGetItemRequest = function (id) {
        console.log("sendGetItemRequest : " + id);
        var mailbox = Office.context.mailbox;
        var request = getGetItemRequest(id);
        var envelope = getSoapEnvelope(request);
        var context = {id: id};
        mailbox.makeEwsRequestAsync(envelope, SentCallbackGetItem, context);
    };

    var SentCallbackGetItem = function (asyncResult) {
        if (asyncResult && asyncResult.asyncContext && asyncResult.status == 'failed') {
            ids_dict[asyncResult.asyncContext.id] = null;
        }
        console.log("SentcallbackGetItem");
        var response = asyncResult.value;
        var context = asyncResult.context;

        // Process the returned response here.
        var doc = $.parseXML(response);
        // gets attributes
        $(doc).find("t\\:Message").each(function () {
            var id = $(this).find("t\\:ItemId").attr("Id");
            var subject = $(this).find("t\\:Subject");
            var fromName = $(this).find("t\\:From").find("t\\:Name");
            var fromEmail = $(this).find("t\\:From").find("t\\:EmailAddress");

            var toRecipients = $(this).find("t\\:ToRecipients");
            var toRecipientsName = $(this).find("t\\:ToRecipients");
            var ccRecipients = $(this).find("t\\:CcRecipients");
            var cccRecipients = $(this).find("t\\:BccRecipients");

            // Assume for now it is only 1 receipent
            var toName = $(this).find("t\\:ToRecipients").find("t\\:Name");
            var toEmail = $(this).find("t\\:ToRecipients").find("t\\:EmailAddress");

            var content = $(this).find("t\\:Body");
            var dateTimeCreated = $(this).find("t\\:DateTimeCreated");
            globalAddin.autoSaveEmail(subject.text(), fromName.text(), fromEmail.text(), toName.text(), toEmail.text(), content.text(), dateTimeCreated.text(), 'sentItem', id);
        });
    };

    return self;
}());
