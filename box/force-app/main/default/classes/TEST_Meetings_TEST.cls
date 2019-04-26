@isTest(SeeAllData=True)
public class TEST_Meetings_TEST {
	
    static testMethod void General_PageTest() {
                
        Test.startTest();
        MeetingsController controller = new MeetingsController();
        Test.stopTest();
    }
    
    static testMethod void Create_Meeting() {
        list<Account> aList = new list<Account>();
        list<Contact> cList = new list<Contact>();
    	Account Acct = new Account();
        Acct.Name = 'EW-TEST2';
        Acct.Location_Number__c = 'EW-TEST2';
        aList.add(Acct);
        
    	Account Acct1 = new Account();
        Acct1.Name = 'EW-TEST3';
        Acct1.Location_Number__c = 'EW-TEST3';
        aList.add(Acct1); 
        
    	Account Acct2 = new Account();
        Acct2.Name = 'EW-TEST4';
        Acct2.Location_Number__c = 'EW-TEST4';
        aList.add(Acct2);
        
        Contact Cont = new Contact();
        Cont.FirstName = 'Eric';
        Cont.LastName = 'Wright';
        cList.add(Cont);
        
        Contact Cont1 = new Contact();
        Cont1.FirstName = 'John';
        Cont1.LastName = 'Doe';
        cList.add(Cont1);  

        Contact Cont2 = new Contact();
        Cont2.FirstName = 'Jane';
        Cont2.LastName = 'Doe';
        cList.add(Cont2); 

        Contact Cont3 = new Contact();
        Cont3.FirstName = 'Mark';
        Cont3.LastName = 'Doe';
        cList.add(Cont3);         

        Contact Cont4 = new Contact();
        Cont4.FirstName = 'Doe';
        Cont4.LastName = 'Doe';
        cList.add(Cont4); 
        
        Contact Cont5 = new Contact();
        Cont5.FirstName = 'Homer';
        Cont5.LastName = 'Doe';
        cList.add(Cont5);         
        
        Test.startTest();
        Conference__c Conf = new Conference__c();
        Conf.Name = 'Travel Week 2016';
        Insert Conf;
        
        Insert aList;
        Insert cList;
        
        
        Conference_Meeting__c ConfMeet_Single = new Conference_Meeting__c();
        ConfMeet_Single.Conference__c = Conf.Id;
        ConfMeet_Single.Uploaded_Date__c = '8/8/2016';
        ConfMeet_Single.Uploaded_Time__c = '11:23 AM';
        ConfMeet_Single.Uploaded_Agency_Name__c = 'Test';
        ConfMeet_Single.Uploaded_Location_Number__c = 'EW-TEST';
        ConfMeet_Single.Meeting_List__c = 'Eric Wright';
        ConfMeet_Single.Meeting_Status__c = 'Scheduled';
        Insert ConfMeet_Single;

        Conference_Meeting__c ConfMeet_Multi = new Conference_Meeting__c();
        ConfMeet_Multi.Conference__c = Conf.Id;
        ConfMeet_Multi.Uploaded_Date__c = '8/8/2016';
        ConfMeet_Multi.Uploaded_Time__c = '11:23 AM';
        ConfMeet_Multi.Uploaded_Agency_Name__c = 'Test';
        ConfMeet_Multi.Uploaded_Location_Number__c = 'EW-TEST2, EW-TEST3, EW-TEST4';
        ConfMeet_Multi.Meeting_List__c = 'Eric Wright; John Doe; Jane Doe; Mark Doe; Doe Doe; Homer Doe';
        ConfMeet_Multi.Meeting_Status__c = 'Scheduled';
        Insert ConfMeet_Multi;

        test.stopTest();
        
    }
    
}