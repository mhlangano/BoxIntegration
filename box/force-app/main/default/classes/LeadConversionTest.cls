@isTest
public class LeadConversionTest {
    public static testMethod void testConversion() {
        Lead l = new Lead(
            FirstName='Pam',
            LastName='Pango',
            Company='Canpango',
            Company_Phone__c='3331112222',
            Phone='1112223333',
            Requested_Products__c='Retail;Group',
            Status='0% - New',
            Select_type_of_adventure_travel_offered__c='mountain climbing',
            Street='123 Fake st',
            City='Milwaukee',
            State='Wisconsin',
            PostalCode='53202',
            Account_Type__c='Online Travel Agency',
            LeadSource='Advertisement',
            Annual_Passenger_Movement__c=12345,
            Annual_Leisure_Sales__c=344.00,
            Consortium__c='None',
            Contact_Title__c='Owner',
            Contact_Type__c='Primary',
            Email='person@place.tld',
            Type_of_Trips_Primarily_Offered__c='Other',
            //What_is_your_annual_travel_sales_volume__c='test',
            What_is_the_average_Trip_Cost_per_person__c=344.00,
            Insured_customers_did_you_have_last_year__c=12,
            Last_Year_Q1_Passenger_Bookings__c=344.00,
            Last_Year_Q2_Passenger_Bookings__c=344.00,
            Last_Year_Q3_Passenger_Bookings__c=344.00,
            Last_Year_Q4_Passenger_Bookings__c=344.00,
            Passengers_who_accept_insurance__c=80.0,
            Total_insurance_premium_collected_last__c=344,
            Will_Travelex_be_the_only_Leisure_Travel__c='Yes'
        );
        
        insert l;
        
        Test.startTest();
        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(l.id);
        
        LeadStatus cs = [SELECT Id,ApiName FROM LeadStatus WHERE IsConverted = TRUE LIMIT 1];
        lc.setConvertedStatus(cs.ApiName);
        lc.setDoNotCreateOpportunity(true);
        
        Database.LeadConvertResult lcr = Database.convertLead(lc);
        System.assert(lcr.isSuccess());
        Test.stopTest();
    }
    public static testMethod void testConversion2() {
        Lead l = new Lead(
            FirstName='Pam',
            LastName='Pango',
            Company='Canpango',
            Company_Phone__c='3331112222',
            Phone='1112223333',
            Requested_Products__c='Club;Vacation Ownership;Partner',
            Status='0% - New',
            Select_type_of_adventure_travel_offered__c='mountain climbing',
            Street='123 Fake st',
            City='Milwaukee',
            State='Wisconsin',
            PostalCode='53202',
     		Account_Type__c='Online Travel Agency',
            LeadSource='Advertisement',
            Annual_Passenger_Movement__c=12345,
            Annual_Leisure_Sales__c=344.00,
            Consortium__c='None',
            Contact_Title__c='Owner',
            Contact_Type__c='Primary',
            Email='person@place.tld',
            Type_of_Trips_Primarily_Offered__c='Other',
            //What_is_your_annual_travel_sales_volume__c='test',
            What_is_the_average_Trip_Cost_per_person__c=344.00,
            Insured_customers_did_you_have_last_year__c=12,
            Last_Year_Q1_Passenger_Bookings__c=344.00,
            Last_Year_Q2_Passenger_Bookings__c=344.00,
            Last_Year_Q3_Passenger_Bookings__c=344.00,
            Last_Year_Q4_Passenger_Bookings__c=344.00,
            Passengers_who_accept_insurance__c=80.0,
            Total_insurance_premium_collected_last__c=344,
            Will_Travelex_be_the_only_Leisure_Travel__c='Yes'
        );
        
        insert l;
        
        Test.startTest();
        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(l.id);
        
        LeadStatus cs = [SELECT Id,ApiName FROM LeadStatus WHERE IsConverted = TRUE LIMIT 1];
        lc.setConvertedStatus(cs.ApiName);
        lc.setDoNotCreateOpportunity(true);
        
        Database.LeadConvertResult lcr = Database.convertLead(lc);
        System.assert(lcr.isSuccess());
        Test.stopTest();
    }
}