global class Data {

	global class Method2{
		public String name  	{ get; set;}
		public Decimal Year_1 	{ get; set;}
		public Decimal Year_2	{ get; set;}
		public Decimal Year_3	{ get; set;}
		public Decimal Year_4	{ get; set;}
		
		public Method2(String name, Decimal Year_1, Decimal Year_2, Decimal Year_3, Decimal Year_4){
			this.name = name;
			this.Year_1 = Year_1;
			this.Year_2 = Year_2;
			this.Year_3 = Year_3;
			this.Year_4= Year_4; 
			
		}
	}
	
	
	public Account createAccount( boolean insertRecord ) {
		Account thisAccount = new Account();
		thisAccount.Name = 'testAccount';
		thisAccount.OwnerId = [SELECT Id FROM User WHERE Name = 'Dianne Lusero' LIMIT 1].Id;
		
		if(insertRecord){
			insert thisAccount;
		}
		return thisAccount;
	}

	public  Financial_Histories__c createFinancialHistories( boolean insertRecord, Account acct, string AmmountType, date yearEndDate ){
		Financial_Histories__c thisFH = new Financial_Histories__c();
		thisFH.Account__c = acct.Id;
		thisFH.Amount_Type__c = AmmountType;
		thisFH.Year_Ending_Date__c = yearEndDate;
		//thisFH.Amount01__c = 100.00;
		//thisFH.Amount02__c = 200.00;
		//thisFH.Amount03__c = 300.00;
		//thisFH.Amount04__c = 400.00;
		//thisFH.Amount05__c = 500.00;
		//thisFH.Amount06__c = 600.00;
		//thisFH.Amount07__c = 700.00;
		//thisFH.Amount08__c = 800.00;
		//thisFH.Amount09__c = 900.00;
		//thisFH.Amount10__c = 1900.00;
		//thisFH.Amount11__c = 9100.00;
		//thisFH.Amount12__c = 1009.00;
		
		if(insertRecord){
			insert thisFH;
		}
		return thisFH;
	}
	
	public  Policy_Count__c createPolicyCount( boolean insertRecord, Account acct, date yearEndDate ){
		Policy_Count__c thisPC = new Policy_Count__c();
		thisPC.Account__c = acct.Id;
		thisPC.Year_Ending_Date__c = yearEndDate;
		
		if( insertRecord ){
			insert thisPC;
		}
		return thisPC;
	}
}