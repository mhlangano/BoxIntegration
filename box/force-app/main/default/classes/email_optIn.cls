global with sharing class email_optIn implements Messaging.InboundEmailHandler {
	global Messaging.InboundEmailresult handleInboundEmail(Messaging.inboundEmail email, Messaging.InboundEnvelope envelope) {
        
		Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        
		set<string>	emailAddresses = new set<string>();
		emailAddresses.add(email.fromAddress);

		list<contact> contacts = new list<contact>([SELECT id,EMail,HasOptedOutOfEmail,Email_opt_IN__c FROM Contact WHERE EMail IN :emailAddresses]);
        
        for (contact contact : contacts) {
            contact.EMail_Opt_IN__c = true;
            if (contact.HasOptedOutOfEmail == true) {
                contact.HasOptedOutOfEmail = false;
            }
		}
		update contacts;
		
		return result;
	}
}