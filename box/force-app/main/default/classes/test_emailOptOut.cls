@isTest
public with sharing class test_emailOptOut {
	
	static testMethod void testEMailOptOut() {
		test.startTest();
			account account = new account(Name='Jeffs Agency');
			insert account;
			contact contact = new contact(
				AccountId = account.Id,
				FirstName='Jeff',
				LastName='Stevens',
				Email='jstevens@procoreresources.com'
				);			
			insert contact;

			// setup Opt-Out email
			Messaging.InboundEmail email = new Messaging.InboundEmail();
			Messaging.InboundEnvelope envelope = new Messaging.InboundEnvelope();
			email.plainTextBody = 'remove';
			email.fromAddress = 'jstevens@procoreresources.com';
			email_optOut emailOptOut = new email_optOut();
			emailOptOut.handleInboundEmail(email, envelope);
			
			// assert that optOut is checked...
			list<contact> contacts = new list<contact>([SELECT Id,HasOptedOutOfEmail FROM Contact WHERE EMail = 'jstevens@procoreresources.com']);
			system.assertEquals(contacts[0].HasOptedOutOfEMail,true);
        
        	// Check for OptIn...
        	email = new Messaging.InboundEmail();
        	envelope = new Messaging.InboundEnvelope();
        	email.plainTextBody = 'Add Back In';
        	email.fromAddress = 'jstevens@procoreresources.com';
        	email_optIn emailOptIn = new email_optIn();
        	emailOptIn.handleInboundEmail(email,envelope);
        	
        	// assert that optIn is checkec...
			contacts = new list<Contact>([SELECT Id,Email_Opt_IN__c FROM Contact WHERE eMail = 'jstevens@procoreresources.com']);
        	system.assertEquals(contacts[0].Email_Opt_IN__c,true);
                
		test.stopTest();
	}
}