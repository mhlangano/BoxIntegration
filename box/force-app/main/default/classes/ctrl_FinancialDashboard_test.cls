@isTest(seealldata=true)
private class ctrl_FinancialDashboard_test {

    static testMethod void myUnitTest() {
        data dataCreate = new data();
		Account acct = dataCreate.createAccount( true ); //Change Boolean to true to return an Account 
		Financial_Histories__c fh = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance(date.today().year(), 12, 31) ); 
		Financial_Histories__c fh2 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance(date.today().year()-1, 12, 31) ); 
		Financial_Histories__c fh3 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance(date.today().year()-2, 12, 31) ); 
		Financial_Histories__c fh4 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance(date.today().year()-3, 12, 31) ); 
		
		
		
		ctrl_FinancialDashboard ctrl = new ctrl_FinancialDashboard();
		
		test.startTest();
		
		ctrl.currentYear = date.today().year();
		ctrl.RID = acct.OwnerId;
		ctrl.getAccounts();
		ctrl.getFinancialHistory10();

		
		test.stopTest();
		
    }
}