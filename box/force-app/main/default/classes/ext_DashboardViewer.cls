public with sharing class ext_DashboardViewer {
	
	private final Account acct;
	public ID RID				{get;set;}
	public integer currentYear 	{get;set;}
	public integer year2 		{get;set;}
	public integer year3 		{get;set;}
	public integer cutOffYear	{get;set;}

    public ext_DashboardViewer(ApexPages.StandardController stdController) {
        this.acct = (Account)stdController.getRecord();
       
    }
    
    public list<data.method2> getFinancialHistory10(){

		currentYear = date.today().year();
		year2 = date.today().year() - 1;
		year3 = date.today().year() - 2;
		cutOffYear = date.today().year() - 3;
		
		chartData jan = new chartData('January', 0, 0, 0, 0);
		chartData feb = new chartData('February', 0, 0, 0, 0);
		chartData mar = new chartData('March', 0, 0, 0, 0);
		chartData apr = new chartData('April', 0, 0, 0, 0);
		chartData may = new chartData('May', 0, 0, 0, 0);
		chartData jun = new chartData('June', 0, 0, 0, 0);
		chartData jul = new chartData('July', 0, 0, 0, 0);
		chartData aug = new chartData('August', 0, 0, 0, 0);
		chartData sep = new chartData('September', 0, 0, 0, 0);
		chartData oct = new chartData('October', 0, 0, 0, 0);
		chartData nov = new chartData('November', 0, 0, 0, 0);
		chartData dec = new chartData('December', 0, 0, 0, 0);
		
		list< data.method2 > chartData_List = new  list< data.method2 >();
		 
		list<Account> acctList = [Select ID, OwnerID, 
							     (Select Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, 
							      LastModifiedById, SystemModstamp, LastActivityDate, Account__c, Amount01__c, 
							      Amount02__c, Amount03__c, Amount04__c, Amount05__c, Amount06__c, Amount07__c, Amount08__c, 
							      Amount09__c, Amount10__c, Amount11__c, Amount12__c, Amount_QTR1__c, Amount_QTR2__c, 
							      Amount_QTR3__c, Amount_QTR4__c, Amount_Type__c, Amount_YTD__c, Year_Ending_Date__c, Year__c 
							      From Financial_Histories__r
							      Order by Year__c asc), Name
							      FROM Account WHERE Id = :acct.Id];
		
		
		list< Financial_Histories__c > fh_List = new list< Financial_Histories__c >();
		
		for( Account a : acctList ){
			for( Financial_Histories__c f : a.Financial_Histories__r ){
				fh_List.add(f);
			}
		}
		
		system.debug('FH List '+fh_List.size());
		system.debug('current '+currentYear);
		system.debug('less1 '+year2);
		system.debug('less2 '+year3);

		for(Financial_Histories__c f : fh_List){
			if(f.Year__c == currentYear){
				
				jan.current += retDec(f.Amount01__c);
				feb.current += retDec(f.Amount02__c);
				mar.current += retDec(f.Amount03__c);
				apr.current += retDec(f.Amount04__c);
				may.current += retDec(f.Amount05__c);
				jun.current += retDec(f.Amount06__c);
				jul.current += retDec(f.Amount07__c);
				aug.current += retDec(f.Amount08__c);
				sep.current += retDec(f.Amount09__c);
				oct.current += retDec(f.Amount10__c);
				nov.current += retDec(f.Amount11__c);
				dec.current += retDec(f.Amount12__c);
				
			}
			if(f.Year__c == year2){
				
				jan.less1 += retDec(f.Amount01__c);
				feb.less1 += retDec(f.Amount02__c);
				mar.less1 += retDec(f.Amount03__c);
				apr.less1 += retDec(f.Amount04__c);
				may.less1 += retDec(f.Amount05__c);
				jun.less1 += retDec(f.Amount06__c);
				jul.less1 += retDec(f.Amount07__c);
				aug.less1 += retDec(f.Amount08__c);
				sep.less1 += retDec(f.Amount09__c);
				oct.less1 += retDec(f.Amount10__c);
				nov.less1 += retDec(f.Amount11__c);
				dec.less1 += retDec(f.Amount12__c);
				

			}
			if(f.Year__c == year3){
				
				jan.less2 += retDec(f.Amount01__c);
				feb.less2 += retDec(f.Amount02__c);
				mar.less2 += retDec(f.Amount03__c);
				apr.less2 += retDec(f.Amount04__c);
				may.less2 += retDec(f.Amount05__c);
				jun.less2 += retDec(f.Amount06__c);
				jul.less2 += retDec(f.Amount07__c);
				aug.less2 += retDec(f.Amount08__c);
				sep.less2 += retDec(f.Amount09__c);
				oct.less2 += retDec(f.Amount10__c);
				nov.less2 += retDec(f.Amount11__c);
				dec.less2 += retDec(f.Amount12__c);
				
				
			}
			if(f.Year__c == cutOffYear){
				
				jan.cutOff += retDec(f.Amount01__c);
				feb.cutOff += retDec(f.Amount02__c);
				mar.cutOff += retDec(f.Amount03__c);
				apr.cutOff += retDec(f.Amount04__c);
				may.cutOff += retDec(f.Amount05__c);
				jun.cutOff += retDec(f.Amount06__c);
				jul.cutOff += retDec(f.Amount07__c);
				aug.cutOff += retDec(f.Amount08__c);
				sep.cutOff += retDec(f.Amount09__c);
				oct.cutOff += retDec(f.Amount10__c);
				nov.cutOff += retDec(f.Amount11__c);
				dec.cutOff += retDec(f.Amount12__c);
				

			}
		}
		
		chartData_List.add(new data.method2( jan.month, jan.current, jan.less1, jan.less2, jan.cutOff ));
		chartData_List.add(new data.method2( feb.month, feb.current, feb.less1, feb.less2, feb.cutOff ));
		chartData_List.add(new data.method2( mar.month, mar.current, mar.less1, mar.less2, mar.cutOff ));
		chartData_List.add(new data.method2( apr.month, apr.current, apr.less1, apr.less2, apr.cutOff ));
		chartData_List.add(new data.method2( may.month, may.current, may.less1, may.less2, may.cutOff ));
		chartData_List.add(new data.method2( jun.month, jun.current, jun.less1, jun.less2, jun.cutOff ));
		chartData_List.add(new data.method2( jul.month, jul.current, jul.less1, jul.less2, jul.cutOff ));
		chartData_List.add(new data.method2( aug.month, aug.current, aug.less1, aug.less2, aug.cutOff ));
		chartData_List.add(new data.method2( sep.month, sep.current, sep.less1, sep.less2, sep.cutOff ));
		chartData_List.add(new data.method2( oct.month, oct.current, oct.less1, oct.less2, oct.cutOff ));
		chartData_List.add(new data.method2( nov.month, nov.current, nov.less1, nov.less2, nov.cutOff ));
		chartData_List.add(new data.method2( dec.month, dec.current, dec.less1, dec.less2, dec.cutOff ));

		return 	chartData_List;
	
	}
	
	public class chartData{
		public string month		{get;set;}
		public decimal current	{get;set;}
		public decimal less1	{get;set;}
		public decimal less2	{get;set;}
		public decimal cutOff	{get;set;}
		
		public chartData( string month, integer current, integer less1, integer less2, integer cutoff){
			this.month = month;
			this.current = current;
			this.less1 = less1;
			this.less2 = less2;
			this.cutoff = cutOff;
		}
	}
	
	
	public decimal retDec( decimal dec ){
		
		if(dec == null){
			return 0;
		}else{
			return dec;
		}
	}

}