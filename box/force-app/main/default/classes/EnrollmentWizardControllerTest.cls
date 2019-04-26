@isTest
public class EnrollmentWizardControllerTest{

    @testSetup static void setup() {
    
        String agencyRt = [select id,name,developername, sobjectType from recordtype where developername ='Agency' and sobjectType ='Account'].Id;
        // Create common test accounts





        List<Account> accList = new List<Account>();
        for(Integer i=0;i<1;i++) {
            accList.add(new Account(Name = 'CULTURAL CONNECTIONS GROUP TOURS', 
            recordTypeId = agencyRt, 
            Consortium__c = 'None',
            Account_Type__c ='Tour Operator',
            Status__c = 'Active',
            Phone = '0000000000',
            RA_Account_Type__c = 'Agency - Group; Agency - Retail',
            FEIN__c= '82-0574562',
            Business_Type__c = 'Corporation',
            Licensing_Model__c = 'License & Registration',
            Legal_Entity_Name__c = 'GROUP TOURS INC',
            Agency_Email_Address__c= 'laura.dunlap@travelexinsurance.com',
            Location_Number__c = '32-6016',
            Site = '32-6016',
            BillingState ='Wisconsin',
            BillingCountry = 'United States'));
        }
        insert accList; 
        
        List<Enrollments__c> enrollTest = new List<Enrollments__c>();
        enrollTest.add(new Enrollments__c(
        Company_DBA__c=accList[0].Id,
        Name='TSB00001',
        confirmation_number__c = '000000',
        Record_status__c = 'Enrollment'
        ));
        Insert enrollTest; 
        
        String firstEnrollId =  enrollTest[0].id;  
        
        Car_Rental_Collision__c crc = new Car_Rental_Collision__c(Confirmation_Number__c=firstEnrollId, Car_Rental_Collision_Cost__c= 9.00, CRC_End_Date__c = date.valueOf(system.today()+1), Name= 'Chev Aveo', CRC_Start_Date__c = date.valueOf(system.today())); 
        insert crc;   
        
        Product2 prod = new Product2(Name = 'Partner Advantage Post Departure',
            
                                     Product_Status__c = 'Available',
                                     
                                     Plan__c = 'PAPD-1117',
                                     Rating__c = 'Standard',
                                     Trip_Cost_Limit__c = 0,
                                     Remittance__c = 'Purchase Date',
                                     Product_Type__c = 'Retail',
                                     Product_Script__c = 'Purchase Limitations',
                                     Delivery_Script__c = 'Once the payment is complete',
                                     Restriction_Script__c = 'Base Plan',
                                     ProductCode = 'PAPD-1117',
                                     Form_Number__c = 'PAPD-1117',
                                     IsActive = true,
                                     RA_ProductID__c = '10194');
        insert prod;
        
        Id pricebookId = Test.getStandardPricebookId();
        
        PricebookEntry pbEntry = new PricebookEntry(Pricebook2Id = pricebookId,product2Id = prod.Id, isActive = true, UnitPrice = 1000);
        insert pbEntry;     
        
        //Create Travelers
        List<Traveler__c> travelers = new List<Traveler__c>();
        travelers.add(new Traveler__c(Enrollment__c= enrollTest.get(0).Id, Is_Primary__c=true, First_Name__c = 'Laura', Last_Name__c ='Dunlap', name='Laura Dunlap',Date_of_Birth__c=date.valueOf('1991-01-29'), Trip_Cost__c = 1000 ));
        insert travelers;
        

        //Create Transactions               
        List<Policy_Transaction__c> transactions = new List<Policy_Transaction__c>();
        transactions.add(new Policy_Transaction__c(Enrollment__c=enrollTest.get(0).Id,Check_Number__c='1234566',ra_payment_id__c='12345',Status__c='Complete',Total__c=25, Amount__c = 25, Payment_Type__c ='Visa') );
        insert transactions; 
        
        //Create upgrades
        
        //Create CRCDates
        
        //Insert List Item
        List<List_Item__c> item = new List<List_Item__c>();
        item.add(new List_Item__c(List_Item_ID_Ext__c='1_456', Name='456',List_Type__c = 'Airline', List_Item_Description__c='Zip',Status__c='Active'));        
        item.add(new List_Item__c(List_Item_ID_Ext__c='3_1898', Name='1898',List_Type__c = 'Tour Operator', List_Item_Description__c='Symphonic Voyages Inc',Status__c='Active',Underwriter__c ='Berkshire Hathaway Specialty Insurance',List_Alert_Type_Effective_Date__c = date.valueOf('2011-01-19'), List_Alert_Type__c = 'Business Decision'));
        item.add(new List_Item__c(List_Item_ID_Ext__c='4_1376', Name='1376',List_Type__c = 'Destination', List_Item_Description__c='Japan',Status__c='Active'));        
        item.add(new List_Item__c(List_Item_ID_Ext__c='2_2', Name='2',List_Type__c = 'Cruiseline', List_Item_Description__c='Cruise',Status__c='Active'));
        insert item;
        
        List<Airport_Locations__c> airports = new List<Airport_Locations__c>();
        airports.add(new Airport_Locations__c(Name='EL MINYA',Airport_Code__c='EMY',Airport_Country__c='Egypt'));
        airports.add(new Airport_Locations__c(Name='ENID VANCE AFB',Airport_Code__c='END',Airport_Country__c='United States'));
        insert airports;
    }
    
    @isTest static void testEnrollment() {
        Enrollments__c enroll = [SELECT Id, Location_Number__c, confirmation_number__c,Record_status__c FROM Enrollments__c WHERE Name='TSB00001' LIMIT 1];
        Product2 prod = [Select id, Form_Number__c from Product2 where Form_Number__c = 'PAPD-1117'];
        List<Traveler__c> travelers = [select id, First_Name__c,Last_Name__c,Enrollment__c ,name,State__c,Is_Primary__c, RA_Traveler_ID__c from Traveler__c where Enrollment__c =: enroll.id];
        
        EnrollmentWizardController.getEnrollment(enroll.id, true);
        EnrollmentWizardController.getEnrollment(enroll.id, false);
        EnrollmentWizardController.findCRC(enroll.id);
        EnrollmentWizardController.getBaseUrl();
        EnrollmentWizardController.getselectOptions(new Account(), 'Account_Type__c');
        EnrollmentWizardController.getAccountByLocation(enroll.Location_Number__c);
        EnrollmentWizardController.getPlanScripts(prod.Form_Number__c);
        
        EnrollmentWizardController.getStateOfResidency('90001');
        EnrollmentWizardController.getEnrollmentDetail(enroll.id, '32-6016','1376','456','2','1898');

        map<object, object> upgradesMap = new map<object, object>();
        upgradesMap.put('upgradeID', 1);
        
        List<Object> upgrades = new object[] {upgradesMap};
        
        List<Object> CRCDates = new List<Object>();

        map<object, object> transactionMap = new map<object, object>();
        transactionMap.put('paymentId', 12345);
        transactionMap.put('amount', 55);
        transactionMap.put('authorizationNumber', '1234');
        transactionMap.put('cardHolderName', 'Test User');
        transactionMap.put('checkNumber', '11223344');
        transactionMap.put('expirationMonth', 5);
        transactionMap.put('expirationYear', 2040);
        transactionMap.put('paymentStatus', 'Complete');
        transactionMap.put('paymentType', 'Cash');

        List<Object> transactions = new object[] {transactionMap};        
        
        List<string> enrollmentNotes = new List<string>();
        enrollmentNotes.add('test');
        
        EnrollmentWizardController.saveEnrollmentRecords(enroll, prod.Form_Number__c ,travelers , transactions,upgrades ,CRCDates,enrollmentNotes);

        // 
        map<object, object> upgradesMap10 = new map<object, object>();
        upgradesMap10.put('upgradeID', 10);
        List<Object> upgrades10 = new object[] {upgradesMap10};
        EnrollmentWizardController.saveEnrollmentRecords(enroll, prod.Form_Number__c ,travelers , transactions,upgrades10 ,CRCDates,enrollmentNotes);

        map<object, object> upgradesMap13 = new map<object, object>();
        upgradesMap10.put('upgradeID', 13);
        List<Object> upgrades13 = new object[] {upgradesMap10};
        EnrollmentWizardController.saveEnrollmentRecords(enroll, prod.Form_Number__c ,travelers , transactions,upgrades13 ,CRCDates,enrollmentNotes);
        
        map<object, object> upgradesMap16 = new map<object, object>();
        upgradesMap10.put('upgradeID', 16);
        List<Object> upgrades16 = new object[] {upgradesMap10};
        EnrollmentWizardController.saveEnrollmentRecords(enroll, prod.Form_Number__c ,travelers , transactions,upgrades16 ,CRCDates,enrollmentNotes);
        
        map<object, object> upgradesMap18 = new map<object, object>();
        upgradesMap10.put('upgradeID', 18);
        List<Object> upgrades18 = new object[] {upgradesMap10};
        EnrollmentWizardController.saveEnrollmentRecords(enroll, prod.Form_Number__c ,travelers , transactions,upgrades18 ,CRCDates,enrollmentNotes);
                        
        customLookUpController.fetchDistinctRecord('Name','Account','CULTURAL CONNECTIONS GROUP TOURS');
        customLookUpController.fetchLookUpValues('32-6016','Account','name');
        customLookUpController.fetchLookUpValues('Japan','Enrollments__c','Destination__c');
        customLookUpController.fetchLookUpValues('Zip','Enrollments__c','Airline__c');
        customLookUpController.fetchLookUpValues('Cruise','Enrollments__c','Cruise_Line__c');
        customLookUpController.fetchLookUpValues('Symphonic Voyages Inc','Enrollments__c','Tour_Operator__c');
        customLookUpController.fetchLookUpValues('EMY','Enrollments__c','Departing_Airport__c');                                       
    }


}