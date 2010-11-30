<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportActionAddNote.ascx.cs" Inherits="ImportActionAddNote" %>
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
        <SalesLogix:PageLink ID="lnkAddNoteHelp" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="leadimportnote.aspx"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="40%" /><col width="2%" /><col width="58%" />
    <tr>
        <td colspan="2"></td>
        <td rowspan="7">
            <div class="lbl">
                <asp:Label ID="Notes_lbl" AssociatedControlID="txtNotes" runat="server" Text="<%$ resources: Notes.Caption %>" ></asp:Label>
            </div>   
            <div class="textcontrol" >
                <asp:TextBox runat="server" ID="txtNotes" TextMode="MultiLine" Columns="160" Rows="8" />
            </div>
        </td>
    </tr>
    <tr>
        <td valign="top">
            <div class="lbl alignleft">
                <asp:Label ID="StartDate_lbl" AssociatedControlID="dtpStartDate" runat="server" Text="<%$ resources: StartDate.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol datepicker">
                <SalesLogix:DateTimePicker runat="server" ID="dtpStartDate" />
            </div>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
            <div class="slxlabel alignleft checkbox">
                <SalesLogix:SLXCheckBox runat="server" ID="chkTimeless" CssClass="checkbox" Text="<%$ resources: Timeless.Caption %>" TextAlign="left" AutoPostBack="true" OnCheckedChanged="chkTimeless_OnChange" />
            </div>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="Duration_lbl" AssociatedControlID="dpDuration" runat="server" Text="<%$ resources: Duration.Caption %>" ></asp:Label>
            </div>
            <div class="duration">
                <SalesLogix:DurationPicker runat="server" ID="dpDuration" Width="55%" />
            </div>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="Description_lbl" AssociatedControlID="pklDescription" runat="server" Text="<%$ resources: Description.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklDescription" PickListID="kSYST0000027" PickListName="Note Regarding" MustExistInList="false" AlphaSort="true"  />
            </div>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="Category_lbl" AssociatedControlID="pklCategory" runat="server" Text="<%$ resources: Category.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklCategory" PickListID="kSYST0000015" PickListName="Meeting Category Codes" MustExistInList="false" AlphaSort="true"  />
            </div>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
            <br />
        </td>
    </tr>
    <tr>
        <td colspan="3" align="right" >
            <div style="padding: 10px 10px 0px 10px;">
                <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" ToolTip="Save" Text="<%$ resources: btnSave.Caption %>" style="width:70px; margin: 0 5px 0 0;" />  
                <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="Cancel" Text="<%$ resources: btnCancel.Caption %>" style="width:70px;" />  
            </div>
        </td>
    </tr>
</table>