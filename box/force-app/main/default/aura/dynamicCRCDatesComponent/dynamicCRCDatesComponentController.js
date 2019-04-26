({
    initialize: function(component, event, helper) {
        var index = component.get("v.datesRowIndex");
        var enrollment_data = component.get("v.EnrollmentData");
        
        /* We re-write the CRCDatesList on parent every time a change happens (to calculate costs), which means these
         * CRC components get deleted and re-rendered each time a change happens, so can't rely on "init" happening only
         * initially. Thus, we have the "haveDefaulted" flag on the EnrollmentData that we set after the first default.
         * 
         * This flag gets set back to false if CRC upgrade is unselected, so that next selection defaults again */
        if(index == 0 && !enrollment_data.haveDefaulted) {
            // If this is the first CRC date, and we haven't yet done this, set initial dates
            component.find('start_date').set('v.value', enrollment_data.departureDate);
            component.find('end_date').set('v.value', enrollment_data.returnDate);
            
            enrollment_data.haveDefaulted = true;
            component.set("v.EnrollmentData", enrollment_data);
        } 
    },
    deleteCRCDate: function(component, event, helper) {
        // Fire an event letting parent know it's time to delete
        component.getEvent("CRCDatesEvent").setParams({
            "index" : component.get("v.datesRowIndex"),
            "instance" : component.get("v.CRCDatesInstance"),
            "Action" : "delete"
        }).fire();
    }, 
    validatePickUpDate: function(component, event, helper){
        /*
        var obj = component.get("v.enrollment"); 
        var start_date_travel = obj.Departure_Date__c;
        var crc_start_date_crc = component.get("v.CRCDatesInstance.CRC_Start_Date__c");
        var end_date_travel = obj.Return_Date__c;

        if(crc_start_date_crc < start_date_travel){
            component.set("v.pickUpDateError", "slds-show");
            component.set("v.blankDateError", "slds-hide");
        }      
        if(crc_start_date_crc >= start_date_travel){
            component.set("v.pickUpDateError", "slds-hide");
            component.set("v.blankDateError", "slds-hide"); 
        }     
        
        if(crc_start_date_crc > end_date_travel){
            component.set("v.outOfBoundDate", "slds-show");
            component.set("v.outOfBoundDateName", "'Pick-up' date must be before the trip's Return date."); 
        }      
        if(crc_start_date_crc <= end_date_travel){
            component.set("v.outOfBoundDate", "slds-hide");
        }   
        */
    },
    validateDropOffDate: function(component, event, helper){
        /*
        var obj = component.get("v.enrollment"); 
        var end_date_travel = obj.Return_Date__c;
        var crc_end_date_crc = component.get("v.CRCDatesInstance.CRC_End_Date__c");
		var start_date_travel = obj.Departure_Date__c;
        
        if(crc_end_date_crc > end_date_travel){
            component.set("v.dropOffDateError", "slds-show");
            component.set("v.blankDateError", "slds-hide");
        }      
        if(crc_end_date_crc <= end_date_travel){
            component.set("v.dropOffDateError", "slds-hide");
            component.set("v.blankDateError", "slds-hide"); 
        }           
         
        if(crc_end_date_crc < start_date_travel){
            component.set("v.outOfBoundDate", "slds-show");
            component.set("v.outOfBoundDateName", "'Drop-off' date must be after the trip's Departure date.");
        }      
        if(crc_end_date_crc >= start_date_travel){
            component.set("v.outOfBoundDate", "slds-hide");
        }            
        */
    }, 
    handleErrors: function(component, event, helper){
        var crcObj = event.getParam("crcObj");
        if((crcObj.CRC_End_Date__c ===undefined || crcObj.CRC_End_Date__c ==="") && (crcObj.CRC_Start_Date__c===undefined || crcObj.CRC_Start_Date__c ==="")){
            component.set("v.blankDateError", "slds-show");
            component.set("v.blankField", "Start Date and End Date");          
        }      
        if((crcObj.CRC_End_Date__c ===undefined || crcObj.CRC_End_Date__c ==="" ) && (crcObj.CRC_Start_Date__c !==undefined || crcObj.CRC_Start_Date__c ==="")){
            component.set("v.blankDateError", "slds-show");
            component.set("v.blankField", "End Date required");
        }
        if((crcObj.CRC_End_Date__c !==undefined || crcObj.CRC_End_Date__c ==="") && (crcObj.CRC_Start_Date__c ===undefined || crcObj.CRC_Start_Date__c ==="" )){
            component.set("v.blankDateError", "slds-show");
            component.set("v.blankField", "Start Date");
        }         
    },
    validateDates: function(component, event, helper) {
        component.getEvent("CRCDatesEvent").setParams({
            "index" : component.get("v.datesRowIndex"),
            "instance" : component.get("v.CRCDatesInstance"),
            "Action" : "change"
        }).fire();
    }
})