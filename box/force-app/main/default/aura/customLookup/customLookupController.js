({
    nameChangeHandler : function(component, event, helper) {
        var selectedRecord = component.get("v.selectedRecord.name");
        
        if(selectedRecord) {
            $A.util.removeClass(component.find("lookup-pill-Name"), "slds-hide"); 
            $A.util.addClass(component.find("lookup-pill-Name"), "slds-show");    
            
            $A.util.removeClass(component.find("lookupField-Name"), "slds-show"); 
            $A.util.addClass(component.find("lookupField-Name"), "slds-hide"); 
        }            
    },
    onfocus : function(component,event,helper){
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var field = component.get("v.fieldName");

        var forOpen = component.find("searchRes-Name");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');

        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);              
    }, 
    onblur : function(component,event,helper){       
        component.set("v.listOfSearchRecords", null );
        var field = component.get("v.fieldName");

        var forclose = component.find("searchRes-Name");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part. 
        var field = component.get("v.fieldName");
        if( getInputkeyWord.length > 0 ){
            var forOpen = component.find("searchRes-Name");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
            var forclose = component.find("searchRes-Name");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    
    // function for clear the Record Selaction 
    clear :function(component,event,heplper){      
        var field = component.get("v.fieldName");

        var pillTarget = component.find("lookup-pill-Name");
        var lookUpTarget = component.find("lookupField-Name");
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        
        /*
        var compEvent = component.getEvent("ClearFieldEvent");
        compEvent.fire();
        */
        
        component.getEvent("CustomLookupEvent").setParams({
            "Action": "clear",
            "SelectedRecord": null,
            "FieldName": component.get("v.fieldName"),
            "ObjectType": component.get("v.objectAPIName")
        }).fire();      
    },
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
		var action = event.getParam('Action');
        
        if(action === "select") {
            var field = component.get("v.fieldName");
            var selected_record = event.getParam("SelectedRecord")
            component.set("v.selectedRecord", selected_record);
            
            var forclose = component.find("lookup-pill-Name");
            $A.util.addClass(forclose, 'slds-show');
            $A.util.removeClass(forclose, 'slds-hide');
            
            var forclose = component.find("searchRes-Name");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
            
            var lookUpTarget = component.find("lookupField-Name");
            $A.util.addClass(lookUpTarget, 'slds-hide');
            $A.util.removeClass(lookUpTarget, 'slds-show'); 
        }
        
    },
    /*
    setRecordByLocationNumber: function(component, event, helper) {
		var args = event.getParam('arguments');
        console.log('Location Number from Parent Component: ', args.location_number);
        
        var previous_field = component.get('v.fieldName');
        component.set('v.fieldName', 'Location_Number__c');

        // Lookup this one record we know we want
        var action = component.get('c.fetchDistinctRecord');
        action.setParams({
            'field_name': 'Location_Number__c',
            'object_name': 'Account',
            'search_value': args.location_number
        });
        action.setCallback(this, function(response) {
            var returned_account = response.getReturnValue();
            console.log('Returned Account from ValidateAPI Loc# ', returned_account);
            
            // Set the record returned as selected
            component.set('v.selectedRecord', returned_account);

            // CSS toggles on select, as we have no event firing to call handleComponentEvent and do this
            var forclose = component.find("lookup-pill-Name");
            $A.util.addClass(forclose, 'slds-show');
            $A.util.removeClass(forclose, 'slds-hide');
            
            var forclose = component.find("searchRes-Name");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
            
            var lookUpTarget = component.find("lookupField-Name");
            $A.util.addClass(lookUpTarget, 'slds-hide');
            $A.util.removeClass(lookUpTarget, 'slds-show');            
            
            // When we're all done, set the field back to whatever it was
            component.set('v.fieldName', previous_field);
        });
        $A.enqueueAction(action);
    }, */
})