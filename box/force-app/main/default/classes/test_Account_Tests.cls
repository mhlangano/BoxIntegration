@isTest
public class test_Account_Tests {

    /*
    static testMethod void Create_New_Acct() {
        //Get an active user ID
        User u = [Select FirstName, LastName from User where UserRole.Name in ('East RAM', 'West RAM') and isActive = True limit 1];
		//Start Testing
        test.startTest();
        //Create New Account
    	Account Acct = new Account();
        Acct.Name = 'EW-TEST2';
        Acct.Location_Number__c = 'EW-TEST2';
        //Set the owner as the selected user. 
        Acct.RA_RSM__c = u.Firstname+' '+u.LastName;  
        //Insert
        insert Acct;
        test.stopTest();
        
    }
*/
    static testMethod void Create_New_Acct_then_Update() {
        List<Account> accts = new List<Account>(); 
        //Get an active user ID
        User u = [Select FirstName, LastName from User where UserRole.Name in ('East RAM', 'West RAM') and isActive = True limit 1];
        User u2 = [Select FirstName, LastName from User where UserRole.Name in ('East RAM', 'West RAM') and isActive = False limit 1];
		//Start Testing
        test.startTest();
        //Create New Account
    	Account Acct = new Account();
        Acct.Name = 'EW-TEST2';
        Acct.Location_Number__c = 'EW-TEST2';
        //Insert
        accts.add(Acct);

    	Account Acct2 = new Account();
        Acct2.Name = 'EW-TEST3';
        Acct2.Location_Number__c = 'EW-TEST3';
        accts.add(Acct2);
        
        insert accts;
        //Set the owner as the selected user. 
        Acct.RA_RSM__c = u.Firstname+' '+u.LastName;  
		Acct2.RA_RSM__c = u2.Firstname+' '+u2.LastName;  
		update Accts;
        
        test.stopTest();
        
    }    
}