<script language="javascript" type="text/javascript">

	function OnTabFiltersClick()
	{
	    SetDivDisplay("@csd_divFiltersId", "inline");	
	    SetDivDisplay("@csd_divOptionsId", "none");
	    
	    SetTabDisplay("@csd_tabFiltersId", "activeTab tab");
	    SetTabDisplay("@csd_tabOptionsId", "inactiveTab tab");
	    
        SetSelectedTabState("@csd_txtSelectedTabId", 1);
	}
	
    function OnTabOptionsClick()
	{
	    SetDivDisplay("@csd_divFiltersId", "none");	
	    SetDivDisplay("@csd_divOptionsId", "inline");
	    
	    SetTabDisplay("@csd_tabFiltersId", "inactiveTab tab");
	    SetTabDisplay("@csd_tabOptionsId", "activeTab tab");
	    
        SetSelectedTabState("@csd_txtSelectedTabId", 2);
	}
	
	function SetDivDisplay(divId, display)
    { 
        var control = document.getElementById(divId);
        if (control != null)
        {
            control.style.display = display;
        }
    }
    
    function SetTabDisplay(tabId, displayClass)
    {
        var control = document.getElementById(tabId);
        if (control != null)
        {
            control.className = displayClass;
        }
    }
    
    function SetSelectedTabState(tabStateId, index)
    {
    	var selectTab = document.getElementById(tabStateId);
	    if (selectTab != null)
	    {
	        selectTab.value = index;
	    }
    }
 var summaryWindow;
 var summaryID = 'summary-div';   
 var rooturl = 'slxdata.ashx/slx/crm/-/namedqueries?format=json&';
function GetReqestUrl(entityType, entityId)
{

   var url = null;
   if(entityType == 'Contact')
   {
      url = GetContactReqeustUrl(entityId);
   }
   if(entityType == 'Lead')
   {
      url = GetLeadReqeustUrl(entityId);
   }
   if(entityType == 'Account')
   {
      url = GetAccountReqeustUrl(entityId);
   }
   return url;
   
}

function GetContactReqeustUrl(entityId)
{
    
   var fmtstr ="mainentity.id eq '{0}'";
   var params = 
   {
        name: 'ContactSearch',
        where: String.format(fmtstr, entityId)
   }
   var url = rooturl + buildQParamStr(params);
   return url;
}

function GetLeadReqeustUrl(entityId)
{
   
   
   var fmtstr ="mainentity.id eq '{0}'";
   var params = 
   {
        name: 'LeadSearch',
        where: String.format(fmtstr, entityId)
   }
   var url = rooturl + buildQParamStr(params);
   return url;
}

function GetAccountReqeustUrl(entityId)
{
   
   
   var fmtstr ="mainentity.id eq '{0}'";
   var params = 
   {
        name: 'AccountSearch',
        where: String.format(fmtstr, entityId)
   }
   var url = rooturl + buildQParamStr(params);
   return url;
}

function buildQParamStr(params)
{
    var o = params;
    var p = [];       
    if (typeof o === "object")
        for (var k in o)
            p.push(k + "=" + encodeURIComponent(o[k]));
    else if (typeof o === "string")
        p.push(o);
     
    return p.join("&");
}


function GetTemplate(entityType)
{
   
   var tpl = null;
   if(entityType == 'Contact')
   {
      tpl = GetContactTemplate();
   }
   if(entityType == 'Lead')
   {
      tpl = GetLeadTemplate();
   }
   if(entityType == 'Account')
   {
      tpl = GetAccountTemplate();
   }
   return tpl;
   
}

function GetContactTemplate()
{
  
    
     var tpl = new Ext.XTemplate(
                    '<Template>',
'<tpl for="items">',
'<div id="{id}" class="EntityCard">',
'<table><col style="width:150px"/><col style="width:300px" /><col/>',
'<thead>',
  '<tr>',
    '<th colspan="3">',
        '<div class="SummaryTitle">',
           '<a href="Contact.aspx?entityid={id}" >{name}</a>',
        '</div>',
    '</th>',
  '</tr>',
'</thead>',
'<tbody>',
  '<tr>',
    '<td class="DataColumn">',
      '<ul>',
         '<li><span>{address_address1}</span></li>',
         '<li><span>{address_citystatezip}</span></li>',                   
      '</ul>',
    '</td>',
    '<td class="DataColumn">',
      '<table>',
         '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svAccount_Caption}</td>',
            '<td class="DataItem"><a href="Account.aspx?entityid={account_id}" >{accountname}</a></td>',
        '</tr>',
         '<tr>',
          '<td class="SummaryCaption">{SummaryView_Captions.svTitle_Caption}</td>',
          '<td class="DataItem">{title}</td>',
       '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svWorkPhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.workphone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svHomePhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.homephone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svMobilePhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.mobilephone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svEmail_Caption}</td>',
            '<td class="DataItem">{email}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svWebAddress_Caption}</td>',
            '<td class="DataItem">{webaddress}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svType_Caption}</td>',
           '<td class="DataItem">{type}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svAccMgr_Caption}</td>',
           '<td class="DataItem">{accountmanager_userinfo_firstname}</td>',
       '</tr>',
     '</table>',
  '</td>',
 '</tr>',
'</tbody>',
'</table>',
'</div>',
'</tpl>',
'</Template>'
 );
                    
                               
                                         
              
                
      return tpl;

}

function GetLeadTemplate()
{
  
     var tpl = new Ext.XTemplate(
                    '<Template>',
'<tpl for="items">',
'<div id="{id}" class="EntityCard">',
'<table><col style="width:150px"/><col style="width:300px" /><col/>',
'<thead>',
  '<tr>',
    '<th colspan="3">',
        '<div class="SummaryTitle">',
           '<a href="Lead.aspx?entityid={id}" >{name}</a>',
        '</div>',
    '</th>',
  '</tr>',
'</thead>',
'<tbody>',
  '<tr>',
    '<td class="DataColumn">',
      '<ul>',
         '<li><span>{address_address1}</span></li>',
         '<li><span>{address_citystatezip}</span></li>',                   
      '</ul>',
    '</td>',
    '<td class="DataColumn">',
      '<table>',
         '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svCompany_Caption}</td>',
            '<td class="DataItem">{company}</td>',
        '</tr>',
         '<tr>',
          '<td class="SummaryCaption">{SummaryView_Captions.svTitle_Caption}</td>',
          '<td class="DataItem">{title}</td>',
       '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svWorkPhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.workphone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svHomePhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.homephone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svMobilePhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.mobilephone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svEmail_Caption}</td>',
            '<td class="DataItem">{email}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svWebAddress_Caption}</td>',
            '<td class="DataItem">{webaddress}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svType_Caption}</td>',
           '<td class="DataItem">{type}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svAccMgr_Caption}</td>',
           '<td class="DataItem">{accountmanager_userinfo_lastname}, {accountmanager_userinfo_firstname}</td>',
       '</tr>',
     '</table>',
  '</td>',
 '</tr>',
'</tbody>',
'</table>',
'</div>',
'</tpl>',
'</Template>'
 );
         
      return tpl;

}

function GetAccountTemplate()
{
  
     var tpl = new Ext.XTemplate(
                    '<Template>',
'<tpl for="items">',
'<div id="{id}" class="EntityCard">',
'<table><col style="width:150px"/><col style="width:300px" /><col/>',
'<thead>',
  '<tr>',
    '<th colspan="3">',
        '<div class="SummaryTitle">',
           '<a href="Account.aspx?entityid={id}" >{name}</a>',
        '</div>',
    '</th>',
  '</tr>',
'</thead>',
'<tbody>',
  '<tr>',
    '<td class="DataColumn">',
      '<ul>',
         '<li><span>{address_address1}</span></li>',
         '<li><span>{address_citystatezip}</span></li>',                   
      '</ul>',
    '</td>',
    '<td class="DataColumn">',
      '<table>',
         '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svType_Caption}</td>',
           '<td class="DataItem">{type}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svStatus_Caption}</td>',
           '<td class="DataItem">{status}</td>',
        '</tr>',
        '<tr>',
          '<td class="SummaryCaption">{SummaryView_Captions.svDivision_Caption}</td>',
          '<td class="DataItem">{division}</td>',
       '</tr>',
       '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svIndustry_Caption}</td>',
            '<td class="DataItem">{industry}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svMainPhone_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.mainphone)]}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svTollFree_Caption}</td>',
            '<td class="DataItem">{[RenderPhoneNumber(values.tollfree)]}</td>',
        '</tr>',
        
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svEmail_Caption}</td>',
            '<td class="DataItem">{email}</td>',
        '</tr>',
        '<tr>',
            '<td class="SummaryCaption">{SummaryView_Captions.svWebAddress_Caption}</td>',
            '<td class="DataItem">{webaddress}</td>',
        '</tr>',
        '<tr>',
           '<td class="SummaryCaption">{SummaryView_Captions.svAccMgr_Caption}</td>',
           '<td class="DataItem">{accountmanager_userinfo_lastname}, {accountmanager_userinfo_firstname}</td>',
       '</tr>',
     '</table>',
  '</td>',
 '</tr>',
'</tbody>',
'</table>',
'</div>',
'</tpl>',
'</Template>'
 );
         
      return tpl;

}

function GetErrorTemplate()
{
  
     var tpl = new Ext.XTemplate(
                    '<p><b>EntityType:</b> {EntityType}</p>',
                    '<p><b>EntityId:</b>   {EntityId}</p>',
                    '<p><b>Error:</b>',
                    '<p>{Error}</p>'                                       
                                         
                );
                
      return tpl;

}
function showSummaryView(source, entityType, entityId)
{
          
       var url = GetReqestUrl(entityType, entityId);
       ShowData(url, successRequest, errorRequest, source, entityType, entityId);
           

}
function ShowData (url, successcallback, errorcallback, source, entityType, entityId) 
{     
    if (typeof successcallback === "undefined") { successcallback = function(data) {  }; };
    if (typeof errorcallback === "undefined") { errorcallback = function() { }; };
    if (typeof entityType === "undefined") { entityType = ''; }
    if (typeof entityId === "undefined") { entityId = ''; }
   
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            successcallback(source, entityType, entityId, data); 
        },
        error: function(request, status, error) {
            errorcallback(source, entityType, entityId, error); 
        }
    });
} 
function successRequest(source, entityType, entityId, data)
{
                           
        var win = GetSummaryWindow();
        win.setTitle(GetSummaryTitle(entityType));  
      
       var tpl = GetTemplate(entityType);
       tpl.overwrite(summaryID, data);
       win.show(source)         

}  
 
function errorRequest(source, entityType, entityId, error)
{
  
   var divEl = document.getElementById(summaryID);

    if (!divEl)
    {
        $("body").append("<div id=\"summary-div\"></div>");
    }
                        
        var win = GetSummaryWindow();
            win.setTitle('Summary View');
      
       var data = 
       {
         EntityType: entityType,
         EntityId: entityId,
         Error:  error
       };
       var tpl = GetErrorTemplate();
       tpl.overwrite(summaryID, data);
       win.show(source)
} 
  
function GetSummaryWindow()
{

   var divEl = document.getElementById(summaryID);

    if (!divEl)
    {
        $("body").append("<div id=\"summary-div\"></div>");
    }
   
   
   if(summaryWindow == null)
   {
      
     summaryWindow = new Ext.Window({
            title    : 'Summary View',
            id: 'win-Summary',
            closable : true,
            contentEl: summaryID,
            closeAction: 'hide',
            width    : 600,
            height   : 350            
            
        }); 
      
      
      
   }
   return summaryWindow
}





function GetSummaryTitle(entityType)
{

   var title = null;
   if(entityType == 'Contact')
   {
      title = SummaryView_Captions.svSummaryViewContact_Title;
   }
   if(entityType == 'Lead')
   {
      title = SummaryView_Captions.svSummaryViewLead_Title;
   }
   if(entityType == 'Account')
   {
      title = SummaryView_Captions.svSummaryViewAccount_Title;
   }
   return title;
   
}

function RenderPhoneNumber(value)
 {
    if ((value == null) || (value == "null")) return "&nbsp;";
    if (!value || value.length != 10)
        return value;
      
    return String.format("({0}) {1}-{2}", value.substring(0,3), value.substring(3,6), value.substring(6));     
}
    
</script>