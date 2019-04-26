public class TIS_FinChart {
    private final Account acct;   
    public integer currentYear  {get;set;}
    public integer minus1Year   {get;set;}
    public integer minus2Year   {get;set;}
 
    public TIS_FinChart(ApexPages.StandardController stdController) {
        this.acct = (Account)stdController.getRecord();
        //system.debug('id = '+acct.Id);
    }     
    
    public List<Data> getChartData() {
        List<Data> data = new List<Data>();       
        currentYear = System.Today().year();
        minus1Year = System.Today().year() - 1;
        minus2Year = System.Today().year() - 2;
        List<String> yearGroup = new List<String>{String.valueOf(currentYear),String.valueOf(minus1year),String.valueOf(minus2year)};
        String[] vMonths = new String[]{'January','February','March','April','May','June', 'July','August','September','October','November','December'};
                
        List<AggregateResult> FinSums = [
            SELECT finYear__c vYear, finMonth__c vMonth, SUM(Premium__c) Premium, Sum(Policy_Count__c) PCount 
            FROM Financial_Summary__c 
            WHERE Agency_Name__r.Id = :acct.Id
            AND finYear__c in :yearGroup
            GROUP BY finYear__c, finMonth__c];
        
        //system.debug('size of list '+ FinSums.size());
        
        for (String m : vMonths){
            Double curYear = 0.00;
            Double lstYear = 0.00;
            Double lst2Year = 0.00;
            for (AggregateResult ar : FinSums) { 
                if(m == ar.get('vMonth')){
                    if(Double.valueOf(ar.get('vYear')) == CurrentYear){
                        curYear = curYear+ Double.valueOf(ar.get('Premium'));
                    }
                    if(Double.valueOf(ar.get('vYear')) == minus1Year){
                        lstYear = lstYear+ Double.valueOf(ar.get('Premium'));
                    }
                    if(Double.valueOf(ar.get('vYear')) == minus2Year){
                        lst2Year = lst2Year+ Double.valueOf(ar.get('Premium'));
                    }
                }
                
            }
            //system.debug('Month = '+m+' | Current Year = '+curYear+' | Last Year = '+lstYear+' | Last 2 year = '+lst2Year);
            data.add(new Data(m.Left(3), curYear, lstYear, lst2Year));
        }
        return data;
    }
    
    // Wrapper class
    public class Data {
        public String name { get; set; }
        public Double data1 { get; set; }
        public Double data2 { get; set; }
        public Double data3 { get; set; }
        public Data(String name, Double data1, Double data2, Double data3) {
            this.name = name;
            this.data1 = data1;
            this.data2 = data2;
            this.data3 = data3;
        }
    }    
}