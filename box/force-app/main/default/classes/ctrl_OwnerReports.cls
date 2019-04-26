public with sharing class ctrl_OwnerReports {
	public string UserID {get;set;}

	public ctrl_OwnerReports(){
		UserId = userInfo.getUserId();
	}

	public list<SelectOption> getAccountOwners(){
		list<SelectOption> selOps = new list<SelectOption>();
		
		User tmpUser = new User();
		
		
		list<User> users = [Select FirstName, LastName, ID, isActive, UserRole.Name, Profile.Name
							FROM User
							WHERE isActive = true];
		
		for( User u : users ){
			if( u.Id == UserId ){
				tmpUser = u;
			}
		}

		if( tmpUser.Profile.Name == 'System Administrator' || tmpUser.Profile.Name == 'System Administrator Travelex' ){
			for( User u : users ){
				selOps.add(new SelectOption(u.ID, u.FirstName + ' ' + u.LastName));
			}
		}else{
			selOps.add(new SelectOption(tmpUser.ID, tmpUser.FirstName + ' ' + tmpUser.LastName));
		}
		
		if( tmpUser.UserRole.Name == 'Sales Team West' ){
			//selOps.add(new SelectOption(tmpUser.ID, tmpUser.FirstName + ' ' + tmpUser.LastName));
			for( User u : users ){
				if( u.UserRole.Name == 'West RAM'){
					selOps.add(new SelectOption(u.ID, u.FirstName + ' ' + u.LastName));
				}
			}
		}
		
		if( tmpUser.UserRole.Name == 'Sales Team East' ){
			//selOps.add(new SelectOption(tmpUser.ID, tmpUser.FirstName + ' ' + tmpUser.LastName));
			for( User u : users ){
				if( u.UserRole.Name == 'East RAM'){
					selOps.add(new SelectOption(u.ID, u.FirstName + ' ' + u.LastName));
				}
			}
		}
		selOps.sort();
		return selOps;
	}
	
	public PageReference getRedirect(){
		PageReference pr = new PageReference('/apex/AccountOwnerDashboard?UID='+UserID);
		return pr;
	}

}