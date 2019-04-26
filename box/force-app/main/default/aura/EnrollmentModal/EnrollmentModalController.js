({
	closeModalNo : function(component, event, helper) {
        var reply = component.getEvent("reply");
        var aura_id = component.get("v.auraId");
        reply.setParams({"reply": "false","auraId":aura_id});
        reply.fire();        
		component.set("v.showHideModal", 'slds-hide');
        component.set("v.modalReply", 'No');
	},
	closeModalYes : function(component, event, helper) {
        var reply = component.getEvent("reply");
        var aura_id = component.get("v.auraId");
        reply.setParams({"reply": "true","auraId":aura_id});
        reply.fire();         
		component.set("v.showHideModal", 'slds-hide');
        component.set("v.modalReply", 'Yes');        
	},
    closeModal: function(component, event, helper) {
        // When we aren't showing response layout, we need no event, just a way to close the modal
        component.set('v.showHideModal', 'slds-hide');
        console.log('Modal Component exiting cleanly, no replies');
    }
})