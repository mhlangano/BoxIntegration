/* 
*Author : Mhlangano Khumalo - Canpango SA
* Description : Aims to consolidate all required data in to the Contract for the purposes of DocuSign integration medge templates.
* Test Class : ContractHelperTest
* Original Version Date: 11 April 2018 
* Version : 01 
*/
public with sharing class ContractHelper {
    
    public static void updateDocuSignAssetProductInfo(List<Contract> contractList, List<Contract> RetailExhi, List<Contract> SRExhi) {
       map<Id,Account> accountMap = new map<Id,Account>();
        
       for(Contract contr : contractList){
           accountMap.put(contr.AccountId, null);
       }  
       
       accountMap.remove(null); 
       
       accountMap.putAll([Select phone, Email__c, fax, website, Merchant_of_Record__c,Licensing_Model__c,Account_Type__c,Legal_Entity_Name__c From Account Where Id In : accountMap.keyset()]);  
        
       System.debug('Size::: '+accountMap.size());        
       
       Map<Id, Contact> contactMap = new Map<Id, Contact>();
       
       List<Contact> primaryContact = [SELECT firstName, lastName, email, DS_Role__c, AccountId From Contact WHERE Contact_Type__c includes ('Primary') AND AccountId In : accountMap.keyset() LIMIT 1];        
       
       Map<Id, Asset> assetMap = new Map<Id, Asset>();             
       Map<Id, Asset> riskAssetMap = new Map<Id, Asset>();
       
       //Populated if a Group Asset appears in asset list
       String groupProcedureApply = '';
        
       // Retail Exhibit A 
       if(RetailExhi.size()>0){ 
           for(Asset ass : [SELECT AccountId ,Product2.Name, Product2Id, Name ,Product2.RecordTypeId,Product2.RecordType.Name,Compensation__c, Special_Note__c ,Product2.Product_Type__c,Commission_Protection_Percent__c from Asset where AccountId In : accountMap.keyset() AND (Status =: 'Pending Activation' OR Status =: 'Activated') ORDER BY Name ASC]){                                                
                 if(ass.Product2.Name!= NULL && ass.Product2.Name.ContainsIgnoreCase('Group') == true){ //ass.Product2.RecordType.Name== 'Group'){  
                     groupProcedureApply = '* Group Procedures apply';
                 }                                                  
                 assetMap.put(ass.Id, ass);
           }
       }
       
       //SR Exhibit A
       if(SRExhi.size()>0){ 
           for(Asset riskAssets : [SELECT AccountId ,Product2.Name, Name,Product2.RecordTypeId,Product2.RecordType.Name ,Compensation__c, Product2Id, Special_Note__c , Product2.Product_Type__c ,Commission_Protection_Percent__c from Asset where AccountId In : accountMap.keyset() AND Status =: 'Pending Activation' ORDER BY Name ASC]){                                                
                 riskAssetMap.put(riskAssets.Id, riskAssets);
           }   
       }    
    
       integer assetsSize = assetMap.size();
       integer riskAssetsSize = riskAssetMap.size();
       System.debug('aaaaa: '+riskAssetsSize );
       System.debug('aaaaa1: '+riskAssetsSize );
       
       Integer riskCounter = 0;
       Integer counter =0;
       for(Contract contra : contractList){
               
               //Clear AssetProducts 
               //first 
               contra.DS_AssetProdName1__c = '';
               contra.DS_AssetProdComm1__c = '';
               contra.DS_Special_Note1__c = ''; 
                                    
               contra.DS_RiskAssetProdName1__c = '';
               contra.DS_RiskAssetProdComm1__c = '';
               contra.DS_RiskSpecial_Note1__c = '';  
                  
               //second     
               contra.DS_AssetProdName2__c  = '';
               contra.DS_AssetProdComm2__c = '';
               contra.DS_Special_Note2__c = ''; 
                                                                                
               contra.DS_RiskAssetProdName2__c  = '';
               contra.DS_RiskAssetProdComm2__c = '';
               contra.DS_RiskSpecial_Note2__c = '';            
                  
               //third  
               contra.DS_AssetProdName3__c  = '';
               contra.DS_AssetProdComm3__c = '';
               contra.DS_Special_Note3__c = '';                    
                
               contra.DS_RiskAssetProdName3__c  = '';
               contra.DS_RiskAssetProdComm3__c = '';
               contra.DS_RiskSpecial_Note3__c = '';            
                                    
               //fourth  
               contra.DS_AssetProdName4__c  = '';
               contra.DS_AssetProdComm4__c = '';
               contra.DS_Special_Note4__c = ''; 
                                    
               contra.DS_RiskAssetProdName4__c  = '';
               contra.DS_RiskAssetProdComm4__c = '';
               contra.DS_RiskSpecial_Note4__c = '';            
                                    
               //fifth
               contra.DS_AssetProdName5__c  = ''; 
               contra.DS_AssetProdComm5__c = '';
               contra.DS_Special_Note5__c = ''; 
                                    
               contra.DS_RiskAssetProdName5__c  = ''; 
               contra.DS_RiskAssetProdComm5__c = '';
               contra.DS_RiskSpecial_Note5__c = '';  
                                    
               //sixth  
               contra.DS_AssetProdName6__c  = ''; 
               contra.DS_AssetProdComm6__c = '';
               contra.DS_Special_Note6__c = '';  
                                       
               contra.DS_RiskAssetProdName6__c  = ''; 
               contra.DS_RiskAssetProdComm6__c = '';
               contra.DS_RiskSpecial_Note6__c = '';    
                   
               //seventh 
               contra.DS_AssetProdName7__c  = ''; 
               contra.DS_AssetProdComm7__c = '';
               contra.DS_Special_Note7__c = ''; 
                                     
               contra.DS_RiskAssetProdName7__c  = ''; 
               contra.DS_RiskAssetProdComm7__c = '';
               contra.DS_RiskSpecial_Note7__c = ''; 
                  
               //eigth 
               contra.DS_AssetProdName8__c  = ''; 
               contra.DS_AssetProdComm8__c = '';
               contra.DS_Special_Note8__c = ''; 
                                    
               contra.DS_RiskAssetProdName8__c  = ''; 
               contra.DS_RiskAssetProdComm8__c = '';
               contra.DS_RiskSpecial_Note8__c = ''; 
                  
               //nine  
               contra.DS_AssetProdName9__c  = ''; 
               contra.DS_AssetProdComm9__c = '';
               contra.DS_Special_Note9__c = ''; 
                                    
               contra.DS_RiskAssetProdName9__c  = ''; 
               contra.DS_RiskAssetProdComm9__c = '';
               contra.DS_RiskSpecial_Note9__c = '';   
                  
               //ten  
               contra.DS_AssetProdName10__c  = ''; 
               contra.DS_AssetProdComm10__c = '';
               contra.DS_Special_Note10__c = '';
                  
               contra.DS_RiskAssetProdName10__c  = ''; 
               contra.DS_RiskAssetProdComm10__c = '';
               contra.DS_RiskSpecial_Note10__c = '';                  
                  
               //eleven  
               contra.DS_AssetProdName11__c  = ''; 
               contra.DS_AssetProdComm11__c = '';
               contra.DS_Special_Note11__c = '';  
                                    
               contra.DS_RiskAssetProdName11__c  = ''; 
               contra.DS_RiskAssetProdComm11__c = '';
               contra.DS_RiskSpecial_Note11__c = '';    
                  
               //twelve  
               contra.DS_AssetProdName12__c  = ''; 
               contra.DS_AssetProdComm12__c = '';
               contra.DS_Special_Note12__c = '';
                                   
               contra.DS_RiskAssetProdName12__c  = ''; 
               contra.DS_RiskAssetProdComm12__c = '';
               contra.DS_RiskSpecial_Note12__c = '';                                                                                                                                                    
                                         
              //Set New Risk Assets Values                            
              //Risk Assets

              if(riskAssetsSize > 0 && riskCounter == 0){
                  contra.DS_RiskAssetProdName1__c = riskAssetMap.values()[0].Product2.Name;                                
                  contra.DS_RiskAssetProdComm1__c = String.valueOf(riskAssetMap.values()[0].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[0].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note1__c = riskAssetMap.values()[0].Special_Note__c; 
                  riskCounter++;
              }                           
              if(riskAssetsSize > 1 && riskCounter == 1){
                  contra.DS_RiskAssetProdName2__c = riskAssetMap.values()[1].Product2.Name;
                  contra.DS_RiskAssetProdComm2__c =  String.valueOf(riskAssetMap.values()[1].Compensation__c ==  NULL? '': String.valueOf(riskAssetMap.values()[1].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note2__c = riskAssetMap.values()[1].Special_Note__c; 
                  riskCounter++;
              }  
              if(riskAssetsSize > 2 && riskCounter == 2){
                  contra.DS_RiskAssetProdName3__c = riskAssetMap.values()[2].Product2.Name;
                  contra.DS_RiskAssetProdComm3__c = String.valueOf(riskAssetMap.values()[2].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[2].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note3__c = riskAssetMap.values()[2].Special_Note__c; 
                  riskCounter++;
              } 
              if(riskAssetsSize > 3 && riskCounter== 3){
                  contra.DS_RiskAssetProdName4__c = riskAssetMap.values()[3].Product2.Name;
                  contra.DS_RiskAssetProdComm4__c = String.valueOf(riskAssetMap.values()[3].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[3].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note4__c = riskAssetMap.values()[3].Special_Note__c; 
                  riskCounter++;
              } 
              if(riskAssetsSize > 4 && riskCounter == 4){
                  contra.DS_RiskAssetProdName5__c = riskAssetMap.values()[4].Product2.Name;
                  contra.DS_RiskAssetProdComm5__c = String.valueOf(riskAssetMap.values()[4].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[4].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note5__c = riskAssetMap.values()[4].Special_Note__c; 
                  riskCounter++;
              }  
              if(riskAssetsSize > 5 && riskCounter == 5){
                  contra.DS_RiskAssetProdName6__c = riskAssetMap.values()[5].Product2.Name;
                  contra.DS_RiskAssetProdComm6__c = String.valueOf(riskAssetMap.values()[5].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[5].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note6__c = riskAssetMap.values()[5].Special_Note__c; 
                  riskCounter++;
              }   
              if(riskAssetsSize > 6 && riskCounter == 6){
                  contra.DS_RiskAssetProdName7__c = riskAssetMap.values()[6].Product2.Name;
                  contra.DS_RiskAssetProdComm7__c = String.valueOf(riskAssetMap.values()[6].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[6].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note7__c = riskAssetMap.values()[6].Special_Note__c; 
                  riskCounter++;
              }                                                                               
              if(riskAssetsSize > 7 && riskCounter == 7){
                  contra.DS_RiskAssetProdName8__c = riskAssetMap.values()[7].Product2.Name;
                  contra.DS_RiskAssetProdComm8__c = String.valueOf(riskAssetMap.values()[7].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[7].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note8__c = riskAssetMap.values()[7].Special_Note__c; 
                  riskCounter++;
              }   
              if(riskAssetsSize > 8 && riskCounter == 8){
                  contra.DS_RiskAssetProdName9__c = riskAssetMap.values()[8].Product2.Name;
                  contra.DS_RiskAssetProdComm9__c = String.valueOf(riskAssetMap.values()[8].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[8].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note9__c = riskAssetMap.values()[8].Special_Note__c; 
                  riskCounter++;
              }
              if(riskAssetsSize > 9 && riskCounter == 9){
                  contra.DS_RiskAssetProdName10__c = riskAssetMap.values()[9].Product2.Name;
                  contra.DS_RiskAssetProdComm10__c = String.valueOf(riskAssetMap.values()[9].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[9].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note10__c = riskAssetMap.values()[9].Special_Note__c; 
                  riskCounter++;
              }              
              if(riskAssetsSize > 10 && riskCounter == 10){
                  contra.DS_RiskAssetProdName11__c = riskAssetMap.values()[10].Product2.Name;
                  contra.DS_RiskAssetProdComm11__c = String.valueOf(riskAssetMap.values()[10].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[10].Compensation__c)+'%'); 
                  contra.DS_RiskSpecial_Note11__c = riskAssetMap.values()[10].Special_Note__c; 
                  riskCounter++;
              }   
              if(riskAssetsSize > 11 && riskCounter == 11){
                  contra.DS_RiskAssetProdName12__c = riskAssetMap.values()[11].Product2.Name;
                  contra.DS_RiskAssetProdComm12__c = String.valueOf(riskAssetMap.values()[11].Compensation__c==  NULL? '': String.valueOf(riskAssetMap.values()[11].Compensation__c)+'%');                                                   
                  contra.DS_RiskSpecial_Note12__c = riskAssetMap.values()[11].Special_Note__c;
                  riskCounter++; 
              }
                                                                                
              //Assets
              contra.Group_Procedures_apply__c = groupProcedureApply ;
              
              //Asset - Load all assetList values on Contract
              if(assetsSize > 0 && counter== 0){
                    contra.DS_AssetProdName1__c = assetMap.values()[0].Product2.Name;
                    contra.DS_AssetProdComm1__c =  String.valueOf(assetMap.values()[0].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[0].Compensation__c)+'%');    
                    contra.DS_Special_Note1__c = assetMap.values()[0].Special_Note__c; 
                    counter++;                             
              }
              if(assetsSize > 1 && counter == 1){
                    contra.DS_AssetProdName2__c = assetMap.values()[1].Product2.Name;
                    contra.DS_AssetProdComm2__c = String.valueOf(assetMap.values()[1].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[1].Compensation__c)+'%');                                   
                    contra.DS_Special_Note2__c = assetMap.values()[1].Special_Note__c;    
                    counter++;                       
              }    
              if(assetsSize > 2 && counter == 2){
                    contra.DS_AssetProdName3__c = assetMap.values()[2].Product2.Name; 
                    contra.DS_AssetProdComm3__c =  String.valueOf(assetMap.values()[2].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[2].Compensation__c)+'%');   
                    contra.DS_Special_Note3__c = assetMap.values()[2].Special_Note__c;   
                    counter++;                       
              }                        
              if(assetsSize > 3 && counter == 3){
                    contra.DS_AssetProdName4__c = assetMap.values()[3].Product2.Name; 
                    contra.DS_AssetProdComm4__c =  String.valueOf(assetMap.values()[3].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[3].Compensation__c)+'%'); 
                    contra.DS_Special_Note4__c = assetMap.values()[3].Special_Note__c;  
                    counter++;                        
              } 
              if(assetsSize > 4 && counter == 4){
                    contra.DS_AssetProdName5__c = assetMap.values()[4].Product2.Name; 
                    contra.DS_AssetProdComm5__c =  String.valueOf(assetMap.values()[4].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[4].Compensation__c)+'%'); 
                    contra.DS_Special_Note5__c = assetMap.values()[4].Special_Note__c;    
                    counter++;                       
              }  
              if(assetsSize > 5 && counter == 5){
                    contra.DS_AssetProdName6__c = assetMap.values()[5].Product2.Name; 
                    contra.DS_AssetProdComm6__c =  String.valueOf(assetMap.values()[5].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[5].Compensation__c)+'%');  
                    contra.DS_Special_Note6__c = assetMap.values()[5].Special_Note__c;  
                    counter++;                        
              } 
              if(assetsSize > 6 && counter == 6){
                    contra.DS_AssetProdName7__c = assetMap.values()[6].Product2.Name; 
                    contra.DS_AssetProdComm7__c =  String.valueOf(assetMap.values()[6].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[6].Compensation__c)+'%');  
                    contra.DS_Special_Note7__c = assetMap.values()[6].Special_Note__c;
                    counter++;                           
              }  
              if(assetsSize > 7 && counter == 7){
                    contra.DS_AssetProdName8__c = assetMap.values()[7].Product2.Name; 
                    contra.DS_AssetProdComm8__c =  String.valueOf(assetMap.values()[7].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[7].Compensation__c)+'%'); 
                    contra.DS_Special_Note8__c = assetMap.values()[7].Special_Note__c;  
                    counter++;                         
              }   
              if(assetsSize > 8 && counter == 8){
                    contra.DS_AssetProdName9__c = assetMap.values()[8].Product2.Name; 
                    contra.DS_AssetProdComm9__c =  String.valueOf(assetMap.values()[8].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[8].Compensation__c)+'%'); 
                    contra.DS_Special_Note9__c = assetMap.values()[8].Special_Note__c; 
                    counter++;                           
              }  
              if(assetsSize > 9 && counter == 9){
                    contra.DS_AssetProdName10__c = assetMap.values()[9].Product2.Name; 
                    contra.DS_AssetProdComm10__c =  String.valueOf(assetMap.values()[9].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[9].Compensation__c)+'%');  
                    contra.DS_Special_Note10__c = assetMap.values()[9].Special_Note__c;  
                    counter++;                        
              }                                                 
              if(assetsSize > 10 && counter == 10){
                    contra.DS_AssetProdName11__c = assetMap.values()[10].Product2.Name; 
                    contra.DS_AssetProdComm11__c =  String.valueOf(assetMap.values()[10].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[10].Compensation__c)+'%'); 
                    contra.DS_Special_Note11__c = assetMap.values()[10].Special_Note__c;    
                    counter++;                        
              }  
              if(assetsSize > 11 && counter == 11){
                    contra.DS_AssetProdName12__c = assetMap.values()[11].Product2.Name; 
                    contra.DS_AssetProdComm12__c =  String.valueOf(assetMap.values()[11].Compensation__c==  NULL? '': String.valueOf(assetMap.values()[11].Compensation__c)+'%'); 
                    contra.DS_Special_Note12__c = assetMap.values()[11].Special_Note__c;      
                    counter++;                     
              }               
                                                                                                        
             //Contact- Load Primary Contact info on Contract
             if(primaryContact.size() > 0){
                  if(contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL){ 
                      contra.Contact_Full_Name__c = primaryContact[0].firstName+' '+primaryContact[0].lastName;
                  }    
                  
                  if(contra.Contact_Email__c  == '' || contra.Contact_Email__c == NULL){ 
                      contra.Contact_Email__c = primaryContact[0].email;
                  }  
    
                  if(contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c == NULL){ 
                      contra.Contact_DS_Role__c = primaryContact[0].DS_Role__c;
                  }                                     
             }else{
             
                  if((contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL) && (contra.Contact_Email__c  == '' || contra.Contact_Email__c == NULL) &&(contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c == NULL)){
                      contra.addError('Primary Contact Not Found on Account, Contact Full Name, Email and Contact DS Role are therefore Required fields');
                  }else{
                      
                      if((contra.Contact_Email__c  == '' || contra.Contact_Email__c == NULL) && (contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c == NULL)){
                              contra.addError('Email and DS Role Required');
                      }else{
                              if((contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL) && (contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c== NULL)){
                                      contra.addError('Contact Full Name and DS Role Required');
                              }else{                      
                                      if(contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL){ 
                                              contra.addError('Contact Full Name Required.');
                                      }   
                                     
                                      if(contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c == NULL){ 
                                              contra.addError('Contact DS Role Required');
                                      }
                              }
                
                              if((contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL) && (contra.Contact_Email__c  == '' || contra.Contact_Email__c  == NULL)){
                                      contra.addError('Contact Full Name and Email Required');
                              }else{  
                                      if((contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL) && (contra.Contact_DS_Role__c== '' || contra.Contact_DS_Role__c== NULL)){
                                              contra.addError('Contact full name and DS Role Required');
                                      }else{                     
                                          if(contra.Contact_Full_Name__c == '' || contra.Contact_Full_Name__c == NULL){ 
                                                  contra.addError('Contact Full Name Required.');
                                          }   
                                          if(contra.Contact_Email__c  == '' || contra.Contact_Email__c == NULL){ 
                                                  contra.addError('Contact Email Required');
                                          }  
                                      }
                              }
                      }                         
                  }              
             }
             
            //Account - Load Account Info on Contract
            if(accountMap.containsKey(contra.AccountId)){            
                //Account
                if(contra.Company_Email__c == '' || contra.Company_Email__c == NULL){ 
                    contra.Company_Email__c  = accountMap.get(contra.AccountId).Email__c;
                }   
                
                if(contra.Company_Fax__c == '' || contra.Company_Fax__c == NULL){ 
                    contra.Company_Fax__c = accountMap.get(contra.AccountId).fax;
                }   
                
                if(contra.Company_Website__c == '' || contra.Company_Website__c == NULL){
                    contra.Company_Website__c = accountMap.get(contra.AccountId).website;
                }   
                
                if(contra.Company_Phone__c == '' || contra.Company_Phone__c == NULL){
                    contra.Company_Phone__c = accountMap.get(contra.AccountId).Phone;
                }             
             }     
        }                                     
    }
}