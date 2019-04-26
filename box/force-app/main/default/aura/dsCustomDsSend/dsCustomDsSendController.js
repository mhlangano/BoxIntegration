({
    handleClick: function(component, event, helper) {
        var record = component.get('v.simpleRecord');
        //used if contacts must be queried
        //helper.doGetContacts(component, record); 
        var returnedContacts = [{
            "LastName": record.Contact_Full_Name__c,
            "DS_Role__c": record.Contact_DS_Role__c,
            "Email": record.Contact_Email__c,
            "Contact_Type__c": "Primary", // must be added a default before passing on
            "sobjectType": "Contact"
        }]
        helper.doExecuteMain(component, '##SFContract', record.Id, record.Send_DS_Envelope__c, 'PRIMARY', returnedContacts, 'contract');
    },

    handlePaaClick: function(component, event, helper) {
        var record = component.get('v.simpleRecord');

        var returnedContacts = [{
            "LastName": record.Contact_Full_Name__c,
            "DS_Role__c": record.Contact_DS_Role__c,
            "Email": record.Contact_Email__c,
            "Contact_Type__c": "Primary", // must be added a default before passing on
            "sobjectType": "Contact"
        }]
        helper.doExecuteMain(component, '##SFContract', record.Id, record.Licensing_Envelope_Required__c, 'PRIMARY', returnedContacts, 'paa');
    },
})