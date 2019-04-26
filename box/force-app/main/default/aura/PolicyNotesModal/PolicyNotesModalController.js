({
    savePolicyHandler : function(component, event, helper) { 
		component.set("v.showHideModal","slds-hide");
        $A.util.removeClass(component.find('policy_change_save_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('policy_change_save_backdrop'), 'slds-backdrop--open');      
         
        var comment_box = component.find('comments');
        var policyNote = comment_box.get('v.value');
        comment_box.set('v.value', '');

        //Fire Event
        var reply = component.getEvent("savepolicy");        
		reply.setParams({"policyNote" : policyNote});            
        reply.fire();                    
    },  
	cancelModalHandler : function(component, event, helper) {
		component.set("v.showHideModal","slds-hide");
        $A.util.addClass(component.find('policy_change_save_window'), 'slds-fade-in-open');
        $A.util.addClass(component.find('policy_change_save_backdrop'), 'slds-backdrop--open');        	        
	},
    returnToEnrollmentHandler : function(component, event, helper) {
        component.set("v.showHideModal","slds-hide");
        $A.util.removeClass(component.find('policy_change_save_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('policy_change_save_backdrop'), 'slds-backdrop--open');              
    },
    policyTransferCommentHandler: function(component, event, helper) {
        var comment_box = component.find('comments');
        var comments = comment_box.get('v.value');
        var button_id = event.getSource().getLocalId();

        var new_text = ''; // [' + new Date().toLocaleString() + '] ';

        var newLine = comments ? '\n' : '';

        switch(button_id) { 
            case 'premRef':
                new_text += newLine + 'Request to refund within free look period.';
                break;
            case 'adjustDate':
                new_text += newLine + 'As per request to adjust traveling dates.';
                break;
            case 'incTripCost':
                new_text += newLine + 'As per request to increase trip cost.';
                break;
            case 'decrTripCost':
                new_text += newLine + 'As per request to decrease trip cost.';
                break;
            case 'tripCanByTO':
                new_text += newLine + 'As per request to refund as trip cancel by T.O. no fault to pax.';
                break;
            case 'addADD':
                new_text += newLine + 'As per request to add AD&D Common Carrier.';
                break;
            case 'addCRC':
                new_text += newLine + 'As per reques to add Car Rental Coverage.';
                break;
            case 'duplicate':
                new_text += newLine + 'As per request to refund as issued in duplicate: see policy #.';
                break;
            case 'upgrdaccBtn':
                new_text += newLine + 'Offered Upgrades; Caller accepted.';
                break;
            case 'benChg':
                new_text += newLine + 'As per pax request to change beneficiary reading.';
                break;
            case 'asPerPax':
                new_text += newLine + 'As per pax.';
                break;
            case 'asPerTA':
                new_text += newLine + 'As per Travel Agent.';
                break;
            case 'correctedAddr':
                new_text += newLine + 'Corrected Address.';
                break;                                
            case 'claims':
                new_text += newLine + 'Transferred caller to Claims.';
                break;                 
            case 'dupcon':
                new_text += newLine + 'Passenger did not receive confirmation. Verified email address and sent out duplicate confirmation.';
                break; 
            case 'noClaims':
                new_text += newLine + 'No claims statement received.';
                break; 
            case 'noPenalties':
                new_text += newLine + 'No penalties for cancelling trip.';
                break; 
            case 'dT6moApplied':
                new_text += newLine + '6 month date transfer applied, new effective date given.';
                break; 
            case 'dT6moNotApplied':
                new_text += newLine + '6 month date transfer approved.';
                break; 
            case 'dT12moApplied':
                new_text += newLine + '12 month date transfer applied, new effective date given.';
                break; 
            case 'dT12moNotApplied':
                new_text += newLine + '12 month date transfer approved.';
                break; 
            case 'cancelCompliance':
                new_text += newLine + 'Cancel for compliance reason. Reinstatement of this policy requires senior management approval.';
                break;                                
            case 'sWagent':
                new_text += newLine + 'Spoke with Agent.';
                break;
            case 'sWPax':
                new_text += newLine + 'Spoke with Passenger.';
                break;
            case 'preWaive':
                new_text += newLine + 'Advised pre-ex limitation waiver.';
                break;
            case 'findEf':
                new_text += newLine + 'Advised of financial default purchase requirement.';
                break;
            case 'upgrddec':
                new_text += newLine + 'Offered upgrades; Caller declined.';
                break;
            case 'visa':
                new_text += newLine + 'Pax purchasing for VISA purposes.';
                break;
            case 'cfBr':
                new_text += newLine + 'Advised of CFBR purchase requirement.';
                break;
            case 'effDt':
                new_text += newLine + 'Advised pax of the effective date.';
                break;
            case 'upGrdacc':
                new_text += newLine + 'Offered Upgrades; Caller accepted.';
                break;
            case 'kip':
                new_text += newLine + 'Advised of KIP.';
                break;   
            case 'docs':
                new_text += newLine + 'Advised to review documents in entirety and approximate delivery time.';
                break;
            case 'cfar':
                new_text += newLine + 'Advised of all CFAR requirements.';
                break;
            case 'cuba':
                new_text += newLine + 'Travel to Cuba.';
                break;
            default:  
        }       
        
        if(comments === undefined) {
            console.log('Fresh write to comment box.');
            comment_box.set('v.value', new_text);
        } else {
            console.log('Appended write to comment box.');
            if(comments){
            	comment_box.set('v.value', comments + new_text);
            }
            if(comments==""){
                comment_box.set('v.value', new_text);
            }
        }
                 
        var commentTerms = component.find('comments').get('v.value');

        if(commentTerms){
            component.find("okButton").set("v.disabled","false");
        }
        if(!commentTerms){
            component.find("okButton").set("v.disabled","true");
        }
    },    
})