<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportActionScheduleActivity.ascx.cs" Inherits="ImportActionScheduleActivity" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Form_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkAddNoteHelp" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="leadimportactivity.aspx"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" /><col width="50%" />
    <tr>
        <td>  
            <span class="twocollbl">
                <asp:Label ID="StartDate_lz" AssociatedControlID="dtpStartDate" runat="server" Text="<%$ resources: StartDate.Caption %>"></asp:Label>
            </span>
            <span class="textcontrol">
                <SalesLogix:DateTimePicker runat="server" ID="dtpStartDate" AutoPostBack="false" />
            </span> 
        </td>
        <td>
            <span>
                <asp:CheckBox runat="server" ID="chkTimeless" Text="" AutoPostBack="true"  OnCheckedChanged="chkTimeless_OnChange"/>
            </span> 
            <span class="lblright">
                <asp:Label ID="Timeless_lz" AssociatedControlID="chkTimeless" runat="server" Text="<%$ resources: Timeless.Caption %>"></asp:Label>
            </span>
        </td>
        
    </tr>
    <tr>
        <td colspan="1">  
            <span class="twocollbl"><asp:Label ID="Duration_lz" AssociatedControlID="dpDuration" runat="server" Text="<%$ resources: Duration.Caption %>"></asp:Label></span>
            <span>
                <SalesLogix:DurationPicker runat="server" ID="dpDuration" Width="33%" MaxLength="3" />
            </span> 
        </td>
        <td colspan="1" align="left">  
            <span class="lbl" style="width:100%">
            <asp:CheckBox runat="server" ID="chkRollover" Text="<%$ resources: Rollover.Caption %>" TextAlign="Right" AutoPostBack="false" />&nbsp;
            </span>
        </td>
    </tr>
    <tr>
      <td>
      </td>
      <td align="left">  
            <span class="twocollbl">
               <asp:CheckBox runat="server" ID="chkAlarm" Text="<%$ resources: Reminder.Caption %>"  TextAlign="Right" AutoPostBack="false" />&nbsp;
            </span>
            <div style="padding-left:90px">
               <SalesLogix:DurationPicker runat="server" ID="dpReminderDuration" Width="55%" MaxLength="3" />
            </div>
        </td>
    
    </tr>
    <tr>
        <td colspan="2">
            <span>
                <hr />
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="1">  
            <span class="twocollbl">
                <asp:Label ID="Description_lz" AssociatedControlID="pklDescription" runat="server" Text="<%$ resources: Description.Caption %>"></asp:Label>
            </span>
            <span class="twocoltextcontrol">
                <SalesLogix:PickListControl runat="server" ID="pklDescription" PickListId="kSYST0000027" PickListName="Note Regarding" MustExistInList="false" AlphaSort="true" MaxLength="64"  />
            </span> 
        </td>
        <td colspan="1" rowspan="4">
            <span class="twocollbl">
                <asp:Label ID="Notes_lz" AssociatedControlID="txtNotes" runat="server" Text="<%$ resources: Notes.Caption %>"></asp:Label>
            </span>
            <span class="twocoltextcontrol">
                <asp:TextBox runat="server" ID="txtNotes" TextMode="MultiLine" Columns="20" Rows="4" />
            </span> 
    </td>
    </tr>
    <tr>
        <td colspan="1">  
        <span class="twocollbl">
            <asp:Label ID="Priority_lz" AssociatedControlID="pklPriority" runat="server" Text="<%$ resources: Priority.Caption %>" ></asp:Label>
        </span>
        <span class="twocoltextcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklPriority" PickListId="kSYST0000028" PickListName="Priorities" MustExistInList="false" MaxLength="64" AlphaSort="false" />
        </span> 
       </td>
    </tr>
    <tr>
       <td colspan="1">  
        <span class="twocollbl">
            <asp:Label ID="Category_lz" AssociatedControlID="pklCategory" runat="server" Text="<%$ resources: Category.Caption %>"></asp:Label>
        </span>
        <span class="twocoltextcontrol">
            <SalesLogix:PickListControl runat="server" ID="pklCategory" PickListId="kSYST0000015" PickListName="Meeting Category Codes" MustExistInList="false" AlphaSort="true" MaxLength="64" />
        </span> 
    </td>
   </tr>
   <tr>
      <td>
        <br />
      </td>
      
   </tr>
   <tr>
        <td colspan="2" align="right">
           
                 <div style="padding: 10px 10px 0px 10px;">
                    <asp:Button runat="server" ID="btnSave" CssClass="slxbutton"  Text="<%$ resources: cmdSave.Caption %>" style="width:70px; margin: 0 5px 0 0;" />  
                    <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />  
                </div>
           
        </td>
    </tr>
</table>

 

