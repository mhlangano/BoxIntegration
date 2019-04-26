@isTest()
public class LocationNumberTest {
    public class LocationServiceMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><u:Timestamp u:Id="_0"><u:Created>2018-06-26T17:22:28.175Z</u:Created><u:Expires>2018-06-26T17:27:28.175Z</u:Expires></u:Timestamp></o:Security></s:Header><s:Body><GenerateLocationNumberResponse xmlns="http://travelexinsurance.com/Services/SalesForceService"><GenerateLocationNumberResult xmlns:a="http://schemas.datacontract.org/2004/07/TIS.DTO.TravelexInsuranceAPIContracts" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><a:LocationNumber>09-1140</a:LocationNumber><a:Message i:nil="true"/><a:Status>Success</a:Status></GenerateLocationNumberResult></GenerateLocationNumberResponse></s:Body></s:Envelope>');
       		
            return res;
        }
    }
    
    @testSetup static void createCredentialSetting() {
        LocationService__c ls = new LocationService__c(
        	username__c='test',
            password__c='test',
            endpoint__c='https://api-test.travelexinsurance.com/Services/SalesForceService.scv'
        );
        insert ls;
    }
    @isTest static void testWithoutStateCode() {
        Account a = new Account(
        	Name='Canpango Test Account'
        );
        
        Test.setMock(HttpCalloutMock.class, new LocationServiceMock());
        Test.startTest();
        	insert a;
        Test.stopTest();
    }
    @isTest static void testWithStateCode() {
        Account a = new Account(
        	Name='Canpango Test Account',
            BillingStateCode='WI'
        );
        
        Test.setMock(HttpCalloutMock.class, new LocationServiceMock());
        Test.startTest();
        	insert a;
        Test.stopTest();    
    }
    @isTest static void testcontractPrimaryCheck() {
        Account a = new Account(
        	Name='Canpango Test Account2',
            Region__c = 'East',
        	BillingStateCode='WI'
        );
        Contact c = new Contact(
        	LastName='Test Last Name',
            Contact_Type__c = 'Primary',
        	AccountId = A.Id
        );
        
        Test.setMock(HttpCalloutMock.class, new LocationServiceMock());
        Test.startTest();
        	insert a;
        Test.stopTest();
    }
    
}