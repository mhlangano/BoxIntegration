//@isTest
@isTest(SeeAllData=True) // Using see all data to get access to the Custom Setting LocNumMaps
public class TEST_User_Tests {

    static testMethod void User_deactivation_Test() {
        //Purpose of this Test is to test The Email Send when an User is Deactivated
        //1) Create and Insert a new User
        //2) Update the User to isActive = False
    	
        
        
        User vUser = [SELECT Id, isActive FROM User WHERE isActive = True AND Profile.Name = 'NA TIS Standard User' Limit 1];
        
        vUser.IsActive = False;
        
        update vUser;
        
        /*
		Id vProfile = [SELECT Id FROM Profile WHERE Name = 'Read Only'].Id;        

		User vUser = new User();
        vUser.FirstName = 'John';
        vUser.LastName = 'Doe';
        vUser.Username = 'John.Doe@travelexinsurance.com';
        vUser.Email = 'John.Doe@travelexinsurance.com';
        vUser.ProfileId = vProfile;
        vUser.Alias = 'jdoe';
        vUser.TimeZoneSidKey = 'America/Chicago';
        vUser.LanguageLocaleKey = 'en_US';
        vUser.EmailEncodingKey = 'ISO-8859-1';
        vUser.LocaleSidKey = 'en_US';
        vUser.IsActive = True;
        
        Insert vUser;
        
        vUser.IsActive = False;
        test.startTest();
        update vUser;
        test.stopTest();

		*/
    }      
    
}