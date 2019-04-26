({
    calculateAge : function(component, event) {
        var dob = component.get('v.Traveler.Date_of_Birth__c');
        if(!dob) {
            console.log('There was no date...');
            // Somehow we have no date of birth, do nothing
            return;
        }
        var current_date = new Date();
        var birth_date = new Date(dob);
        var age = current_date.getFullYear() - birth_date.getFullYear();
        
        
        if(current_date.getMonth() < (birth_date.getMonth() - 1)) {
            age -= 1;
        }
        
        if((birth_date.getMonth() -1) == current_date.getMonth() && (current_date.getDate() < birth_date.getDate())) {
            age -= 1;
        }
        
        component.set('v.Traveler.Calculated_Age__c', age);
    },
    getPickListOptions: function(component, fieldName) {
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objectType": {'sobjectType': 'Traveler__c'},
            "field": fieldName
        });
        
        var opts = [{"class": "optionClass", "label": "Choose one...", "value": null, "selected": true}];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var returned_values = response.getReturnValue();
                for(let val in returned_values) {
                    opts.push({
                        "label": returned_values[val],
                        "value": returned_values[val]
                    });
                }
                
                component.set("v.StateOptions", opts);
            }
        });
        
        $A.enqueueAction(action);
    },
    getFormattedDate : function (date){
        if(date){ 
            var x = new Date(date);            
            var y = x.getFullYear().toString();
            var m = (x.getMonth() + 1).toString();
            var d = x.getDate().toString();            
            (d.length == 1) && (d = '0' + d);
            (m.length == 1) && (m = '0' + m);
            return y +"-"+ m +"-"+ d;     
        } else {
            return null;
        }
    },        
})