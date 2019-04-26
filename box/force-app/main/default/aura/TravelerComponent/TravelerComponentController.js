({
    changeDisplayedFields: function(component, event, helper){
        //Reset fields
        //var a = component.get('c.resetDisplayedFields');
        //$A.enqueueAction(a);        
        
        var product = component.get("v.PurchasedProduct");  	
        //alert('isFlight: '+product.isFlight);
        //
        if(product.isRetail){
            $A.util.removeClass(component.find("primary_traveler"), "slds-hide"); 
            $A.util.removeClass(component.find("trip_costDiv"), "slds-hide");                   
            $A.util.removeClass(component.find("traveler_phoneDiv"), "slds-hide");                   
        }  
         
        if(product.isFlight){
            $A.util.removeClass(component.find("primary_traveler"), "slds-hide");                  
            $A.util.removeClass(component.find("traveler_phoneDiv"), "slds-hide");             
        }
        
        if(product.isUseYear){
			$A.util.removeClass(component.find("primary_traveler"), "slds-hide");
            $A.util.removeClass(component.find("traveler_phoneDiv"), "slds-hide"); 
        }    
        if(product.isGroupProduct){
            component.set("v.groupPlan", true);   
            
            $A.util.removeClass(component.find("age_categoryDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("trip_costDiv"), "slds-hide");
            $A.util.removeClass(component.find("total_Plan_CostDiv"), "slds-hide");
            $A.util.removeClass(component.find("groupRow1"), "slds-hide"); //Primary Traveler, Cancel for Any Reason Cost
            $A.util.removeClass(component.find("groupRow2"), "slds-hide"); //Departure Date, Return Date, Deposit Date, Premium Paid Date
            
            $A.util.removeClass(component.find("address1Div"), "slds-hide");
            $A.util.removeClass(component.find("address2Div"), "slds-hide");
            $A.util.removeClass(component.find("cityDiv"), "slds-hide");
            $A.util.removeClass(component.find("countryDiv"), "slds-hide");
            $A.util.removeClass(component.find("stateDiv"), "slds-hide");
            $A.util.removeClass(component.find("zipDiv"), "slds-hide");  
        }       
        if(product.isStudentGroupProduct){
            component.set("v.groupPlan", true);
            
            $A.util.removeClass(component.find("age_categoryDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("trip_costDiv"), "slds-hide");
            $A.util.removeClass(component.find("total_Plan_CostDiv"), "slds-hide");
            $A.util.removeClass(component.find("groupRow1"), "slds-hide"); //Primary Traveler, Cancel for Any Reason Cost
            $A.util.removeClass(component.find("groupRow2"), "slds-hide"); //Departure Date, Return Date, Deposit Date, Premium Paid Date
            
            $A.util.removeClass(component.find("address1Div"), "slds-hide");
            $A.util.removeClass(component.find("address2Div"), "slds-hide");
            $A.util.removeClass(component.find("cityDiv"), "slds-hide");
            $A.util.removeClass(component.find("countryDiv"), "slds-hide");
            $A.util.removeClass(component.find("stateDiv"), "slds-hide");
            $A.util.removeClass(component.find("zipDiv"), "slds-hide");  

        } 
        if(product.enableDOB){
			$A.util.removeClass(component.find("date_of_birthDiv"), "slds-hide");  
            $A.util.removeClass(component.find("ageDiv"), "slds-hide"); 
        }      
        if(product.isAddressRequired){
            $A.util.removeClass(component.find("address1Div"), "slds-hide");
            $A.util.removeClass(component.find("address2Div"), "slds-hide");
            $A.util.removeClass(component.find("cityDiv"), "slds-hide");
            $A.util.removeClass(component.find("countryDiv"), "slds-hide");
            $A.util.removeClass(component.find("stateDiv"), "slds-hide");
            $A.util.removeClass(component.find("zipDiv"), "slds-hide"); 
        }
        if(product.requireState){
            $A.util.removeClass(component.find("stateDiv"), "slds-hide");
        }
        if(component.find('state_select').get('v.value')){
        	component.set("v.Traveler.State__c", component.find('state_select').get('v.value'));
        }
    },  
    resetDisplayedFields: function(component, event, helper){
        var product = component.get("v.PurchasedProduct"); 
        
        if(!product.isRetail){
            $A.util.addClass(component.find("primary_traveler"), "slds-hide"); 
            $A.util.addClass(component.find("trip_costDiv"), "slds-hide");                   
            $A.util.addClass(component.find("traveler_phoneDiv"), "slds-hide");                   
        }  
        
        if(!product.isFlight){
            $A.util.addClass(component.find("primary_traveler"), "slds-hide");                  
            $A.util.addClass(component.find("traveler_phoneDiv"), "slds-hide");             
        }        
        
        if(!product.isUseYear){
			$A.util.addClass(component.find("primary_traveler"), "slds-hide");         
        }    
        if(!product.isGroupProduct){   
            component.set("v.groupPlan", false);

            $A.util.addClass(component.find("age_categoryDiv"), "slds-hide");
            
            $A.util.addClass(component.find("trip_costDiv"), "slds-hide");
            $A.util.addClass(component.find("total_Plan_CostDiv"), "slds-hide");
            $A.util.addClass(component.find("groupRow1"), "slds-hide"); //Primary Traveler, Cancel for Any Reason Cost
            $A.util.addClass(component.find("groupRow2"), "slds-hide"); //Departure Date, Return Date, Deposit Date, Premium Paid Date
            
            $A.util.addClass(component.find("address1Div"), "slds-hide");
            $A.util.addClass(component.find("address2Div"), "slds-hide");
            $A.util.addClass(component.find("cityDiv"), "slds-hide");
            $A.util.addClass(component.find("countryDiv"), "slds-hide");
            $A.util.addClass(component.find("stateDiv"), "slds-hide");
            $A.util.addClass(component.find("zipDiv"), "slds-hide");               
        }       
        if(!product.isStudentGroupProduct){
            component.set("v.groupPlan", false);
            
            $A.util.addClass(component.find("age_categoryDiv"), "slds-hide");
            
            $A.util.addClass(component.find("trip_costDiv"), "slds-hide");
            $A.util.addClass(component.find("total_Plan_CostDiv"), "slds-hide");
            $A.util.addClass(component.find("groupRow1"), "slds-hide"); //Primary Traveler, Cancel for Any Reason Cost
            $A.util.addClass(component.find("groupRow2"), "slds-hide"); //Departure Date, Return Date, Deposit Date, Premium Paid Date
            
            $A.util.addClass(component.find("address1Div"), "slds-hide");
            $A.util.addClass(component.find("address2Div"), "slds-hide");
            $A.util.addClass(component.find("cityDiv"), "slds-hide");
            $A.util.addClass(component.find("countryDiv"), "slds-hide");
            $A.util.addClass(component.find("stateDiv"), "slds-hide");
            $A.util.addClass(component.find("zipDiv"), "slds-hide");  
        } 
        if(!product.enableDOB){
			$A.util.addClass(component.find("date_of_birthDiv"), "slds-hide");  
            $A.util.addClass(component.find("ageDiv"), "slds-hide"); 
        }              
        if(!product.isAddressRequired){
            $A.util.addClass(component.find("address1Div"), "slds-hide");
            $A.util.addClass(component.find("address2Div"), "slds-hide");
            $A.util.addClass(component.find("cityDiv"), "slds-hide");
            $A.util.addClass(component.find("countryDiv"), "slds-hide");
            $A.util.addClass(component.find("stateDiv"), "slds-hide");
            $A.util.addClass(component.find("zipDiv"), "slds-hide"); 
        }              
        if(!product.requireState){
            $A.util.addClass(component.find("stateDiv"), "slds-hide");
        }
        
    },
    deleteTraveler: function(component, event, helper){
        // A traveler was deleted, alert the parent component
        component.getEvent("TravelerEvent").setParams({
            "Traveler": component.get("v.Traveler"),
            "RowIndex": component.get("v.RowIndex"),
            "Action": "delete"
        }).fire();
    }, 
    validateChanges: function(component, event, helper){
        // Something changed in the component, first validate all fields are setup.
        var dob = component.get('v.Traveler.Date_of_Birth__c');
        var tc = component.get('v.Traveler.Trip_Cost__c');
        var dobs = component.find('date_of_birth');
        var tcs = component.find('trip_cost');
        
        // Show validation error borders
        if(!dob) {
            for(let f in dobs) {
                $A.util.addClass(dobs[f], 'slds-has-error'); 
            }
        }
        
        //Validate DOB is not in future
        if(dob){
            var today = new Date(); today.setDate(today.getDate());
            
            if(new Date(dob) > today) {
                $A.util.removeClass(component.find('validate_date_of_birth'), 'slds-hide');
                var spinner = component.find('date_of_birth');
                $A.util.addClass(spinner, 'field');
            } else {
                $A.util.addClass(component.find('validate_date_of_birth'), 'slds-hide');
                var spinner2 = component.find('date_of_birth');
                $A.util.removeClass(spinner2, 'field');                    
            }            
        }
        
        // We have a date, calculate the age
        helper.calculateAge(component, event);
        
        // if(!tc)
        if(tc && tc < 0) {
            for(let f in tcs) {
                $A.util.addClass(tcs[f], 'slds-has-error');
            }
        }
        
        // if(!tc || !dob) {
        if((tc && tc < 0) || !dob) {
            // We don't have valid traveler data, so do nothing
            component.set('v.Traveler.IsValid', false);
        }
        
        // Remove any existing validation borders
        var all_fields = dobs.concat(tcs);
        for(let f in all_fields) {
        	$A.util.removeClass(all_fields[f], 'slds-has-error');
        }
		
        if(component.find('state_select').get('v.value')){
        	component.set("v.Traveler.State__c", component.find('state_select').get('v.value'));
        }
        
        // Fire an event to let parent know to reset Traveler list
        component.getEvent("TravelerEvent").setParams({
            "Traveler": component.get("v.Traveler"),
            "RowIndex": component.get("v.RowIndex"),
            "Action": "change"
        }).fire();
    },
    validateCountryChange: function(component, event, helper) {
        var current_country = component.get('v.Traveler.Country__c');
        var state_field = component.find('state_select');
		
        if(current_country === "Canada") {
            //state_field.set('v.value', null);
			helper.getPickListOptions(component, "Canada_States__c");
			state_field.set('v.disabled', false);            
        } else if(current_country === "United States") {
            //state_field.set('v.value', null);
			helper.getPickListOptions(component, "State__c");
			state_field.set('v.disabled', false);  
        } else {
            state_field.set('v.disabled', true);
        }
        
        $A.enqueueAction(component.get('c.validateStateChange'));
    },
    validateStateChange: function(component, event, helper) {
        var state_field = component.find('state_select');
        if(!state_field.get('v.disabled') && !state_field.get('v.value')) {
            // If the field isn't disabled and has no value, mark it required
            $A.util.removeClass(component.find('state_required_label'), 'slds-hide');
            $A.util.addClass(state_field, 'slds-has-error');
        } else {
            $A.util.addClass(component.find('state_required_label'), 'slds-hide');
            $A.util.removeClass(state_field, 'slds-has-error');
        }
        
        if(state_field.get('v.value')){ 
        	component.set("v.Traveler.State__c", state_field.get('v.value'));
        }
        
        $A.enqueueAction(component.get('c.validateChanges'));
    },
    selectedAsPrimary: function(component, event, helper) {
        component.getEvent("TravelerEvent").setParams({
            "Traveler": component.get("v.Traveler"),
            "RowIndex": component.get("v.RowIndex"),
            "Action": "promoted"
        }).fire();
    },
    getFormattedDate : function (date){
        if(date){ 
            var dateObject = new Date(date);
            return (dateObject.getUTCMonth()+1) + '-' + dateObject.getUTCDate() + '-' + dateObject.getUTCFullYear();
        } else {
            return null;
        }
    },     
})