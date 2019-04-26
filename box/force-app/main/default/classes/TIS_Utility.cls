public class TIS_Utility {


    // ==============================================================================
    // Send Email Section
    // ==============================================================================
    @future
    public static void TIS_SendEmail(Set<ID> recordIds)
    {  
		List<String> vMails;
        List<String> sendTo = new List<String>();
        List<String> sendToCC = new List<String>();
        List<User> vsendTo = [SELECT Email FROM User WHERE Receive_User_Status_Change_Emails__c = True];
        
        for (User u: vsendTo){
            system.debug('Send to Email Users: '+ u.Email);
        	sendTo.add(u.Email);
        }
        
        String vTemp = TIS_Settings__c.getValues('Travelex').External_Emails__c;
        if(vTemp != Null){
        	sendToCC = vTemp.split(';');
        }
        
    	list<User> vUsers = [SELECT Username, Id, Name, Title, isActive, LastLoginDate, LastPasswordChangeDate FROM User WHERE ID in :recordIds];
        
        for( User vU : vUsers ){

            /***********************************************/
            Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();

            message.setToAddresses(sendTo);
            if(vTemp != Null){
                message.setCCAddresses(sendToCC);
            }            
            
            String lastLogin = vU.LastLoginDate.format('MMMM d, yyyy @ hh:mm:ss:a');
            String PWChange = vU.LastPasswordChangeDate.format('MMMM d, yyyy @ hh:mm:ss:a');
            
            message.subject = 'Deactivated Salesforce User: '+ vU.Name ;
            message.setHTMLBody('Hello, </br> '
                                     + 'This is an automated email to inform you that [ <b>' + vU.Name 
                                     + ' ]</b> has been deactivated in Salesforce.</br></br>'
                                     + '     <b>*** Salesforce Account is Deactivated ***</b> </br>'
                                     + '************************************************************************** </br>'
                                     + '     <b>Name:</b> ' + vU.Name + '</br>'
                                     + '     <b>Username:</b> ' + vU.Username + '</br>'
                                     + '     <b>Title:</b> ' + vU.Title + '</br>' 
                                     + '     <b>Last Login Timestamp:</b> ' + lastLogin + '</br>' 
                                	 + '     <b>Last Password Change Timestamp:</b> ' + PWChange + '</br>' 	 
                                     + '************************************************************************** </br></br>'
                                     + 'If you have any questions please see the SF Admin that sent this email.');
            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
            
			Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
            if (results[0].success) {
                System.debug('The email was sent successfully.');
            } else {
                System.debug('The email failed to send: '
                      + results[0].errors[0].message);
            }
        }        
    }
    // ==============================================================================
    // Page Methods
    // ==============================================================================
    public static string GetParamVal(string ParamKey)
    {
        string toReturn='';
        if(ApexPages.currentPage().getParameters().containsKey(ParamKey))
        {            
            toReturn=ApexPages.currentPage().getParameters().get(ParamKey);
        }
        return toReturn;
    } 
    
    // ==============================================================================
    // Financial Calculations
    // ==============================================================================    
    @future
    public static void Financial_Summary_Rollup(List<ID> recordIds)
    {   
        Map<Id, Decimal> CY_Q1 = new Map<Id, Decimal>();
        Map<Id, Decimal> CY_Q2 = new Map<Id, Decimal>();
        Map<Id, Decimal> CY_Q3 = new Map<Id, Decimal>();
        Map<Id, Decimal> CY_Q4 = new Map<Id, Decimal>();
        Map<Id, Decimal> CY_H1 = new Map<Id, Decimal>();
        Map<Id, Decimal> CY_H2 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_Q1 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_Q2 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_Q3 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_Q4 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_H1 = new Map<Id, Decimal>();
        Map<Id, Decimal> LY_H2 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_Q1 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_Q2 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_Q3 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_Q4 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_H1 = new Map<Id, Decimal>();
        Map<Id, Decimal> Y2_H2 = new Map<Id, Decimal>();       
        Map<Id, Decimal> YTD_CY = new Map<Id, Decimal>();
        Map<Id, Decimal> YTD_LY = new Map<Id, Decimal>();
        Map<Id, Decimal> YTD_2Y = new Map<Id, Decimal>();                
        Map<Id, Decimal> X3YR_YTD = new Map<Id, Decimal>(); 
        Map<Id, Decimal> LIFETIME_TOTAL = new Map<Id, Decimal>();
        Map<Id, Date> mDate = new Map<Id, Date>();        
        Map<Id, Date> First_Date = new Map<Id, Date>();   
        Map<Id, Date> Last_Date = new Map<Id, Date>();           
        integer currentYear = System.Today().year();
        integer minus1Year = System.Today().year() - 1;
        integer minus2Year = System.Today().year() - 2; 
        
        //Pull Financials for each Product Commission recieved
        list<Financial_Summary__c> finSum = [
            SELECT Id, Product_Commission__c, Premium__c, Report_Month__c, Report_Year__c, Month_Of__c 
            FROM Financial_Summary__c 
            WHERE Product_Commission__c in :recordIds];
        
        for(Financial_Summary__c f : finSum){
            //Current Year Calculations
            if(f.Report_Year__c == currentYear){
                system.debug('year = '+f.Report_Year__c);
                if(f.Report_Month__c == 1 || f.Report_Month__c == 2 || f.Report_Month__c == 3){                   
                    //Quarterly Rollup
                    if(CY_Q1.containsKey(f.Product_Commission__c)){
                        CY_Q1.put(f.Product_Commission__c, CY_Q1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_Q1.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(CY_H1.containsKey(f.Product_Commission__c)){
                        CY_H1.put(f.Product_Commission__c, CY_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_H1.put(f.Product_Commission__c, f.Premium__c);
                    }
                }
                if(f.Report_Month__c == 4 || f.Report_Month__c == 5 || f.Report_Month__c == 6){
                    //Quarterly Rollup
                    if(CY_Q2.containsKey(f.Product_Commission__c)){
                        CY_Q2.put(f.Product_Commission__c, CY_Q2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_Q2.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(CY_H1.containsKey(f.Product_Commission__c)){
                        CY_H1.put(f.Product_Commission__c, CY_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_H1.put(f.Product_Commission__c, f.Premium__c);
                    }
                }                
                if(f.Report_Month__c == 7 || f.Report_Month__c == 8 || f.Report_Month__c == 9){
                    //Quarterly Rollup
                    if(CY_Q3.containsKey(f.Product_Commission__c)){
                        CY_Q3.put(f.Product_Commission__c, CY_Q3.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_Q3.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(CY_H2.containsKey(f.Product_Commission__c)){
                        CY_H2.put(f.Product_Commission__c, CY_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_H2.put(f.Product_Commission__c, f.Premium__c);
                    }
                }                
                if(f.Report_Month__c == 10 || f.Report_Month__c == 11 || f.Report_Month__c == 12){
                    //Quarterly Rollup
                    if(CY_Q4.containsKey(f.Product_Commission__c)){
                        CY_Q4.put(f.Product_Commission__c, CY_Q4.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_Q4.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(CY_H2.containsKey(f.Product_Commission__c)){
                        CY_H2.put(f.Product_Commission__c, CY_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        CY_H2.put(f.Product_Commission__c, f.Premium__c);
                    } 
                }
                //Year to Date
                if(YTD_CY.containsKey(f.Product_Commission__c)){
                    system.debug('Record Date = '+f.Report_Year__c+' | varYear = '+ currentYear);
                    YTD_CY.put(f.Product_Commission__c, YTD_CY.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    YTD_CY.put(f.Product_Commission__c, f.Premium__c);
                } 
                //3 Year to Date Rollup 
                if(X3YR_YTD.containsKey(f.Product_Commission__c)){
                    X3YR_YTD.put(f.Product_Commission__c, X3YR_YTD.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    X3YR_YTD.put(f.Product_Commission__c, f.Premium__c);
                } 
                //LIFETIME_TOTAL Rollup
                if(LIFETIME_TOTAL.containsKey(f.Product_Commission__c)){
                    LIFETIME_TOTAL.put(f.Product_Commission__c, LIFETIME_TOTAL.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    LIFETIME_TOTAL.put(f.Product_Commission__c, f.Premium__c);
                }    
                //Gather First Date 
                if(First_Date.containsKey(f.Product_Commission__c)){
                    system.debug('Maped Date = '+First_Date.get(f.Product_Commission__c));
                    if(First_Date.get(f.Product_Commission__c) > f.Month_Of__c){
                        First_Date.put(f.Product_Commission__c, f.Month_Of__c);
                    }	
                }else{
                    First_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }
                //Gather Last Date 
                if(Last_Date.containsKey(f.Product_Commission__c)){
                    system.debug('Maped Date = '+Last_Date.get(f.Product_Commission__c));
                    if(Last_Date.get(f.Product_Commission__c) < f.Month_Of__c){
                        Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
                    }	
                }else{
                    Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }                    
            }
            
            //Last Year Calculations
            if(f.Report_Year__c == minus1Year){
                
                if(f.Report_Month__c == 1 || f.Report_Month__c == 2 || f.Report_Month__c == 3){                   
                    //Quarterly Rollup
                    if(LY_Q1.containsKey(f.Product_Commission__c)){
                        LY_Q1.put(f.Product_Commission__c, LY_Q1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_Q1.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(LY_H1.containsKey(f.Product_Commission__c)){
                        LY_H1.put(f.Product_Commission__c, LY_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_H1.put(f.Product_Commission__c, f.Premium__c);
                    }
                }
                if(f.Report_Month__c == 4 || f.Report_Month__c == 5 || f.Report_Month__c == 6){
                    //Quarterly Rollup
                    if(LY_Q2.containsKey(f.Product_Commission__c)){
                        LY_Q2.put(f.Product_Commission__c, LY_Q2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_Q2.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(LY_H1.containsKey(f.Product_Commission__c)){
                        LY_H1.put(f.Product_Commission__c, LY_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_H1.put(f.Product_Commission__c, f.Premium__c);
                    }                        
                }                
                if(f.Report_Month__c == 7 || f.Report_Month__c == 8 || f.Report_Month__c == 9){
                    //Quarterly Rollup
                    if(LY_Q3.containsKey(f.Product_Commission__c)){
                        LY_Q3.put(f.Product_Commission__c, LY_Q3.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_Q3.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(LY_H2.containsKey(f.Product_Commission__c)){
                        LY_H2.put(f.Product_Commission__c, LY_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_H2.put(f.Product_Commission__c, f.Premium__c);
                    }                  
                }                
                if(f.Report_Month__c == 10 || f.Report_Month__c == 11 || f.Report_Month__c == 12){
                    //Quarterly Rollup
                    if(LY_Q4.containsKey(f.Product_Commission__c)){
                        LY_Q4.put(f.Product_Commission__c, LY_Q4.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_Q4.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(LY_H2.containsKey(f.Product_Commission__c)){
                        LY_H2.put(f.Product_Commission__c, LY_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        LY_H2.put(f.Product_Commission__c, f.Premium__c);
                    }                      
                }                
                //Year to Date Rollup
                
                if(YTD_LY.containsKey(f.Product_Commission__c)){
                    system.debug('MINUS ONE YEAR Record Date = '+f.Report_Year__c+' | varYear = '+ minus1Year);
                    YTD_LY.put(f.Product_Commission__c, YTD_LY.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    YTD_LY.put(f.Product_Commission__c, f.Premium__c);
                } 
                
                //3 Year to Date Rollup 
                if(X3YR_YTD.containsKey(f.Product_Commission__c)){
                    X3YR_YTD.put(f.Product_Commission__c, X3YR_YTD.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    X3YR_YTD.put(f.Product_Commission__c, f.Premium__c);
                }  
                
                //LIFETIME_TOTAL Rollup
                if(LIFETIME_TOTAL.containsKey(f.Product_Commission__c)){
                    LIFETIME_TOTAL.put(f.Product_Commission__c, LIFETIME_TOTAL.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    LIFETIME_TOTAL.put(f.Product_Commission__c, f.Premium__c);
                }                 
                
                //Gather First Date 
                if(First_Date.containsKey(f.Product_Commission__c)){
                    system.debug('Maped Date = '+First_Date.get(f.Product_Commission__c));
                    if(First_Date.get(f.Product_Commission__c) > f.Month_Of__c){
                        First_Date.put(f.Product_Commission__c, f.Month_Of__c);
                    }	
                }else{
                    First_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }
                //Gather Last Date 
                if(Last_Date.containsKey(f.Product_Commission__c)){
                    system.debug('Maped Date = '+Last_Date.get(f.Product_Commission__c));
                    if(Last_Date.get(f.Product_Commission__c) < f.Month_Of__c){
                        Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
                    }	
                }else{
                    Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }                 
                
            }
            
            //2 Year Calculations
            if(f.Report_Year__c == minus2Year){
                //system.debug('year = '+f.Report_Year__c);
                //
                
                if(f.Report_Month__c == 1 || f.Report_Month__c == 2 || f.Report_Month__c == 3){                   
                    //Quarterly Rollup
                    if(Y2_Q1.containsKey(f.Product_Commission__c)){
                        Y2_Q1.put(f.Product_Commission__c, Y2_Q1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_Q1.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(Y2_H1.containsKey(f.Product_Commission__c)){
                        Y2_H1.put(f.Product_Commission__c, Y2_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_H1.put(f.Product_Commission__c, f.Premium__c);
                    }
                }
                if(f.Report_Month__c == 4 || f.Report_Month__c == 5 || f.Report_Month__c == 6){
                    //Quarterly Rollup
                    if(Y2_Q2.containsKey(f.Product_Commission__c)){
                        Y2_Q2.put(f.Product_Commission__c, Y2_Q2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_Q2.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(Y2_H1.containsKey(f.Product_Commission__c)){
                        Y2_H1.put(f.Product_Commission__c, Y2_H1.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_H1.put(f.Product_Commission__c, f.Premium__c);
                    }                        
                }                
                if(f.Report_Month__c == 7 || f.Report_Month__c == 8 || f.Report_Month__c == 9){
                    //Quarterly Rollup
                    if(Y2_Q3.containsKey(f.Product_Commission__c)){
                        Y2_Q3.put(f.Product_Commission__c, Y2_Q3.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_Q3.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(Y2_H2.containsKey(f.Product_Commission__c)){
                        Y2_H2.put(f.Product_Commission__c, Y2_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_H2.put(f.Product_Commission__c, f.Premium__c);
                    }                  
                }                
                if(f.Report_Month__c == 10 || f.Report_Month__c == 11 || f.Report_Month__c == 12){
                    //Quarterly Rollup
                    if(Y2_Q4.containsKey(f.Product_Commission__c)){
                        Y2_Q4.put(f.Product_Commission__c, Y2_Q4.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_Q4.put(f.Product_Commission__c, f.Premium__c);
                    }
                    //Half Year Rollup
                    if(Y2_H2.containsKey(f.Product_Commission__c)){
                        Y2_H2.put(f.Product_Commission__c, Y2_H2.get(f.Product_Commission__c) +f.Premium__c);
                    }else{
                        Y2_H2.put(f.Product_Commission__c, f.Premium__c);
                    }                      
                }                             
                
                //**************************************************
                
                if(YTD_2Y.containsKey(f.Product_Commission__c)){
                    system.debug('MINUS 2 YEAR Record Date = '+f.Report_Year__c+' | varYear = '+ minus2Year);
                    YTD_2Y.put(f.Product_Commission__c, YTD_2Y.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    YTD_2Y.put(f.Product_Commission__c, f.Premium__c);
                }  
                
                //3 Year to Date Rollup 
                if(X3YR_YTD.containsKey(f.Product_Commission__c)){
                    X3YR_YTD.put(f.Product_Commission__c, X3YR_YTD.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    X3YR_YTD.put(f.Product_Commission__c, f.Premium__c);
                }    
                
                //LIFETIME_TOTAL Rollup
                if(LIFETIME_TOTAL.containsKey(f.Product_Commission__c)){
                    LIFETIME_TOTAL.put(f.Product_Commission__c, LIFETIME_TOTAL.get(f.Product_Commission__c) +f.Premium__c);
                }else{
                    LIFETIME_TOTAL.put(f.Product_Commission__c, f.Premium__c);
                }                 
            }
            
            //LIFETIME_TOTAL Rollup
            if(LIFETIME_TOTAL.containsKey(f.Product_Commission__c)){
                LIFETIME_TOTAL.put(f.Product_Commission__c, LIFETIME_TOTAL.get(f.Product_Commission__c) +f.Premium__c);
            }else{
                LIFETIME_TOTAL.put(f.Product_Commission__c, f.Premium__c);
            }               
            
            //Gather First Date 
            if(First_Date.containsKey(f.Product_Commission__c)){
                system.debug('Maped Date = '+First_Date.get(f.Product_Commission__c));
                if(First_Date.get(f.Product_Commission__c) > f.Month_Of__c){
                    First_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }	
            }else{
                First_Date.put(f.Product_Commission__c, f.Month_Of__c);
            }
            //Gather Last Date 
            if(Last_Date.containsKey(f.Product_Commission__c)){
                system.debug('Maped Date = '+Last_Date.get(f.Product_Commission__c));
                if(Last_Date.get(f.Product_Commission__c) < f.Month_Of__c){
                    Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
                }	
            }else{
                Last_Date.put(f.Product_Commission__c, f.Month_Of__c);
            }               
        }
        
        list<Product_Commission__c> ProdComms = [
            SELECT Id, Q1_CY__c, Q2_CY__c, Q3_CY__c, Q4_CY__c, 
            Q1_LY__c, Q2_LY__c, Q3_LY__c, Q4_LY__c, 
            H1_CY__c, H2_CY__c, YTD_CY__c, YTD_LY__c, YTD_2Y__c, Last_Posted_Month__c 
            FROM Product_Commission__c 
            WHERE Id in :recordIds];
        
        for(Product_Commission__c pc : ProdComms){
            //Current year
            pc.Q1_CY__c = nullChk(CY_Q1.get(pc.Id)); 
            pc.Q2_CY__c = nullChk(CY_Q2.get(pc.Id)); 
            pc.Q3_CY__c = nullChk(CY_Q3.get(pc.Id)); 
            pc.Q4_CY__c = nullChk(CY_Q4.get(pc.Id)); 
            pc.H1_CY__c = nullChk(CY_H1.get(pc.Id)); 
            pc.H2_CY__c = nullChk(CY_H2.get(pc.Id)); 
            //Last Year
            pc.Q1_LY__c = nullChk(LY_Q1.get(pc.Id)); 
            pc.Q2_LY__c = nullChk(LY_Q2.get(pc.Id)); 
            pc.Q3_LY__c = nullChk(LY_Q3.get(pc.Id)); 
            pc.Q4_LY__c = nullChk(LY_Q4.get(pc.Id)); 
            pc.H1_LY__c = nullChk(LY_H1.get(pc.Id)); 
            pc.H2_LY__c = nullChk(LY_H2.get(pc.Id)); 
            //Last 2 Year
            pc.Q1_2Y__c = nullChk(Y2_Q1.get(pc.Id)); 
            pc.Q2_2Y__c = nullChk(Y2_Q2.get(pc.Id)); 
            pc.Q3_2Y__c = nullChk(Y2_Q3.get(pc.Id)); 
            pc.Q4_2Y__c = nullChk(Y2_Q4.get(pc.Id)); 
            pc.H1_2Y__c = nullChk(Y2_H1.get(pc.Id)); 
            pc.H2_2Y__c = nullChk(Y2_H2.get(pc.Id));             
            //Yearly Rollups
            pc.YTD_CY__c = nullChk(YTD_CY.get(pc.Id));
            pc.YTD_LY__c = nullChk(YTD_LY.get(pc.Id));               
            pc.YTD_2Y__c = nullChk(YTD_2Y.get(pc.Id));  
            //3 Year Rollup
            pc.X3YR_YTD__c = nullChk(X3YR_YTD.get(pc.Id));
            //Lifetime Rollup
            pc.Lifetime_Total__c = nullChk(Lifetime_Total.get(pc.Id));            
            //Date Rollup
            pc.Last_Posted_Month__c = Last_Date.get(pc.Id);
            pc.First_Posted_Month__c = First_Date.get(pc.Id);
        }        
        update ProdComms;        
    }  
    
    public static Decimal nullChk(Decimal value)
    {
        if(value == null){
            return 0.00;
        }else{
            return value;
        }
    }    
    
}