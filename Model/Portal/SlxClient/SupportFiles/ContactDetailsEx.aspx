<%@ Page AutoEventWireup="true" Language="C#" CodeFile="ContactDetailsEx.aspx.cs" Inherits="SlxClient.ContactDetailsEx" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="head1" runat="server">
    <title><asp:Literal runat="server" Text="<%$ resources: Title%>" /></title> 
    <link rel="stylesheet" type="text/css" href="~/css/YUI/fonts.css" />
    <link rel="stylesheet" type="text/css" href="~/css/YUI/reset.css" />
    <link rel="stylesheet" type="text/css" href="~/css/sage-styles.css" />      
    <script type="text/javascript" src="jscript/YUI/yahoo.js"></script>
    <script type="text/javascript" src="jscript/YUI/event.js"></script>
    <script type="text/javascript" src="jscript/YUI/connection.js"></script>
    <script type="text/javascript" src="jscript/YUI/dom.js"></script>
    <script type="text/javascript" src="jscript/YUI/container.js"></script>
    <script type="text/javascript" src="jscript/YUI/menu.js"></script>
    <script type="text/javascript" src="jscript/SLXDataGrid.js"></script>        
</head>
<body>
<form id="mainform" runat="server" action="javascript:void(0);">
<asp:ScriptManager runat="server" ID="scriptManager"></asp:ScriptManager>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
           <col width="10%" />
            <col width="10%" />
            <col width="10%" />
                                                                
     <tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="nmePersonName_lz" AssociatedControlID="nmePersonName" runat="server" Text="<%$ resources: nmePersonName.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol person"  > 
    <SalesLogix:FullName runat="server" ID="nmePersonName" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="phnWork_lz" AssociatedControlID="phnWork" runat="server" Text="<%$ resources: phnWork.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol phone"  > 
    <SalesLogix:Phone runat="server" ID="phnWork" Enabled="false"  />
  </div>

      </td>
                <td  >
<div class="slxlabel alignleft">
  <asp:CheckBox runat="server" ID="chkPrimaryContact" CssClass="checkbox" Text="<%$ resources: chkPrimaryContact.Caption %>" Enabled="false"  />
</div>
      </td>
      </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtAccountName_lz" AssociatedControlID="txtAccountName" runat="server" Text="<%$ resources: txtAccountName.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtAccountName" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="phnFax_lz" AssociatedControlID="phnFax" runat="server" Text="<%$ resources: phnFax.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol phone"  > 
    <SalesLogix:Phone runat="server" ID="phnFax" Enabled="false"  />
  </div>

      </td>
                <td  >
<div class="slxlabel alignleft">
  <asp:CheckBox runat="server" ID="chkAuthorizedServiceContact" CssClass="checkbox" Text="<%$ resources: chkAuthorizedServiceContact.Caption %>" Enabled="false"  />
</div>
      </td>
      </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtTitle_lz" AssociatedControlID="txtTitle" runat="server" Text="<%$ resources: txtTitle.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtTitle" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="phnMobile_lz" AssociatedControlID="phnMobile" runat="server" Text="<%$ resources: phnMobile.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol phone"  > 
    <SalesLogix:Phone runat="server" ID="phnMobile" Enabled="false"  />
  </div>

      </td>
                <td></td>
      </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtAssistant_lz" AssociatedControlID="txtAssistant" runat="server" Text="<%$ resources: txtAssistant.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtAssistant" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="phnHome_lz" AssociatedControlID="phnHome" runat="server" Text="<%$ resources: phnHome.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol phone"  > 
    <SalesLogix:Phone runat="server" ID="phnHome" Enabled="false"  />
  </div>

      </td>
                <td></td>
      </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtSalutation_lz" AssociatedControlID="txtSalutation" runat="server" Text="<%$ resources: txtSalutation.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtSalutation" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="phnOther_lz" AssociatedControlID="phnOther" runat="server" Text="<%$ resources: phnOther.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol phone"  > 
    <SalesLogix:Phone runat="server" ID="phnOther"  />
  </div>

      </td>
                <td></td>
      </tr>
<tr>
            <td rowspan="3"  >
 <div class=" lbl alignleft">
   <asp:Label ID="adrPrimaryAddress_lz" AssociatedControlID="adrPrimaryAddress" runat="server" Text="<%$ resources: adrPrimaryAddress.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol address"  > 
    <SalesLogix:AddressControl runat="server" ID="adrPrimaryAddress" AddressDescriptionPickListId="kSYST0000014" Enabled="false" ShowButton="false" >
<AddressDescStyle Height="80" /> </SalesLogix:AddressControl></span>
</div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtPreferredContact_lz" AssociatedControlID="txtPreferredContact" runat="server" Text="<%$ resources: txtPreferredContact.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtPreferredContact" Enabled="false"  />
  </div>

      </td>
                <td  >
<div class="slxlabel alignleft">
  <asp:CheckBox runat="server" ID="chkDoNotSolicit" CssClass="checkbox" Text="<%$ resources: chkDoNotSolicit.Caption %>" Enabled="false"  />
</div>
      </td>
      </tr>
<tr>
                  <td  colspan="2" >
 <div class="twocollbl alignleft">
   <asp:Label ID="emlEmail_lz" AssociatedControlID="emlEmail" runat="server" Text="<%$ resources: emlEmail.Caption %>"></asp:Label>
 </div>   
   <div  class="twocoltextcontrol email"  > 
<SalesLogix:Email runat="server" ID="emlEmail" Enabled="false" ShowButton="false" EmailTextBoxStyle-ForeColor="#000099" EmailTextBoxStyle-Font-Underline="false" />
  </div>

      </td>
            </tr>
<tr>
                  <td  colspan="2" >
 <div class="twocollbl alignleft">
   <asp:Label ID="urlWeb_lz" AssociatedControlID="urlWeb" runat="server" Text="<%$ resources: urlWeb.Caption %>"></asp:Label>
 </div>   
   <div  class="twocoltextcontrol urlcontrol"  > 
    <SalesLogix:URL runat="server" ID="urlWeb" Enabled="false" ShowButton="false" URLTextBoxStyle-ForeColor="#000099" URLTextBoxStyle-Font-Underline="false" />
  </div>

      </td>
            </tr>
<tr>
            <td  colspan="3" >
  <hr />
 

      </td>
                  </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="ownOwner_lz" AssociatedControlID="ownOwner" runat="server" Text="<%$ resources: ownOwner.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol owner"  > 
<SalesLogix:OwnerControl runat="server" ID="ownOwner" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtContactType_lz" AssociatedControlID="txtContactType" runat="server" Text="<%$ resources: txtContactType.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtContactType" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtAccountType_lz" AssociatedControlID="txtAccountType" runat="server" Text="<%$ resources: txtAccountType.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtAccountType" Enabled="false"  />
  </div>

      </td>
      </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="usrAccountManager_lz" AssociatedControlID="usrAccountManager" runat="server" Text="<%$ resources: usrAccountManager.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol user"  > 
    <SalesLogix:SlxUserControl runat="server" ID="usrAccountManager" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtContactStatus_lz" AssociatedControlID="txtContactStatus" runat="server" Text="<%$ resources: txtContactStatus.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtContactStatus" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtAccountStatus_lz" AssociatedControlID="txtAccountStatus" runat="server" Text="<%$ resources: txtAccountStatus.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtAccountStatus" Enabled="false"  />
  </div>

      </td>
      </tr>
<tr>
            <td  colspan="3" >
  <hr />
 

      </td>
                  </tr>
<tr>
            <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="txtContactID_lz" AssociatedControlID="txtContactID" runat="server" Text="<%$ resources: txtContactID.Caption %>"></asp:Label>
 </div>   
  <div  class="textcontrol"  > 
<asp:TextBox runat="server" ID="txtContactID" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="usrCreateUser_lz" AssociatedControlID="usrCreateUser" runat="server" Text="<%$ resources: usrCreateUser.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol user"  > 
    <SalesLogix:SlxUserControl runat="server" ID="usrCreateUser" Enabled="false"  />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="usrModifyUser_lz" AssociatedControlID="usrModifyUser" runat="server" Text="<%$ resources: usrModifyUser.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol user"  > 
    <SalesLogix:SlxUserControl runat="server" ID="usrModifyUser" Enabled="false"  />
  </div>

      </td>
      </tr>
<tr>
            <td></td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="dtpCreateDate_lz" AssociatedControlID="dtpCreateDate" runat="server" Text="<%$ resources: dtpCreateDate.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol datepicker"  > 
    <SalesLogix:DateTimePicker runat="server" ID="dtpCreateDate" Enabled="false" />
  </div>

      </td>
                <td  >
 <div class=" lbl alignleft">
   <asp:Label ID="dtpModifyDate_lz" AssociatedControlID="dtpModifyDate" runat="server" Text="<%$ resources: dtpModifyDate.Caption %>"></asp:Label>
 </div>   
   <div  class="textcontrol datepicker"  > 
    <SalesLogix:DateTimePicker runat="server" ID="dtpModifyDate" Enabled="false" />
  </div>

      </td>
      </tr>        
<tr>
            <td  colspan="3" >
  <hr />
 

      </td>
                  </tr>         
<tr>
<td  colspan="3" >

<SalesLogix:SlxGridView runat="server"
    ID="grdHistory"
    AllowPaging="true"
    AllowSorting="true"
    AlternatingRowStyle-CssClass="rowdk"
    AutoGenerateColumns="false"
    CellPadding="4"
    CssClass="datagrid"
    CurrentSortDirection="Descending"
    CurrentSortExpression="CompleteDate"
    EmptyTableRowText="<%$ resources: grdHistory.EmptyTableRowText %>"
    EnableViewState="false"
    GridLines="None"
    OnPageIndexChanging="grdHistory_PageIndexChanging"
    OnSorting="grdHistory_Sorting"
    PageSize="5"
    PagerStyle-CssClass="gridPager"
    RowStyle-CssClass="rowlt"
    SelectedRowStyle-CssClass="rowSelected"
    ShowEmptyTable="true"         
    ShowSortIcon="false"
    MinRowHeight="18px"
    >
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16.gif" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: grdHistory.60389765-76ab-4b03-884d-c1f06e27453f.ColumnHeading %>" SortExpression="Type">
            <ItemTemplate><%# GetHistoryTypeText(Eval("Type")) %></ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField   HeaderText="<%$ resources: grdHistory.9732eef2-f5cf-444a-b145-17c078ebad09.ColumnHeading %>" SortExpression="Leader">
        <itemtemplate>
        <SalesLogix:SlxUserControl runat="server" ID="grdHistorycol2" DisplayMode="AsText" LookupResultValue='<%# Eval("UserId") %>' />
        </itemtemplate></asp:TemplateField>
        <asp:TemplateField   HeaderText="<%$ resources: grdHistory.968d9707-d01c-4100-932c-fa43d3d831ca.ColumnHeading %>" SortExpression="CompleteDate">
        <itemtemplate>
        <SalesLogix:DateTimePicker runat="server" ID="grdHistorycol3"  DisplayMode="AsText" DateTimeValue='<%# Eval("CompletedDate") %>' />
        </itemtemplate></asp:TemplateField>
        <asp:BoundField DataField="Description" 
          HeaderText="<%$ resources: grdHistory.2809744b-6079-4d33-9613-536874608032.ColumnHeading %>" SortExpression="Description" />
        <asp:BoundField DataField="Notes" 
          HeaderText="<%$ resources: grdHistory.21a8240d-c389-4b8a-8d3c-f6e20d29c40b.ColumnHeading %>" SortExpression="Notes" />
    </Columns>  
</SalesLogix:SlxGridView>

</td>
</tr>

<tr>
<td colspan="3" >
<asp:Button runat="server" Text="Close" meta:resourceKey="Close_rsc" ID="cmdClose" OnClientClick="javascript:window.close();" />
</td>
</tr>

</table>
</form>
</body>
</html>