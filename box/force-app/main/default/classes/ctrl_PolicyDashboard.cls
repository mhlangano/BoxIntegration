public with sharing class ctrl_PolicyDashboard {

	public ID UID				{get;set;}
	public integer currentYear 	{get;set;}
	public integer year2 		{get;set;}
	public integer year3 		{get;set;}
	public integer cutOffYear	{get;set;}
	
	public list<Account> getAccounts(){
		list<Account> acctList = [Select ID, OwnerID, 
							     (Select Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, 
							      LastModifiedById, SystemModstamp, Account__c, January__c, 
							      February__c, March__c, April__c, May__c, June__c, July__c, August__c, 
							      September__c, October__c, November__c, December__c, First_Quarter__c, Second_Quarter__c, 
							      Third_Quarter__c, Fourth_Quarter__c, Year_To_Date__c, Year_Ending_Date__c, Year__c 
							      From Policy_Counts__r
							      Order by Year__c asc), Name
							      FROM Account WHERE OwnerID = :UID ];
		return acctList;
	}
	
	public void goToReport(){
		getGoToReport();
		system.debug('Report Loop');
	}
	
	public PageReference getGoToReport(){
		//PageReference pr = new PageReference('/'+'00O30000007OSwL');
		PageReference pr = new PageReference( '/' + '00O30000008acRE' );
		return pr;
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
		
		transient list< Account > acctList = [Select ID, OwnerID, Name,
											     (Select Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, 
											      LastModifiedById, SystemModstamp, Account__c, January__c, 
											      February__c, March__c, April__c, May__c, June__c, July__c, August__c, 
											      September__c, October__c, November__c, December__c, First_Quarter__c, Second_Quarter__c, 
											      Third_Quarter__c, Fourth_Quarter__c, Year_To_Date__c, Year_Ending_Date__c, Year__c    
											      From Policy_Counts__r WHERE Year__c >= :year3
											      Order by Year__c asc)
											      
											      FROM Account WHERE OwnerID = :UID];
		
		
		transient list< Policy_Count__c > pc_List = new list< Policy_Count__c >();
		
		system.debug( 'ACCOUNT COUNT ' + acctList.size() );
		
		for( Account a : acctList ){
			for( Policy_Count__c pc : a.Policy_Counts__r ){
				pc_List.add( pc );
			}
		}
		
		system.debug( 'PC List '+ pc_List.size() );
		system.debug( 'current ' + currentYear );
		system.debug( 'less1 ' + year2 );
		system.debug( 'less2 ' + year3 );

		for( Policy_Count__c p : pc_List ){
			if( p.Year__c == currentYear ){
				
				jan.current += retDec(p.January__c);
				feb.current += retDec(p.February__c);
				mar.current += retDec(p.March__c);
				apr.current += retDec(p.April__c);
				may.current += retDec(p.May__c);
				jun.current += retDec(p.June__c);
				jul.current += retDec(p.July__c);
				aug.current += retDec(p.August__c);
				sep.current += retDec(p.September__c);
				oct.current += retDec(p.October__c);
				nov.current += retDec(p.November__c);
				dec.current += retDec(p.December__c);
				
			}
			if( p.Year__c == year2 ){
				
				jan.less1 += retDec( p.January__c );
				feb.less1 += retDec( p.February__c );
				mar.less1 += retDec( p.March__c );
				apr.less1 += retDec( p.April__c );
				may.less1 += retDec( p.May__c );
				jun.less1 += retDec( p.June__c );
				jul.less1 += retDec( p.July__c );
				aug.less1 += retDec( p.August__c );
				sep.less1 += retDec( p.September__c );
				oct.less1 += retDec( p.October__c );
				nov.less1 += retDec( p.November__c );
				dec.less1 += retDec( p.December__c );
				

			}
			if( p.Year__c == year3 ){
				
				jan.less2 += retDec( p.January__c );
				feb.less2 += retDec( p.February__c );
				mar.less2 += retDec( p.March__c );
				apr.less2 += retDec( p.April__c );
				may.less2 += retDec( p.May__c );
				jun.less2 += retDec( p.June__c );
				jul.less2 += retDec( p.July__c );
				aug.less2 += retDec( p.August__c );
				sep.less2 += retDec( p.September__c );
				oct.less2 += retDec( p.October__c );
				nov.less2 += retDec( p.November__c );
				dec.less2 += retDec( p.December__c );
				

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