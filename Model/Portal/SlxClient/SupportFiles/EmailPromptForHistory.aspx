<%@ Page AutoEventWireup="true" Language="c#" CodeFile="EmailPromptForHistory.aspx.cs" Inherits="Sage.SalesLogix.Client.MailMerge.EmailPromptForHistory" Culture="auto" UICulture="auto" meta:resourcekey="PageResource1" %>

<%@ Import namespace="Sage.Platform.Application.UI.Web"%>
<%@ Import namespace="Sage.Platform.Application.UI"%>
<%@ Import namespace="Sage.SalesLogix"%>
<%@ Import namespace="Sage.Platform.Application"%>
<%@ Import namespace="Sage.Platform.Security"%>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="smartParts" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Workspaces" TagPrefix="workSpace" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Services" TagPrefix="Services" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Workspaces.Tab" TagPrefix="tws" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="Saleslogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI"
    TagPrefix="asp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Sage CRM SalesLogix</title>
    <base target="_self" />

    <link rel="stylesheet" type="text/css" href="~/css/YUI/fonts.css" />
    <link rel="stylesheet" type="text/css" href="~/css/YUI/reset.css" />
    <link rel="stylesheet" type="text/css" href="~/Libraries/Ext/resources/css/ext-all.css" /> 
    <link rel="stylesheet" type="text/css" href="~/Libraries/Ext/ux/resources/css/ext-ux-livegrid.css" />
    <link rel="stylesheet" type="text/css" href="~/css/YUI/container.css" />
          
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery.selectboxes.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery-ui.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/adapter/jquery/ext-jquery-adapter.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-all.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-overrides.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-paging-tree-loader.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-tablegrid.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ux/ext-ux-livegrid-combined-min.js"></script>
    
    <script pin="pin" type="text/javascript" src="jscript/YUI/yui-combined-min.js"></script>     
    <script pin="pin" type="text/javascript" src="jscript/sage-platform/sage-platform.js"></script>
    <script pin="pin" type="text/javascript" src="jscript/sage-controls/sage-controls.js"></script>
    <script pin="pin" type="text/javascript" src="jscript/sage-common/sage-common.js"></script>
    
    <link rel="stylesheet" type="text/css" href="~/css/sage-styles.css" />      

    <script pin="pin" type="text/javascript">
        var groupManager = new groupmanager();

        function CheckToDelete() {
            var oCancelStateElement = document.getElementById("CancelState");
            if (oCancelStateElement != null) {
                if (oCancelStateElement.value == "0") {
                    document.getElementById("btnCancel").click();
                }
            }
        }

        function DoNotAllowDelete() {
            var oCancelStateElement = document.getElementById("CancelState");
            if (oCancelStateElement != null) {
                oCancelStateElement.value = "1";
            }
        }
    </script>
    
<style type="text/css" >
.lbl { 
    width : 100px;
}
.formtable .lbl {
    width : 100px;
}
.textcontrol {
    width : 100%;
}
SPAN.textcontrol TEXTAREA {
    width : 75%;
}
SPAN.textcontrol input {
    width : 75%;
}

</style>
</head>
<body onunload="CheckToDelete()">

    <script pin="pin" type="text/javascript">
        Ext._stringFormat = String.format;
    </script>
    
    <form id="mainform" runat="server">
    <asp:ScriptManager runat="server" ID="scriptManager"></asp:ScriptManager>
<asp:HiddenField ID="CancelState" Value="0" runat="server" />
<div style="display:none">
<asp:Panel ID="CompleteActivity_LTools" runat="server" meta:resourcekey="CompleteActivity_LToolsResource1">
</asp:Panel>
<asp:Panel ID="CompleteActivity_CTools" runat="server" meta:resourcekey="CompleteActivity_CToolsResource1">
</asp:Panel>
<asp:Panel ID="CompleteActivity_RTools" runat="server" meta:resourcekey="CompleteActivity_RToolsResource1">
</asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="50%" /><col width="50%" />
<tr>
<td >  
    <span class="lbl">
        <asp:Label ID="Completed_lz" meta:resourcekey="Completed_lz" AssociatedControlID="Completed" runat="server" Text="Completed:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:DateTimePicker runat="server" ID="Completed" AccessKey="c" AutoPostBack="False" DisplayDate="True" DisplayMode="AsControl" DisplayTime="True" Enable24HourTime="False" IncludeSecondsInTimeFormat="False" meta:resourcekey="CompletedResource1" /></span> 
</td>
  
<td >  
    <span class="lbl">
        <asp:Label ID="Scheduled_lz" meta:resourcekey="Scheduled_lz" AssociatedControlID="Scheduled" runat="server" Text="Scheduled:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:DateTimePicker runat="server" ID="Scheduled" AccessKey="s" AutoPostBack="False" DisplayDate="True" DisplayMode="AsControl" DisplayTime="True" Enable24HourTime="False" IncludeSecondsInTimeFormat="False" meta:resourcekey="ScheduledResource1" /></span> 
</td>
  </tr>
<tr>
<td >  
    <span class="lbl">
        <asp:Label ID="Duration_lz" meta:resourcekey="Duration_lz" AssociatedControlID="Duration" runat="server" Text="Duration:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:DurationPicker runat="server" ID="Duration" AccessKey="d" meta:resourcekey="DurationResource1"  /></span> 
</td>
  
<td >  
    <span >
        <asp:CheckBox runat="server" ID="Timeless" AccessKey="d" meta:resourcekey="TimelessResource1"  />
    </span> 
    <span class="lblright"><asp:Label ID="Timeless_lz" meta:resourcekey="Timeless_lz" AssociatedControlID="Timeless" runat="server" Text="Timeless"></asp:Label></span>
</td>
  </tr>
<tr>
<td >  
        <span class="lbl"><asp:Label ID="Result_lz" meta:resourcekey="Result_lz" AssociatedControlID="Result" runat="server" Text="Result:"></asp:Label></span><span class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="Result" PickListId="kSYST0000021" PickListName="To Do Result Codes" MustExistInList="False" AlphaSort="True" AutoPostBack="False" DisplayMode="AsControl" ValueStoredAsText="true" LeftMargin="" DefaultPickListItem="" meta:resourcekey="ResultResource1" NoneEditable="True" />
</span> 
</td>
<td ></td>
  </tr>
<tr>
<td >  
    <span class="lbl">
        <asp:Label ID="FollowUp_lz" meta:resourcekey="FollowUp_lz" AssociatedControlID="FollowUp" runat="server" Text="Follow-Up:"></asp:Label></span>
    <span class="textcontrol">
        <asp:DropDownList id="FollowUp" runat="server">
            <asp:ListItem Value="None" Text="NONE" Selected="True" ></asp:ListItem>
            <asp:ListItem Value="atMeeting" Text="Meeting"></asp:ListItem>
            <asp:ListItem Value="atPhoneCall" Text="Phone Call"></asp:ListItem>
            <asp:ListItem Value="atToDo" Text="To-Do"></asp:ListItem>
        </asp:DropDownList>
    </span> 
</td>
  
<td > 
        <span >
<asp:CheckBox runat="server" ID="CarryOverNotes" meta:resourcekey="CarryOverNotesResource1"  />
</span> 
<span class="lblright"><asp:Label ID="CarryOverNotes_lz" meta:resourcekey="CarryOverNotes_lz" AssociatedControlID="CarryOverNotes" runat="server" Text="Carry Over Notes"></asp:Label></span>
</td>
  </tr>
<tr>
<td colspan="2">  
<hr />
</td>
  </tr>
<tr>
<td >  
<div id="ContactIdDiv" runat="server">
    <span class="lbl"><asp:Label ID="ContactId_lz" meta:resourcekey="ContactId_lz" AssociatedControlID="luContact" runat="server" Text="Contact:"></asp:Label></span><span class="textcontrol">
        <SalesLogix:LookupControl runat="server" ID="luContact" LookupEntityName="Contact" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" LookupBindingMode="String" OverrideSeedOnSearch="true" SeedProperty="Account.Id"  >
            <LookupProperties>
                <SalesLogix:LookupProperty PropertyHeader="Last Name" PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="First Name" PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Company" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="City" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="State" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Postal" PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Phone" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Owner" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            </LookupProperties>
            <LookupPreFilters>
            </LookupPreFilters>
        </SalesLogix:LookupControl>
    </span> 
</div>

<div id="LeadIdDiv" runat="server" style="display:none">
    <span class="lbl"><asp:Label ID="LeadId_lz" meta:resourcekey="LeadId_lz" AssociatedControlID="luLead" runat="server" Text="Lead:"></asp:Label></span><span class="textcontrol">
        <SalesLogix:LookupControl runat="server" ID="luLead" LookupEntityName="Lead" LookupEntityTypeName="Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" LookupBindingMode="String" OverrideSeedOnSearch="true" SeedProperty=""  >
            <LookupProperties>
                <SalesLogix:LookupProperty PropertyHeader="Last Name" PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="First Name" PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Company" PropertyName="Company" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="City" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="State" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Postal" PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Phone" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
                <SalesLogix:LookupProperty PropertyHeader="Owner" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            </LookupProperties>
            <LookupPreFilters>
            </LookupPreFilters>
        </SalesLogix:LookupControl>
    </span> 
</div>

</td>
<td >  
<div id="OpportunityIdDiv" runat="server">
    <span class="lbl"><asp:Label ID="OpportunityId_lz" meta:resourcekey="OpportunityId_lz" AssociatedControlID="luOpportunity" runat="server" Text="Opportunity:"></asp:Label></span><span class="textcontrol">
        <SalesLogix:LookupControl runat="server" ID="luOpportunity" LookupEntityName="Opportunity" LookupEntityTypeName="Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" 
            LookupBindingMode="String" AllowClearingResult="true" AutoPostBack="false" OverrideSeedOnSearch="true" SeedProperty="Account.Id"  >
        <LookupProperties>
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Manager.PropertyHeader%>" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>                            
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Description.PropertyHeader %>" PropertyName="Description" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty> 
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Stage.PropertyHeader %>" PropertyName="Stage" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
        </LookupProperties>
        <LookupPreFilters>
        </LookupPreFilters>
        </SalesLogix:LookupControl>
    </span> 
</div>    
</td>
  </tr>
<tr>
<td >  
<div id="AccountIdDiv" runat="server">
    <span class="lbl"><asp:Label ID="AccountId_lz" meta:resourcekey="AccountId_lz" AssociatedControlID="luAccount" runat="server" Text="Account:"></asp:Label></span><span class="textcontrol">
    <SalesLogix:LookupControl runat="server" ID="luAccount" LookupEntityName="Account" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" LookupBindingMode="String" OverrideSeedOnSearch="true" SeedProperty="" >
        <LookupProperties>
            <SalesLogix:LookupProperty PropertyHeader="Company" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="City" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="State" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Postal" PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Country" PropertyName="Address.Country" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Main Phone" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Region" PropertyName="Region" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Industry" PropertyName="Industry" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Manager" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Owner" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
        </LookupProperties>
        <LookupPreFilters>
        </LookupPreFilters>
    </SalesLogix:LookupControl>


</span> 
</div>
</td>
  
<td >  
<div id="TicketIdDiv" runat="server">
    <span class="lbl"><asp:Label ID="TicketId_lz" meta:resourcekey="TicketId_lz" AssociatedControlID="luTicket" runat="server" Text="Ticket:"></asp:Label></span><span class="textcontrol">
    <SalesLogix:LookupControl runat="server" ID="luTicket" LookupEntityName="Ticket" LookupEntityTypeName="Sage.Entity.Interfaces.ITicket, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" LookupBindingMode="String" AllowClearingResult="true" OverrideSeedOnSearch="true" SeedProperty="Account.Id"  >
        <LookupProperties>
            <SalesLogix:LookupProperty PropertyHeader="Account" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="First Name" PropertyName="Contact.FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Last Name" PropertyName="Contact.LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Ticket ID" PropertyName="TicketNumber" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Ticket Area" PropertyName="Area" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
            <SalesLogix:LookupProperty PropertyHeader="Ticket Status" PropertyName="StatusCode" PropertyFormat="PickList" PropertyType="SalesLogix.PickList" UseAsResult="True"></SalesLogix:LookupProperty>
        </LookupProperties>
        <LookupPreFilters>
        </LookupPreFilters>
    </SalesLogix:LookupControl>


</span> 
</div>
</td>
  </tr>
<tr>
    <td colspan="2">  
        <hr />
    </td>
</tr>
<tr>
<td colspan="2">  
    <span class="lbl">
        <asp:Label ID="Description_lz" meta:resourcekey="Description_lz" AssociatedControlID="Description" runat="server" Text="Regarding:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:PickListControl runat="server" ID="Description" PickListId="kSYST0000027" PickListName="Note Regarding" MustExistInList="False" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" DisplayMode="AsControl" LeftMargin="" meta:resourcekey="DescriptionResource1" NoneEditable="True" /></span> 
</td>
  </tr>
<tr>
<td colspan="2">  
    <span class="lbl">
        <asp:Label ID="Notes_lz" meta:resourcekey="Notes_lz" AssociatedControlID="Notes" runat="server" Text="Notes"></asp:Label></span>
    <span class="textcontrol">
        <asp:TextBox runat="server" ID="Notes" TextMode="MultiLine" Columns="40" Rows="4" meta:resourcekey="NotesResource2"  /></span> 
</td>
  </tr>
<tr>
<td >  
        <span class="lbl"><asp:Label ID="Priority_lz" meta:resourcekey="Priority_lz" AssociatedControlID="Priority" runat="server" Text="Priority:"></asp:Label></span><span class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="Priority" PickListId="kSYST0000028" PickListName="Priorities" MustExistInList="False" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" DisplayMode="AsControl" LeftMargin="" meta:resourcekey="PriorityResource1" NoneEditable="True" />
</span> 
</td>
  
<td >  
        <span class="lbl"><asp:Label ID="Category_lz" meta:resourcekey="Category_lz" AssociatedControlID="Category" runat="server" Text="Category:"></asp:Label></span><span class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="Category" PickListId="kSYST0000015" PickListName="Meeting Category Codes" MustExistInList="False" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" DisplayMode="AsControl" LeftMargin="" meta:resourcekey="CategoryResource1" NoneEditable="True" />
</span> 
</td>
  </tr>
<tr>
<td >  
    <span class="lbl"><asp:Label ID="LeaderId_lz" meta:resourcekey="LeaderId_lz" AssociatedControlID="CreateUser" runat="server" Text="User:"></asp:Label></span><span class="textcontrol">
    <SalesLogix:SlxUserControl runat="server" ID="CreateUser" AutoPostBack="False" DisplayMode="AsControl" >
        <UserDialogStyle BackColor="ButtonFace" />
    </SalesLogix:SlxUserControl>
</span> 
</td>
  
<td >  
</td>
  </tr>
</table>
    <asp:Button runat="server" ID="btnOk" Text="OK" ToolTip="Complete Activity" OnClientClick="DoNotAllowDelete()" meta:resourcekey="Ok_rsc" />
    <asp:Button runat="server" ID="btnCancel" Text="Cancel" ToolTip="Cancel" OnClientClick="window.close()" meta:resourcekey="btnCancelResource1" />
    <SalesLogix:PageLink ID="CompleteActivityHelpLink" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="completeactivity.aspx" ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16" ></SalesLogix:PageLink>

</form>

    <script type="text/javascript">
        String.format = Ext._stringFormat;
    </script>
    
</body>
</html>
