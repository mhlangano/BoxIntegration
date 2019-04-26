public class MeetingsController {
    
    public List<Conference_Meeting__c> lstMeets {get;set;}
    public Meeting[] Meetings { get; set; } 
    public String soql {get;set;}

    Conf_Settings__c vMeeting = Conf_Settings__c.getInstance('Travelex');
    Public ID vConfID = vMeeting.Current_Conference__c;
    Public String vConfStatus = 'Scheduled';
    Public String vRowCount = vMeeting.Number_of_Rows__c;

    public MeetingsController() {
        getMeetings();
    }
    
    public void getMeetings(){
        Meetings = new List<Meeting>();
        soql = 'SELECT Id, Conference__c, Meeting_DateTime__c, Table_Meeting_Location__c, Meeting_List__c,';
        soql += ' Meeting_Status__c, Uploaded_Location_Number__c, Uploaded_Appt__c, Uploaded_Agency_Name__c,';            
        soql += ' Agency0_Review_Link__c, Agency1_Review_Link__c, Agency2_Review_Link__c,';                      
        soql += ' Location_Number0__c, Location_Number1__c, Location_Number2__c, Uploaded_Time__c';          
        soql += ' FROM Conference_Meeting__c';         
        soql += ' WHERE Conference__c = \'' + vConfID + '\'';
        soql += ' AND Meeting_Status__c = \'' + vConfStatus + '\'';         
        soql += ' ORDER BY Meeting_DateTime__c ASC LIMIT ';  
        soql += vRowCount;
        //Run SOQL 
        try{
            lstMeets = Database.query(soql);
            system.debug('size = '+lstMeets.size());
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'SOQL Ooops! Get SF Admin Attention.'));
        }        
        
        for(Conference_Meeting__c item : lstMeets) {
            String vDT = item.Meeting_DateTime__c.format('h:mm a');
            //system.debug(vDT);
            Meetings.add(new Meeting(item.Id, item.Meeting_DateTime__c, vDT, item.Meeting_List__c, item.Table_Meeting_Location__c, item.Uploaded_Agency_Name__c, 
                                     item.Uploaded_Location_Number__c, String.valueOf(item.Uploaded_Appt__c), item.Agency0_Review_Link__c, 
                                     item.Agency1_Review_Link__c, item.Agency2_Review_Link__c,item.Location_Number0__c,item.Location_Number1__c,item.Location_Number2__c, item.Uploaded_Time__c));                    
        }         
    }
    
    public class Meeting{
        Public ID MeetId {get; set;}
        Public Datetime MeetDateTime {get; set;}
        Public String MeetDateTime2 {get; set;}        
        Public String MeetList {get; set;}
        Public String MeetTable {get; set;}
        Public String UpAgncyName {get; set;}        
        Public String UpLocNums {get; set;}         
        Public String MeetApptNum {get; set;}
        public String Agency0Link {get; set;}
        public String Agency1Link {get; set;}
        public String Agency2Link {get; set;}
        public String Agency0LocNum {get; set;}
        public String Agency1LocNum {get; set;}
        public String Agency2LocNum {get; set;}
        public String MeetTime {get; set;}
        
        public Meeting(ID vMeetId, DateTime vMeetDateTime, String vMeetDateTime2, String vMeetList, String vMeetTable, String vUpAgncyName,   
                       String vUpLocNums, String vMeetApptNum, String vAgency0Link, String vAgency1Link, String vAgency2Link,
                       String vAgency0LocNum, String vAgency1LocNum, String vAgency2LocNum, String vMeetTime){ 
                           
                           MeetId = vMeetId;
                           MeetDateTime = vMeetDateTime;
                           MeetDateTime2 = vMeetDateTime2;            
                           MeetList = vMeetList;
                           MeetTable = vMeetTable;
                           UpAgncyName = vUpAgncyName;                           
                           UpLocNums = vUpLocNums;
                           MeetApptNum = vMeetApptNum;
                           Agency0Link = vAgency0Link;
                           Agency1Link = vAgency1Link;
                           Agency2Link = vAgency2Link;
                           Agency0LocNum = vAgency0LocNum;
                           Agency1LocNum = vAgency1LocNum;
                           Agency2LocNum = vAgency2LocNum;  
                           MeetTime = vMeetTime;                        
                       }       
    }
}