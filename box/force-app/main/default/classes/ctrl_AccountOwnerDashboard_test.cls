@isTest(SeeAllData=true)
private class ctrl_AccountOwnerDashboard_test {

    static testMethod void myUnitTest() {
        data dataCreate = new data();
		Account acct = dataCreate.createAccount( true ); //Change Boolean to true to return an Account 
		
		Financial_Histories__c fh = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance( 2013, 12, 31) ); 
		Financial_Histories__c fh2 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance( 2012 , 12, 31) ); 
		Financial_Histories__c fh3 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance( 2011 , 12, 31) ); 
		Financial_Histories__c fh4 = dataCreate.createFinancialHistories( true, acct, 'Premium', date.newinstance( 2010 , 12, 31) ); 

		
		ApexPages.currentPage().getParameters().put( 'UID' , acct.OwnerId );  
		
		ctrl_AccountOwnerDashboard ctrl = new ctrl_AccountOwnerDashboard();
		
		test.startTest();

		ctrl.goToReport();

		test.stopTest();
    }
}