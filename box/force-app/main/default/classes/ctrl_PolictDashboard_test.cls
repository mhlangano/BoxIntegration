@isTest
private class ctrl_PolictDashboard_test {
	static testMethod void myUnitTest() {
        data dataCreate = new data();
		Account acct = dataCreate.createAccount( true ); //Change Boolean to true to return an Account 

		Policy_Count__c pc3 = dataCreate.createPolicyCount( true, acct, date.newinstance(date.today().year()-3, 12, 31) ); 
		Policy_Count__c pc2 = dataCreate.createPolicyCount( true, acct, date.newinstance(date.today().year()-2, 12, 31) );
		Policy_Count__c pc1 = dataCreate.createPolicyCount( true, acct, date.newinstance(date.today().year()-1, 12, 31) );
		Policy_Count__c pc = dataCreate.createPolicyCount( true, acct, date.newinstance(date.today().year(), 12, 31) );
		
		ctrl_PolicyDashboard ctrl = new ctrl_PolicyDashboard();
		
		test.startTest();
		
		ctrl.currentYear = date.today().year();
		ctrl.UID = acct.OwnerId;
		ctrl.getAccounts();
		ctrl.getFinancialHistory10();

		
		test.stopTest();
		
    }
}