<%@ Import Namespace="Sage.Common.Syndication.Json"%>
<%@ Import Namespace="Sage.Platform.WebPortal.Services"%>
<%@ Import Namespace="Sage.Platform.WebPortal.SmartParts"%>
<%@ Import Namespace="Sage.Platform.NamedQueries" %>
<%@ Import Namespace="Sage.Platform.Application" %>
<%@ Import Namespace="Sage.Platform.Application.Services" %>
<%@ Import Namespace="Sage.Platform.Security" %>
<%@ Import Namespace="Sage.SalesLogix.Web" %>
<%@ Import Namespace="Sage.Platform.WebPortal" %>
<%@ Import Namespace="System.ComponentModel" %>
<%@ Import Namespace="System.Drawing.Design" %>
<%@ Control Language="C#" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="SalesLogix" %>
<style type="text/css">
.list-detail .SummaryCaption { width: 100px; text-align: left; }
.list-view-summary div.list-view-summary-item { height: 130px; overflow: hidden; }
</style>

<SalesLogix:ListPanel runat="server" ID="ActivityList" FriendlyName="MainList"
    IncludeScript="true" AddTo="center_panel_center" Viewport="mainViewport" CreateOnly="true" DelayLoadUntilReady="false" IncludeScriptAsReference="false">
    <ViewOptions>
        <SalesLogix:ViewOptions Name="list" FitToContainer="true" SingleSelect="true" />
    </ViewOptions>
    <StateDefinition>
        <StateID Value="function() { return 'activity' }" Format="Literal" />
    </StateDefinition>
    <MetaConverters>
        <SalesLogix:MetaConverter Name="list" Type="standardmetaconverter" />
        <SalesLogix:MetaConverter Name="summary" Type="standardsummarymetaconverter" />
    </MetaConverters>
    <Connections>
        <SalesLogix:SDataConnection Name="list" Resource="slxdata.ashx/slx/crm/-/activities/activity/all">
            <Parameters>
                <SalesLogix:ConnectionParameter Name="count" Value="true" />
            </Parameters>
        </SalesLogix:SDataConnection>
        
        <SalesLogix:SDataConnection Name="summary" Resource="slxdata.ashx/slx/crm/-/activities/activity/all-summary">
            <Parameters>
                <SalesLogix:ConnectionParameter Name="count" Value="true"/>
            </Parameters>  
        </SalesLogix:SDataConnection>      
        
    </Connections>
    <Managers>
        <SalesLogix:SummaryManager Name="summary" XType="summarymanager">
            <Connection Resource="slxdata.ashx/slx/crm/-/namedqueries">
                <Parameters>
                    <SalesLogix:ConnectionParameter Name="format" Value="json" />
                    <SalesLogix:ConnectionParameter Name="where" Value="function(c, o) { return String.format(c.format, (o.id ? o.id.substring(0, 12) : o.id)); }"
                        Format="Literal" />
                </Parameters>
            </Connection>
        </SalesLogix:SummaryManager>    
        <SalesLogix:SummaryManager Name="detail" XType="summarymanager">
            <Connection Resource="slxdata.ashx/slx/crm/-/namedqueries">
                <Parameters>
                    <SalesLogix:ConnectionParameter Name="format" Value="json" />
                    <SalesLogix:ConnectionParameter Name="where" Value="function(c, o) { return String.format(c.format, (o.id ? o.id.substring(0, 12) : o.id)); }"
                        Format="Literal" />
                </Parameters>
            </Connection>
        </SalesLogix:SummaryManager>
    </Managers>
</SalesLogix:ListPanel>

<script pin="pin" type="text/javascript">
    groupMenuList = [];
</script>

<SalesLogix:ScriptResourceProvider ID="SR" runat="server">
    <keys>
        <SalesLogix:ResourceKeyName Key="ActivityType_Meeting" />
        <SalesLogix:ResourceKeyName Key="ActivityType_PhoneCall" />
        <SalesLogix:ResourceKeyName Key="ActivityType_ToDo" />                
        <SalesLogix:ResourceKeyName Key="ActivityType_PersonalActivity" />
        <SalesLogix:ResourceKeyName Key="ActivityTypeGrid_PersonalActivity" />              
        <SalesLogix:ResourceKeyName Key="ActivityTabs_AllOpen" />
        <SalesLogix:ResourceKeyName Key="ActivityTabs_Literature" />
        <SalesLogix:ResourceKeyName Key="ActivityTabs_Events" />
        <SalesLogix:ResourceKeyName Key="ActivityTabs_Confirmations" />
        <SalesLogix:ResourceKeyName Key="ActivityMisc_Timeless" />
        <SalesLogix:ResourceKeyName Key="ActivityMisc_Hours" />
        <SalesLogix:ResourceKeyName Key="ActivityMisc_Minutes" /> 
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Complete" />                        
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Recur" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Attachment" />        
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Alarm" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_ActivityType" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_DateTime" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Duration" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Type" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Name" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_AccountCompany" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Regarding" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_Priority" />
        <SalesLogix:ResourceKeyName Key="ActivityColumn_ScheduledFor" />
        <SalesLogix:ResourceKeyName Key="LitColumn_SendDate" />
        <SalesLogix:ResourceKeyName Key="LitColumn_Scheduled" />
        <SalesLogix:ResourceKeyName Key="LitColumn_Contact" />
        <SalesLogix:ResourceKeyName Key="LitColumn_Description" />
        <SalesLogix:ResourceKeyName Key="LitColumn_SendVia" />
        <SalesLogix:ResourceKeyName Key="LitColumn_Priority" />
        <SalesLogix:ResourceKeyName Key="EventColumn_Type" />
        <SalesLogix:ResourceKeyName Key="EventColumn_Description" />
        <SalesLogix:ResourceKeyName Key="EventColumn_StartDate" />
        <SalesLogix:ResourceKeyName Key="EventColumn_EndDate" />
        <SalesLogix:ResourceKeyName Key="EventColumn_User" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_Notification" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_DateTime" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_Activity" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_Duration" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_From" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_Regarding" />
        <SalesLogix:ResourceKeyName Key="ConfColumn_To" />
    </keys>
</SalesLogix:ScriptResourceProvider>

<script pin="pin" type="text/javascript">
    
    //$(document).ready(function() {
    ScriptQueue.at.dom(function() {
    
        Sage.SalesLogix.Controls.StandardMetaConverter.registerLocalizationStore(SR);
        
        var list = window.<%= ActivityList.ClientID %>; 
        var defaultView = "<%= DefaultView %>";        
        var defaultViewToId = {
            "0": "all_open",
            "1": "literature",
            "2": "event",
            "3": "confirmation",
            "actTabConfirm": "confirmation"
        };
        
        document.oncontextmenu = function() { return false; };  
        
        MasterPageLinks.LookupBtnWidth = -6; /* probably not the best way to do this - to ensure width calculation is zero in general.js */
        $("#GroupTabs").css({left: 0});
        
        var tabItems = [{
            id: "all_open",
            title: SR.ActivityTabs_AllOpen, 
            connections: {
                list: {
                    resource: "slxdata.ashx/slx/crm/-/activities/activity/all",
                    parameters: { count: "true" }         
                },
                summary: {
                    resource: "slxdata.ashx/slx/crm/-/activities/activity/all-summary",
                    parameters: { count: "true" }         
                }
            },
            managers: { }
        },{
            id: "literature",
            title: SR.ActivityTabs_Literature,                           
            connections: {
                list: {
                    resource: "slxdata.ashx/slx/crm/-/activities/literature/all",
                    parameters: { count: "true" }                        
                },
                summary: false
            },
            managers: { }
        },{
            id: "event",
            title: SR.ActivityTabs_Events,                          
            connections: {
                list: {
                    resource: "slxdata.ashx/slx/crm/-/activities/event/all",
                    parameters: { count: "true" }                        
                },
                summary: false
            },
            managers: { }
        },{
            id: "confirmation",
            title: SR.ActivityTabs_Confirmations,                          
            connections: {
                list: {
                    resource: "slxdata.ashx/slx/crm/-/activities/confirmation/all",
                    parameters: { count: "true" }                        
                },
                summary: false
            },
            managers: { }
        }];
        
        var tabPanel = new Ext.TabPanel({
            id: 'activity_groups_tabs',
            renderTo:'GroupTabs',
            resizeTabs:false,
            minTabWidth:135,
            enableTabScroll:true,
            animScroll:true,
            border:false,
            items: tabItems,
            listObj : list,
            activeTab: (typeof defaultViewToId[defaultView] !== "undefined") ? defaultViewToId[defaultView] : "all_open"
        });        
                
        var active = tabPanel.getActiveTab();
        if (active) {
            if (typeof Sage.FilterManager.FilterActivityManager != "undefined") {
                Sage.FilterManager.FilterActivityManager.requestActiveFilters(function() {
                    list.connections = Ext.apply({}, Ext.ComponentMgr.get('activity_groups_tabs').getActiveTab().connections);      
                    list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);
                    list.present();          
                });
            } else {
                list.connections = Ext.apply({}, active.connections);      
                list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);                
                list.present();          
            }
        } else {           
            list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);            
            list.present();          
		}
        
        list.on("itemcontextmenu", function(d,e) { 
	            var curActive = tabPanel.getActiveTab();
	            if (curActive.id == 'all_open') 
	            {
	                this.views.list.getSelectionModel().selectRow(d);                
	                showAcivityGridContextMenu(e);
	                e.stopEvent();
	    	    }
	        }); 
	        
	    list.on("beforerefresh", function() {
	            this.setEnableDetailView(tabPanel.getActiveTab().id === "all_open", true);   
	        }); 
        
        tabPanel.on({
            'tabchange': {
                fn: function(panel, tab) {
                    if (typeof Sage.FilterManager.FilterActivityManager != "undefined") {
                        Sage.FilterManager.FilterActivityManager.requestActiveFilters(function() {
                            list.connections = Ext.apply({}, tab.connections);   
                            list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);   
                            //list.setEnableDetailView(tab.id === "all_open");                                
                            list.refresh();
                        });
                    } else {
                        list.connections = Ext.apply({}, tab.connections);   
                        list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);   
                        //list.setEnableDetailView(tab.id === "all_open");                                
                        list.refresh();
                    }
                }
            }
        });              
    });    
</script>

<script pin="pin" type="text/javascript">    
    function showAcivityGridContextMenu(e)
{    
 var panel = Sage.SalesLogix.Controls.ListPanel.find("MainList");
        if (panel)
        {            
            selection = panel.getSelections();
        }
            
    if (typeof(ContextActivityGridMenu) != 'undefined') 
    {
        ContextActivityGridMenu.removeAll();
    }

        if (typeof contextActivityGridMenu_data === "undefined" || !contextActivityGridMenu_data)
        return;
        
        var activityId = selection[0].data.id.split(":");
        var startDate = formatDateTimeUTC(selection[0].data.startDate);
        
        var menustring = Sys.Serialization.JavaScriptSerializer.serialize(contextActivityGridMenu_data);           
        
        menustring = menustring.replace(/%ACTIVITYID%/g, activityId[0])
        menustring = menustring.replace(/%STARTDATE%/g, startDate)
        menustring = menustring.replace(/%CONTACTID%/g, selection[0].data.contactId)
        menustring = menustring.replace(/%ACCOUNTID%/g, selection[0].data.accountId)
        menustring = menustring.replace(/%LEADID%/g, selection[0].data.leadId)
        menustring = menustring.replace(/%OPPORTUNITYID%/g, selection[0].data.opportunityId)
        menustring = menustring.replace(/%TICKETID%/g, selection[0].data.ticketId)
             
        var newgmd = Sys.Serialization.JavaScriptSerializer.deserialize(menustring); 
        
        newgmd = contextActivitySpliceConext(newgmd, selection)
        
        ContextActivityGridMenu = new Ext.menu.Menu({id: 'contextActivityGridMenu'});
        
        addToMenu(newgmd, ContextActivityGridMenu);
        
    if (!e) 
    {
        e = {xy: [ 250, 250 ]};
    }
    
    ContextActivityGridMenu.showAt(e.xy);
}

    function contextActivitySpliceConext(menuData, selection)
    {
        for (i = 0; i < menuData.length; i++) {

            if (selection[0].data.activity_id) {
                if (menuData[i].id == 'menuItemViewActivityOccurrence')
                    menuData.splice(i, 1);
                if (menuData[i].id == 'menuItemCompleteActivityOccurrence')
                    menuData.splice(i, 1);
                if (menuData[i].id == 'menuItemDeleteActivityOccurrence')
                    menuData.splice(i, 1);
            }
            else {
                if (menuData[i].id == 'menuItemViewActivity')
                    menuData.splice(i, 1);
                if (menuData[i].id == 'menuItemCompleteActivity')
                    menuData.splice(i, 1);
                if (menuData[i].id == 'menuItemDeleteActivity')
                    menuData.splice(i, 1);
            }

            if (isNullOrEmpty(selection[0].data.leadId)) {
                if (menuData[i].id == 'menuItemViewLead')
                    menuData.splice(i, 1);
            }

            if (isNullOrEmpty(selection[0].data.contactId)) {
                if (menuData[i].id == 'menuItemViewContact')
                    menuData.splice(i, 1);
                if (menuData[i].id == 'menuItemViewAccount')
                    menuData.splice(i, 1);
            }
            if (isNullOrEmpty(selection[0].data.opportunityId))
                if (menuData[i].id == 'menuItemViewOpportunity')
                menuData.splice(i, 1);

            if (isNullOrEmpty(selection[0].data.ticketId))
                if (menuData[i].id == 'menuItemViewTicket')
                menuData.splice(i, 1);
        }
        return menuData;
     }
    
    function buildHeader(obj) {
        // Hide details for Personal Activities of other users.
        // Note: this should display details for others when current user has edit calendar access, but
        // this logic is not implemented.
        // 262162 = PersonalActivity
        var isVisible = obj.type != 262162 || (obj.userid == getContextByKey('userID') && obj.type == 262162);
        var description = getActivityType(obj.type);
        if (obj.description != null && isVisible)
            description = obj.description;
        var imgTypeUrl = getImage(obj.type);
        
        var startDate = new Date(obj.context.id.slice(13));        
        startDate = formatDateTimeUTC(startDate);        
        if (!obj.recurring)
        {
            var dialogUrl = "javascript:Link.editActivity('" + obj.id + "');";
        }
        else
        {
            var dialogUrl = String.format("javascript: Link.editActivityOccurrence('{0}','{1}')", obj.id , startDate);
        }
        
        var returnString;        
        returnString = '<img src="' + imgTypeUrl + '"/>&nbsp;<a href="' + dialogUrl + '" >' + description + '</a>&nbsp;&nbsp;';
        if (obj.recurring)
            returnString += '<img id="imgRecur" src="images/icons/Recurring_16x16.gif" />&nbsp;';
        if (obj.alarm)            
            returnString += '<img id="imgAlarm" src="images/icons/Alarm_16x16.gif" /> ';
        if (obj.AttachmentCount > 0)            
            returnString += '<img id="imgAlarm" src="images/icons/attach_to_16.png" /> ';             
        
        //Complete Button
        returnString +=  '<input onclick="Link.completeActivity(\'' + obj.id + '\');"  type="button" value="'+ SR.ActivityColumn_Complete +'" id="Complete" class="slxbutton" style="margin-top:10px;margin-right:5px; width:auto;float:right;position:relative;top:-20px;right:25px;"  />';
        
        return returnString;
    }  

    function getImage(type) {
        switch (type) {
            case 262145: //Meeting
                return 'images/icons/Schedule_Meeting_24x24.gif';
                break;
            case 262146: //Phone Call
                return 'images/icons/Schedule_Call_24x24.gif';
                break;
            case 262147: //ToDo:
                return 'images/icons/Schedule_To_Do_24x24.gif';
                break;
            case 262162: //Personal Activity
                return 'images/icons/Schedule_Personal_Activity_24x24.gif';
                break;
        }
        return 'images/icons/Schedule_Meeting_24x24.gif';
    }

    function getImageText(obj) {
        var dialogUrl = "javascript:Link.editActivity('" + obj.row.data.id + "');";

        switch (obj.value) {
            case 262145: //Meeting
                return '<img src="images/icons/Schedule_Meeting_16x16.gif" />&nbsp;<a href="' + dialogUrl + '" > ' + SR.ActivityType_Meeting + '</a>';
                break;
            case 262146: //Phone Call
                return '<img src="images/icons/Schedule_Call_16x16.gif" />&nbsp;<a href="' + dialogUrl + '" > ' + SR.ActivityType_PhoneCall + '</a>';
                break;
            case 262147: //ToDo:
                return '<img src="images/icons/Schedule_To_Do_16x16.gif" />&nbsp;<a href="' + dialogUrl + '" > ' + SR.ActivityType_ToDo + '</a>';
                break;
            case 262162: //Personal Activity
                return '<img src="images/icons/Schedule_Personal_Activity_16x16.gif" />&nbsp;<a href="' + dialogUrl + '" > ' + SR.ActivityTypeGrid_PersonalActivity + '</a>';
                break;
        }
        return '<img src="images/icons/Schedule_Meeting_16x16.gif" />&nbsp;<a href="' + dialogUrl + '" >  ' + SR.ActivityType_Meeting + '</a>';
    }

    function getContactLink(a) {
        if (isNullOrEmpty(a.contactId) && isNullOrEmpty(a.leadId))
            return "";
        if (!isNullOrEmpty(a.contactId))
            return String.format('<a href="Contact.aspx?entityid={0}">{1}</a>', a.contactId, a.contactName);
        return String.format('<a href="Lead.aspx?entityid={0}">{1}</a>', a.leadId, a.leadName);
    }

    function getContactType(a) {
        if (isNullOrEmpty(a.contactId) && isNullOrEmpty(a.leadId))
            return "";
        if (!isNullOrEmpty(a.contactId))
            return "Contact";
        return "Lead";
    }

    function getAccountLink(a) {
        if (isNullOrEmpty(a.accountName))
            return "";
        if (isNullOrEmpty(a.accountId))
            return a.accountName;
        return String.format('<a href="Account.aspx?entityid={0}">{1}</a>', a.accountId, a.accountName);
    }

    function PostRenderScript(obj) {
        var cardObj = obj;        
        window.setTimeout(function() { ShowContext(cardObj)}, 10);
        }

        function ShowContext(cardObj) {

            // Hide details for Personal Activities of other users.
            // Note: this should display details for others when current user has edit calendar access, but
            // this logic is not implemented.
            // 262162 = PersonalActivity
           var panel = Sage.SalesLogix.Controls.ListPanel.find("MainList");           
           var objId = cardObj.id;
           //To keep unique Id's on summart form elements, we append the form name.  
            if (panel.activeView == 'summary')
            {
                objId = objId + '_ActivitySummaryList';
            }
            else
            {
                objId = objId + '_ActivityContactSummary';
            }
            var isVisible = cardObj.type != 262162 || (cardObj.userid == getContextByKey('userID') && cardObj.type == 262162);

            // Show Priority
            if (!isNullOrEmpty(cardObj.priority) && isVisible)
                $('#' + objId + '_txtPriority').removeClass('x-hide-display').show();

            // Show Duration                
            if (cardObj.timeless == false)
                $('#' + objId + '_txtDuration').removeClass('x-hide-display').show();

            // Show Phone
            if (!isNullOrEmpty(cardObj.phonenumber) && isVisible)
                $('#' + objId + '_txtPhone').removeClass('x-hide-display').show();              
            //Show Recurring Icon
            if (cardObj.recurring)
                $('#imgRecur').removeClass('x-hide-display').show();

            //Show Alarm Icon            
            if (cardObj.alarm)
                $('#imgAlarm').removeClass('x-hide-display').show();

            //A Lead Activity
            if (cardObj.leadid != null && isVisible) {
                $('#' + objId + '_txtLeadName').removeClass('x-hide-display')
                    .find('td.DataItem')
                    .append('&nbsp;&nbsp;' +
                        getEmailImageLink($('#' + objId + '_txtLeadEmail').text()))
                    .show();
                $('#' + objId + '_txtLeadCompany').removeClass('x-hide-display').show();
            }
            //A Contact Activity
            else {
                if (!isNullOrEmpty(cardObj.contactname) && isVisible) {
                    $('#' + objId + '_txtContactName').removeClass('x-hide-display')
                        .find('td.DataItem')
                        .append('&nbsp;&nbsp;' +
                            getEmailImageLink($('#' + objId + '_txtContactEmail').text()))
                        .show();
                }

                if (!isNullOrEmpty(cardObj.accountname) && isVisible)
                    $('#' + objId + '_txtAccount').removeClass('x-hide-display').show();

                if (!isNullOrEmpty(cardObj.opportunityname) && isVisible)
                    $('#' + objId + '_txtOpportunityName').removeClass('x-hide-display').show();
                if (!isNullOrEmpty(cardObj.ticketnumber) && isVisible)
                    $('#' + objId + '_txtTicketNumber').removeClass('x-hide-display').show();
            }
            
            //setup notes tooltip
            var notesEl = $("#" + cardObj.id).find(".SummaryFooter").get(0);
            if (notesEl)
            {
                new Ext.ToolTip({
                    target: notesEl,
                    html: notesEl.innerHTML
                });
            }

            //Show Notes
            if (!isNullOrEmpty(cardObj.notes) && isVisible)
                $('#' + objId + '_txtNotes').removeClass('x-hide-display').show();

        }

    function getEmailImageLink(emailAddress) {
        if (isNullOrEmpty(emailAddress) || emailAddress == "null")
            return "";
        return String.format('<a href="mailto:{0}"><img src="{1}" /></a>',
            emailAddress, "ImageResource.axd?scope=global&type=Global_Images&key=Send_Write_email_16x16");
    }

    function formatDate(date) {        
        return date ? date.dateFormat(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr'))) : "";
    }

    function formatDateTimeSummary(data) {
        if (!data) return "";
        
        var date = new Date(data.context.id.slice(13));
        if (isNaN(date))
            date = data.startdate;
            
        var timeless = data.timeless;
        
        var dateString = formatDate(date);
        var timeString;
        if (!timeless)
            timeString = date ? date.dateFormat(ConvertToPhpDateTimeFormat(getContextByKey('userTimeFmtStr'))) : "";
        else
            timeString = SR.ActivityMisc_Timeless;
        return String.format("{0} {1}", dateString, timeString);
    }

    function formatDateTime(date, timeless) {
        if (!date) return "";
        var timeString;
        if (!timeless) {
            timeString = date ? date.dateFormat(ConvertToPhpDateTimeFormat(getContextByKey('userTimeFmtStr'))) : "";
        }
        else {
            timeString = SR.ActivityMisc_Timeless;
            // convert local to UTC (since timeless dates are already stored as local)
            date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        }
        var dateString = formatDate(date);
        return String.format("{0} {1}", dateString, timeString);
    }
    
    function formatDateTimeUTC(startDate)
    {
        var year = startDate.getFullYear();
        var month = startDate.getUTCMonth();
        var day = startDate.getUTCDate();
        var hours = startDate.getUTCHours();
        var minutes = startDate.getUTCMinutes();                
        var date = new Date(year, month, day, hours, minutes).dateFormat(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr') + ' ' + getContextByKey('userTimeFmtStr')));
        return date;
    }
    
    function formatDuration(minutes) {
        if (!minutes) return "";
        return String.leftPad(Math.floor(minutes / 60), 1, "0") + ":" +
            String.leftPad(minutes % 60, 2, "0");
    }

    function formatDurationLong(values) {
        //debugger;
        var returnStr = "";

        if (values.timeless == false) {
            if (Math.floor(values.duration / 60) > 0) {
                returnStr = String.leftPad(Math.floor(values.duration / 60), 1, "0") + " " + SR.ActivityMisc_Hours + " ";
            }
            if (values.duration % 60 > 0)
                returnStr = returnStr + String.leftPad(values.duration % 60, 2, "0") + " " + SR.ActivityMisc_Minutes;
        }
        return returnStr;
    }
    
    function formatName(firstName, lastName) {
        return firstName != "" ? lastName + ", " + firstName : lastName;
    }

    function getActivityType(type) {
        if (!type) return "";
        switch (type) {
            case 262145: //Meeting
                return SR.ActivityType_Meeting;
            case 262146: //Phone Call
                return SR.ActivityType_PhoneCall;
            case 262147: //To-Do
                return SR.ActivityType_ToDo;
            case 262162: //Personal Activity
                return SR.ActivityType_PersonalActivity;
        }
        return ""; 
    }

    function getActivityTypeImageSmall(type) {
        switch (type) {
            case 262145: //Meeting
                return "images/icons/Schedule_Meeting_16x16.gif";
            case 262146: //Phone Call
                return "images/icons/Schedule_Call_16x16.gif";
            case 262147: //To-Do
                return "images/icons/Schedule_To_Do_16x16.gif";
            case 262162: //Personal Activity
                return "images/icons/Schedule_Personal_Activity_16x16.gif";
        }
        return "images/icons/Schedule_Meeting_16x16.gif";
    }

    function getEditActivityLink(values) {  
        if (!values.row.data.id) return "";
        var activityId = values.row.id.split(":");
       
        var startDate = formatDateTimeUTC(values.row.data.startDate);
        
        if (values.row.data.activity_id)
        {
            return String.format("javascript: Link.editActivity('{0}')", activityId[0]);
        }
        else
        {
            return String.format("javascript: Link.editActivityOccurrence('{0}','{1}')", activityId[0],startDate);
        }
    }
    
    function getCompleteActivityLink(values) {  
        if (!values.row.data.id) return "";
        var activityId = values.row.id.split(":");
       
        var startDate = formatDateTimeUTC(values.row.data.startDate);
        
        if (values.row.data.activity_id)
        {
            return String.format("javascript: Link.completeActivity('{0}')", activityId[0]);
        }
        else
        {
            return String.format("javascript: Link.completeActivityOccurrence('{0}','{1}')", activityId[0],startDate);
        }
    }

    function getNotificationLink(n) {
        switch (n.type) {
            case "New":
                return String.format(
                    "javascript:Link.confirmActivity('{0}', '{1}')", n.activityId, n.toUserId);
            case "Change": case "Confirm": case "Decline": case "Leader":
                return String.format(
                    "javascript:Link.deleteConfirmation('{0}', '{1}')", n.activityId, n.id);
            case "Deleted":
                return String.format(
                    "javascript:Link.removeDeletedConfirmation('{0}')", n.id);
        }
        return "";
    }

    function isNullOrEmpty(s) {
        return s == null || s.trim() == "";
    }

</script>

<script runat="server" type="text/C#">

    private string _summaryConfig;
    //[Editor(typeof(SummaryQuickFormTypeEditor), typeof(UITypeEditor))]
    public string SummaryConfigFile
    {
        get { return _summaryConfig; }
        set { _summaryConfig = value; }
    }
	
	private string _summaryListConfig;
    //[Editor(typeof(SummaryQuickFormTypeEditor), typeof(UITypeEditor))]
    public string SummaryListConfigFile
    {
        get { return _summaryListConfig; }
        set { _summaryListConfig = value; }
    }

    private string _defaultView;
    public string DefaultView
    {
        get { return _defaultView; }
        set { _defaultView = value; }
    }

    private IMenuService _mnuSvc;
    [ServiceDependency]
    public IMenuService MenuService
    {
        get
        {
            return _mnuSvc;
        }
        set
        {
            _mnuSvc = value;
        }
    }

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        RegisterContextMenus();
       
        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
   
        DefaultView = PortalUtil.JavaScriptEncode(userOption.GetCommonOption("DefaultView", "ActivityAlarm"));
        if (!String.IsNullOrEmpty(Request.QueryString["activetab"]))
            DefaultView = PortalUtil.JavaScriptEncode(Request.QueryString["activetab"]);

        bool autoFitColumns;
        string autoFitColumnsValue = userOption.GetCommonOption("autoFitColumns", "GroupGridView");
        if (!Boolean.TryParse(autoFitColumnsValue, out autoFitColumns))
            autoFitColumns = true;

        ViewOptions listViewOptions = ActivityList.ViewOptions.Find("list");
        if (listViewOptions == null)
            ActivityList.ViewOptions.Add((listViewOptions = new ViewOptions()));

        listViewOptions.Name = "list";
        listViewOptions.FitToContainer = autoFitColumns;

        if (!String.IsNullOrEmpty(SummaryConfigFile))
        {
            ActivityList.ApplySummaryConfig(String.Format("~/SummaryConfigData/{0}.xml", SummaryListConfigFile));
            ActivityList.ApplySummaryConfigForDetail(String.Format("~/SummaryConfigData/{0}.xml", SummaryConfigFile));
        }

        var pageLink = new PageLink {LinkType = enumPageLinkType.HelpFileName, NavigateUrl = "activitylookup"};
        ActivityList.HelpUrl = pageLink.GetWebHelpLink().Url;
        //ActivityList.HelpUrl = "help.aspx?content=help*/base/activitylookup.aspx";
    }

    private void RegisterContextMenus()
    {
        NavItemCollection menuActivityGridContext = LoadControl("~/ContextMenuItems/contextActivityGridMenu.ascx").Controls[0] as NavItemCollection;
        MenuService.AddMenu("contextActivityGridMenu", menuActivityGridContext, menuType.ContextMenu);
    }

</script>
