@isTest
private class ContractHelperTest{
    @testSetup
    static void setupTestData() {   

        List<Account> acc = new List<Account>();        
        acc.add(new Account(Name= 'Acme',Status__c = 'Active', Email__c='inquiry@acme.com', Consortium__c='None',Phone='000',Type_s_of_Trips_Primarily_Offered_Type__c='Leisure Travel (flight & hotel)',Annual_Passenger_Movement__c = 1000,of_insured_customers_last_year__c=2,Passengers_who_Accept_insurance__c =1,Avg_trip_cost_per_person__c=1));
        acc.add(new Account(Name= 'Acme2',Status__c = 'Active', Email__c='inquiry@acme2.com',Consortium__c='None',Phone='000',Type_s_of_Trips_Primarily_Offered_Type__c='Leisure Travel (flight & hotel)',Annual_Passenger_Movement__c = 1000,of_insured_customers_last_year__c=2,Passengers_who_Accept_insurance__c =1,Avg_trip_cost_per_person__c=1));
        acc.add(new Account(Name= 'Acme3',Status__c = 'Active', Email__c='inquiry@acme3.com',Consortium__c='None',Phone='000',Type_s_of_Trips_Primarily_Offered_Type__c='Leisure Travel (flight & hotel)',Annual_Passenger_Movement__c = 1000,of_insured_customers_last_year__c=2,Passengers_who_Accept_insurance__c =1,Avg_trip_cost_per_person__c=1));
        insert acc;
        
        List<Contact> cont = new List<Contact>();        
        cont.add(new Contact(firstName= 'John',lastName = 'Smith', email = 'john@smith.com', DS_Role__c='Signer',AccountId = acc[0].id, Contact_Type__c='Primary'));
        
        cont.add(new Contact(firstName= 'Lola',lastName = 'Smith', email = '', DS_Role__c='',AccountId = acc[2].id, Contact_Type__c='Primary'));
        insert cont;        

        List<Opportunity> opp = new List<Opportunity>();        
        opp.add(new Opportunity(Name= 'Acme',
                                AccountId = acc[0].id,
                                StageName = 'Prospecting',
                                Expected_Premium_This_Year__c = 1000000,
                                CloseDate = Date.today()));
        //insert opp;   
        List<RecordType> rt1 =[select id from RecordType where name=:'Group' AND sObjecttype= 'Product2'];
        List<RecordType> rt2 =[select id from RecordType where name=:'Specialty Risk' AND sObjecttype= 'Product2'];
        
        List<Product2> prod = new List<Product2>();        
        prod.add(new Product2(Name = 'Prod Group', IsActive= true,Product_Status__c='Available',recordtypeid=rt1[0].id));
        prod.add(new Product2(Name = 'Prod', IsActive= true,Product_Status__c='Available',Product_Type__c = 'Specialty Risk',recordtypeid=rt2[0].id));
        insert prod;

        List<Asset> assets = new List<Asset >();        
        for(integer i=0; i<12; i++){
            assets.add(new Asset(Name='Group Test'+i,
                                Status = 'Pending Activation',
                                AccountId = acc[0].id,
                                Anticipated_Live_Date__c = Date.Today(),
                                Date_Activated__c = Date.today(),
                                Date_Deactivated__c = Date.today(),
                                Product2id = prod[0].id ));
            assets.add(new Asset(Name='Test'+i,
                                Status = 'Pending Activation',
                                AccountId = acc[1].id,
                                Anticipated_Live_Date__c = Date.Today(),
                                Date_Activated__c = Date.today(),
                                Date_Deactivated__c = Date.today(),
                                Product2id = prod[1].id ));                                
        }    
        insert assets;
    
        List<RecordType> rt3 =[select id from RecordType where name=:'Current Contract'];
        List<Contract> contr = new List<Contract>();        
        contr.add(new Contract(AccountId = acc[0].id,Product_Type__c='Retail',Anticipated_Live_Date__c=date.today(),recordtypeid=rt3[0].id,
                               Status='Draft'));
        contr.add(new Contract(AccountId = acc[1].id,Product_Type__c='Specialty Risk',Anticipated_Live_Date__c=date.today(),recordtypeid=rt3[0].id,
                               Status='Draft'));                               
        insert contr;                
    } 
    //Test pulling all the fields to Contract - Positive Test 
    static testMethod void ContractFieldsAutomationTest() {
        List <Contract> result = [select id,AccountId,DS_AssetProdName1__c,Company_Email__c,Contact_Email__c, DS_RiskSpecial_Note12__c from Contract Where Account.Name=: 'Acme' ]; 

        Test.startTest();
        result[0].DS_RiskSpecial_Note12__c ='random test';
        update result;
        Test.stopTest();
        //Test If Assets info pulled through
        System.assertEquals('Prod',result[0].DS_AssetProdName1__c); 
        
        //Test If Account info pulled through
        System.assertEquals('inquiry@acme.com',result[0].Company_Email__c);         
        
        //Test If Contact info pulled through
        System.assertEquals('john@smith.com',result[0].Contact_Email__c );          
    }  
    
    //Test empty contact validation - Negative Test 
    static testMethod void primaryContactTest() {
        List <Contract> result = [select id,AccountId,DS_AssetProdName1__c,DS_RiskSpecial_Note12__c  from Contract Where Account.Name =: 'Acme2' ]; 

        Test.startTest();
            try{
                    result[0].DS_RiskSpecial_Note12__c ='random test';
                    update result;// ContractHelper.updateDocuSignAssetProductInfo(result,result,result1); 
               }
               catch(Exception ex){                    
                    Boolean expectedExceptionThrown =  ex.getMessage().contains('Required') ? true : false;
                    System.assertEquals(expectedExceptionThrown, true);                    
               }                    
        Test.stopTest();             
    }       
}