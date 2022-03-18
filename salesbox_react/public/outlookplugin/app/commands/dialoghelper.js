var dialogHelper = (function() {
	var self = {};

	console.log("dialogHelper initializing");

	var addinVirtualFolder = "";
	var clickEvent = null;
	var dialog = null;

Office.initialize = function () {
    // Checks for the DOM to load using the jQuery ready function.
    $(document).ready(function () {
    	var init = true;
    });
}
    self.openDialog = function(event, path, options) {
    	globalAddin.isCommandsAddin = true;
    	clickEvent = event;
    	Office.context.ui.displayDialogAsync(window.location.origin + addinVirtualFolder + path, options, dialogCallback);
    }

    var dialogCallback = function(asyncResult) {
    	if (asyncResult.status == "failed") {
	        switch (asyncResult.error.code) {
    	        case 12004:
        	        self.showNotification("Domain is not trusted");
            	    break;
            	case 12005:
                	self.showNotification("HTTPS is required");
                	break;
            	case 12007:
                	self.showNotification("A dialog is already opened.");
                	break;
            	default:
                	self.showNotification(asyncResult.error.message);
                	break;
        	}
    	}
    	else {
        	dialog = asyncResult.value;
        	/* Messages are sent by developers programatically from the dialog using office.context.ui.messageParent(...)*/
        	dialog.addEventHandler(Office.EventType.DialogMessageReceived, messageHandler);
	        /* Events are sent by the platform in response to user actions or errors. For example, the dialog is closed via the 'x' button*/
    	    dialog.addEventHandler(Office.EventType.DialogEventReceived, eventHandler);
    	}
    }

    self.showNotification = function(text) {
    	if (text != null && text.trim() != '') {
    		Office.context.mailbox.item.notificationMessages.addAsync("subject", {
		    	type: "informationalMessage",
		    	message: text,
		    	icon: "login-16",
		    	persistent: false
			});
    	}

		//Required, call event.completed to let the platform know you are done processing.
        if (clickEvent)
        	clickEvent.completed();
    }

    var messageHandler = function(arg) {
    	globalAddin.isCommandsAddin = null;
    	dialog.close();
    	self.showNotification('');
	}


	var eventHandler = function(arg) {
	    switch (arg.error) {
    	    case 12002:
        	    self.showNotification("Cannot load URL, no such page or bad URL syntax.");
            	break;
        	case 12003:
            	self.showNotification("HTTPS is required.");
            	break;
        	case 12006:
        		globalAddin.isCommandsAddin = null;
            	self.showNotification("Dialog closed by user");
            	break;
        	default:
            	self.showNotification("Undefined error in dialog window");
            	break;
    	}
	}

    return self;
}());