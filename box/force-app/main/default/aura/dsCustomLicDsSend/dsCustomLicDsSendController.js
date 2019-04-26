({
    handleLicenseeClick: function(component, event, helper) {
        var record = component.get('v.simpleRecord');

        var returnedContacts = [{
            "LastName": record.License_Name__c,
            "DS_Role__c": record.Licensee_DS_Role__c,
            "Email": record.Email__c,
            "Contact_Type__c": "Primary", // must be added a default before passing on
            "sobjectType": "Contact"
        }]
        helper.doExecuteMain(component, '##SFLicensing__c', record.Id, record.Send_DS_Envelope__c, 'LICENSEE', returnedContacts);
    },

    handlePrimaryClick: function(component, event, helper) {
        var record = component.get('v.simpleRecord');

        var returnedContacts = [{
            "LastName": record.Contact_Full_Name__c,
            "DS_Role__c": record.Contact_DS_Role__c,
            "Email": record.Contact_Email__c,
            "Contact_Type__c": "Primary", // must be added a default before passing on
            "sobjectType": "Contact"
        }]
        helper.doExecuteMain(component, '##SFLicensing__c', record.Id, record.Send_DS_Envelope__c, 'PRIMARY', returnedContacts);
    },

    recordUpdated: function(component, event, helper) {
        var record = component.get('v.simpleRecord');
        if (record.Contact_Email__c != null && record.Contact_Full_Name__c != null && record.Contact_DS_Role__c != null) {
            component.set("v.showCustomBtn", "true");
        } else {
            component.set("v.showCustomBtn", "false");
        }
    }
})