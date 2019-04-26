trigger Financial_Histories on Financial_Histories__c (before insert, before update) {

    if(trigger.isBefore){
        
        
        //Loop thru the Collection of all Fin Hist in this trigger and get the associated Accounts
        set<id> accountIds = new set< Id >();
        for( Financial_Histories__c fh : trigger.new ){
            accountIds.add( fh.Account__c );
        }   
        //Get all of the Fin Hist related to the Accounts   
        list<Financial_Histories__c> finHistories = [Select Id, Account__c, Amount01__c, 
                                                            Amount02__c, Amount03__c, Amount04__c, Amount05__c, Amount06__c, Amount07__c, Amount08__c, 
                                                            Amount09__c, Amount10__c, Amount11__c, Amount12__c, Amount_QTR1__c, Amount_QTR2__c, 
                                                            Amount_QTR3__c, Amount_QTR4__c, Amount_Type__c, Amount_YTD__c, Year_Ending_Date__c, Year__c 
                                                        From Financial_Histories__c
                                                        WHERE Account__c IN :accountIds];
        
        //Map of the Account ID and a map of the Year and Fin Hist it relates to
        map< id, map< decimal, Financial_Histories__c > > finHistMap = new map< id, map< decimal, Financial_Histories__c > >();
        
        //Lop through all of the related Fin Hist we querried for
        for ( Financial_Histories__c fh :finHistories ) {
            //Instanciate the inner map first mapping the year to the Fin Hist it belongs to            
            map< decimal, Financial_Histories__c > iterFinHistMap = new map< decimal,Financial_Histories__c >();
            
            if( finHistMap.containsKey( fh.Account__c ) ){
                iterfinHistMap = finHistMap.get(fh.Account__c);
            }
            
            //Add the Fin Hist to the inner map
            
            iterFinHistMap.put( fh.Year__c,fh );
            //Add the inner map and its parent account mapping to the outer map.
            finHistMap.put( fh.Account__c, iterFinHistMap );
        }
        system.debug('Map Size: '+finHistMap.size() );
        system.debug('Map: ' + finHistMap);
        // Read through trigger rec's and update the Delta's...
        for( Financial_Histories__c fh :trigger.new ){
            //Map of the year value and the Fin Hist record it relates to
            map< decimal,Financial_Histories__c > iterFinHistMap = new map< decimal, Financial_Histories__c >();
            
            if ( finHistMap.containsKey( fh.Account__c ) ) {
                iterFinHistMap = finHistMap.get( fh.Account__c );
                decimal yearLess1 = fh.Year__c - 1;
                
                if ( iterFinHistMap.containsKey( yearLess1 ) ) {
                    //Monthly
                    fh.Previous_01__c = iterFinHistMap.get( yearLess1 ).Amount01__c;
                    fh.Previous_02__c = iterFinHistMap.get( yearLess1 ).Amount02__c;
                    fh.Previous_03__c = iterFinHistMap.get( yearLess1 ).Amount03__c;
                    fh.Previous_04__c = iterFinHistMap.get( yearLess1 ).Amount04__c;
                    fh.Previous_05__c = iterFinHistMap.get( yearLess1 ).Amount05__c;
                    fh.Previous_06__c = iterFinHistMap.get( yearLess1 ).Amount06__c;
                    fh.Previous_07__c = iterFinHistMap.get( yearLess1 ).Amount07__c;
                    fh.Previous_08__c = iterFinHistMap.get( yearLess1 ).Amount08__c;
                    fh.Previous_09__c = iterFinHistMap.get( yearLess1 ).Amount09__c;
                    fh.Previous_10__c = iterFinHistMap.get( yearLess1 ).Amount10__c;
                    fh.Previous_11__c = iterFinHistMap.get( yearLess1 ).Amount11__c;
                    fh.Previous_12__c = iterFinHistMap.get( yearLess1 ).Amount12__c;
                    //Quarterly
                    fh.previous_QTR1__c = iterFinHistMap.get( yearLess1 ).Amount_QTR1__c;
                    fh.previous_QTR2__c = iterFinHistMap.get( yearLess1 ).Amount_QTR2__c;
                    fh.previous_QTR3__c = iterFinHistMap.get( yearLess1 ).Amount_QTR3__c;
                    fh.previous_QTR4__c = iterFinHistMap.get( yearLess1 ).Amount_QTR4__c;
                    //Annual
                    fh.Previous_Year__c = iterFinHistMap.get( yearLess1 ).Amount_YTD__c;
                }
            }
        }
    
        
        
        
        
        
        /*
        set< Id > accountIDs_Set = new set< Id >();
        list< Financial_Histories__c > finHist_List = new list< Financial_Histories__c >();
        //Loop thru the Collection of all Fin Hist in this trigger and get the associated Accounts
        for(Financial_Histories__c fh : trigger.new){
            accountIDs_Set.add( fh.Account__c );
        }   
        //Get all of the Fin Hist related to the Accounts   
        finHist_List = [Select Id, Account__c, Amount01__c, 
                          Amount02__c, Amount03__c, Amount04__c, Amount05__c, Amount06__c, Amount07__c, Amount08__c, 
                          Amount09__c, Amount10__c, Amount11__c, Amount12__c, Amount_QTR1__c, Amount_QTR2__c, 
                          Amount_QTR3__c, Amount_QTR4__c, Amount_Type__c, Amount_YTD__c, Year_Ending_Date__c, Year__c 
                          From Financial_Histories__c
                          WHERE Account__c IN :accountIDs_Set];
                          


                                  
        //Set the "Previous" values of the Fin Hist in this triger based on the relared Previous Years Fin Hist
        for( Financial_Histories__c fh : trigger.new ){
            // Get Prior Year for the difference...
            for( Financial_Histories__c sub : finHist_List ){
                if(fh.Account__c == sub.Account__c && ( fh.Year__c - 1 ) == sub.Year__c ){
                    //Monthly Data
                    fh.Previous_01__c = sub.Amount01__c;
                    fh.Previous_02__c = sub.Amount02__c;
                    fh.Previous_03__c = sub.Amount03__c;
                    fh.Previous_04__c = sub.Amount04__c;
                    fh.Previous_05__c = sub.Amount05__c;
                    fh.Previous_06__c = sub.Amount06__c;
                    fh.Previous_07__c = sub.Amount07__c;
                    fh.Previous_08__c = sub.Amount08__c;
                    fh.Previous_09__c = sub.Amount09__c;
                    fh.Previous_10__c = sub.Amount10__c;
                    fh.Previous_11__c = sub.Amount11__c;
                    fh.Previous_12__c = sub.Amount12__c;
                    //Quarterly Data
                    fh.previous_QTR1__c = sub.Amount_QTR1__c;
                    fh.previous_QTR2__c = sub.Amount_QTR2__c;
                    fh.previous_QTR3__c = sub.Amount_QTR3__c;
                    fh.previous_QTR4__c = sub.Amount_QTR4__c;
                    //Annual Data
                    fh.Previous_Year__c = sub.Amount_YTD__c;
                }
            }
        }
        */
    }
}