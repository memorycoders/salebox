var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
(function() {
    'use strict';
    var token = globalAddin.getLocalStorageItem('currentUserId');
    var ownerName = globalAddin.getLocalStorageItem('ownerName');
    var contactName = globalAddin.getLocalStorageItem('contactName');
    var contactEmail = globalAddin.getLocalStorageItem('contactEmail');
    var uuid = globalAddin.getLocalStorageItem('contact_uuid');
	var contactOrgId= globalAddin.getLocalStorageItem('contactoOrganisationId');
	var orgId = globalAddin.getLocalStorageItem('organisationId');
    var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
    // The initialize function must be run each time a new page is loaded
//    Office.initialize = function (reason) {
        $(document).ready(function() {
            app.initialize();

            // Setup Back Button
            globalAddin.updateBackButtonBasedOnApplicationMode(1);

            $("#taskowner").val(ownerName);
            $("#taskowner").attr("data-uuid", globalAddin.getLocalStorageItem('ownerid'));
            $("[data-toggle='dropdown']").on('click', function() {
                var dropdown = $(this).siblings(".dropdown-menu");
                if (dropdown.is(":hidden")) {
                    $(".dropdown-menu").slideUp();
                    dropdown.slideDown();
                } else {
    				dropdown.slideUp();
    			}
            });
            $("#add-to-prospector").on('click', function() {
                addTask();
            });


            $("#contactfocus-caret-down").on('click', function() {
                uuid = globalAddin.getLocalStorageItem('contact_uuid');
                bindTaskOpportunity(token, uuid,enterpriseId);
            });


            $("#taskcategory").on('click', function() {
                bindTaskCategory(token,enterpriseId);
            });
            $("#categoryfocus-caret-down").on('click', function() {
                bindTaskCategory(token,enterpriseId);
            });


            $("#taskfocus").on('click', function() {
                bindTaskFocus(token,enterpriseId);
            });
            $("#taskfocus-caret-down").on('click', function() {
                bindTaskFocus(token,enterpriseId);
            });


    		$("#account").val(globalAddin.getLocalStorageItem('contactOrganisationName'));
    		$("#account").attr('data-uuid',globalAddin.getLocalStorageItem('contactoOrganisationId'));
    		bindAccount(token,enterpriseId);

            if (contactOrgId && contactOrgId.length>5) {
    			bindTaskContact(token, contactName, uuid,contactOrgId,enterpriseId);
    		} else {
    			bindTaskContact(token, contactName, uuid,orgId,enterpriseId);
    		}
            bindTaskFocus(token,enterpriseId);
            bindTaskCategory(token,enterpriseId);
            bindTaskTag(token);

        });
 //   }

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum;
    }

    function bindTaskContact(token, name, uuid,orgId,enterpriseId) {
        $("#ddltaskContact tr").remove();
        var contactlist = '';
        if (orgId && orgId !== "null") {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: serviceUrl + "contact-" + version + "/syncByOrganisation?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10&organisationId=" + orgId+"&enterpriseID="+enterpriseId,
                success: function(data) {
                    $.each(data.contactDTOList, function(i, obj) {
                        contactlist = contactlist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '" data-email="' + obj.email + '"><td>' + obj.firstName + " " + obj.lastName + '</td></tr>';
                    });
                    if (!name || name.trim() == "") {
                        $("#taskcontact").parent().css("visibility", "hidden");
                    } else {
                        $("#taskcontact").val(name);
                        $("#taskcontact").attr('data-uuid', uuid);
                    }
                    $("#ddltaskContact").append(contactlist);
                    bindTaskOpportunity(token, uuid,enterpriseId);
                    $("#ddltaskContact td").on('click', function(event) {
                        $("#taskcontact").val($(this).text());
                        $("#taskcontact").attr('data-uuid', $(this).attr('data-uuid'));
                        $("#taskcontact").attr('data-email', $(this).attr('data-email'));
                        bindTaskOpportunity(token, $(this).attr('data-uuid'),enterpriseId);
                        $("#taskcontact").parent().show();
                        $("#taskcontact").parent().css("visibility", "visible");
                        $(".dropdown-menu").slideUp();
                        //Update Contact Data
                        globalAddin.getProfileDetailSync($(this).attr('data-email'))
                    });
                },
                cache: false
            });
        } else {
            $("#taskcontact").val(name);
            $("#taskcontact").attr('data-uuid', uuid);
        }
    }

    function bindTaskOpportunity(token, contactid,enterpriseId) {
        var opportunitylist = '';
        $('#ddltaskopporunity tr').remove();

        if (!contactid) {
            return;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: '["' + contactid + '"]',
            url: serviceUrl + "prospect-"+ version  +"/listByContacts?token=" + token + "&pageIndex=0&pageSize=10"+"&enterpriseID="+enterpriseId,
            success: function(data) {
                $.each(data.prospectLiteDTOList, function(i, obj) {
                    opportunitylist = opportunitylist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.description + '</td></tr>';
                });

                $("#ddltaskopporunity").append(opportunitylist);
                $("#taskopportunity").val('');
                $("#ddltaskopporunity .dropdown-item").on('click', function() {
                    $("#taskopportunity").val($(this).text());
                    $("#taskopportunity").attr('data-uuid', $(this).attr('data-uuid'));
                    $(".dropdown-menu").slideUp();
                });
            },
            cache: false
        });
    }

    function bindTaskCategory(token,enterpriseId) {
        var categorylist = '';

        $('#ddltaskcategory tr').remove();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "task-"+ version  +"/list/category?token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data.workDataActivityDTOList) {

                    $.each(data.workDataActivityDTOList, function (i, obj) {
                        categorylist = categorylist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                    });
                }
                if(data.activityDTOList) {
                    $.each(data.activityDTOList, function (i, obj) {
                        categorylist = categorylist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                    });
                }

                $("#ddltaskcategory").append(categorylist);
                $("#ddltaskcategory .dropdown-item").on('click', function() {
                    $("#taskcategory").val($(this).text());
                    $("#taskcategory").attr('data-uuid', $(this).attr('data-uuid'));
                    $(".dropdown-menu").slideUp();
                });
               // bindTaskOpportunity(token, $(this).attr('data-uuid'));
            },
            cache: false
        });
    }

    function bindTaskFocus(token,enterpriseId) {
        var focuslist = '';
        var selectedValue = "NULL"
        var taskopp = $("#taskopportunity").attr("data-uuid");
        var taskcategory = $("#taskcategory").attr("data-uuid");
        if (taskopp)
            selectedValue = taskopp;

        $('#ddltaskfocus tr').remove();

        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "task-"+ version  +"/list/focus/" + selectedValue + "?&pageIndex=0&pageSize=10000&token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                if(data.workDataActivityDTOList) {
                    $.each(data.workDataActivityDTOList, function (i, obj) {
                        focuslist = focuslist + '<tr class="dropdown-item" data-type="WorkData" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                    });
                }
                if(data.activityDTOList) {
                    $.each(data.activityDTOList, function (i, obj) {
                        focuslist = focuslist + '<tr class="dropdown-item" data-type="Activity" data-uuid="' + obj.uuid + '"><td>' + obj.name + '</td></tr>';
                    });
                }

                $("#ddltaskfocus").append(focuslist);
                $("#ddltaskfocus .dropdown-item").on('click', function() {
                    $("#taskfocus").val($(this).text());
                    $("#taskfocus").attr('data-uuid', $(this).attr('data-uuid'));
                    $("#taskfocus").attr('data-type', $(this).attr('data-type'));
                    $(".dropdown-menu").slideUp();
                });
            },
            cache: false
        });
    }

    function bindTaskTag(token) {
        var taglist = '';
        $("#ddltasktag").html('');
        $.ajax({
            type: "GET",
            dataType: "json",
            url: serviceUrl + "task-"+ version  +"/listTag?token=" + token+"&enterpriseID="+enterpriseId,
            success: function(data) {
                $.each(data.tagDTOList, function(i, obj) {
                    if (obj.name == "NONE")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>None</td></tr>';
                    if (obj.name == "SALES")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>Sales</td></tr>';
                    if (obj.name == "INTERNAL_FOLLOW_UP")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>Internal follow-up</td></tr>';
                    if (obj.name == "EXTERNAL_FOLLOW_UP")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>External follow-up</td></tr>';
                    if (obj.name == "ISSUES")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>Issues</td></tr>';
                    if (obj.name == "COLLABORATION")
                        taglist = taglist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td><span class="dot background-' + obj.color.toLowerCase() + '"></span></td><td>Collaboration</td></tr>';

                });

                $("#ddltasktag").append(taglist);
                $("#ddltasktag .dropdown-item").on('click', function() {
                    $("#tasktag").val($(this).text());
                    $("#tasktag").attr('data-uuid', $(this).attr('data-uuid'));
                    $(".dropdown-menu").slideUp();
                });
            },
            cache: false
        });
    }

    function bindAccount(token,enterpriseId) {
         $("#account").autocomplete({
             minLength: 0,
             delay: 500,
             source: function(request, response) {
                 $.ajax({
                     type: "POST",
                     crossDomain: true,
                     dataType: "json",
                     contentType: "application/json",
                     data: JSON.stringify({
                         "name": request.term
                     }),
                     url: serviceUrl + "organisation-"+ version  +"/searchLocal?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10"+"&enterpriseID="+enterpriseId,
                     success: function(data) {
                         response($.map(data.organisationDTOList, function(item) {
                             return {
                                 label: item.name,
                                 value: item.uuid,
                                 email: item.email
                             }
                         }));
                     },
                     cache: false
                 })
             },
             search: function(event, ui) {
                 $('#accountlist li').remove();
				 $("#account").removeAttr("data-uuid");
             },
             focus: function(event, ui) {

             },
             select: function(event, ui) {
                 return false;
             }
         }).focus(function() {
             //Use the below line instead of triggering keydown
             $(this).autocomplete("search");

         }).data("ui-autocomplete")._renderItem = function(ul, item) {
             var data1 = $("<li></li>")
                 .data("item.autocomplete", item)
                 .append("<a class='ui-menu-item' data-uuid=" + item.value + " data-email=" + item.email + " href='javascript:void(0)'>" + item.label + "</a>")
                 .appendTo("#accountlist");
             $("#accountlist a").on('click', function(event) {
                 event.stopImmediatePropagation();
                 $("#account").val($(this).text());
                 $("#account").attr('data-uuid', $(this).attr('data-uuid'));
                 $("#account").attr('data-email', $(this).attr('data-email'));
                 $(this).closest(".dropdown-menu").slideUp();
				 bindTaskContact(token, contactName, uuid,$(this).attr('data-uuid'),enterpriseId);
				 $("#taskcontact").parent().css("visibility","hidden");
             });

             return data1;


         };
     }

    function addAccount(token, company,enterpriseId) {
         var obj = {
             "name": company,
             "mediaType": "MANUAL",
             "additionalEmailList": [],
             "additionalPhoneList": [],
             "isPrivate": false,
             "isChanged": false,
             "participantList": [],
             "numberGoalsMeeting": 0
         }
         $.ajax({
             type: "Post",
             url: serviceUrl + "organisation-"+ version  +"/add?token=" + token+"&enterpriseID="+enterpriseId,
             dataType: 'json',
             contentType: "application/json",
             async: false,
             data: JSON.stringify(obj),
             success: function(result) {
                 $("#account").attr('data-uuid', result.uuid);
             },
             cache: false
         });
     }

    function addTask() {
        var tfocus = $("#taskfocus").val();
        var tfocusType = $("#taskfocus").attr('data-type');
        if (tfocus == '') {
            $("#taskfocus").css('background', 'rgba(255, 231, 224, 0.498039)');
			app.showNotification("", "Focus is required");
            return;
        } else {
            $("#taskfocus").css('background', '');
        }

        var taskDTO = {
            "uuid": null,
            "dateAndTime": toTimestamp($("#taskdate").val()),
            "prospectId": $("#taskopportunity").attr("data-uuid"),
            "ownerId": $("#taskowner").attr("data-uuid"),
            "note": $("#tasknote").val(),
            "contactId": $("#taskcontact").attr("data-uuid"),
            "type": "MANUAL",
            "categoryId": $("#taskcategory").attr("data-uuid")
            // "focusWorkData": {
            //     "uuid": $("#taskfocus").attr("data-uuid")
            // },
            // "focusActivity": {
            //
            // }
        };
        if(tfocusType == 'WorkData'){
            taskDTO.focusWorkData = { "uuid": $("#taskfocus").attr("data-uuid")}
        }else if(tfocusType == 'Activity'){
            taskDTO.focusActivity = { "uuid": $("#taskfocus").attr("data-uuid")}
        }
		if($("#tasktag").attr("data-uuid")) {
		 taskDTO.tagDTO={
                "uuid": $("#tasktag").attr("data-uuid")
            };
		}

		if ($("#account").attr('data-uuid') && $("#account").val().trim()!="") {
             taskDTO.organisationId = $("#account").attr('data-uuid');
         } else if($("#account").val().trim()!="") {
			 addAccount(token, $("#account").val(),enterpriseId);
             taskDTO.organisationId = $("#account").attr('data-uuid');
		 }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
            dataType: "json",
            url: serviceUrl + "task-"+ version  +"/add?token=" + token+"&enterpriseID="+enterpriseId,
            data: JSON.stringify(taskDTO),
            success: function(data) {
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
            error: function(error) {
				var rdata=JSON.parse(error.responseText);
				app.showNotification("", rdata.errorMessage);
            },
            cache: false
        });

    }
})();
