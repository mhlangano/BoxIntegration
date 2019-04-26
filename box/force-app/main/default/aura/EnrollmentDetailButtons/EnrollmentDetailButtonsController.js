({
    displaySendQuoteEmailModal: function(component, event, helper) {
        helper.removeClass(component, "sendQuoteModal", "slds-hide");
    },
    displaySendConfirmationEmailModal : function(component, event, helper) {
        helper.removeClass(component, "sendConfirmationModal", "slds-hide");
    },
    closeModal : function(component, event, helper) {
		helper.closeModal(component, event, helper);
    },
    EnrollAgainHandler : function(component, event, helper) {
        helper.launchEnrollmentWizardHelper(component, event,'EnrollAgain');     
    },
    EditEnrollmentWizard : function(component, event, helper) {        
        helper.launchEnrollmentWizardHelper(component, event,'Edit');                       	
    },
    enrollmentLoaded: function(component, event, helper) {
        var record = component.get("v.record");
        component.set('v.isEnrollment', (record.Record_Status__c == 'Enrollment'));
        
        // Call the Apex Controller to return the Base URL for API from Custom Setting
        var action = component.get('c.getBaseUrl');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state !== "SUCCESS") {
                return;
            }            
            component.set('v.BaseURL', response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },
    resendConfirmation: function(component, event, helper) {

        var record = component.get('v.record');

        var agentEmail = component.find("agentEmail");
		var email1 = component.find("confirmEmail1");
		var email2 = component.find("confirmEmail2");

		var agentValidity = agentEmail.get("v.validity");
		var email12Validity = true;

		var clientEmails = [];

        if (record.Plan_Type__c!="Groups") {
            if (!$A.util.isEmpty(email1.get("v.value"))) {
            	clientEmails.push(email1.get("v.value"));
            }

            if (!$A.util.isEmpty(email2.get("v.value"))) {
            	 clientEmails.push(email2.get("v.value"));
            }
            if (!(email1.get("v.validity") && email2.get("v.validity"))) {
                email12Validity = false;

            }
        }

        if (agentValidity && email12Validity) {
			var url = component.get('v.BaseURL') + '/resendconfirmationemail';
			var data = {
				"confirmationNumber": record.Confirmation_Number__c,
			};

			if (clientEmails) {
			    data.clientEmails = clientEmails;
   			}
   			if (agentEmail.get("v.value")) {
   			    data.agentEmail = agentEmail.get("v.value");
      		}

			console.log('[resendconfirmationemail] Payload: ', data);

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(res => res.json()).then(function(response) {
				console.log(response);
				component.set('v.APIResponse', response.message);
				if (response.message=='') component.set('v.APIResponse', 'Success: email(s) have been sent.');
			}).catch(function(error) {
				console.error('[resendconfirmationemail] Error: ', error);
				component.set('v.errorModalTitle', 'Network Error');
				component.set('v.errorModalMessage', error);
				self.errorModalToggle(component, event);
			});
        }
    },
    sendQuoteEmail: function(component, event, helper) {
        var emailField = component.find("quoteEmailInput");
        var emailFieldVal = emailField.get("v.value");

        var validity = emailField.get("v.validity");

        if(validity.valid) {
			var url = component.get('v.BaseURL') + '/sendpolicyquoteemail';
			var record = component.get('v.record');

			console.log('record');
			console.log(record);

			var data = {
				"policyQuoteNo": record.Quote_Number__c,
				"emails": [emailFieldVal],
			};
			console.log('[sendpolicyquoteemail] Payload ', data);

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(res => res.json()).then(function(response) {
				console.log(response);
				console.log(response.status);
				component.set('v.APIResponse', response.message);
				if (response.status=="Failure") {
				    //helper.closeModal(component, event, helper);
    			}
			}).catch(function(error) {
				console.error('[resendconfirmationemail] Error: ', error);
				//component.set('v.errorModalTitle', 'Network Error');
				component.set('v.errorModalMessage', error);
				self.errorModalToggle(component, event);
			});
       }
    },
    closeConfirmationNumberModal : function(component, event, helper) {
            $A.util.removeClass(component.find('confirm_window'), 'slds-fade-in-open');
            $A.util.removeClass(component.find('confirm_window_backdrop'), 'slds-backdrop--open'); 
    },    
})