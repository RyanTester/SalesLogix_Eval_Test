<%@ Control Language="C#" AutoEventWireup="true" CodeFile="InsertNote.ascx.cs" Inherits="SmartParts_History_InsertNote" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<style type="text/css">
#InsertNoteTitle IMG
{
    margin : 4px;
    height : 24px;
    width : 24px;
}
#InsertNoteTitle 
{
    font-size : 110%;
    font-weight : bold;
}

</style>

<span id="InsertNoteTitle">
<%--    //TODO: imgHistType is placeholder for Note icons to be added at a later date--%>
    <asp:Image runat="server" ID="imgInsertNote"  />
    <asp:Label runat="server" ID="lblDialogTitle" ></asp:Label>
</span>
<div>
<SalesLogix:TabControl Width="706"  id="InsertNotesDialog" runat="server" >
   <Panels>
        <SalesLogix:TabPanel Height="380px" TabCaption="<%$ resources: Tab.General.Caption %>" SmartPartPath="~/SmartParts/History/AddContactOrLeadNote.ascx" runat="server" ID="Notes"></SalesLogix:TabPanel>
        <SalesLogix:TabPanel TabCaption="<%$ resources: Tab.Attachments.Caption %>" runat="server" id="NotesAttachments" SmartPartPath="~/SmartParts/Attachment/AttachmentList.ascx"></SalesLogix:TabPanel>
        
    </Panels>
</SalesLogix:TabControl >
</div>
<table cellpadding="1" cellspacing="0" border="0" class="formtable">
    <col />
    <col />
    <tr>
        <td>
            <div>
                <asp:Label runat="server" cssclass="lblright" ID="CreateUser"  />
            </div> 
        </td>
        <td style="text-align:right">
            <asp:Button CssClass="slxbutton" ID="cmdOK" runat="server" ToolTip="<%$ resources: btnOK.Tooltip %>" Text="<%$ resources: btnOK.Caption %>" />
            <asp:Button CssClass="slxbutton" ID="cmdCancel" runat="server" ToolTip="<%$ resources: btnCancel.Tooltip %>" Text="<%$ resources: btnCancel.Caption %>" />
        </td>
    </tr>

</table>
