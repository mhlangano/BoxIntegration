public with sharing class ctrl_PolicyCount {

//Variables
	public User myUser 													{get;set;}
	public string UserID 												{get;set;}
	public integer currentYear											{get;set;}	
	public boolean renderAccountsMonthly								{get;set;}	
	
	public set< Id > users_Set = new set< Id >();
	
	//Controller
	public ctrl_PolicyCount(){
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

	public pageReference goToReport(){
		//string tmpUrl = '/00OQ0000000PUgN'; //Dev
		string tmpURL = '/00O30000008acRE'; //Production
		PageReference pr = new PageReference(tmpURL);
		pr.setRedirect(false);
		return pr;
	}

}