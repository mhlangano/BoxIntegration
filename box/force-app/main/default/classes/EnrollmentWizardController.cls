public class EnrollmentWizardController{
    
    @AuraEnabled
    public static ResponseObj getEnrollment(Id recordId, boolean isEnrollAgain) {

        if (isEnrollAgain==null) isEnrollAgain = false;
        
        Map<String, List<Object>> objectList = new Map<String, List<Object>>();

        List<Enrollments__c> enrollment = new list<Enrollments__c>();

        if (!isEnrollAgain) {
            enrollment = [SELECT id,Name, Company_DBA__r.Id,Company_DBA__r.Name,Company_DBA__c,Product_Name__r.Name,Sales_Rep__r.Name,Owner.Name,Departing_Airport__r.Name,
                    Plan_Number__c,Coverage_Type__c,Flight_Accident_Coverage__c,Confirmation_number__c, Total_Plan_Cost__c,
                    Payment_Due_Date__c,Recepient_s__c,Enable_Date_of_Birth__c,Enable_Save_Quote__c,Require_Address__c,Require_State__c,
                    Collection_Begin_Date__c,Collection_End_Date__c,Medical_Expense_Upgrade__c,Cancel_for_Any_Reason_Upgrade__c,
                    Adventure_Sports_Upgrade__c,AD_D_Upgrade__c,Traveler_Count__c,Group_Name__c,Use_Year__c,Use_Year_Start_Date__c,Use_Year_End_Date__c,
                    Purchase_Date__c,Effective_Date__c,Postmarked_Date__c,Group_Phone__c,Trip_Length__c,Restriction_Script__c,Product_Script__c,
                    Group_Email__c,Amount_Outstanding__c,Flight_Number__c,Total_Upgrade_Costs__c,Plan_Type__c,Underwriter__c,
                    Record_Status__c,Total_Base_Plan_Cost__c,Policy_Status__c,Quote_email__c,Is_Use_Year__c,Invoice_Number__c,Is_Group__c,
                    Agent_Code__c,Base_Plan_Cost__c,Country_of_residency__c,Comments__c,Quote_Number__c,Policy_Document__c,
                    Zip_Code__c,Departure_Date__c,Policy_Fulfillment__c,Return_Date__c,Group_ID__c,Deposit_Date__c,Group_Return_Date__c,Group_Departure_Date__c,
                    Inbound_Sales_Rep__c,Airline__c,Cruise_Line__c,Tour_Operator__c,Departing_Airport__c,Beneficiary_Details__c,
                    Email1__c,Email2__c,Agent_Email__c,State_of_Residency__c, Source_c__c,
                    Destination__c,Destination__r.Name,Destination__r.List_Item_Description__c,Destination__r.Id,
                    Airline__r.List_Item_Description__c,
                    Airline__r.Name,
                    Cruise_Line__r.List_Item_Description__c,Cruise_Line__r.Name,Tour_Operator__r.List_Item_Description__c,Tour_Operator__r.Name,
                    Location_Number__c , Company_DBA__r.Location_Number__c, Company_DBA__r.BillingPostalCode  FROM Enrollments__c WHERE Id = :recordId];
        } else {
            enrollment = [SELECT Country_of_residency__c,State_of_Residency__c,Zip_Code__c, Company_DBA__r.Id, Source_c__c,
                    Location_Number__c, Company_DBA__r.Name, Company_DBA__r.BillingPostalCode FROM Enrollments__c WHERE Id = :recordId];
        }
                
        List<Object> enrollmentObj = (List<Object>) enrollment;
        
        Id accountId = enrollment[0].Company_DBA__r.Id;
        
        List<Account> accountList= new List<Account>();
        accountList.add(new Account(Id= enrollment[0].Company_DBA__c, Location_Number__c = enrollment[0].Location_Number__c , Name= enrollment[0].Company_DBA__r.Name, BillingPostalCode = enrollment[0].Company_DBA__r.BillingPostalCode));
                
        List<Object> accountObj = (List<Object>) accountList;

        List<Object> travelersList = [SELECT id,Traveler_Email__c, Phone__c,Country__c,Zip_Code__c,State__c,City__c,Address_2__c,Address_1__c,
        CFAR__c,Premium_Paid_Date__c,Return_Date__c,Last_Name__c,First_Name__c,Is_Primary__c,
        AD_D_Cost__c,Date_of_Birth__c,Trip_Cost__c  from Traveler__c where Enrollment__c =: recordId]; 
        
        List<Object> policy_transList = [SELECT id, Enrollment__c from Policy_Transaction__c where Enrollment__c =: recordId];         
        
        List<Object> list_itemList = NULL; 

                       
        objectList.put('account', accountObj );
        objectList.put('travelers', travelersList);
        objectList.put('policy_trans', policy_transList);
        objectList.put('list_item', list_itemList);
        objectList.put('enrollment', enrollmentObj);
        
        System.debug(Json.serialize(new ResponseObj(true, 'SUCCESS', objectList )));
        
        return new ResponseObj(true, 'SUCCESS', objectList );          
    } 
    
    public class ResponseObj {
            @AuraEnabled public Boolean IsSuccess { get; set; }
            @AuraEnabled public String Message { get; set; }
            @AuraEnabled public Map<String, List<Object>> objectList{ get; set; }        
            
           public ResponseObj (Boolean IsSuccess, String Message, Map<String, List<Object>> objectList){
            this.IsSuccess = true;
            this.Message = Message;
            this.objectList = objectList;            
        }

        public ResponseObj() {

        }
    }    
                
    @AuraEnabled
    public static Car_Rental_Collision__c findCRC(String recordId) {
        return [SELECT id FROM Car_Rental_Collision__c  WHERE Confirmation_Number__c = :recordId];
    }
    
    @AuraEnabled
    public static String getBaseUrl() {
        return EnrollmentWizardService__c.getOrgDefaults().base_url__c;
    }
    
    @AuraEnabled
    public static List <String> getselectOptions(sObject objectType, String field) {
          List < String > allOpts = new list < String > ();
          Schema.sObjectType objType = objectType.getSObjectType();
          Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
          map <String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();        
          list < Schema.PicklistEntry > values =
          fieldMap.get(field).getDescribe().getPickListValues();
          for (Schema.PicklistEntry a: values) {
           allOpts.add(a.getValue());
          }
          allOpts.sort();
          return allOpts;
    }
    
    @AuraEnabled
    public static Account getAccountByLocation(String locationNumber) {
        return [Select Id, Name, Location_Number__c from Account WHERE Location_Number__c =: locationNumber];
    }
    
    @AuraEnabled
    public static Map<String, Object> loadBulkLookups(String account, String destination_id, String tour_id, String airline_id, String cruise_id) {
        Map<String, Object> return_map = new Map<String, Object>();
        
        if(account != null) {
            return_map.put('account', [SELECT Id, Name, Location_Number__c FROM Account WHERE Location_Number__c = :account]);
        }
        
        if(destination_id != null) {
            return_map.put('destination', [SELECT Id, Name, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :destination_id AND List_Type__c = 'Destination']);
        }
        
        if(tour_id != null) {
            return_map.put('tour', [SELECT Id, Name, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :tour_id AND List_Type__c = 'Tour Operator']);
        }
        
        if(airline_id != null) {
            return_map.put('airline', [SELECT Id, Name, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :airline_id AND List_Type__c = 'Airline']);
        }
        
        if(cruise_id != null) {
            return_map.put('cruise', [SELECT Id, Name, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :cruise_id AND List_Type__c = 'Cruiseline']);
        }
        
        
        return return_map;
    }
    
    @AuraEnabled
    public static Product2 getPlanScripts(String formNumber) {
        Product2 scripts = [
            SELECT Id, Product_Script__c, Restriction_Script__c, Delivery_Script__c 
            FROM Product2 WHERE Form_Number__c = :formNumber
        ];
        
        return scripts;
    }
   
    @AuraEnabled
    public static ResponseObj saveEnrollmentRecords(Enrollments__c enrollment, string productFormNo, List<Traveler__c> travelers,
            list<object> transactions, list<object> upgrades, list<object> CRCDates, list<string> enrollmentNotes) {

        Map<String, List<Object>> objectList = new Map<String, List<Object>>();

        ResponseObj responseObject = new ResponseObj();
        responseObject.IsSuccess = true;

        //string[] errors = new string[]{};

        System.debug('SAVE ENROLLMENT APEX METHOD');
        System.debug('*** '+enrollment);
        System.debug('*** '+travelers);
        System.debug('*** '+transactions);
        System.debug('*** '+CRCDates);
        System.debug('*** '+enrollmentNotes);

        for (object u : upgrades) {
            system.debug(u);

            map<object, object> upgradeMap = (map<object, object>) u;

            switch on string.valueOf(upgradeMap.get('upgradeID')) {
                when '1' {
                    enrollment.cancel_for_any_reason_upgrade__c = true;
                }
                when '10' {
                    enrollment.medical_expense_upgrade__c = true;
                }
                when '13' {
                    enrollment.car_rental_collision_upgrade__c = true;
                }
                when '16' {
                    enrollment.ad_d_upgrade__c = true;
                }
                when '18' {
                    enrollment.adventure_sports_upgrade__c = true;
                }
            }
        }

        //insert enrollment first, catch any errors
        try {
            enrollment.Sales_Rep__c = UserInfo.getUserId();


            //*
            //if (enrollment.Id != null) {
            //   upsert enrollment;
            //}
            //else {
                if (string.isNotBlank(enrollment.confirmation_number__c)) {
                    enrollment.name = string.valueOf(enrollment.confirmation_number__c);
                    enrollment.Record_status__c = 'Enrollment';

                    Schema.SObjectField exIdField = Enrollments__c.fields.Confirmation_Number__c;
                    Database.upsertResult eSaveResult = Database.upsert(enrollment, exIdField, false);
                    if (!eSaveResult.isSuccess()) {
                        for (database.error err : eSaveResult.getErrors()){
                            responseObject.IsSuccess = false;
                            responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                        }
                    }
                } else if (string.isNotBlank(enrollment.quote_number__c)) {
                    enrollment.name = string.valueOf(enrollment.quote_number__c);
                    enrollment.Record_status__c = 'Saved Quote';

                    Schema.SObjectField exIdField = Enrollments__c.fields.Quote_Number__c;
                    Database.upsertResult eSaveResult = Database.upsert(enrollment, exIdField, false);
                    if (!eSaveResult.isSuccess()) {
                        for (database.error err : eSaveResult.getErrors()){
                            responseObject.IsSuccess = false;
                            responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                        }
                    }
                } else {
                    Database.upsertResult eSaveResult = Database.upsert(enrollment, false);
                    if (!eSaveResult.isSuccess()) {
                        for (database.error err : eSaveResult.getErrors()){
                            responseObject.IsSuccess = false;
                            responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                        }
                    }
                }
            //}

            objectList.put('Enrollments__c', new Enrollments__c[] { enrollment });

        } catch (exception e) {
            system.debug(e.getMessage());
            responseObject.Message += e.getMessage() + '/r/n';
        }

        if (enrollment.Id!=null) {
            //next, associate travelers list with just-inserted enrollment;

            for (traveler__c traveler : travelers) {

                traveler.name = traveler.first_name__c + ' ' + traveler.last_name__c;

                traveler.enrollment__c = enrollment.id;
                traveler.RA_Traveler_ID__c = string.valueOf(traveler.RA_Traveler_ID__c);
                               
                system.debug(traveler);
            }

            System.debug('@@@@@@@@@@@@@ Enrollment Save Record Status: ' + enrollment.Record_status__c);
            if(enrollment.Record_Status__c == 'Saved Quote') {
                System.debug('@@@@@@@@@@@@@@@@@@@@@@@@ Saving Travelers With Insert For Quote');
                Database.SaveResult[] tSaveResult = Database.insert(travelers, false);
                for(Database.SaveResult sr : tSaveResult) {
                    if(!sr.isSuccess()) {
                        for(Database.error err : sr.getErrors()) {
                            responseObject.IsSuccess = false;
                            responseObject.Message += ' |ERROR| ' + err.getMessage() + ' from ' + err.getFields() + '\r\n |';
                        }
                    }
                }
            } else {
                Schema.SObjectField exIdField = Traveler__c.fields.RA_Traveler_ID__c;
               
                Database.UpsertResult[] tSaveResult = Database.upsert(travelers, exIdField, false);
               
                for (database.UpsertResult sr : tSaveResult) {
                    if (!sr.isSuccess()) {
                        for (database.error err : sr.getErrors()){
                            responseObject.IsSuccess = false;
                            // responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                            responseObject.Message += ' |ERROR| ' + err.getMessage() + ' from ' + err.getFields() + '\r\n |';
                        }
                    }
                }
            }

            objectList.put('Traveler__c', travelers);


            for (object u : upgrades) {
                system.debug(u);

                map<object, object> upgradeMap = (map<object, object>) u;

            }

            //Policy transactions

            List<Policy_Transaction__c> polTransactions = new list<Policy_Transaction__c>();

            for (object t : transactions) {
                Policy_Transaction__c tran = new Policy_Transaction__c();

                system.debug(t);
                map<object, object> tranMap = (map<object, object>) t;

                system.debug(tranMap);

                tran.name = string.valueOf((decimal) tranMap.get('paymentId'));
                tran.Enrollment__c = enrollment.Id;
                tran.Amount__c = (decimal) tranMap.get('amount');
                tran.auth_number__c = (string) tranMap.get('authorizationNumber');
                tran.card_holder_name__c = (string) tranMap.get('cardHolderName');
                tran.check_number__c = (string) tranMap.get('checkNumber');
                tran.expiration_date__c = string.valueOf((decimal) tranMap.get('expirationMonth')) + '/' + string.valueOf((decimal) tranMap.get('expirationYear'));
                tran.ra_payment_id__c = string.valueOf((decimal) tranMap.get('paymentId'));
                tran.status__c = (string) tranMap.get('paymentStatus');
                tran.payment_type__c = (string) tranMap.get('paymentType');

                polTransactions.add(tran);
            }

            Schema.SObjectField ptExIdField = Policy_Transaction__c.fields.RA_Payment_ID__c;
            Database.upsertResult[] tUpsertResults = Database.upsert(polTransactions, ptExIdField, false);

            objectList.put('Policy_Transaction__c', polTransactions);

            for (database.upsertREsult ur : tUpsertResults){
                if (!ur.isSuccess()) {
                    for (database.error err : ur.getErrors()) {
                        responseObject.IsSuccess = false;
                        responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                    }
                }
            }

            for (Traveler__c traveler : travelers) {
                if (traveler.Is_Primary__c) {
                    enrollment.Primary_Traveler__c = traveler.id;
                    enrollment.State_of_Residency__c = traveler.State__c;

                }
            }

            list<Car_Rental_Collision__c> crcList = new list<Car_Rental_Collision__c>();

            for (object c : crcDates) {
                map<object, object> crcMap = (map<object, object>) c;

                Car_Rental_Collision__c crc = new Car_Rental_Collision__c();

                //map<object, object> dateRange = (map<object, object>) crcMap.get('rvdDateRange');


                string startDtString = (string) crcMap.get('CRC_Start_Date__c');
                string endDtString = (string) crcMap.get('CRC_End_Date__c');

                crc.CRC_Start_Date__c = date.parse(startDtString);

                crc.CRC_End_Date__c = date.parse(endDtString);

                crc.Confirmation_Number__c = enrollment.id;
                crc.RA_CRC_ID__c = string.valueOf((decimal) crcMap.get('RA_CRC_ID__c'));

                crcList.add(crc);
            }

            Schema.SObjectField crcExIdField = Car_Rental_Collision__c.fields.RA_CRC_ID__c;
            Database.upsertResult[] crcUpsertResults = Database.upsert(crcList, crcExIdField, false);

            objectList.put('Car_Rental_Collision__c', crcList);

            for (database.upsertREsult ur : crcUpsertResults){
                if (!ur.isSuccess()) {
                    for (database.error err : ur.getErrors()) {
                        responseObject.IsSuccess = false;
                        responseObject.Message += err.getStatusCode() + '; ' + err.getMessage() + ' from ' + err.getFields() + '\r\n';
                    }
                }
            }


            list<contentnote> notes = new list<contentnote>();
            list<contentdocumentlink> cdls = new list<contentdocumentlink>();

            integer noteNum = 1;
            for (string enote : enrollmentNotes) {

                contentnote cn = new contentnote();
                cn.content = blob.valueOf(enote);
                cn.title = system.now().format('MM/dd/yyyy hh:mm a', userinfo.getTimeZone().getID()) + ' Note ' + string.valueOf(noteNum);
                noteNum++;
                notes.add(cn);
            }
            if (notes.size()>0) insert notes;

            for (contentnote cn : notes) {
                contentdocumentlink cdl = new contentdocumentlink();
                cdl.linkedEntityId = enrollment.id;
                cdl.contentDocumentId = cn.id;
                cdl.shareType = 'I';
                cdls.add(cdl);
            }

            if (cdls.size()>0) insert cdls;


            //insert crcList;
            
            enrollment.Product_Name__c = [select id from product2 where Form_Number__c=: productFormNo Limit 1].Id;

            update enrollment;
            objectList.put('Enrollments__c', new Enrollments__c[] { enrollment });

        }
        
        List<Object> enrl = objectList.get('Enrollments__c');
        System.debug('#### BRANDON #### Enrollment Debug, ID: ' + enrollment.Id + ', Whole thing: ' + enrl);
                      
        responseObject.objectList = objectList;
        return responseObject;
    }
 
    @AuraEnabled
    public static String getStateOfResidency(String zip_code) {                        
        Integer zipCode = integer.valueof(zip_code);
        String stateOfResidency ='';
        List<Zip_Code__c> state = [SELECT Name ,Zip_Code_Range_Start_Formula__c,Zip_Code_Range_End_Formula__c,State__c from Zip_Code__c where Zip_Code_Range_Start_Formula__c <=: zipCode and Zip_Code_Range_End_Formula__c >=: zipCode ];
        if(!state.IsEmpty()){ stateOfResidency = state[0].State__c;}
        return stateOfResidency;       
    }
        
    @AuraEnabled
    public static String getEnZipCon(String recordId) {
    	System.debug(recordId);
    	return [select Zip_Code__c from Enrollments__c WHERE Id = :recordId].Zip_Code__c;
    } 
    
     @AuraEnabled
    public static ResponseObj getEnrollmentDetail(String recordId, String locationNumber, String destinationId, String airlineId, String cruiseLineId, String tourOperatorId) {
        
        System.debug('recordId: '+recordId+' agencyId: '+locationNumber);
        
        Map<String, List<Object>> objectList = new Map<String, List<Object>>();
        
        List<Object> list_itemList = new List<Object>();//[select id, name,List_Type__c, List_Item_Description__c from List_Item__c where List_Item_ID__c =:destinationId OR Name =: airlineId OR Name =:cruiseLineId OR Name =:tourOperatorId];         
        if(destinationId != null) {
            System.debug('%%%% Current listItemList: ' + list_itemList);
            System.debug('%%%% Current Destination Return: ' + [SELECT Id, Name, List_Type__c, List_Item_Description__c, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :destinationId AND List_Type__c = 'Destination' LIMIT 1]);
            for(List_Item__c li : [SELECT Id, Name, List_Type__c, List_Item_Description__c, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :destinationId AND List_Type__c = 'Destination' LIMIT 1]) {
                list_itemList.add(li);
            }
            System.debug('%%%% After listItemList: ' + list_ItemList);
        }
        if(airlineId != null) {
            for(List_item__c li : [SELECT Id, Name, List_Type__c, List_Item_Description__c, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :airlineId AND List_Type__c = 'Airline' LIMIT 1]) {
                list_itemList.add(li);
            }
        }
        if(cruiseLineId != null) {
            for(List_item__c li : [SELECT Id, Name, List_Type__c, List_Item_Description__c, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :cruiseLineId AND List_Type__c = 'Cruiseline' LIMIT 1]) {
                list_itemList.add(li);
            }
        }
        if(tourOperatorId != null) {
            for(List_Item__c li : [SELECT Id, Name, List_Type__c, List_Item_Description__c, List_Item_ID__c FROM List_Item__c WHERE List_Item_ID__c = :tourOperatorId AND List_Type__c = 'Tour Operator' LIMIT 1]) {
                list_itemList.add(li);
            }
        }  
        
        String accountIdentifier = '';
        List<Object> accountObj = null;
        System.debug('*** location num'+locationNumber );
        if(locationNumber == null || locationNumber == ''){
            // Get Account Id on Enrollment and select account
            Enrollments__c enrollment = [select Company_DBA__c FROM Enrollments__c WHERE Id = :recordId];        
            accountObj = [Select Id, name, OwnerId, Location_Number__c, Owner.Name, BillingPostalCode from Account where Id = :enrollment.Company_DBA__c ];
            
            System.debug('*** 1'+enrollment );
            System.debug('*** accountObj '+accountObj );
        }else{           
            accountObj = [Select Id, name, OwnerId, Location_Number__c, Owner.Name, BillingPostalCode from Account where Location_Number__c = :locationNumber];
            System.debug('*** 2'+locationNumber );
        }
             
         
        List<Object> enrollmentObj = [SELECT Id, Record_Status__c, Zip_Code__c FROM Enrollments__c where Id =: recordId];
        
        System.debug('account: '+accountObj);
        System.debug('list_item: '+list_itemList);
        System.debug('enrollment: '+enrollmentObj);
        
        objectList.put('account', accountObj);
        objectList.put('list_item', list_itemList);   
        objectList.put('enrollment', enrollmentObj); 
        
             
        System.debug(Json.serialize(new ResponseObj(true, 'SUCCESS', objectList)));  
              
        return new ResponseObj(true, 'SUCCESS', objectList);        
    } 
             
}