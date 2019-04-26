/**
 * Created by mark.adcock on 3/4/19.
 */
({
	addClass : function(cmp, id, cName){
		var comp = cmp.find(id);
		if(!$A.util.hasClass(comp,cName)){
			$A.util.addClass(comp,cName);
		}
	},

	removeClass : function(cmp, id, cName){
		var comp = cmp.find(id);
		if($A.util.hasClass(comp,cName)){
			$A.util.removeClass(comp,cName);
		}
	},
	closeModal : function(component, event, helper) {
	    this.addClass(component, "sendQuoteModal", "slds-hide");
		this.addClass(component, "sendConfirmationModal", "slds-hide");
 	}, 
    errorModalToggle: function(component, helper) {
    	component.set('v.errorModalToggle', !component.get('v.errorModalToggle'));
	},     
	launchEnrollmentWizardHelper : function(component, event, action) {
        
        var recordId = component.get("v.recordId");
        var confirmationId = component.get("v.record.Confirmation_Number__c");
        var quoteNumber = component.get("v.record.Quote_Number__c");
        var recordStatus = component.get("v.record.Record_Status__c");        
        
        //Confirm confirmation ID is populated
        if(recordStatus=='Enrollment' && !confirmationId ){
            //Pop modal
            component.set("v.recordTypeMsg", 'Confirmation Number Required');
            $A.util.addClass(component.find('confirm_window'), 'slds-fade-in-open');
            $A.util.addClass(component.find('confirm_window_backdrop'), 'slds-backdrop--open');    
            return;
        }          
         
        if((recordStatus=='Quote' || recordStatus=='Saved Quote	') && (!confirmationId) ){            
            if(!quoteNumber){
                //Pop modal
                component.set("v.recordTypeMsg", 'Confirmation Number / Quote Number Required');
                
                $A.util.addClass(component.find('confirm_window'), 'slds-fade-in-open');
                $A.util.addClass(component.find('confirm_window_backdrop'), 'slds-backdrop--open');                  
            }  
            return;
        } 
        
        if(!confirmationId){
            if(quoteNumber){ 
                confirmationId = quoteNumber;
            }
        } 
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/lightning/n/Enrollment?enrollmentId=" + recordId +"&confirmationNumber="+confirmationId+"&action="+action+"&status="+recordStatus 
        });
        
        urlEvent.fire();
        setTimeout(function() {
        }, 1200);         

 	},     
})