public class TIS_FinRollup {
    private final Account acct;    
    public TIS_FinRollup(ApexPages.StandardController stdController) {
        this.acct = (Account)stdController.getRecord();
        //system.debug('id = '+acct.Id);
    }     
    
    public List<Data> getTableData() {
        List<Data> dataCol = new List<Data>();    
        
        Map<String,Map<String,Double>> finMap = new Map<String,Map<String,Double>>();
        
        Set<Integer> allYears = new Set<Integer>();

        for (Integer i = 0; i < 20; i++) {
            allYears.add(System.Today().year() - i);
        }      

		String[] vQuarters = new String[]{'Q1','Q2','Q3','Q4'};
            
                
        List<AggregateResult> FinSums = [
            SELECT finYear__c vYear, finQuarter__c vQuarter, SUM(Premium__c) Premium, Sum(Policy_Count__c) PCount 
			FROM Financial_Summary__c 
            WHERE Agency_Name__r.Id = :acct.Id
            //AND finYear__c in :yearGroup
            GROUP BY finYear__c, finQuarter__c];

        for(Integer i : allYears){
            Integer dYear = i;
            Double dQ1_prem = 0.00;
            Double dQ2_prem = 0.00;
            Double dQ3_prem = 0.00;
            Double dQ4_prem = 0.00;
            Double dYT_prem = 0.00;
            Integer dQ1_count = 0;
            Integer dQ2_count = 0;
            Integer dQ3_count = 0;
            Integer dQ4_count = 0;
            Integer dYT_count = 0;            
        	for (String q : vQuarters){
                for (AggregateResult ar : FinSums) {
                    if(Integer.valueOf(ar.get('vYear')) == i){
                        if(ar.get('vQuarter') == 'Q1'){
                            dQ1_prem = Double.valueOf(ar.get('Premium'));
                            dQ1_count = Integer.valueOf(ar.get('PCount'));
                        }
                        if(ar.get('vQuarter') == 'Q2'){
                            dQ2_prem = Double.valueOf(ar.get('Premium'));
                            dQ2_count = Integer.valueOf(ar.get('PCount'));
                        }
                        if(ar.get('vQuarter') == 'Q3'){
                            dQ3_prem = Double.valueOf(ar.get('Premium'));
                            dQ3_count = Integer.valueOf(ar.get('PCount'));
                        }
                        if(ar.get('vQuarter') == 'Q4'){
                            dQ4_prem = Double.valueOf(ar.get('Premium'));
                            dQ4_count = Integer.valueOf(ar.get('PCount'));
                        }                    
                    }
                }
            }
            dYT_prem = dQ1_prem + dQ2_prem + dQ3_prem + dQ4_prem;
            dYT_count = dQ1_count + dQ2_count + dQ3_count + dQ4_count;
            system.debug('Year = '+dYear+' | Q1 Prem = '+dQ1_prem+' | Q1 Count = '+dQ1_Count);
            if (dYT_prem != 0.00 && dYT_count != 0){
            	dataCol.add(new Data(dYear, dQ1_prem, dQ2_prem, dQ3_prem, dQ4_prem, dYT_prem, dQ1_Count, dQ2_Count, dQ3_Count, dQ4_Count, dYT_Count));
            }
        }
        return dataCol;
    }
    
    // Wrapper class
    public class Data {
        public Integer year { get; set; }
        public Double Q1_Prem { get; set; }
        public Double Q2_Prem { get; set; }
        public Double Q3_Prem { get; set; }
        public Double Q4_Prem { get; set; }
        public Double YT_Prem { get; set; }        
        public Integer Q1_Count { get; set; }
        public Integer Q2_Count { get; set; }
        public Integer Q3_Count { get; set; }
		public Integer Q4_Count { get; set; }
        public Integer YT_Count { get; set; }

        public Data(Integer year, Double Q1_Prem, Double Q2_Prem, Double Q3_Prem, Double Q4_Prem, Double YT_Prem, Integer Q1_Count, Integer Q2_Count, Integer Q3_Count, Integer Q4_Count, Integer YT_Count) {
            this.year = year;
            this.Q1_Prem = Q1_Prem;
            this.Q2_Prem = Q2_Prem;
            this.Q3_Prem = Q3_Prem;
            this.Q4_Prem = Q4_Prem;
            this.YT_Prem = YT_Prem; 
            this.Q1_Count = Q1_Count;
            this.Q2_Count = Q2_Count;
            this.Q3_Count = Q3_Count;
            this.Q4_Count = Q4_Count;
            this.YT_Count = YT_Count;            
        }
    }
}