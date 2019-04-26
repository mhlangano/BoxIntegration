public class LeadConversion {
    public static void createOpportunities(Id lead_id, String[] products) {
        List<Opportunity> opps = new List<Opportunity>();
        
        for(String product : products) {
            if(product == 'Retail') {
                opps.add(createOpportunity('Retail'));
            } else if(product == 'Group') {
                opps.add(createOpportunity('Group'));
            } else if(product == 'Custom Travel Secure') {
                opps.add(createOpportunity('Custom Travel Secure'));
            } else if(product == 'Specialty Risk') {
                opps.add(createOpportunity('Specialty Risk'));
            } else if(product == 'Vacation Ownership' || product == 'Club' || product == 'Resort') {
                opps.add(createOpportunity('VO, Club, or Resort'));
            }
        }

        Lead converted_lead = [
            SELECT Annual_Passenger_Movement__c, LeadSource, Company, OwnerId, ConvertedAccountId,
            	   Passengers_Who_Accept_Insurance__c, Insured_customers_did_you_have_last_year__c,
            	   Total_insurance_premium_collected_last__c, Consortium__c, Other_Consortium__c
            FROM Lead WHERE Id = :lead_id];
        List<Account> accts = [SELECT Id, Name FROM Account WHERE Id = :converted_lead.ConvertedAccountId LIMIT 1];

        for(Opportunity opp : opps) {
            opp.LeadSource = converted_lead.LeadSource;
            opp.OwnerId = converted_lead.OwnerId;
            opp.Name = String.format('{0} - {1}', new String[]{accts[0].Name, opp.Name});
            
            opp.of_Passengers_Who_Accept_Insurance__c = converted_lead.Passengers_Who_Accept_Insurance__c;
            opp.of_Insured_Customers_Last_Year__c = converted_lead.Insured_customers_did_you_have_last_year__c;
            opp.Total_Insurance_Premium_Collected_LY__c = converted_lead.Total_insurance_premium_collected_last__c;
            opp.of_Passengers_Annually__c = converted_lead.Annual_Passenger_Movement__c;
            opp.Consortium__c = converted_lead.Consortium__c;
            opp.Other_Consortium__c = converted_lead.Other_Consortium__c;
            
            if(!accts.isEmpty()) {
                opp.AccountId = accts[0].Id;
            }
        }
        
        insert opps;
        
        return;
    }
    
    private static Opportunity createOpportunity(String record_type_name) {
        Id record_type_id = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get(record_type_name).getRecordTypeId();
        
        Opportunity opp = new Opportunity();
        opp.RecordTypeId = record_type_id;
        opp.StageName = 'Prospecting';
        opp.CloseDate = Date.today();
        opp.Name = record_type_name;
        
        return opp;
    }
}