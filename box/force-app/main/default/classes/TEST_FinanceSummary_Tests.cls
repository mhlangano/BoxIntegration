@isTest
//@isTest(SeeAllData=True)
public class TEST_FinanceSummary_Tests {
	
    static testMethod void RollupTest2() {

		List<Integer> vYears = new List<Integer>{System.Today().year(), System.Today().year()-1, System.Today().year()-2};        
        List<Integer> vMonths = new List<Integer>{1,2,3,4,5,6,7,8,9,10,11,12};
		List<Financial_Summary__c> lFinSum = new List<Financial_Summary__c>{};
        
        
        //Create New Account
    	Account Acct = new Account();
        Acct.Name = 'EW-TEST2';
        Acct.Location_Number__c = 'EW-TEST2';
        insert Acct;
        
        //Create New Product
        Product2 Prod = new Product2();
        Prod.Name = 'Flight Insure Plus - Single Trip';
        Prod.ProductCode = 'SFS-0911';
        Prod.Form_Number__c = 'SFS-0911';
        Prod.RA_ProductID__c = '179';
        Prod.Description = 'Flight Insure Plus - Single Trip';
        insert Prod;
        
        //Create Product Commission
        Product_Commission__c ProdCom = new Product_Commission__c();
        ProdCom.Form_Number__c = 'SFS-0911';
        ProdCom.UniqueIDbyAcct__c = 'EW-TEST2-SFS-0911';
        ProdCom.Account_Name__c = Acct.Id;
        insert ProdCom;
        
        //Create 1 Financial Summary for each Month / Year for the last 3 years. 
        for(Integer vYear : vYears){
            Double vPremium = 5.00;
            Integer vCount = 1;
            for(Integer vMonth : vMonths){
                Date myDate = date.newinstance(vYear, vMonth, 1);
                Financial_Summary__c FinSum = new Financial_Summary__c();
                FinSum.Name = 'EW-TEST2';
                FinSum.Month_Of__c = myDate;
                FinSum.Policy_Count__c = 1;
                FinSum.Agency_Name__c = Acct.Id;
                FinSum.Form_Number__c = 'SFS-0911';
                FinSum.Product_Name__c = Prod.Id;
                FinSum.FSID__c = '00-1359-SFS-0911'+vYear+'-'+vMonth;
                FinSum.Product_Commission__c = ProdCom.Id;
                FinSum.Report_Year__c = vYear;
                FinSum.Report_Month__c = vMonth;
                FinSum.Premium__c = vPremium;
                FinSum.Policy_Count__c = vCount;
                lFinSum.add(FinSum);
                vPremium++;
                vCount++;
            }
        }    
        
        test.startTest();
        Insert lFinSum;
        
        test.stopTest();        
        
    }
    
    
    //static testMethod void RollupTest() {
        /*
        List<ID> PCs = new List<ID>();
        for (Product_Commission__c p : [SELECT Account_Name__c, Id FROM Product_Commission__c where Account_Name__c = '0013000001CaO3o']){
            system.debug('id = '+p.Id);
            PCs.add(p.Id);    
        }
        TIS_Utility.processRecords(PCs);
    	
        List<ID> Accts = new List<ID>();

    	//SELECT Id FROM Account WHERE id IN (SELECT Account_Name__c FROM Product_Commission__c) limit 25
    	//SELECT Id FROM Account Limit 25
        for (Account A : [SELECT Id FROM Account WHERE id IN (SELECT Account_Name__c FROM Product_Commission__c) limit 200]){
            //system.debug('id = '+a.Id);
            Accts.add(a.Id);    
        }
        
        List<ID> PCs = new List<ID>();
        for (Product_Commission__c p : [SELECT Account_Name__c, Id FROM Product_Commission__c where Account_Name__c in :Accts]){
            system.debug('id = '+p.Id);
            PCs.add(p.Id);    
        }
        TIS_Utility.Financial_Summary_Rollup(PCs);
		*/
    //}
}