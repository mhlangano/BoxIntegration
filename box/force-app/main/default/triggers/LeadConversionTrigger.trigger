trigger LeadConversionTrigger on Lead (after update) {
    for(Lead lead : Trigger.New) {
        if(lead.isConverted && !Trigger.OldMap.get(lead.Id).isConverted) {
            String[] products = lead.Requested_Products__c.split(';');
            System.debug('[Trigger] Lead Conversion caught: ' + lead.Requested_Products__c);
            LeadConversion.createOpportunities(lead.Id, products);
        }
    }
}