@isTest
//@isTest(SeeAllData=True)
public class TEST_MergeContacts {

    static testMethod void TestContactMerge() {
        Id PrimaryContact;
        Id MergeContact;    
        List<Contact> ContList = new List<Contact>{};
		List<TISMerge__c> MergList = new List<TISMerge__c>{};

        //Create New Account
    	Account Acct = new Account();
        Acct.Name = 'EW-TEST2';
        Acct.Location_Number__c = 'EW-TEST2';
        insert Acct;            
       
		//Create New Contacts - 12 Contacts for 6 sets of duplicates
        for (Integer i = 0; i < 12; i++) {
            Contact Cont = new Contact();
            Cont.AccountId = Acct.Id;
            Cont.FirstName = 'John';
            Cont.LastName = 'Doe';
            Cont.Email = 'JohnDoe@testgmail.com';            
            ContList.add(Cont);
        }     
        
        Insert ContList;
        
        Integer i = 0;
        Integer x = 0;
        for(Contact c : ContList){
            i++;
            Integer vSplit = math.MOD(i,2);
            if(vSplit == 0){
                PrimaryContact = c.Id;
                x++;
            }else{
             	MergeContact = c.Id;
                x++;
            }
            
            if(x==2){
                TISMerge__c TMerg = new TISMerge__c();
                TMerg.Master_Record_Contact__c  = PrimaryContact;
                TMerg.Merge_Record_Contact__c = MergeContact;
                TMerg.Status__c = 'Ready';
                MergList.add(TMerg);
                x = 0;
            }
        }
        
        insert MergList;
        
    	Database.executeBatch(new BatchMerge(), 10);
    }
    
}