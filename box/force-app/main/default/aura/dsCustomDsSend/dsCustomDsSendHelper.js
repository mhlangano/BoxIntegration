({
    doExecuteMain: function(component, sourceDsObjectType, sourceRecordId, packageToSend, conType, accountContacts, docType) {
        var action = component.get("c.mainExecution");
        action.setParams({
            "sourceDsObjectType": sourceDsObjectType,
            "sourceRecordId": sourceRecordId,
            "packageToSend": packageToSend,
            "contactType": conType,
            "accountContacts": accountContacts,
            "docType": docType
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var status = response.getReturnValue();
                var url = status.substr(0, status.length - 1) + '0';
                window.open(url);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "mode": "dismissible",
                    "duration": 20000,
                    "type": "success",
                    "title": "DocuSign envelope created!",
                    "message": "A new window will now open. If not, turn off your browser's pop up blocker."
                });
                toastEvent.fire();
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "mode": "sticky",
                            "type": "error",
                            "title": "Error",
                            "message": errors[0].message
                        });
                        toastEvent.fire();
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }

    //used if contacts must be queried
    /*doGetContacts: function(component, record) {
        var action = component.get("c.getContacts");
        action.setParams({
            "accId": record.AccountId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnedContacts = response.getReturnValue();
                console.log('returnedContacts **' + JSON.stringify(returnedContacts));
                component.set("v.accountContacts", returnedContacts);
                for (var i = 0; i < returnedContacts.length; i++) {
                    returnedContacts[i].sobjectType = 'Contact';
                }
                this.doExecuteMain(component, '##SFContract', record.Id, record.Send_DS_Envelope__c, returnedContacts);
            }
        });
        $A.enqueueAction(action);
    },*/
})