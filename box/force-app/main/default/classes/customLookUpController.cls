public class customLookUpController {
    @AuraEnabled
    public static sObject fetchDistinctRecord(String field_name, String object_name, String search_value) {
        String sQuery = 'SELECT Id, Name, Location_Number__c, BillingState, BillingCountry, BillingPostalCode, ShippingState, ShippingCountry, ShippingPostalCode FROM ' +
            object_name + ' WHERE ' + field_name + ' = \'' + search_value + '\' LIMIT 1';
        
        sObject result = Database.query(sQuery);
        
        return result;
    }
    @AuraEnabled
    public static List <enrollmentWrapper> fetchLookUpValues(String searchKeyWord, String ObjectName,String fieldName) {
        
        String searchKey = searchKeyWord + '%';   
        
        System.debug('searchKeyWord: '+searchKeyWord);
        System.debug('ObjectName: '+ObjectName);
        System.debug('fieldName: '+fieldName);
        
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        String sQuery =  '';
        List <sObject> lstOfRecords  = new List <sObject>();
        List <sObject> returnList = new List <sObject>();
        
        List <Account> accList = new List <Account>();
        List <List_Item__c> itemList = new List<List_Item__c>();
        List <Airport_Locations__c> airportList = new List<Airport_Locations__c>(); 
        
        if(Objectname == 'Account' && fieldName == 'name'){
            sQuery =  'select  Name,Location_Number__c, BillingState,BillingCountry,BillingPostalCode, ShippingState, ShippingCountry,ShippingPostalCode from Account where Name LIKE: searchKey OR Location_Number__c LIKE: searchKey order by createdDate DESC limit 5';
            accList = Database.query(sQuery);                            
        }                 
        if(Objectname == 'Enrollments__c' && fieldName == 'Destination__c'){
            
            String active = 'Active'; 
            String listtype ='Destination';
            
            String escapedActive = String.escapeSingleQuotes(active);
            String escapedListtype  = String.escapeSingleQuotes(listtype );
            sQuery  = 'select id,name,List_Type__c ,Status__c,List_Item_Description__c, Alert_Message__c, List_Item_ID__c from List_Item__c where Status__c =: escapedActive and List_Type__c =:escapedListtype and List_Item_Description__c LIKE: searchKey order by createdDate DESC limit 5';
            itemList = Database.query(sQuery);                    
        }
        if(Objectname == 'Enrollments__c' && fieldName == 'Airline__c'){       
            String active = 'Active'; 
            String airline ='Airline';
            
            String escapedActive = String.escapeSingleQuotes(active);
            String escapedAirline  = String.escapeSingleQuotes(airline);
            sQuery  = 'select id,name,List_Item_Description__c, Alert_Message__c, List_Item_ID__c from List_Item__c where Status__c =: escapedActive and List_Type__c =:escapedAirline  and List_Item_Description__c LIKE: searchKey order by createdDate DESC limit 5';
            itemList = Database.query(sQuery);           
        }
        if(Objectname == 'Enrollments__c' && fieldName == 'Cruise_Line__c'){      
            String active = 'Active'; 
            String destination ='Cruiseline';            
            String escapedActive = String.escapeSingleQuotes(active);
            String escapedDestination = String.escapeSingleQuotes(destination);
            sQuery  = 'select id,name,List_Item_Description__c, Alert_Message__c, List_Item_ID__c from List_Item__c where Status__c =: escapedActive and List_Type__c =:escapedDestination and List_Item_Description__c LIKE: searchKey order by createdDate DESC limit 5';
            itemList = Database.query(sQuery);          
        }
        if(Objectname == 'Enrollments__c' && fieldName == 'Tour_Operator__c'){      
            String active = 'Active'; 
            String operator='Tour Operator';
            
            String escapedActive = String.escapeSingleQuotes(active);
            String escapedOperator = String.escapeSingleQuotes(operator);
            sQuery  = 'select id,name,List_Item_Description__c, Alert_Message__c,Custom_Alert_Message__c, List_Item_ID__c' +
                    ' from List_Item__c where Status__c =: escapedActive and List_Type__c =:escapedOperator and List_Item_Description__c LIKE: searchKey order by createdDate DESC limit 5';
            itemList = Database.query(sQuery);          
        }
        if(Objectname == 'Enrollments__c' && fieldName == 'Departing_Airport__c'){                  
            sQuery  = 'select id,name,Airport_Code__c,Airport_Country__c from Airport_Locations__c where Name LIKE: searchKey OR Airport_Code__c LIKE: searchKey order by createdDate DESC limit 5';
            airportList = Database.query(sQuery);  
            
        }
        
        
        
        List<enrollmentWrapper> wrapperList  = new List<enrollmentWrapper>();
        
        if(Objectname == 'Enrollments__c' && (fieldName == 'Departing_Airport__c' || fieldName == 'Destination__c' || fieldName == 'Airline__c' || fieldName == 'Cruise_Line__c' || fieldName == 'Tour_Operator__c')){
            for (List_Item__c  obj: itemList) { 
                System.debug(obj);               
                enrollmentWrapper wrapper = new enrollmentWrapper(); 
                wrapper.recordId = obj.Id;            
                wrapper.Name = obj.List_Item_Description__c;    
                wrapper.Code = fieldName; 
                wrapper.identifier = obj.List_Item_ID__c;
                wrapper.alert = obj.Alert_Message__c;
                wrapperList.add(wrapper);
            }
        }  

        if(Objectname == 'Enrollments__c' && fieldName == 'Departing_Airport__c'){
            for (Airport_Locations__c obj: airportList) {                
                enrollmentWrapper wrapper = new enrollmentWrapper();
                wrapper.recordId = obj.Id;            
                wrapper.Name = obj.Name+' - '+obj.Airport_Code__c;    
                wrapper.Code = obj.Airport_Code__c;     
                wrapperList.add(wrapper);
            }
        } 
        
        if(Objectname == 'Account' && fieldName == 'name'){
            for (Account obj: accList) {                
                enrollmentWrapper wrapper = new enrollmentWrapper();
                wrapper.recordId = obj.Id;            
                wrapper.Name = obj.Name+' - '+obj.Location_Number__c;    
                wrapper.Code = obj.Location_Number__c;      
                wrapperList.add(wrapper);
            }
        }
        return wrapperList  ;
    }
    
    public class enrollmentWrapper{
        
        @AuraEnabled
        public String recordId{get; set;}
        @AuraEnabled
        public String name{get; set;}
        @AuraEnabled
        public String code{get; set;}
        @AuraEnabled
        public String identifier{get; set;}
        @AuraEnabled
        public String alert{get; set;}
    }
}