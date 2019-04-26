global class TIS_FinanceRollups implements Database.batchable<sObject>{ 
    String query;
    global Database.QueryLocator start(Database.BatchableContext ctx) { 
        //query = 'Select ID from Account';
        //if(Test.isRunningTest())
        //{
        //    query += ' Limit 10';
        //}
        return Database.getQueryLocator(query); 
    }     
    
    global void execute(Database.BatchableContext ctx, List<Product_Commission__c> scope){
    	//List<Account> pcs = (List<Account>) scope;    
        //Delete pcs;
        Set<Id> pcIDs = new Set<Id>();
		Map<Id, Double> CY_Q1 = new Map<Id, Double>();
		Map<Id, Double> CY_Q2 = new Map<Id, Double>();
        Map<Id, Double> CY_Q3 = new Map<Id, Double>();
        Map<Id, Double> CY_Q4 = new Map<Id, Double>();
        
        Map<Id, Double> CY_H1 = new Map<Id, Double>();
        Map<Id, Double> CY_H2 = new Map<Id, Double>();
        
        Map<Id, Double> YTD_CY = new Map<Id, Double>();
        Map<Id, Double> YTD_LY = new Map<Id, Double>();
        Map<Id, Double> YTD_2Y = new Map<Id, Double>();        
        
        
        integer currentYear;
    	integer minus1Year;
    	integer minus2Year;
        
        currentYear = System.Today().year();
        minus1Year = System.Today().year() - 1;
        minus2Year = System.Today().year() - 2;        
        
        for(Product_Commission__c pc : scope){
            pcIDs.add(pc.Id); 
        }
        
        
        list<Financial_Summary__c> finSum = [
            SELECT Id, Product_Commission__c, Premium__c, Report_Month__c, Report_Year__c 
            FROM Financial_Summary__c 
            WHERE Product_Commission__c in :pcIds];
        
       
        for(Financial_Summary__c f : finSum){
            //Current Year Calculations
            system.debug('fs = '+f.Id);
            if(f.Report_Year__c == currentYear){
                system.debug('year = '+f.Report_Year__c);
                if(f.Report_Month__c == 1 || f.Report_Month__c == 2 || f.Report_Month__c == 3){                   
                    if(CY_Q1.containsKey(f.Product_Commission__c)){
                        CY_Q1.put(f.Product_Commission__c, CY_Q1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
						CY_Q1.put(f.Product_Commission__c, f.Premium__c);
                    }
                }
                if(f.Report_Month__c == 4 || f.Report_Month__c == 5 || f.Report_Month__c == 6){
                    if(CY_Q2.containsKey(f.Product_Commission__c)){
                        CY_Q2.put(f.Product_Commission__c, CY_Q2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
						CY_Q2.put(f.Product_Commission__c, f.Premium__c);
                    }
                }                
                if(f.Report_Month__c == 7 || f.Report_Month__c == 8 || f.Report_Month__c == 9){
                    if(CY_Q3.containsKey(f.Product_Commission__c)){
                        CY_Q3.put(f.Product_Commission__c, CY_Q3.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
						CY_Q3.put(f.Product_Commission__c, f.Premium__c);
                    }
                }                
                if(f.Report_Month__c == 10 || f.Report_Month__c == 11 || f.Report_Month__c == 12){
                    if(CY_Q4.containsKey(f.Product_Commission__c)){
                        CY_Q4.put(f.Product_Commission__c, CY_Q4.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
						CY_Q4.put(f.Product_Commission__c, f.Premium__c);
                    }
                }                               
            }
			
            //Last Year Calculations
            if(f.Report_Year__c == minus1Year){
                system.debug('year = '+f.Report_Year__c);

            }
            
            //Last 2 Year Calculations
            if(f.Report_Year__c == minus2Year){
                system.debug('year = '+f.Report_Year__c);

            }            
             
        }
        
        
        for(Product_Commission__c pc : scope){
            pc.Q1_CY__c = CY_Q1.get(pc.ID);
            pc.Q2_CY__c = CY_Q2.get(pc.ID);
            pc.Q3_CY__c = CY_Q3.get(pc.ID);
            pc.Q4_CY__c = CY_Q4.get(pc.ID);              
        }        
        
        update scope;        
        
        
    }     
    
    global void finish(Database.BatchableContext ctx){     
        
    } 
}