﻿var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
(function () {
    "use strict";

    var pageLoginInitialized = false;

    Office.initialize = function (reason) {
        $(document).ready(function () {
            if (!pageLoginInitialized)
                initializePage();
        });
    };

    if (!pageLoginInitialized) {
        console.log("ComposeEmail script initialized outside Office::initialize");
        $(document).ready(function () {
            if (!pageLoginInitialized)
                initializePage();
        });
    }

    function initializePage() {
        app.initialize();

        pageLoginInitialized = true;

        if (globalAddin.isCommandsAddin)
            $("btnNewUser").css("visibility", "hidden");

        $("#btnLogin").on("click", function (event) {
            var username = $("#username").val();
            var password = $("#password").val();
            var hasP = CryptoJS.MD5(password).toString();
            var obj = {
                'username': username,
                'hashPassword': hasP,
                'webPlatform': false,
                'deviceToken': "WEB_TOKEN",
                'version': "3.6"
            };
            $.ajax({
                type: "POST",
                url: serviceUrl + "enterprise-" + version + "/user/login?username="+username,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (json) {
                    if (json.userDTO) {
                        if(json.enterprisePackageType == 'FREE' || json.enterprisePackageType == 'SUPER_MONTHLY' || json.enterprisePackageType == 'SUPER_YEARLY' || json.enterprisePackageType == 'BASIC_YEARLY' || json.enterprisePackageType == 'BASIC_MONTHLY')
                        {
                            app.showNotification("", "Oh, you need to upgrade to ultra or ultimate package to use this feature.");
                            return;
                        }
                        app.showNotification("", "You are now logged into Salesbox Outlook addin");
                        globalAddin.currentUser = json.userDTO;

                        // [SF] Needs to be deleted - use globalAddin.CurrentUser property instead
                        localStorage["loggedIn"] = true;
                        localStorage["currentUserId"] = json.userDTO.token;
                        localStorage["ownerName"] = json.userDTO.firstName + " " + json.userDTO.lastName;
                        localStorage["organisationId"] = json.sharedOrganisationId;
                        localStorage["companyName"] = json.companyName;
                        localStorage["ownerid"] = json.userDTO.uuid;
                        localStorage["userEmail"] = json.userDTO.email;
                        localStorage["enterpriseId"] = json.enterpriseId;

                        if (!globalAddin.isCommandsAddin) {
                            if (localStorage["appmode"] === "read")
                                window.location = globalAddin.randomizeUrl("openemail.html");
                            else if (localStorage["appmode"] === "mobileread")
                                window.location = globalAddin.randomizeUrl("openemailmobile.html");
                            else
                                window.location = globalAddin.randomizeUrl("composeemail.html");
                        }
                        else {
                            Office.context.ui.messageParent("close");
                        }

                    }
                },
                statusCode: {
                    500: function (error) {
                        localStorage.removeItem("token");
                        $("#loginFail").show();
                    }
                },
                error: function (e) {
                    var data = JSON.parse(e.responseText);

                    if (data.errorMessage == "USERNAME_NOT_FOUND") {
                        app.showNotification("", "user name not found");
                    }
                    else if (data.errorMessage == "INCORRECT_PASSWORD") {
                        app.showNotification("", "password is not correct");
                    }
                    else {
                        app.showNotification("", "unknown error");
                    }
                },
                cache: false
            });

        });

        $("#btnNewUser").on("click", function (event) {
            if (localStorage["appmode"] === "mobileread") {
                window.open("https://itunes.apple.com/us/app/salesbox-crm-the-sales-crm/id899959535?mt=8");
            } else {
                window.open("https://go.salesbox.com/desktop/#/login?mode=register");
            }
        });
    }


})();

