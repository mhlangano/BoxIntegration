trigger contactPrimaryCheck on Contact (before insert, before update) {

    //
    //  Don't allow a Primary contact to be added if Account already has a Primary 
    //
    //If (trigger.new.size() == 1 ) {
        //map<id,contact> primaryContactMap = new Map<id,contact>();        // <AccountI,Contact>
        Map<Id,List<Contact>> primaryContactsMap = new Map<Id,List<Contact>>();
        List<Contact> primaryContactList = new List<Contact>();
        string oldContactType = '';
        if (trigger.isUpdate) {
            oldContactType = trigger.old[0].Contact_Type__c;
        }
    
        // Get Map of <AcountId,List<PrimaryContacts>>
        Set<Id> accountIds = new Set<Id>();
        For (Contact C : Trigger.new) {
            accountIds.add(C.accountId);
        }
        try {
            primaryContactList = [SELECT Id,AccountId,Contact_Type__c FROM Contact WHERE AccountId IN :accountIds AND Contact_Type__c = 'Primary' ];
        } catch(Exception ex) { 
            primaryContactList = new List<Contact>();
        }
        For (contact C : primaryContactList) {
            List<Contact> iterList = new List<Contact>();
            If (primaryContactsMap.containsKey(C.AccountId)) {
                iterList = primaryContactsMap.get(C.AccountId);
            }
            iterList.add(C);
            primaryContactsMap.put(C.AccountId, iterList);
        }
        // Loop through Contacts, making sure there is not a Primary already for that account
        For (Contact C : Trigger.new) {
            
            If (C.Contact_Type__c == 'Primary' && primaryContactsMap.containsKey(C.AccountId) ) {
                
                List<Contact> iterList = new List<Contact>();
                iterList = primaryContactsMap.get(C.AccountId);
                If (iterList.size()>1) {
                    C.Contact_Type__c.addError('Account already has a Primary Contact');
                } ELSE IF (iterList[0].Id != C.Id) {
                    C.Contact_Type__c.addError('Account already has a Primary Contact');
                }
                
                
                // Get List from primaryContactsMap
                // if iterList size > 1
                    // Error
                // else IF (iterList[0].Id != C.id)  
                    // Error C.Contact_Type__c.addError('Account already has a Primary Contact');
                    
                    
                /*  
                // Need to also check that the Previous value was NOT Primary
                if (oldContactType != 'Primary' ) {
                    Trigger.new[0].Contact_Type__c.addError('Account already has a Primary Contact');
                } 
                */
            }
            
            
            
        }
    //}
}