trigger Link_Meetings on Conference_Meeting__c (before update, before insert) {
	System.debug('LINK MEETING START');
    
    Set<String> uLocNum = new Set<String>();
    Set<String> cLastNames = new Set<String>();
    Map<String, Id> AcctMap = new Map<String, Id>();
    Map<String, Id> ContactMap = new Map<String, Id>();
    
    //Get lookup values if fields are NULL
    for(Conference_Meeting__c c : Trigger.New) {
        if(c.Agency0__c == NULL){
            if(c.uploaded_Location_Number__c != Null){
                if(c.uploaded_Location_Number__c.length() == 7){
                    uLocNum.add(c.uploaded_Location_Number__c);
                }else{
                    String[] vTemp = c.uploaded_Location_Number__c.split(',');
                    for (Integer i=0; i<vTemp.size(); i++){
                        uLocNum.add(vTemp[i].trim());    
                    }
                }
            }
        }
        if(c.Contact_1__c == NULL){
            if(c.Meeting_List__c != Null){
                String[] tempContacts = c.Meeting_List__c.split(';');
                for (Integer i=0; i<tempContacts.size(); i++){
                    String[] tCon = tempContacts[i].removeStart(' ').split(' ');
                    system.debug('tCon size  = '+tCon.size());
                    if(tCon.Size() >= 2){        
                        cLastNames.add(tCon[1]);
                    }
                }
            }
        }
    }
    
    //***********Lookup Account Data **************
    if(uLocNum.size() > 0){
        for (Account a : [
            SELECT Id, Location_Number__c
            FROM Account
            WHERE Location_Number__c in :uLocNum]) {
                AcctMap.put(a.Location_Number__c, a.Id);                          
            }    
    }
    //***********Lookup Contact Data **************
    if(cLastNames.size() > 0){
        for (Contact c : [
            SELECT Id, FirstName, LastName
            FROM Contact
            WHERE LastName in :cLastNames]) {
                ContactMap.put(c.FirstName + ' ' + c.LastName, c.Id);                          
            }        
    }
    system.debug('ContactMap Size'+ ContactMap.size());
    system.debug('ContactMap '+ ContactMap);
    
    for(Conference_Meeting__c c : Trigger.New) {
        // ************************  Agency Assignments  *********************************      
        if(c.Agency0__c == NULL){
            if(c.uploaded_Location_Number__c != Null){
                if(c.uploaded_Location_Number__c.length() == 7){
                    c.Agency0__c = AcctMap.get(c.uploaded_Location_Number__c);
                }else{
                    String[] vTemp = c.uploaded_Location_Number__c.split(',');
                    for (Integer i=0; i<vTemp.size(); i++){
                        if(i==0){
                            c.Agency0__c = AcctMap.get(vTemp[i].trim());    
                        }
                        if(i==1){
                            c.Agency1__c = AcctMap.get(vTemp[i].trim());    
                        }
                        if(i==2){
                            c.Agency2__c = AcctMap.get(vTemp[i].trim());    
                        }                    
                    }
                }
            }
        }
		// ************************  Meeting Date Time Correction ************************
        if(c.Meeting_DateTime__c == NULL){
            if(c.Uploaded_Date__c != Null && c.Uploaded_Time__c != NULL){
                c.Meeting_DateTime__c = DateTime.parse(c.Uploaded_Date__c + ' '+ c.Uploaded_Time__c);           
            }
        }
        // ************************  Contact Assignments  ********************************
        if(c.Contact_1__c == NULL){
            if(c.Meeting_List__c != Null){
                String[] tempContacts = c.Meeting_List__c.split(';');
                for (Integer i=0; i<tempContacts.size(); i++){
                    String[] tCon = tempContacts[i].removeStart(' ').split(' ');
                    if(tCon.Size() >= 2){  
                        String vName = tCon[0]+' '+tCon[1];
                        if(i == 0){	
                            c.Contact_1__c = ContactMap.get(vName);
                        }
                        if(i == 1){
                            c.Contact_2__c = ContactMap.get(vName);
                        }
                        if(i == 2){
                            c.Contact_3__c = ContactMap.get(vName);
                        }
                        if(i == 3){
                            c.Contact_4__c = ContactMap.get(vName);
                        }
                        if(i == 4){
                            c.Contact_5__c = ContactMap.get(vName);
                        }
                        if(i == 5){
                            c.Contact_6__c = ContactMap.get(vName);
                        }
                    }
                }
            }            
        }
    }
    System.debug('LINK MEETING STOP');
}