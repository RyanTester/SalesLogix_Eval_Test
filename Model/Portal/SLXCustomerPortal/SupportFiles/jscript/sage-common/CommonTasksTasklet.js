if(typeof Sys!=="undefined") { Type.registerNamespace("Sage.TaskPane"); } else { Ext.namespace("Sage.TaskPane"); }
var contextSvc;
var context;
var strEntityId;
var strEntityDescription;
var strEntityTableName;
var selections;
var arraySelections = new Array;
var activeGrid;
var postUrl = "";
var totalCount;
var clientID;
var sortExpression = '';

Sage.TaskPane.CommonTasksTasklet = function(options) {
    this._id = options.id;
    clientID = options.clientId;
};

Sage.TaskPane.CommonTasksTasklet.prototype.init = function() {
    var svc = Sage.Services.getService("GroupManagerService");
    svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, function(sender, evt) {
        this.__doPostBack(clientID, "");
    });
  
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_pageLoaded(function(sender, args) { 
        
         var l = Sage.SalesLogix.Controls.ListPanel.find("MainList");
         if (l) {           
                $("#selectionCount").text(l.getTotalSelectionCount());
         }                
       
    });
    
    
    
};

function GetCurrentEntity() {
    if (Sage.Services.hasService("ClientEntityContext")) {
        contextSvc = Sage.Services.getService("ClientEntityContext");
        context = contextSvc.getContext();
        strEntityId = context.EntityId;
        strEntityType = context.EntityType;
        strEntityTableName = context.EntityTableName;
    }
}

removeCurrentFromGroup = function() {
    try {
        GetCurrentEntity();
        var groupID = Sage.Services.getService("GroupManagerService")._contextService.getContext().CurrentGroupID;
    }
    catch (e) {
        Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);
    }

    var svc = Sage.Services.getService("ClientGroupContext");
    if (svc != null) {
        var grpctxt = svc.getContext();
        var firstid = grpctxt.FirstEntityID;
        if (firstid == strEntityId) {
            firstid = grpctxt.NextEntityID;
        }
        if (firstid != "") {
            if (typeof (setCurentEntityContext) != "undefined") {
                setCurentEntityContext(firstid, strEntityId);
            }
        }
    }


    postUrl = "slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupRemoveMembers&groupID=" + groupID + "&selections=" + strEntityId

    if (postUrl != "") {
        $.ajax({
            type: "POST",
            url: postUrl,
            data: { },
            datatype : "text",
            error: function(request, status, error)
            { alert(error) },
            success: function(status) {
                //Ext.Msg.alert( "Group Updated" );
            }
        });
    }
}

function showAdHocList(e) {
    if (typeof (GroupAdHocListMenu) == 'undefined') {
        GroupAdHocListMenu = new Ext.menu.Menu({ id: 'GroupAdHocList' });
        addToMenu(groupAdHocListMenu.menuitems[0].submenu, GroupAdHocListMenu);
    }
    if (!e) {
        e = { xy: [250, 250] };
    }
    else {
        e = { xy: [e.xy[0] - 52, e.xy[1] + 10] };
    }
    GroupAdHocListMenu.showAt(e.xy);
}
function GetSelectionInfo() {
   var selectionInfo;
    try {
        var panel = Sage.SalesLogix.Controls.ListPanel.find("MainList");
        if (panel) {          
            selectionInfo = panel.getSelectionInfo();
        }
        return selectionInfo;
    }
    catch (e)
    { Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData); }

    
}
function SetSelectionCount() {
   
 
    try {
        var panel = Sage.SalesLogix.Controls.ListPanel.find("MainList");
        if (panel) {          
            
            $("#selectionCount").text(panel.getTotalSelectionCount());
        }
        
    }
    catch (e)
    {  }

    
}



function PrepareSelectionsForExport() {
    totalCount = Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;
    dialogBody = String.format(MasterPageLinks.AdHocDialog_NoneSelectedExcel, totalCount);
    var selectionInfo;
    try {
        selectionInfo = GetSelectionInfo();
    }
    catch (e)
    { Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData); }

    if (selectionInfo.selectionCount == 0) 
    {    
        Ext.MessageBox.confirm("",dialogBody,StoreAllSelectionsOrCancel);
    }
    else 
    {
      
        document.getElementById(clientID + '_hfSelections').value = selectionInfo.key;
        var svc = Sage.Services.getService("SelectionContextService");
        svc.setSelectionContext(selectionInfo.key, selectionInfo, FileFormatCheck)
               
        //FileFormatCheck();
    }
}

StoreAllSelectionsOrCancel = function(agree)
{
    if (agree == "yes") 
    {
        document.getElementById(clientID + '_hfSelections').value = "selectAll";
        FileFormatCheck();
    }
    else 
    {
        document.getElementById(clientID + '_hfSelections').value = "cancel";
    }

}

exportToExcel = function () 
{
    GetCurrentEntity();
    PrepareSelectionsForExport();
}

FileFormatCheck = function(result)
{
    
        var formatIsSaved = getCookie("formatIsSaved");
        var format = getCookie("format");
        //Check for cookie of file format type preference
        if (formatIsSaved == "true" && format.length > 0)  
            {document.getElementById(clientID + '_tskExportToExcel').click();}   
        else
            {PromptForFileFormat();}
}

PromptForFileFormat = function()
{    
    // Prompt the user to select which delimiter the export should use.
    // Their cultural version of csv or Excel preferred Tab.
    // Also allow the user to save this preference, and not be prompted again.
    var form = new Ext.FormPanel({   
       labelAlign:'left',         
       border: false, 
       defaults: {       
        hideLabel: true,
        anchor: '100%'
       },       
       items: [  
                {
                  border: false,                  
                  html: '<p style=padding:5px;>' + CommonTasksResx.ExportToFile_Header + '</p>'
                },
                {  
                  xtype: 'radio',                        
                  name: 'format_type',  
                  checked: true,
                  inputValue: 'csv',  
                  boxLabel: CommonTasksResx.ExportToFile_OptionCSV
                },  
                {  
                  xtype: 'radio',  
                  name: 'format_type',                
                  inputValue: 'tab',  
                  boxLabel: CommonTasksResx.ExportToFile_OptionTab
                },
                {
                border: false
                },
                {  
                  xtype: 'checkbox',  
                  name: 'exportFormatSaved',  
                  inputValue: true,  
                  boxLabel: CommonTasksResx.ExportToFile_OptionSaveFormat
                }
              ]
    });
    var dialog = new Ext.Window({                  
                bodyStyle: 'background-color: C6D7EF',
                border: false,
                width:315,
                height:175,
                layout: 'fit',
                title: CommonTasksResx.ExportToFile_DialogTitle,                
                items: form,
                buttonAlign: "right",
                buttons: [{
                    text: CommonTasksResx.ExportToFile_OK,
                    handler: function()
                    {                                
                        //Get the user preference
                        var typeIsSaved = form.getForm().getValues().exportFormatSaved;;
                        var formatType = form.getForm().getValues().format_type;

                        //Save the user preference
                        if (typeIsSaved != undefined)
                            {document.cookie = "formatIsSaved=" + typeIsSaved + "; expires=1/01/2020";}               
                        document.cookie = "format=" + formatType + "; expires=1/01/2020";      
                        //Call the click event for the hidden sumbit button.
                        document.getElementById(clientID + '_tskExportToExcel').click();
                        dialog.hide();
                    }},
                    {
                        text: CommonTasksResx.ExportToFile_Cancel,
                        handler: function()
                    {
                        dialog.hide();
                    }
                }]
    });
    dialog.show();
       
}
function EmailSend() {
    GetCurrentEntity();
    var url = "slxdata.ashx/slx/crm/-/namedqueries?columnaliases=email&format=json&hql="
    url = url + GetURL(strEntityTableName);
    $.ajax({
        url: url,
        dataType: 'json',
        success: Send,
        error: function(error) {
            alert(error);
        }
    });
}

function Send(email) {
    var sEmail = email.items[0].email
    if (email.count > 0 && sEmail) {
        sEmail = email.items[0].email;

        sEmail = "mailto:" + sEmail;
        document.location.href = sEmail;
    }
    else Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoEmail);
}

function GetURL(entity) {
    switch (entity) {
        // Example when using cached Named Query 
        //case 'CAMPAIGN': url = strEntityTableName +"EmailGet&where=cam.id eq '" + strEntityId + "'";     
        case 'CONTACT': url = "select con.Email from Contact con where con.id like '" + strEntityId + "'";
            break;
        case 'ACCOUNT': url = "select con.Email from Contact as con where con.Account.id like '" + strEntityId + "' and con.IsPrimary like 'T'";
            break;
        case 'OPPORTUNITY': url = "select con.Email from Opportunity as opp left join opp.Contacts as oppCon left join oppCon.Contact as con where opp.id like '" + strEntityId + "' and oppCon.IsPrimary like 'T'";
            break;
        case 'LEAD': url = "select le.Email from Lead le where le.id like '" + strEntityId + "'";
            break;
        case 'CAMPAIGN': url = "select ufo.Email from Campaign as cam left join cam.AccountManager as usr left join usr.UserInfo as ufo where cam.id like '" + strEntityId + "'";
            break;
        case 'TICKET': url = "select ufo.Email from User as usr left join usr.UserInfo as ufo where usr.DefaultOwner in  (select own.id from Ticket as tic left join tic.AssignedTo as own where tic.id like '" + strEntityId + "')";
            break;
        case 'DEFECT': url = "select ufo.Email from User as usr left join usr.UserInfo as ufo where usr.DefaultOwner in (select own.id from Defect as def left join def.AssignedTo as own where def.id like '" + strEntityId + "')";
            break;
        case 'CONTRACT': url = "select con.Email from Contract as crt left join crt.Contact as con where crt.id like '" + strEntityId + "'";
            break;

    }
    return url;
}