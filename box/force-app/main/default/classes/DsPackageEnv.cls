public class DsPackageEnv
{
    // ds settings
    static DsConnectionSettings__c ds;
    static String integration_key = ''; 	// = '197d05f4-6570-4a7d-9dff-689208b0b4b2';
    static String account_id = ''; 			// = '';
    static String ds_server = ''; 			// = 'callout:DocuSign_Legacy/api/3.0/dsapi.asmx';
    static String trace_value = ''; 		// = 'SFDC_004_SOAP_email_send'; // Used for tracing API calls
    static String trace_key = ''; 			// = 'X-ray';
    static String envelope_id = '';
    static String senderViewUrl = '';
    
    // initialise api inner class
    static DocuSignTK.APIServiceSoap api_sender = new DocuSignTK.APIServiceSoap();
    
    static void initSettings()
    {
        ds = DsConnectionSettings__c.getOrgDefaults();
        integration_key = ds.integration_key__c;
        account_id = ds.account_id__c;
        ds_server = ds.ds_server__c;
        trace_value = ds.trace_value__c;
        trace_key = ds.trace_key__c;
    }
    
    //static entry point
    @AuraEnabled
    public static String mainExecution(String sourceDsObjectType, String sourceRecordId, String packageToSend, String contactType, List<Contact> accountContacts, String docType)
    {
        initSettings();
        configureSender();
        // identify and wrap contacts
        List<RecipientWrapper> lstRecipientWrappers = new List<RecipientWrapper>();
        for(Contact c : accountContacts)
        {
            // get multiselect picklist selections for contact type
            String[] contactTypes = c.Contact_Type__c.split(';',0);
            for(String s : contactTypes)
            {
                String tempStr = s.toUpperCase();
                if(tempStr.contains('PRIMARY'))
                {
                    if(c.Email!='' && c.Name!='' && c.DS_Role__c!='')
                    {
                        lstRecipientWrappers.add(new RecipientWrapper(c.Email, c.LastName, c.DS_Role__c, 1, 1)); // set defaults for recId and recOrder
                    }
                }
            }            
        }
        
        if(lstRecipientWrappers.size()<1)
        {
            throw new AuraHandledException('No primary contacts were found for the contract.  Please check your contact information for input errors.');
        }
        
        if(packageToSend != null)
        {
            constructContractPackage(packageToSend, sourceDsObjectType, sourceRecordId, lstRecipientWrappers, docType);
        }
        else
        {
            throw new AuraHandledException('A package was not chosen for the current contract.');
        }
        return senderViewUrl;
    }
    
    static void configureSender(){
        api_sender.endpoint_x = ds_server;
        api_sender.inputHttpHeaders_x = new Map<String, String>();
        String auth =   '<DocuSignCredentials><Username>{!$Credential.Username}</Username>' 
            + '<Password>{!$Credential.Password}</Password>' 
            + '<IntegratorKey>' + integration_key + '</IntegratorKey></DocuSignCredentials>';
        
        api_sender.inputHttpHeaders_x.put('X-DocuSign-Authentication', auth);
    }
    
    // template envelope requirements
    static DocuSignTK.TemplateReference[] templateReferences; // individual templates added here
    static DocuSignTK.ArrayOfTemplateReference ArrayOfTemplateReference; // array of templates added here
    
    // Create and link recipient information
    static DocuSignTK.Recipient createRecipient(String recipientEmail, String recipientUsername, String recipientType, Integer recipientId, Integer recipientRoutingOrder)
    {
        DocuSignTK.Recipient recipient = new DocuSignTK.Recipient();
        recipient.Email = recipientEmail;
        recipient.UserName = recipientUsername;
        recipient.Type_x = recipientType; // eg. Signer
        recipient.RoleName = recipientType; // eg. Signer
        recipient.ID = recipientId; // eg. 1
        recipient.RoutingOrder = recipientRoutingOrder; // eg. 1
        
        return recipient;
    }
    
    // link server template
    static DocuSignTK.TemplateReference linkServerTemplate(String templateId, List<DocuSignTK.Recipient> recipients)
    {
        DocuSignTK.TemplateReference templateReference = new DocuSignTK.TemplateReference();
        DocuSignTK.TemplateReferenceRoleAssignment[] roleAssignments = new List<DocuSignTK.TemplateReferenceRoleAssignment>();
        
        for(DocuSignTK.Recipient dsr: recipients)
        {
            // role assignment
            DocuSignTK.TemplateReferenceRoleAssignment roleAssignment = new DocuSignTK.TemplateReferenceRoleAssignment();
            roleAssignment.RecipientID = dsr.ID;
            roleAssignment.RoleName = dsr.RoleName;
            roleAssignments.add(roleAssignment);
        }
        
        DocuSignTK.ArrayOfTemplateReferenceRoleAssignment ArrayOfTemplateReferenceRoleAssignment = new DocuSignTK.ArrayOfTemplateReferenceRoleAssignment();
        ArrayOfTemplateReferenceRoleAssignment.RoleAssignment = roleAssignments;   
        
        templateReference.TemplateLocation = 'Server';
        templateReference.Template = templateId;
        templateReference.RoleAssignments = ArrayOfTemplateReferenceRoleAssignment;
        
        return templateReference;
    }
    
    // Construct the envelope information
    static DocuSignTK.EnvelopeInformation createEnvelopeInfo(String dsObjectType, String sourceRecordId, String packageToSend)
    {
        DocuSignTK.EnvelopeInformation envelopeInfo = new DocuSignTK.EnvelopeInformation();
        envelopeInfo.AccountId = account_id;
        if(packageToSend.contains('PAA'))
        {envelopeInfo.Subject = 'Action Required: Travelex Producer Appointment Application';}
        else{envelopeInfo.Subject = 'Action Required: Travelex Contract Documents';}
        envelopeInfo.EmailBlurb = 
            'Dear Travelex Partner,\n\n'+
            'Travelex Insurance Services is excited for you to begin offering our travel insurance plans to your travelers.\n\n'+
            'This email is being sent to you to obtain Contract and Licensing documents, so that your company may begin offering the Travelex suite of products.\n\n'+
            'We sincerely thank you for trusting Travelex with your clients’ protection. Your partnership is valued, and we appreciate your business as we continue to provide excellent products, coupled with experienced people, and exceptional care.\n\n'+
            'Should you have questions regarding the enclosed documents prior to acceptance, please contact the Compliance and Licensing team at 888-744-6564 or tislicenseandcompliance@travelexinsurance.com.';
        
        
        DocuSignTK.Notification Notification = new DocuSignTK.Notification();
		Notification.UseAccountDefaults = true;
		envelopeInfo.Notification = Notification;
        
        // linking the source record to the template
        DocuSignTK.CustomField field1 = new DocuSignTK.CustomField (); 
        field1.Name = dsObjectType;
        field1.Value = sourceRecordId;    
        field1.Show = 'false';
        DocuSignTK.CustomField field2 = new DocuSignTK.CustomField (); 
        field2.Name = 'DSFSSourceObjectId';
        field2.Value = sourceRecordId;    
        field2.Show = 'false';
        DocuSignTK.ArrayOfCustomField arrayOfCustomField = new DocuSignTK.ArrayOfCustomField();
        arrayOfCustomField.CustomField  = new DocuSignTK.CustomField[2];
        arrayOfCustomField.CustomField[0] = field1;
        arrayOfCustomField.CustomField[1] = field2;
        envelopeInfo.CustomFields = arrayOfCustomField;
        
        return envelopeInfo;
    }
    
    
    // recipient envelope requirements
    static DocuSignTK.Recipient[] recipients; // individual recipients added here
    static DocuSignTK.ArrayOfRecipient1 ArrayOfRecipient1; // array of recipients added here
    
    
    static void constructContractPackage(String packageToSend, String sourceDsObjectType, String sourceRecordId, List<RecipientWrapper> contacts, String docType)
    {
        // clear recipient lists link recipients
        recipients = new List<DocuSignTK.Recipient>();
        ArrayOfRecipient1 = new DocuSignTK.ArrayOfRecipient1();
        
        // below commented FOR loop can be used when business logic decides on having multiple ds roles
        /*for(RecipientWrapper rw : contacts)
{recipients.add(createRecipient(rw.recipientEmail, rw.recipientUsername, rw.recipientType, rw.recipientId, rw.recipientRoutingOrder));}*/
        // only load the first contact
        recipients.add(createRecipient(contacts[0].recipientEmail, contacts[0].recipientUsername, contacts[0].recipientType, contacts[0].recipientId, contacts[0].recipientRoutingOrder));
        ArrayOfRecipient1.Recipient = recipients;
        
        
        // clear template lists and link template
        templateReferences = new List<DocuSignTK.TemplateReference>();
        ArrayOfTemplateReference = new DocuSignTK.ArrayOfTemplateReference();
        
        // get all server templates for cross referencing
        List<String> serverTemplateIds = new List<String>();
        try {
            // get all templates
            DocuSignTK.EnvelopeTemplates ets = api_sender.RequestTemplates(account_id,true); 
            for(DocuSignTK.EnvelopeTemplateDefinition etd :ets.EnvelopeTemplateDefinition)
            {
                serverTemplateIds.add(etd.TemplateId);
            }
        } catch ( CalloutException e) {
            System.debug('Exception - ' + e );
        } 
        
        // check for valid templates and add if valid
        List<String> templateIds = new List<String>();
        templateIds = getPathTemplates(packageToSend);
        if(templateIds.size()>0)
        {
            for(String s : templateIds)
            {
                if(serverTemplateIds.contains(s))
                {
                    templateReferences.add(linkServerTemplate(s,recipients));
                }
                else
                {
                    System.debug('Error - Template Id *->' + s + '<-* is not active or does not exist in Docusign or path does not exist and will not be added to the envelope.' );
                }
            }
        }
        ArrayOfTemplateReference.TemplateReference = templateReferences;
        
        // assemble and send envelope
        DocuSignTK.EnvelopeInformation envelopeInfo = createEnvelopeInfo(sourceDsObjectType, sourceRecordId, packageToSend);
        doSend(envelopeInfo,sourceRecordId, docType);
    }
    
    // generate envelope and sender screen
    static void doSend(DocuSignTK.EnvelopeInformation envelopeInfo, String sourceRecordId, String docType)
    {
        try {
            DocuSignTK.EnvelopeStatus status = api_sender.CreateEnvelopeFromTemplates(ArrayOfTemplateReference,ArrayOfRecipient1,envelopeInfo,false); // send or draft
            envelope_id = status.EnvelopeID;        	
            senderViewUrl = api_sender.RequestSenderToken(envelope_id, account_id, senderViewUrl);
            
            Id sId = sourceRecordId;
            String strId = String.valueOf(sId.getSobjectType());
            if(strId == 'Contract' && docType=='contract')
            {Database.update(new Contract(Id=sourceRecordId,Status='Sent',Contract_Issued__c=System.today()),false);}
            else if(strId == 'Contract' && docType=='paa')
            {Database.update(new Contract(Id=sourceRecordId,PAA_Issued__c=System.today()),false);}
            else if(strId == 'Licensing__c')
            {Database.update(new Licensing__c(Id=sourceRecordId,Status__c='Sent',Issue_Date__c=System.today()),false);}
        } catch ( CalloutException ce) {
            System.debug('Exception - ' + ce );
            throw new AuraHandledException('An error has occured processing a DocuSign template.  Possible actions to take are: \n(1) Check that templates are configured correctly in DocuSign, \n(2) Confirm that you have a valid DocuSign username & password configured for your Salesforce profile.  \nAlternatively, contact your system administrator.');            
        } catch ( DmlException de) {
            System.debug('Exception - ' + de );
            throw new AuraHandledException('An error has occured.  The contract record failed to update.  Please contact your system administrator.');
        }
    }
    
    class RecipientWrapper
    {
        String recipientEmail;
        String recipientUsername;
        String recipientType;
        Integer recipientId;
        Integer recipientRoutingOrder;
        
        RecipientWrapper(String recipientEmail, String recipientUsername, String recipientType, Integer recipientId, Integer recipientRoutingOrder)
        {
            this.recipientEmail = recipientEmail;
            this.recipientUsername = recipientUsername;
            this.recipientType = recipientType;
            this.recipientId = recipientId;
            this.recipientRoutingOrder = recipientRoutingOrder;
        }
    }
    
    static List<String> getPathTemplates(String packageToSend)
    {
        List<Docusign_Template_Path_Mapping__c> dst = new List<Docusign_Template_Path_Mapping__c>();
        List<String> templateIds = new List<String>();
        
        dst = [select Template_Id__c, Envelope_Package__c 
               from Docusign_Template_Path_Mapping__c 
               where isActive__c=true 
               and Envelope_Package__c != null
               order by Order_of_Precedence__c,Template_Name__c];
        if(dst.size()>0)
        {
            for(Docusign_Template_Path_Mapping__c d : dst)
            {
                String[] envPackages;
                if(d.Envelope_Package__c != null && d.Envelope_Package__c !='')
                {
                    envPackages = d.Envelope_Package__c.split(';',0);
                    
                    for(String s : envPackages)
                    {
                        String tempStr = s.toUpperCase();
                        if(tempStr.contains(packageToSend.toUpperCase()))
                        {
                            templateIds.add(d.Template_Id__c);
                        }
                    }
                }
            }
        }
        if(templateIds.size()<1)
        {
            throw new AuraHandledException('There are no DocuSign templates matching the chosen package or No Contract Path Found.  Please check template path mapping records.');
        }
        return templateIds;
    }
    
    class MyException extends Exception {}
}