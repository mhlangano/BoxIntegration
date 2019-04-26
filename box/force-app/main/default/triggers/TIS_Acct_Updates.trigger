trigger TIS_Acct_Updates on Account (after insert) { 
    
    for(Account a :trigger.new){
        if(a.Location_Number__c == NULL){
            LocationNumberAPI.getLocationNumber(a.id);                             
        }            
    }
    
}