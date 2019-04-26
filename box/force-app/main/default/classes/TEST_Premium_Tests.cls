@isTest(seealldata=true)
public class TEST_Premium_Tests {

    static testMethod void FinChart_Test(){
        Integer currentYear = System.Today().year();
        Integer minus1Year = System.Today().year() - 1;
        Integer minus2Year = System.Today().year() - 2;
        List<Financial_Summary__c> fsList = new List<Financial_Summary__c>();
        List<String> yearGroup = new List<String>{String.valueOf(currentYear),String.valueOf(minus1year),String.valueOf(minus2year)};
        String[] lMonths = new String[]{'1','2','3','4','5','6', '7','8','9','10','11','12'};                    
        
        //Create Account for Testing    
        Account acct = new Account(name='Test', Location_Number__c = '98-1234');
        Insert acct;
        
        //Create a Product on the Account so FinSummary can link to it. 
        Product_Commission__c ProdComm = new Product_Commission__c(Name='Travel Select', 
            Account_Name__c = acct.Id,
            UniqueIDbyAcct__c = '98-1234-TTS-SIG-0814');
        insert ProdComm;
        
        // Loop, create and add new Financial Summaries to a List for Insert.     
        for(String y : yearGroup){
            for(string m : lMonths){
                Financial_Summary__c fs = 
                    new Financial_Summary__c(
                        Name='fs'+m+'-'+y, 
                        Agency_Name__c = acct.Id,
                        Report_Month__c = Decimal.ValueOf(m),
                        Report_Year__c = Decimal.ValueOf(y), 
                        Premium__c = 100.00,
                        //Product_Commission__c = '98-1234-TTS-SIG-0814'
                        Product_Commission__c = ProdComm.Id
                );
                fsList.add(fs);
                
            }
        }    
        insert fsList;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////
        //Start testing
        test.startTest();
        
        apexPages.Standardcontroller ctrl = new apexPages.Standardcontroller( acct );
        TIS_FinChart FinChart = new TIS_FinChart( ctrl );
        FinChart.getChartData();
        
        test.stopTest();

    }

    static testMethod void FinRollup_Test(){
        Integer currentYear = System.Today().year();
        Integer minus1Year = System.Today().year() - 1;
        Integer minus2Year = System.Today().year() - 2;
        List<Financial_Summary__c> fsList = new List<Financial_Summary__c>();
        List<String> yearGroup = new List<String>{String.valueOf(currentYear),String.valueOf(minus1year),String.valueOf(minus2year)};
        String[] lMonths = new String[]{'1','2','3','4','5','6', '7','8','9','10','11','12'};                    
        
        //Create Account for Testing    
        Account acct1 = new Account(name='Test', Location_Number__c = '97-1234');
        Insert acct1;
        
        //Create a Product on the Account so FinSummary can link to it. 
        Product_Commission__c ProdComm = new Product_Commission__c(Name='Travel Select', 
            Account_Name__c = acct1.Id,
            UniqueIDbyAcct__c = '97-1234-TTS-SIG-0814');
        insert ProdComm;
        
        // Loop, create and add new Financial Summaries to a List for Insert.     
        for(String y : yearGroup){
            for(string m : lMonths){
                Financial_Summary__c fs = 
                    new Financial_Summary__c(
                        Name='fs'+m+'-'+y, 
                        Agency_Name__c = acct1.Id,
                        Report_Month__c = Decimal.ValueOf(m),
                        Report_Year__c = Decimal.ValueOf(y), 
                        Premium__c = 100.00,
                        Policy_Count__c = Integer.valueOf(m),
                        //Product_Commission__c = '98-1234-TTS-SIG-0814'
                        Product_Commission__c = ProdComm.Id
                );
                fsList.add(fs);
                
            }
        }    
        insert fsList;
        
        ////////////////////////////////////////////////////////////////////////////////////////////////
        //Start testing
        test.startTest();
        
        apexPages.Standardcontroller ctrl = new apexPages.Standardcontroller( acct1 );
        TIS_FinRollup FinRollup = new TIS_FinRollup( ctrl );
        FinRollup.getTableData();
        
        test.stopTest();

    }    
}