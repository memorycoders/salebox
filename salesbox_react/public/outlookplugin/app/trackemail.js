var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var email = '';
var fromEmail = '';
var messageId = '';
(function () {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            $('#loading').fadeIn();
            Office.context.mailbox.item.to.getAsync(getComposeEmail);
            Office.context.mailbox.item.body.getAsync("html", function calbody(body) {

                if (body) {
                    var urls = body.value.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);

                    if (urls) {
                        for (var i = urls.length; i--;) {
                            if (urls[i].indexOf('type=EMAIL_CONTENT') != -1) {
                                urls.splice(i, 1);
                            }
                        }
                        if (urls.length == 0) {
                            $("#urllink").hide();
                        }
                    }
                }
            });
        });
    };
    $(document).ready(function () {
        app.initialize();
        if (globalAddin.getLocalStorageItem("IsTrackContent") === "true") {
            $("#trackContent").html('Tracking Content Enabled');
            $("#trackContent").addClass("contactBg");
        } else {
            $("#trackContent").click(function () {
                trackEmailContent();
            });
        }

        if (globalAddin.getLocalStorageItem("trackEmailURL") === "true") {
            $("#trackUrl").html('Tracking URL Enabled');
            $("#trackUrl").addClass("contactBg");
        } else {
            $("#trackUrl").click(function () {
                window.location = "add_url.html";
            });
        }

        if (globalAddin.getLocalStorageItem("trackEmailAtt") === "true") {
            $("#trackAttacment").html('Tracking Attachment Enabled');
            $("#trackAttacment").addClass("contactBg");
        } else {
            $("#trackAttacment").click(function () {
                window.location = "add_attachment.html";
            });
        }

        $("#btnURLTrack").click(function () {
            trackEmailURL();
        });

        $("#trackemailsubmit").click(function () {
            trackEmailAtt();
        });
    });

    function callback(result) {
        if (result.error) {
            app.showNotification("Error", "Unable to upload attachment..");
        } else {
            $.ajax({
                type: "GET",
                url: serviceUrl + "contact-" + version + "/outlook/getTrackingImage?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + "&type=ATTACHMENT"+"&enterpriseID="+enterpriseId,
                // url: serviceUrl + "contact-" + version + "/outlook/getTrackingImage?emailFrom=" + globalAddin.getLocalStorageItem('userEmail') + "&emailTo=" + email + "&type=ATTACHMENT",
                success: function (data) {
                    app.showNotification("Error", "Unable to track attachment.");
                },
                error: function (error) {
                    console.log(error);
                    Office.context.mailbox.item.body.prependAsync(
                        "<img src='" + error.responseText + "'  />", {
                            coercionType: "html",
                            asyncContext: "This is passed to the callback"
                        },
                        function callback(result) {
                            window.location = "track_options.html";
                        });
                },
                cache: false
            });

        }
    }

    function addAttachment(attachmentURL) {
        // The values in asyncContext can be accessed in the callback
        var options = {
            'asyncContext': {
                var1: 1,
                var2: 2
            }
        };
        Office.context.mailbox.item.addFileAttachmentAsync(attachmentURL, attachmentURL, options, callback);

    }

    function getComposeEmail(asyncResult) {
        var arrayOfCcRecipients = asyncResult.value[0];
        if (arrayOfCcRecipients) {
            email = arrayOfCcRecipients.emailAddress;
            $('#loading').fadeOut();
        }
        else {
            email = "";
            $('#loading').fadeOut();
        }
        console.log(email);
    }


    function trackEmailContent() {
        if (globalAddin.getLocalStorageItem("IsTrackContent") === "true") {
            app.showNotification("", "Email content tracking is already enabled.");
            return;
        }
        var idAttr = "";
        if (localStorage["IdTrackEmail"] && localStorage["IdTrackEmail"] != "null" && localStorage["IdTrackEmail"] != "undefined") {
            idAttr = "&id=" + localStorage["IdTrackEmail"];
        }
        if (email) {
            sentRequestGetTrackImage(idAttr,token,enterpriseId);
        } else {
            $('#loading').fadeIn();
            Office.context.mailbox.item.to.getAsync(function (result) {
                var arrayOfCcRecipients = result.value[0];
                if (arrayOfCcRecipients) {
                    email = arrayOfCcRecipients.emailAddress;
                    sentRequestGetTrackImage(idAttr,token,enterpriseId);
                    $('#loading').fadeOut();
                }
                else {
                    app.showNotification("", "To/email address field can not be blank");
                    $('#loading').fadeOut();
                }
            });
        }
    }

    function sentRequestGetTrackImage(idAttr,token,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-" + version + "/plugin/getTrackingImages?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + idAttr + "&types=EMAIL_CONTENT&token=" + token+"&enterpriseID="+enterpriseId,
            //url: serviceUrl + "contact-"+ version + "/outlook/getTrackingImage?emailFrom=" + globalAddin.getLocalStorageItem('userEmail') + "&emailTo=" + email + "&type=EMAIL_CONTENT",
            success: function (data) {
                localStorage["IsTrackContent"] = true;
                localStorage["IdTrackEmail"] = data.id;
                var trackEmailContent = data.trackEmailContent +"&enterpriseID="+enterpriseId;
                Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, function (result) {
                    var newHtml = result.value.replace("</body>", "<br/ ><img id='trackImageContent' data-sign='trackImageContent' src='" + trackEmailContent + "' style='border: 0px; width: 0px; height: 0px; overflow: hidden; user-select: none;'  /></body>");
                    Office.context.mailbox.item.body.setAsync(newHtml, {coercionType: Office.CoercionType.Html});
                    app.showNotification("", "Email content tracking is enabled.");
                    $("#trackContent").html('Tracking Content Enabled');
                    $("#trackContent").addClass("contactBg");

                });
            },
            error: function (error) {
                console.log(error);
                if (JSON.parse(error.responseText).errorMessage == "EMAIL_CONTACT_NOT_EXIT") {
                    app.showNotification("", "This contact does not exist.");
                    return;
                }
                app.showNotification("", "Email content tracking is not enabled.");
                $("#trackContent").html('Tracking Content is Not Enabled');
                $("#trackContent").addClass("contactBg");
            },
            cache: false
        });
    }
    function validateURL(textval) {
        var urlregex = new RegExp("^(http|https|ftp)\://(.)+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2})(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return urlregex.test(textval);
    }

    function trackEmailURL() {
        if (globalAddin.getLocalStorageItem("trackEmailURL") == "true") {
            app.showNotification("", "Email URL tracking is already enabled.");
            return;
        }

        var name = $("#urlname").val();
        var url = $("#fileattachment").val();
        if (name == '') {
            $("#urlname").css('background', 'rgba(255, 231, 224, 0.498039)');
            app.showNotification("", "Title is required");
            $("#urlname").focus();
            return;
        } else {
            $("#urlname").css('background', '');
        }
        if (url == '') {
            $("#fileattachment").css('background', 'rgba(255, 231, 224, 0.498039)');
            $("#fileattachment").focus();
            app.showNotification("", "URL is required");
            return;
        } else {
            $("#fileattachment").css('background', '');
        }

        if (!validateURL(url)) {
            app.showNotification("", "Insert URL with http(s)");
            return;
        }

        var idAttr = "";
        if (localStorage["IdTrackEmail"] && localStorage["IdTrackEmail"] != "null" && localStorage["IdTrackEmail"] != 'undefined')
            idAttr = "&id=" + localStorage["IdTrackEmail"];
        if(email){
            sentRequestGetTrackingURL(idAttr,token,url,name,enterpriseId);
        }else{
            $('#loading').fadeIn();
            Office.context.mailbox.item.to.getAsync(function (result) {
                var arrayOfCcRecipients = result.value[0];
                if (arrayOfCcRecipients) {
                    email = arrayOfCcRecipients.emailAddress;
                    sentRequestGetTrackingURL(idAttr,token,url,name,enterpriseId);
                    $('#loading').fadeOut();
                }
                else {
                    app.showNotification("", "To/email address field can not be blank");
                    $('#loading').fadeOut();
                }
            });
        }
    }

    function sentRequestGetTrackingURL(idAttr,token,url,name,enterpriseId) {
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-" + version + "/plugin/getTrackingImages?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + idAttr + "&types=URL&token=" + token+"&enterpriseID="+enterpriseId,
            //url: serviceUrl + "contact-" + version + "/outlook/getTrackingImage?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + "&type=URL",
            //url: serviceUrl + "contact-" + version + "/outlook/getTrackingImage?emailFrom=" + globalAddin.getLocalStorageItem('userEmail') + "&emailTo=" + email + "&type=URL",
            success: function (data) {
                localStorage["IdTrackEmail"] = data.id;
                var trackURL = data.trackURL+"&enterpriseID="+enterpriseId;
                Office.context.mailbox.item.body.setSelectedDataAsync(
                    "<a id='trackImageUrl' data-sign=\"trackImageUrl\" href='" + trackURL + "&redirect=" + url + "'  >" + name + "</a>", {
                        coercionType: "html",
                        asyncContext: "This is passed to the callback"
                    },
                    function callback(result) {
                        localStorage["trackEmailURL"] = true;
                        var linkEmail = $('#x_trackImageUrl').attr('href');
                        if(!linkEmail){
                            linkEmail = $('#trackImageUrl').attr('href');
                        }
                        if (linkEmail == undefined || linkEmail == null) {
                            $('#x_trackImageUrl').attr('href', trackURL);
                            $('#trackImageUrl').attr('href', trackURL);
                        }
                        window.location = "track_options.html";
                    });
            },
            error: function (error) {
                if (JSON.parse(error.responseText).errorMessage == "EMAIL_CONTACT_NOT_EXIT") {
                    app.showNotification("", "This contact does not exist.");
                    return;
                }
            },
            cache: false
        });
    }

    function trackEmailAtt() {
        if (globalAddin.getLocalStorageItem("trackEmailAtt") === "true") {
            app.showNotification("", "Email attachments tracking is already enabled.");
            return;
        }

        var name = $("#urlname").val();
        var url = $("#fileattachment").val();
        if (name == '') {
            $("#urlname").css('background', 'rgba(255, 231, 224, 0.498039)');
            $("#urlname").focus();
            app.showNotification("", "Title is required");
            return;
        } else {
            $("#urlname").css('background', '');
        }
        if (url == '') {
            $("#fileattachment").css('background', 'rgba(255, 231, 224, 0.498039)');
            $("#fileattachment").focus();
            app.showNotification("", "URL is required");
            return;
        } else {
            $("#fileattachment").css('background', '');
        }
        if (!validateURL(url)) {
            app.showNotification("", "Insert URL with http(s)");
            return;
        }
        var idAttr = "";
        if (localStorage["IdTrackEmail"] && localStorage["IdTrackEmail"] != 'null' && localStorage["IdTrackEmail"] != 'undefined')
            idAttr = "&id=" + localStorage["IdTrackEmail"];
        if (email) {
            sentRequestGetTrackingLink(idAttr,url,name,token,enterpriseId);
        }else{
            $('#loading').fadeIn();
            Office.context.mailbox.item.to.getAsync(function (result) {
                var arrayOfCcRecipients = result.value[0];
                if (arrayOfCcRecipients) {
                    email = arrayOfCcRecipients.emailAddress;
                    sentRequestGetTrackingLink(idAttr,url,name,token,enterpriseId);
                    $('#loading').fadeOut();

                }
                else {
                    app.showNotification("", "To/email address field can not be blank");
                    $('#loading').fadeOut();
                }
            });
        }

    }

    function sentRequestGetTrackingLink(idAttr,url,name,token,enterpriseId){
        $.ajax({
            type: "GET",
            url: serviceUrl + "contact-" + version + "/plugin/getTrackingImages?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + idAttr + "&types=ATTACHMENT&token=" + token+"&enterpriseID="+enterpriseId,
            //url: serviceUrl + "contact-" + version + "/outlook/getTrackingImage?emailFrom=" + localStorage['userEmail'] + "&emailTo=" + email + "&type=ATTACHMENT",
            //url: serviceUrl + "contact-" + version +"/outlook/getTrackingImage?emailFrom=" + globalAddin.getLocalStorageItem('userEmail') + "&emailTo=" + email + "&type=ATTACHMENT",
            success: function (data) {
                localStorage["IsTrackURL"] = true;
                localStorage["IdTrackEmail"] = data.id;
                var trackAttachment = data.trackAttachment+"&enterpriseID="+enterpriseId;
                Office.context.mailbox.item.body.setSelectedDataAsync(
                    "<a id='trackImageAtt' data-sign='trackImageAtt' href='" + trackAttachment + "&redirect=" + url + "'  >" + name + "</a>", {
                        coercionType: "html",
                        asyncContext: "This is passed to the callback"
                    },
                    function callback(result) {
                        localStorage["trackEmailAtt"] = true;
                        window.location = "track_options.html";
                    });
            },
            error: function (error) {
                if (JSON.parse(error.responseText).errorMessage == "EMAIL_CONTACT_NOT_EXIT") {
                    app.showNotification("", "This contact does not exist.");
                    return;
                }
            },
            cache: false
        });
    }
})();
