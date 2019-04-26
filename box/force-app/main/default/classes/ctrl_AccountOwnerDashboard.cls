public with sharing class ctrl_AccountOwnerDashboard {
	
	//Variables
	public User myUser 													{get;set;}
	public string UserID 												{get;set;}
	transient public list< Account > accounts_List {get;set;}
	//public list< financialData > financialData_List						{get;set;}
	public integer currentYear											{get;set;}	
	public boolean renderAccountsMonthly								{get;set;}
	public string accountId												{get;set;}	
	
	public set< Id > users_Set = new set< Id >();
	
	//Controller
	public ctrl_AccountOwnerDashboard(){
		UserID = ApexPages.currentPage().getParameters().get('UID');
		getUsers();
		renderAccountsMonthly = true;
		currentYear = date.today().year();
		//getAccounts_list();
		//updateData();
	}
	
	public void getUsers(){
		
		list< User > users_List = [ SELECT Id, UserRole.Name, Profile.Name FROM User WHERE isActive = true ];
		
		for( User u : users_List ){
			if( u.Id == UserId ){
				myUser = u;
			}
		}
		
		if( myUser.Profile.Name == 'System Administrator' || myUser.Profile.Name == 'System Administrator Travelex' ){
			users_Set.add( UserId );
		}
		
		for( User u: users_List ){
			
			if( myUser.UserRole.Name == 'Sales Team East' && u.UserRole.Name == 'East RAM' ){
				users_Set.add( u.Id );
			}
			
			if( myUser.UserRole.Name == 'Sales Team West' && u.UserRole.Name == 'West RAM' ){
				users_Set.add( u.Id );
			}
			
			if( u.Id == UserId ){
				users_Set.add( u.Id );
			}
		}
	}
	
	//Methods
	public void getAccounts_list(){
		
		//list<Account> tmpAcctList = new list<Account>();
		
		if(UserID!=null){
			
			accounts_list = [SELECT ID, OwnerID, Name,
							     (SELECT Id, IsDeleted, Name, CreatedDate, CreatedById, LastModifiedDate, 
								      LastModifiedById, SystemModstamp, LastActivityDate, Account__c, Amount01__c, 
								      Amount02__c, Amount03__c, Amount04__c, Amount05__c, Amount06__c, Amount07__c, Amount08__c, 
								      Amount09__c, Amount10__c, Amount11__c, Amount12__c, Amount_QTR1__c, Amount_QTR2__c, 
								      Amount_QTR3__c, Amount_QTR4__c, Amount_Type__c, Amount_YTD__c, Year_Ending_Date__c, Year__c, Text_Year__c,
								      Cash_Delta_01__c, Cash_Delta_02__c, Cash_Delta_03__c, Cash_Delta_04__c, Cash_Delta_05__c, Cash_Delta_06__c,
								      Cash_Delta_07__c, Cash_Delta_08__c, Cash_Delta_09__c, Cash_Delta_10__c, Cash_Delta_11__c, Cash_Delta_12__c,
								      Cash_Delta_QTR1__c, Cash_Delta_QTR2__c, Cash_Delta_QTR3__c, Cash_Delta_QTR4__c, Cash_Delta_YTD__c,
								      Percent_Delta_01__c, Percent_Delta_02__c, Percent_Delta_03__c, Percent_Delta_04__c, Percent_Delta_05__c, Percent_Delta_06__c,
								      Percent_Delta_07__c, Percent_Delta_08__c, Percent_Delta_09__c, Percent_Delta_10__c, Percent_Delta_11__c, Percent_Delta_12__c,
								      Percent_Delta_QTR1__c, Percent_Delta_QTR2__c, Percent_Delta_QTR3__c, Percent_Delta_QTR4__c, Percent_Delta_YTD__c  
							      	FROM Financial_Histories__r ORDER BY Year__c DESC )
							      FROM Account WHERE OwnerID IN : users_Set ];
			//accounts_List = tmpAcctList;	      		
		}					      
	}

	public void renderMonthly(){
		renderAccountsMonthly = true;
	}
	
	public pageReference goToReport(){
		//string tmpUrl = '/00OQ0000000PUgN'; //Dev
		string tmpURL = '/00O300000086n6q'; //Production
		PageReference pr = new PageReference(tmpURL);
		pr.setRedirect(false);
		return pr;
	}



}