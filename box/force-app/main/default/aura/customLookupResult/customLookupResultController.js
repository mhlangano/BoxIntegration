({
    selectRecord : function(component, event, helper) {
        var selected_record = component.get("v.oRecord");
        
        component.getEvent("CustomLookupEvent").setParams({
            "Action": "select",
            "SelectedRecord": selected_record
        }).fire();
    },
})