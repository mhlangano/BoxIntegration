@isTest
global class DocuSignTKCalloutMock implements WebServiceMock {
    global void doInvoke(
        Object stub,
        Object request,
        Map<String, Object> response,
        String endpoint,
        String soapAction,
        String requestName,
        String responseNS,
        String responseName,
        String responseType) {
            // start - specify the response you want to send
            
            if(requestName=='RequestTemplates')
            {
                DocuSignTK.RequestTemplatesResponse_element response_x = new DocuSignTK.RequestTemplatesResponse_element();
                DocuSignTK.EnvelopeTemplateDefinition etd = new DocuSignTK.EnvelopeTemplateDefinition();
                etd.TemplateID = 'TESTTEMPLATEID';
                DocuSignTK.EnvelopeTemplates et = new DocuSignTK.EnvelopeTemplates();
                et.EnvelopeTemplateDefinition = new List<DocuSignTK.EnvelopeTemplateDefinition>{etd};
                    response_x.RequestTemplatesResult = et;
                response.put('response_x', response_x); 
            }
            if(requestName=='CreateEnvelopeFromTemplates')
            {
                DocuSignTK.CreateEnvelopeFromTemplatesResponse_element response_x = new DocuSignTK.CreateEnvelopeFromTemplatesResponse_element();
                DocuSignTK.EnvelopeStatus es = new DocuSignTK.EnvelopeStatus();
                es.EnvelopeID = 'TESTENVID';
                response_x.CreateEnvelopeFromTemplatesResult = es;
                response.put('response_x', response_x); 
            }
             if(requestName=='RequestSenderToken')
            {
                DocuSignTK.RequestSenderTokenResponse_element response_x = new DocuSignTK.RequestSenderTokenResponse_element();
                response_x.RequestSenderTokenResult = 'SENDERURL1';
                response.put('response_x', response_x); 
            }
            
        }
}