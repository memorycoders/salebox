var serviceUrl = globalAddin.serviceUrl;
var version = globalAddin.version;
var contactName = localStorage['contactName'];
var contactEmail = localStorage['contactEmail'];
var participantListArray = new Array();
var pageIndex = 1;

 (function() {
     'use strict';
     var token = localStorage['currentUserId'];
     var enterpriseId = globalAddin.getLocalStorageItem('enterpriseId');
     // The initialize function must be run each time a new page is loaded
     $(document).ready(function() {
         app.initialize();

         globalAddin.updateBackButtonBasedOnApplicationMode(1);

         if (localStorage['appmode'] == "compose") {
			 localStorage['phonenumer']="";
			 localStorage['title']="";
			 localStorage['accountName']="";
		 }

		 // Setup existing email
		 viewContact(contactEmail,enterpriseId);

         // var name = contactName.split(' ');
         // if (name.length > 1) {
         //     $("#firstname").val(name[0]);
         //     $("#lastname").val(name[1]);
         // }

         // $("#email").val(contactEmail);
         // $("#phone").val(localStorage['phonenumer']);
         // $("#title").val(localStorage['title']);
		 // $("#account").val(localStorage['accountName']);
         // bind Account
         bindAccount(token);
         //  bind country
         bindCountry(token,enterpriseId);
         //bind type
         bindType(token,enterpriseId);
         // Bind Industry
         bindIndustry(token,enterpriseId);
         // Bind Relation
         bindRelation(token,enterpriseId);

         $("[data-toggle='dropdown']").on('click', function() {
             var dropdown = $(this).siblings(".dropdown-menu");
             if (dropdown.is(":hidden")) {
                 $(".dropdown-menu").slideUp();
                 dropdown.slideDown();
             } else {
				dropdown.slideUp();
                 pageIndex =1;
             }
         });
         $("[data-toggle='form-group-addon']").on('click', function() {
             var target = $(this).attr('data-target');
             $(target).removeClass("hidden");
         });
         $("#relationshiplist a").on('click', function() {
             $(this).closest(".dropdown-menu").slideUp();
             $("#relationship").val($(this).text().trim());
         });
         $("#behaviourlist a").on('click', function() {
             $(this).closest(".dropdown-menu").slideUp();
             $("#behaviour").val($(this).text().trim());
         });
         $("#add-to-prospector").click(function() {
             addToProspector();
         });
         mailHook.runLoop();
         // $(document).on('click', function(event) {
             // event.stopImmediatePropagation();
             // if (!$(event.target).closest("#accountlist").length && event.target.id != "account" && !$("#account").attr("data-uuid")) {

                 // $("#account").val('');
             // }
         // });
     });

     function addToProspector() {
         var btn = $("#add-to-prospector");
         var fname = $("#firstname").val();
         var lname = $("#lastname").val();
         if (fname == '') {
             $("#firstname").css('background', 'rgba(255, 231, 224, 0.498039)');
             app.showNotification("", "First name is required");
             return;
         } else {
             $("#firstname").css('background', '');
         }
         if (lname == '') {
             $("#lastname").css('background', 'rgba(255, 231, 224, 0.498039)');
             app.showNotification("", "First name is required");
             return;
         } else {
             $("#lastname").css('background', '');
         }

         var contact = {
             "firstName": fname,
             "lastName": lname
         };

         // contact.organisationId = localStorage['organisationId'];
         if(localStorage['organisationId'] && localStorage['organisationId'] !="null")
             contact.organisationId = localStorage['organisationId'];
         else
             contact.organisationId = null;

         if(localStorage['avatar'] && localStorage['avatar'] !="null" && localStorage['avatar'] != 'undefined')
             contact.avatar = localStorage['avatar'];
         else
             contact.avatar = null;


         if(localStorage['sharedOrganisationId'] && localStorage['sharedOrganisationId'] !="null")
            contact.sharedOrganisationId = localStorage['sharedOrganisationId'];
         else
             contact.sharedOrganisationId = null;

         if(localStorage['uuid'])
             contact.uuid = (localStorage['uuid'] && localStorage['uuid'] != 'null' && localStorage['uuid'] != 'undefined') ? localStorage['uuid'] : null;

         if(localStorage['avatar'])
             contact.avatar = (localStorage["avatar"] && localStorage["avatar"] != 'null' && localStorage["avatar"] != 'undefined') ? localStorage["avatar"] : null;

         if(localStorage['region'])
             contact.region = (localStorage["region"] && localStorage["region"] != 'null' && localStorage["region"] != 'undefined') ? localStorage["region"] : null;

         if(localStorage['discProfile'] && localStorage['discProfile'] != "null")
             contact.discProfile = localStorage["discProfile"].toUpperCase();
         else
             contact.discProfile ='NONE';

         contact.participantList = participantListArray;

         contact.street = $("#street").val() ? $("#street").val() : null;
         contact.zipCode = $("#zip").val() ? $("#zip").val() : null;
         contact.city = $("#city").val() ? $("#city").val() : null;
         contact.region = $("#state").val() ? $("#state").val() : null;
         contact.country = $("#country").val() ? $("#country").val() : null;
         contact.title = $("#title").val() ? $("#title").val() : null;
         contact.discProfile = $("#behaviour").val() ? $("#behaviour").val().toUpperCase() : null;

         if ($("#email").val()) {
             contact.email = $("#email").val();
             contact.mainEmailType = "EMAIL_WORK";
             contact.additionalEmailList = [{
                 "value": $("#email").val(),
                 "type": "EMAIL_WORK",
                 "main": true,
                 "isPrivate": false
             }];
             $("#emailbox .inputfieldbox").each(function(index, element) {
                 contact.additionalEmailList.push({
                     "value": $(this).children().val(),
                     "type": "EMAIL_WORK",
                     "main": false,
                     "isPrivate": false
                 });

             });
         }
         if ($("#phone").val()) {
             contact.phone = $("#phone").val();
             contact.mainPhoneType = "PHONE_WORK";
             contact.additionalPhoneList = [{
                 "value": $("#phone").val(),
                 "type": "PHONE_WORK",
                 "main": true,
                 "isPrivate": false
             }];
             $("#phonebox .inputfieldbox").each(function(index, element) {
                 contact.additionalPhoneList.push({
                     "value": $(this).children().val(),
                     "type": "PHONE_WORK",
                     "main": false,
                     "isPrivate": false
                 });
             });
         }
         if ($("#account").attr('data-uuid') && $("#account").attr('data-uuid') != "null") {
             contact.organisationId = $("#account").attr('data-uuid');
         } else if($("#account").val()) {
             addAccount(token, $("#account").val(),enterpriseId);
             contact.organisationId = $("#account").attr('data-uuid');
         }
         if ($("#type").attr('data-uuid')) {
             contact.type = {
                 "uuid": $("#type").attr('data-uuid'),
                 "type": $("#type").attr('data-type'),
                 "name": $("#type").attr('data-name'),
                 "code": $("#type").attr('data-code')
             };
         }
         if ($("#industry").val()) {
             contact.industry = {
                 "uuid": $("#industry").attr('data-uuid'),
                 "type": $("#industry").attr('data-type'),
                 "name": $("#industry").attr('data-name'),
                 "code": $("#industry").attr('data-code')
             };
         }
         if ($("#relation").val()) {
             contact.relation = {
                 "uuid": $("#relation").attr('data-uuid'),
                 "type": $("#relation").attr('data-type'),
                 "name": $("#relation").attr('data-name'),
                 "code": $("#relation").attr('data-code')
             };
         }
         if ($("#relationship").val()) {
             if($("#relationship").val() == 'Good')
                 contact.relationship = 'GREEN';
             if($("#relationship").val() == 'Neutral')
                 contact.relationship = 'YELLOW';
             if($("#relationship").val() == 'Bad')
                 contact.relationship = 'RED';
         }

         $.ajax({
             type: "POST",
             crossDomain: true,
             dataType: "json",
             contentType: "application/json",
             data: JSON.stringify(contact),
             url: serviceUrl + "contact-" + version +"/update?token=" + token + "&languageCode=en"+"&enterpriseID="+enterpriseId,
             success: function(data) {
				 if (!globalAddin.isCommandsAddin) {
                     app.showNotification("", "Contact saved!");

                     if (localStorage['appmode'] == "read") {
                         window.location = "../openemail.html"
					 } else {
                         window.location = "../composeemail.html"
					 }
				 }
                else
                    Office.context.ui.messageParent("close");
             },
             error: function(error) {
                 app.showNotification("", "Something wrong happened!");
                 //console.log(error);
             },
             cache: false
         });
     }

     function bindType(token,enterpriseId) {
         var type = '';
         $.ajax({
             type: "GET",
             dataType: "json",
             url: serviceUrl + "administration-"+ version +"/workData/organisations?token=" + token+"&enterpriseID="+enterpriseId,
             success: function(data) {
                 //console.log(data.workDataOrganisationDTOList);
                 $.each(data.workDataOrganisationDTOList, function(i, obj) {
                     if (obj.type == "TYPE")
                         type = type + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                 });
                 $("#typelist").append(type);
                 $("#typelist a").on('click', function() {
                     $(this).closest(".dropdown-menu").slideUp();
                     $("#type").val($(this).text());
                     $("#type").attr('data-uuid', $(this).attr('data-uuid'));
                     $("#type").attr('data-type', $(this).attr('data-type'));
                     $("#type").attr('data-name', $(this).attr('data-name'));
                     $("#type").attr('data-code', $(this).attr('data-code'));
                 });
             },
             error: function (jqXhr, status, error) {
                 if (jqXhr.status && jqXhr.status === 403) {
                     console.log(error);
                     localStorage['loggedIn'] = false;
                     window.location = "login.html";
                 } else {
                     console.log(error);
                 }
             },
             cache: false
         });
     }

     function bindIndustry(token,enterpriseId) {
         var industry = '';
         $.ajax({
             type: "GET",
             dataType: "json",
             url: serviceUrl + "administration-" + version +"/workData/workData/industries?token=" + token+"&enterpriseID="+enterpriseId,
             success: function(data) {
                 //console.log(data.workDataOrganisationDTOList);
                 $.each(data.workDataOrganisationDTOList, function(i, obj) {
                     industry = industry + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                     if (i == 0) {
                         $("#industry").attr('data-uuid', obj.uuid);
                         $("#industry").attr('data-type', obj.type);
                         $("#industry").attr('data-name', obj.name);
                         $("#industry").attr('data-code', obj.code);
                     }
                 });
                 $("#industrylist").append(industry);
                 $("#industrylist a").on('click', function() {
                     $(this).closest(".dropdown-menu").slideUp();
                     $("#industry").val($(this).text());
                     $("#industry").attr('data-uuid', $(this).attr('data-uuid'));
                     $("#industry").attr('data-type', $(this).attr('data-type'));
                     $("#industry").attr('data-name', $(this).attr('data-name'));
                     $("#industry").attr('data-code', $(this).attr('data-code'));
                 });
             },
             cache: false
         });
     }

     function bindRelation(token,enterpriseId) {
         var relation = '';
         $.ajax({
             type: "GET",
             dataType: "json",
             url: serviceUrl + "administration-"+ version  +"/workData/organisations?token=" + token+"&enterpriseID="+enterpriseId,
             success: function(data) {
                 //console.log(data.workDataOrganisationDTOList);
                 $.each(data.workDataOrganisationDTOList, function(i, obj) {
                     if (obj.type == "CONTACT_RELATIONSHIP")
                         relation = relation + '<li><a class="" href="javascript:void(0)" data-uuid="' + obj.uuid + '" data-type="' + obj.type + '" data-name="' + obj.name + '" data-code="' + obj.code + '">' + obj.name + '</a></li>';
                 });
                 $("#relationlist").append(relation);
                 $("#relationlist a").on('click', function() {
                     $(this).closest(".dropdown-menu").slideUp();
                     $("#relation").val($(this).text());
                     $("#relation").attr('data-uuid', $(this).attr('data-uuid'));
                     $("#relation").attr('data-type', $(this).attr('data-type'));
                     $("#relation").attr('data-name', $(this).attr('data-name'));
                     $("#relation").attr('data-code', $(this).attr('data-code'));
                 });
             },
             cache: false
         });
     }

     function bindAccount(token) {
         $("#account-dropdown-menu").scroll(function() {
             var $this = $(this);
             var height = this.scrollHeight - $this.height(); // Get the height of the div
             var scroll = $this.scrollTop(); // Get the vertical scroll position

             var isScrolledToEnd = (scroll >= height);
             if (isScrolledToEnd) {
                 var additionalContent = getAdditionalAccountData(token,pageIndex,enterpriseId); // Get the additional content
                 pageIndex++;
             }
         });


         $("#account").autocomplete({
             minLength: 0,
             delay: 0,
             source: function(request, response) {
                 $.ajax({
                     type: "POST",
                     crossDomain: true,
                     dataType: "json",
                     contentType: "application/json",
                     data: JSON.stringify({
                         "name": request.term
                     }),
                     url: serviceUrl + "organisation-"+version +"/searchLocal?token=" + token + "&updatedDate=0&pageIndex=0&pageSize=10"+"&enterpriseID="+enterpriseId,
                     success: function(data) {
                         response($.map(data.organisationDTOList, function(item) {
                             return {
                                 label: item.name,
                                 value: item.uuid
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
                 .append("<a class='ui-menu-item' data-uuid=" + item.value + "  href='javascript:void(0)'>" + item.label + "</a>")
                 .appendTo("#accountlist");
             $("#accountlist a").on('click', function(event) {
                 event.stopImmediatePropagation();
                 $("#account").val($(this).text());
                 $("#account").attr('data-uuid', item.uuid);
                 //$("#account").attr('data-uuid', $(this).attr('data-uuid'));
                 $(this).closest(".dropdown-menu").slideUp();
             });

             return data1;
         };
     }

     function bindCountry(token,enterpriseId) {
         var country;
         $.ajax({
             type: "Get",
             async: false,
             url: serviceUrl + "administration-"+ version  +"/workData/workData/countries?token=" + token+"&enterpriseID="+enterpriseId,
             success: function(data) {
                 country = $.map(data.countryDTOList, function(item) {
                     return {
                         label: item.name,
                         value: item.name
                     }
                 });

             },
             error: function (jqXhr, status, error) {
                 if (jqXhr.status && jqXhr.status === 403) {
                     console.log(error);
                     localStorage['loggedIn'] = false;
                     window.location = "login.html";
                 } else {
                     console.log(error);
                 }
             },
             cache: false
         });


         $("#txt-country-search").autocomplete({
             minLength: 0,
             delay: 0,
             source: country,
             search: function(event, ui) {
                 $('#countrylist li:not(:first)').remove();
             },
             focus: function(event, ui) {
                 return false;
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
                 .append("<a class='ui-menu-item'   href='javascript:void(0)'>" + item.label + "</a>")
                 .appendTo("#countrylist");
             $("#countrylist a").on('click', function(event) {
                 event.stopImmediatePropagation();
                 $("#country").val($(this).text());
                 $(this).closest(".dropdown-menu").slideUp();
             });
             return data1;


         };
     }

     function viewContact(email,enterpriseId) {
         $.ajax({
             type: "GET",
             url: serviceUrl + "contact-"+ version  +"/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en"+"&enterpriseID="+enterpriseId,
             success: function(data) {

                 localStorage["contact_uuid"] = data.uuid;
                 localStorage["avatar"] = data.avatar;
                 localStorage['contactEmail'] = (data.email == null) ? '' : data.email;
                 localStorage['firstname'] = (data.firstName == null) ? '' : data.firstName;
                 localStorage['lastname'] = (data.lastName == null) ? '' : data.lastName;
                 localStorage['accountName'] = data.firstName + " " + data.lastName;
                 localStorage['title'] = (data.title == null) ? '' : data.title;
                 localStorage['phonenumer'] = data.phone;
                 localStorage['street'] = (data.street == null) ? '' : data.street;
                 localStorage['zipCode'] = data.zipCode;
                 localStorage['city'] = (data.city == null) ? '' : data.city;
                 localStorage['region'] = (data.region == null) ? '' : data.region;
                 localStorage['country'] = (data.country == null) ? '' : data.country;
                 localStorage['type'] = (data.region == null) ? '' : data.type;
                 localStorage['industry'] = (data.industry == null) ? '' : data.industry;
                 localStorage['relation'] = (data.relation == null) ? '' : data.relation;
                 localStorage['organisationName'] = (data.organisationName == null) ? '' : data.organisationName;
                 localStorage['relationship'] = (data.relationship == null) ? '' : data.relationship;
                 localStorage['organisationId'] = data.organisationId;
                 localStorage['sharedOrganisationId'] = data.sharedOrganisationId;
                 localStorage['uuid'] = data.uuid;
                 localStorage['additionalEmailList'] = data.additionalEmailList;
                 localStorage['additionalPhoneList'] = data.additionalPhoneList;
                 localStorage['participantList'] = data.participantList;
                 localStorage['discProfile'] = data.discProfile.toLowerCase();

                 localStorage['participantList'] = [];

                 // data.participantList.forEach(function (arrayItem) {
                 //     participantListArray.push(arrayItem)
                 // })

                 data.participantList.forEach(function (arrayItem) {
                     participantListArray.push(arrayItem.uuid)
                 })

                 $('#firstname').val(localStorage['firstname']);
                 $('#lastname').val(localStorage['lastname']);
                 $('#email').val(localStorage['contactEmail']);

                 if (localStorage['phonenumer'] != "null")
                     $("#phone").val(localStorage['phonenumer']);

                 $('#title').val(localStorage['title']);
                 $("#account").val(localStorage['organisationName']);
                 $("#account").attr('data-uuid', localStorage["organisationId"]);
                 $("#typelist").val(localStorage['type']);

                 if (data.industry) {
                     $("#industry").val(data.industry.name);
                     $("#industry").attr('data-uuid', data.industry.uuid);
                     $("#industry").attr('data-type', data.industry.type);
                     $("#industry").attr('data-name', data.industry.name);
                     $("#industry").attr('data-code', data.industry.code);
                 }

                 if (data.relation) {
                     $("#relation").val(data.relation.name);
                     $("#relation").attr('data-uuid', data.relation.uuid);
                     $("#relation").attr('data-type', data.relation.type);
                     $("#relation").attr('data-name', data.relation.name);
                     $("#relation").attr('data-code', data.relation.code);
                }

                 if (localStorage['zipCode'] !="null")
                     $("#zip").val(localStorage['zipCode']);

                 $("#street").val(localStorage['street']);
                 $("#city").val(localStorage['city']);
                 $("#country").val(localStorage['country']);
                 $("#title").val(localStorage['title']);
                 $("#state").val(localStorage['region']);
                 $("#behaviour").val(localStorage['discProfile']);

                 if (localStorage['relationship']) {
                     if(localStorage['relationship'] == 'GREEN')
                         $("#relationship").val('Good');
                     if(localStorage['relationship'] == 'YELLOW')
                         $("#relationship").val('Neutral');
                     if(localStorage['relationship'] == 'RED')
                         $("#relationship").val('Bad');
                 }
                 if(data.type){
                     $("#type").val(data.type.name);
                     $("#type").attr('data-uuid', data.type.uuid);
                     $("#type").attr('data-type', data.type.type);
                     $("#type").attr('data-name', data.type.name);
                     $("#type").attr('data-code', data.type.code);
                 }

             },
             error: function(error) {
                 //app.showNotification("", "This contact does not exist <a href='composeemail/add_contact.html'>Add Now</a>.");
             },
             cache: false
         });
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
             url: serviceUrl + "organisation-"+ version +"/add?token=" + token+"&enterpriseID="+enterpriseId,
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
             url: serviceUrl + "organisation-"+ version  +"/searchLocal?token=" + token + "&updatedDate=0&pageIndex=" + pageIndex + "&pageSize=10"+"&enterpriseID="+enterpriseId,
             success: function(data) {
                 $.each(data.organisationDTOList, function(i, obj) {
                     var data1 = '';
                     data1 = $("<li></li>")
                         .append("<a class='ui-menu-item' data-uuid=" + obj.uuid + " data-email=" + obj.email + " href='javascript:void(0)'>" + obj.name + "</a>")
                         .appendTo("#accountlist");
                     $("#accountlist a").on('click', function(event) {
                         pageIndex = 1;
                         event.stopImmediatePropagation();
                         $("#account").val($(this).text());
                         $("#account").attr('data-uuid', $(this).attr('data-uuid'));
                         $("#account").attr('data-email', $(this).attr('data-email'));
                         $(this).closest(".dropdown-menu").slideUp();
                         bindTaskContact(token, contactName, uuid,$(this).attr('data-uuid'));
                         $("#taskcontact").parent().css("visibility","hidden");
                     });
                 });


             },
             cache: false
         });
     }

     function isEmpty(value) {
         if (!value) {
             return true;
         }
         if (isArray(value) || isString(value)) {
             return !value.length;
         }
         for (var key in value) {
             if (hasOwnProperty.call(value, key)) {
                 return false;
             }
         }
         return true;
     }
 })();
