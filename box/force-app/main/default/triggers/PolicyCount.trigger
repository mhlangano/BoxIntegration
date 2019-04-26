trigger PolicyCount on Policy_Count__c (before insert, before update) {

    if(trigger.isBefore){
        
        //Loop thru the Collection of all Fin Hist in this trigger and get the associated Accounts
        set<id> accountIds = new set< Id >();
        for( Policy_Count__c pc : trigger.new ){
            accountIds.add( pc.Account__c );
        }   
        //Get all of the Fin Hist related to the Accounts   
        list< Policy_Count__c > polCt_List = [Select Id, Account__c, Year__c,
                                                        January__c,
                                                        February__c,
                                                        March__c,
                                                        April__c,
                                                        May__c,
                                                        June__c,
                                                        July__c,
                                                        August__c,
                                                        September__c,
                                                        October__c,
                                                        November__c,
                                                        December__c,
                                                        //Quarterly
                                                        First_Quarter__c,
                                                        Second_Quarter__c,
                                                        Third_Quarter__c,
                                                        Fourth_Quarter__c,
                                                        //Annual
                                                        Year_To_Date__c
                                                        From Policy_Count__c
                                                        WHERE Account__c IN :accountIds];
        
        //Map of the Account ID and a map of the Year and Policy_Count__c it relates to
        map< id, map< decimal, Policy_Count__c > > PolCount_Map = new map< id, map< decimal, Policy_Count__c > >();
        
        //Lop through all of the related Pol Count we querried for
        for ( Policy_Count__c pc :polCt_List ) {
            //Instanciate the inner map first mapping the year to the Pol Count it belongs to           
            map< decimal, Policy_Count__c > iterPolCount_Map = new map< decimal,Policy_Count__c >();
            
            if( PolCount_Map.containsKey( pc.Account__c ) ){
                iterPolCount_Map = PolCount_Map.get(pc.Account__c);
            }
            
            //Add the Pol Count to the inner map
            
            iterPolCount_Map.put( pc.Year__c, pc );
            //Add the inner map and its parent account mapping to the outer map.
            PolCount_Map.put( pc.Account__c, iterPolCount_Map );
        }

        // Read through trigger rec's and update the Delta's...
        for( Policy_Count__c pc :trigger.new ){
            //Map of the year value and the Policy_Count__c record it relates to
            map< decimal, Policy_Count__c > yearPC_Map = new map< decimal, Policy_Count__c >();
            
            if ( PolCount_Map.containsKey( pc.Account__c ) ) {
                yearPC_Map = PolCount_Map.get( pc.Account__c );
                decimal yearLess1 = pc.Year__c - 1;
                
                if ( yearPC_Map.containsKey( yearLess1 ) ) {
                    //Monthly
                    pc.Previous_January__c = yearPC_Map.get( yearLess1 ).January__c;
                    pc.Previous_February__c = yearPC_Map.get( yearLess1 ).February__c;
                    pc.Previous_March__c = yearPC_Map.get( yearLess1 ).March__c;
                    pc.Previous_April__c = yearPC_Map.get( yearLess1 ).April__c;
                    pc.Previous_May__c = yearPC_Map.get( yearLess1 ).May__c;
                    pc.Previous_June__c = yearPC_Map.get( yearLess1 ).June__c;
                    pc.Previous_July__c = yearPC_Map.get( yearLess1 ).July__c;
                    pc.Previous_August__c = yearPC_Map.get( yearLess1 ).August__c;
                    pc.Previous_September__c = yearPC_Map.get( yearLess1 ).September__c;
                    pc.Previous_October__c = yearPC_Map.get( yearLess1 ).October__c;
                    pc.Previous_November__c = yearPC_Map.get( yearLess1 ).November__c;
                    pc.Previous_December__c = yearPC_Map.get( yearLess1 ).December__c;
                    //Quarterly
                    pc.previous_QTR1__c = yearPC_Map.get( yearLess1 ).First_Quarter__c;
                    pc.previous_QTR2__c = yearPC_Map.get( yearLess1 ).Second_Quarter__c;
                    pc.previous_QTR3__c = yearPC_Map.get( yearLess1 ).Third_Quarter__c;
                    pc.previous_QTR4__c = yearPC_Map.get( yearLess1 ).Fourth_Quarter__c;
                    //Annual
                    pc.Previous_Year__c = yearPC_Map.get( yearLess1 ).Year_To_Date__c;
                    
                }
            }
        }
    }
}