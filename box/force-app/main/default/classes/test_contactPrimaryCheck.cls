@isTest
public with sharing class test_contactPrimaryCheck {
    
    static testMethod void testContactPrimaryCheck() {
        
        // Create Account
        Account A = new Account();
        A.Name = 'Test Account';
        A.Region__c = 'East';
        A.BillingStateCode='WI';
        
        // Create Primary Contact
        Contact C = new Contact();
        C.LastName = 'Test Last Name';
        C.Contact_Type__c = 'Primary';
        C.AccountId = A.Id;
        // Create Primary Contact
        try {
        C = new Contact();
        C.LastName = 'Test Last Name2';
        C.Contact_Type__c = 'Primary';
        C.AccountId = A.Id;
        
        List<Contact> cList = new List<Contact>();
        C.LastName = 'Test Last Name';
        C.Contact_Type__c = 'Primary';
        C.AccountId = A.Id;
        cList.Add(C);
        cList.Add(C);
        } Catch(Exception e) {}
        
    }
}