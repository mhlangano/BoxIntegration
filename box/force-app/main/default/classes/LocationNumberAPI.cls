public class LocationNumberAPI {
    private static DOM.Document generateXML(String username, String password, String state) {
        DOM.Document document = new DOM.Document();
        
        String soap_namespace = 'http://www.w3.org/2003/05/soap-envelope';
        String service_namespace = 'http://travelexinsurance.com/Services/SalesForceService';
        String wsse_namespace = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
        
        // Generate the outer envelope
        DOM.XmlNode envelope = document.createRootElement('Envelope', soap_namespace, 'soap');
        envelope.setNamespace('sal', service_namespace);
        
        // Generate the header
        DOM.XmlNode header = envelope.addChildElement('Header', soap_namespace, 'soap');
        
        // Generate the Security header node
        DOM.XmlNode security = header.addChildElement('Security', wsse_namespace, 'wsse');
        
        DOM.XmlNode username_token = security.addChildElement('UsernameToken', wsse_namespace, 'wsse');
        username_token.addChildElement('Username', wsse_namespace, 'wsse').addTextNode(username);
        username_token.addChildElement('Password', wsse_namespace, 'wsse').addTextNode(password);
        
        // Generate the body
        DOM.XmlNode body = envelope.addChildElement('Body', soap_namespace, 'soap');
        
        DOM.XmlNode location_number = body.addChildElement('GenerateLocationNumber', service_namespace, 'sal');
        if(state != null) {
            location_number.addChildElement('stateAbbreviation', service_namespace, 'sal').addTextNode(state);
        }
        
        // Return the String to put in the request
        return document;
    }
    
    @future(callout=true)
    public static void getLocationNumber(String accountId) {
        Account a = [SELECT BillingStateCode FROM Account WHERE Id = :accountId];
        
        LocationService__c creds = LocationService__c.getOrgDefaults();
        
        if(creds.username__c == null) {
            return;
        }
        
        DOM.Document request_body = generateXML(creds.username__c, creds.password__c, a.BillingStateCode);
        
        HttpRequest request = new HttpRequest();
        
        request.setMethod('POST');
        request.setEndpoint(creds.endpoint__c);
        request.setHeader('Content-Type', 'application/soap+xml;charset=UTF-8;action="http://travelexinsurance.com/Services/SalesForceService/ITisSalesForceService/GenerateLocationNumber"');        
        request.setBodyDocument(request_body);
        request.setTimeout(20000);
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        System.assertEquals(200, response.getStatusCode());
        
        DOM.XmlNode envelope = response.getBodyDocument().getRootElement();
        System.debug('Response Body: '+ response.getBody());
        
        String location = envelope
            .getChildElement('Body', 'http://www.w3.org/2003/05/soap-envelope')
            .getChildElement('GenerateLocationNumberResponse', 'http://travelexinsurance.com/Services/SalesForceService')
            .getChildElement('GenerateLocationNumberResult', 'http://travelexinsurance.com/Services/SalesForceService')
            .getChildElement('LocationNumber', 'http://schemas.datacontract.org/2004/07/TIS.DTO.TravelexInsuranceAPIContracts')
            .getText();
        
        updateLocation(accountId, location);
    } 
    
    
    public static void updateLocation(Id accountId, String LocationNumber){
        List<Account> acct = [Select Id,Location_Number__c from Account where Id =:accountId];
        acct[0].Location_Number__c = LocationNumber;
        
        try{
            update acct;
        }catch(Exception e){
            system.debug('Error occured: ' + e);
        }
    }
    
}