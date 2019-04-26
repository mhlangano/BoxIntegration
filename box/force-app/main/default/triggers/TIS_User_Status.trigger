trigger TIS_User_Status on User (after update) {

    if(TIS_Settings__c.getValues('Travelex').Send_User_Deactivated_Email__c){
		
        Set<ID> setUIDs = new Set<ID>(); // Define a new set
        
        
        
        for( User vU :trigger.new ){
            system.debug('status' + vU.isActive);
            
            User vOldMap = trigger.oldmap.get(vU.Id);
            system.debug('new map status: ' + vU.isActive);    
            system.debug('old map status: ' + vOldMap.isActive);    
            if(vU.isActive == False && vOldMap.isActive == True){
                system.debug('IN the Loop - ID '+vU.ID);
        		setUIDs.add(vU.ID);
            }
        }
        
        system.debug('number of users: '+ setUIDs.size());
        
        if(setUIDs.size() > 0){
			TIS_Utility.TIS_SendEmail(setUIDs);
        }
    
    }
    
    
    
    
    
}