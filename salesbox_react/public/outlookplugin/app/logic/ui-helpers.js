// Imlementation of common functionality ofUi Helper

var uiHelper = (function() {
	'use strict';

	var self = {};

	// Binds a list of accounts to the UI control
	self.bindAccount = function(renderItemCallback) {
		console.log("uiHelper.bindAccount called");

		$("#account").autocomplete({
			minLength: 0,
			delay: 0,
			source: function(request, response) {
				globalAddin.getAccounts(request.term, function(data) {
					response($.map(data.organisationDTOList, function(item) {
						return {
							label: item.name,
							value: item.uuid
						}
					}));	
				});
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
			$(this).autocomplete("search");
		}).data("ui-autocomplete")._renderItem = function(ul, item) {
			var data1 = $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='ui-menu-item' data-uuid=" + item.value + "  href='javascript:void(0)'>" + item.label + "</a>")
                    .appendTo("#accountlist");

	        $("#accountlist a").on('click', function(event) {
	            event.stopImmediatePropagation();
	            $("#account").val($(this).text());
	            $("#account").attr('data-uuid', $(this).attr('data-uuid'));
	            $(this).closest(".dropdown-menu").slideUp();
	            self.bindAppContacts(globalAddin.contactFullName, "",$(this).attr('data-uuid'));					
	            $("#appcontact").html('&nbsp;');
				$("#appcontact").css("visibility","hidden");
	        });

	        return data1;
		}; 
	}

	self.bindAppContacts = function(name, uuid, orgId) {
		console.log("uiHelper.bindAccount called");
		
		$("#ddlappcontact tr").remove();

		globalAddin.getContacts(uuid, orgId, function(data) {
			var contactlist = "";
			$.each(data.contactDTOList, function(i, obj) {
            	contactlist = contactlist + '<tr class="dropdown-item" data-uuid="' + obj.uuid + '"><td>' + obj.firstName + " " + obj.lastName + '</td></tr>';
            });
            
            $("#ddlappcontact").append(contactlist);
            var alluuid = [];
            if (name.trim() != '' && uuid.length > 5) {
            	$("#appcontact").html(getContactPresenter(uuid, name));
            }

            $("#appcontact .remove-contact").on('click', function() {
            	removeContactCallback($(this));
            });

            $("#ddlappcontact td").on('click', function() {
                var indicator1 = 0;
                var indicator2 = 0;
                
                alluuid = [];
				$("#appcontact").css("visibility","visible");
                    
                $("#appcontact").html(getContactPresenter($(this).parent().attr('data-uuid'), $(this).parent().text()));
                    
                $('#appcontact label').each(function(index) {
                	alluuid.push($(this).parent().attr('data-uuid'));
                });

                $("#appcontact .remove-contact").on('click', function() {
                	removeContactCallback($(this));
                    
                });
            	$(".dropdown-menu").slideUp();
            });
		});
	}

    self.bindSingleAppContact = function(name, uuid) {
        console.log("uiHelper.bindSingleAccount called");
        $('#accountlist li').remove();
        $("#account").removeAttr("data-uuid");
        $("#account").removeAttr("data-uuid");
        $("#account").attr('readonly', true);
        $("#ddlappcontact tr").remove();
        $("#appcontact").html(getContactPresenter(uuid, name));
        $("#appcontact .remove-contact").on('click', function() {
            removeContactCallback($(this));
        });
    }

    /* Private stuff here */

	// Remove contact element from control
	var removeContactCallback = function(root) { 
       	root.parent().remove();
       	$("#appcontact").html('&nbsp;');
    }

    // Returns definition of control represented a contact
    var getContactPresenter = function(uuid, name) {
    	return '<label class="label label-default background-contact" data-uuid="' + uuid + '"><span class="contact-name app-contact" >' + name + '</span><span class="remove-contact">x</span></label>';
    }

	return self;
}());