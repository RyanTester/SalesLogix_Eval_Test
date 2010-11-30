<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AccountReseller.ascx.cs" Inherits="SmartParts_AccountReseller" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>


<div style="display:none">
 <asp:Panel ID="Reseller_LTools" runat="server" meta:resourcekey="Reseller_LToolsResource1"> </asp:Panel>
 <asp:Panel ID="Reseller_CTools" runat="server" meta:resourcekey="Reseller_CToolsResource1"></asp:Panel>
 <asp:Panel ID="Reseller_RTools" runat="server" meta:resourcekey="Reseller_RToolsResource1">
    <asp:HyperLink runat="server" ID="linkAddOpportunity"   ImageUrl="~\images\icons\plus_16X16.gif"    ToolTip="Insert New Opportunity"   NavigateUrl="~/InsertOpportunity.aspx?modeid=Insert"   meta:resourcekey="linkAddOpportunity"  />
    <SalesLogix:PageLink ID="lnkAccountResellerHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="accountresellertab.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="lnkAccountResellerHelpResource1"></SalesLogix:PageLink>
 </asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="25%" /><col width="25%" /><col width="25%" /><col width="25%" />
  <tr>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblOpen" meta:resourcekey="lblOpen" AssociatedControlID="lblOpen_X" runat="server" Text="Open"></asp:Label>
      </span> 
      <span >
        <asp:Label runat="server" ID="lblOpen_X" meta:resourcekey="lblOpen_XResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedWon" meta:resourcekey="lblClosedWon" AssociatedControlID="lblClosedWon_X" runat="server" Text="Closed - Won"></asp:Label>
      </span> 
      <span >
        <asp:Label runat="server" ID="lblClosedWon_X" meta:resourcekey="lblClosedWon_XResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedLost" meta:resourcekey="lblClosedLost" AssociatedControlID="lblClosedLost_X" runat="server" Text="Closed - Lost"></asp:Label>
      </span> 
      <span >
        <asp:Label runat="server" ID="lblClosedLost_X" meta:resourcekey="lblClosedLost_XResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblInactive" meta:resourcekey="lblInactive" AssociatedControlID="lblInactive_X" runat="server" Text="Inactive"></asp:Label>
      </span> 
      <span >
        <asp:Label runat="server" ID="lblInactive_X" meta:resourcekey="lblInactive_XResource1"  />
      </span> 
    </td>
  </tr>
  <tr>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblOpenCount" meta:resourcekey="lblOpenCount" AssociatedControlID="txtOpenCount" runat="server" Text="Count:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <asp:TextBox runat="server" ID="txtOpenCount" Enabled="False" meta:resourcekey="txtOpenCountResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedWonCount" meta:resourcekey="lblClosedWonCount" AssociatedControlID="txtClosedWonCount" runat="server" Text="Count:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <asp:TextBox runat="server" ID="txtClosedWonCount" Enabled="False" meta:resourcekey="txtClosedWonCountResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedLostCount" meta:resourcekey="lblClosedLostCount" AssociatedControlID="txtClosedLostCount" runat="server" Text="Count:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <asp:TextBox runat="server" ID="txtClosedLostCount" Enabled="False" meta:resourcekey="txtClosedLostCountResource1"  />
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblInactiveCount" meta:resourcekey="lblInactiveCount" AssociatedControlID="txtInactiveCount" runat="server" Text="Count:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <asp:TextBox runat="server" ID="txtInactiveCount" Enabled="False" meta:resourcekey="txtInactiveCountResource1"  />
      </span> 
    </td>
  </tr>
  <tr>
    <td >
      <span class="lbl">
        <asp:Label ID="lblOpenTotal" meta:resourcekey="lblOpenTotal" AssociatedControlID="crnOpenTotal" runat="server" Text="Total:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <SalesLogix:Currency runat="server" ID="crnOpenTotal" ExchangeRateType="BaseRate" Enabled="False" DisplayCurrencyCode="true" AutoPostBack="False" CurrentCode="" DisplayMode="AsControl" ExchangeRate="1" FormattedText="" MaxLength="0" meta:resourcekey="crnOpenTotalResource1"  >
            <CurrencyStyle Width="150px" />
        </SalesLogix:Currency>
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedWonTotal" meta:resourcekey="lblClosedWonTotal" AssociatedControlID="crnClosedWonTotal" runat="server" Text="Total:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <SalesLogix:Currency runat="server" ID="crnClosedWonTotal" ExchangeRateType="BaseRate" Enabled="False" DisplayCurrencyCode="true" AutoPostBack="False" CurrentCode="" DisplayMode="AsControl" ExchangeRate="1" FormattedText="" MaxLength="0" meta:resourcekey="crnClosedWonTotalResource1"  >
            <CurrencyStyle Width="150px" />
        </SalesLogix:Currency>
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblClosedLostTotal" meta:resourcekey="lblClosedLostTotal" AssociatedControlID="crnClosedLostTotal" runat="server" Text=" Total:"></asp:Label>
      </span> 
      <span class="textcontrol">
        <SalesLogix:Currency runat="server" ID="crnClosedLostTotal" ExchangeRateType="BaseRate" Enabled="False" DisplayCurrencyCode="true" AutoPostBack="False" CurrentCode="" DisplayMode="AsControl" ExchangeRate="1" FormattedText="" MaxLength="0" meta:resourcekey="crnClosedLostTotalResource1"  >
            <CurrencyStyle Width="150px" />
        </SalesLogix:Currency>
      </span> 
    </td>
    <td >  
      <span class="lbl">
        <asp:Label ID="lblInactiveTotal" meta:resourcekey="lblInactiveTotal" AssociatedControlID="crnInactiveTotal" runat="server" Text="Total:"></asp:Label>
      </span> 
      <span class="textcontrol">
         <SalesLogix:Currency runat="server" ID="crnInactiveTotal" ExchangeRateType="BaseRate" Enabled="False" DisplayCurrencyCode="true" AutoPostBack="False" CurrentCode="" DisplayMode="AsControl" ExchangeRate="1" FormattedText="" MaxLength="0" meta:resourcekey="crnInactiveTotalResource1"  >
             <CurrencyStyle Width="150px" />
         </SalesLogix:Currency>
      </span>
    </td>
  </tr>
</table>        
  <SalesLogix:SlxGridView 
     runat="server" 
     ID="grdReseller"
     GridLines="None"
     AutoGenerateColumns="False" 
     CellPadding="4" 
     CssClass="datagrid"
     AlternatingRowStyle-CssClass="rowdk" 
     RowStyle-CssClass="rowlt" 
     ShowEmptyTable="True" 
     EnableViewState="False"
     EmptyTableRowText="No records match the selection criteria." 
     meta:resourcekey="AccountOpportunities_51_rsc" 
     ExpandableRows="True" 
     ResizableColumns="True" CurrentSortDirection="Ascending" CurrentSortExpression="" 
     RowSelect="True" ShowSortIcon="True" SortAscImageUrl="" SortDescImageUrl="" OnRowCreated="grdReseller_RowDataBound"
     AllowPaging="true"
     PageSize="10"
  >
    <Columns>
      <asp:TemplateField   HeaderText="Opportunity Name"  meta:resourcekey="grdReseller_OpportunityName"     >
       <itemtemplate>
<SalesLogix:PageLink runat="server" EntityId='<%# Eval("Id") %>' LinkType="EntityAlias" Text='<%# Eval("Description") %>' NavigateUrl="Opportunity" meta:resourcekey="PageLinkResource1"></SalesLogix:PageLink>

       
</itemtemplate>
     </asp:TemplateField>
     <asp:BoundField DataField="Status"    HeaderText="Status"  meta:resourcekey="grdReseller_Status"      />
     <%--<asp:BoundField DataField="SalesPotential" DataFormatString="{0:C}" HtmlEncode="False"   HeaderText="Potential"  meta:resourcekey="grdReseller_Potential"    >
         <itemstyle horizontalalign="Right" />
     </asp:BoundField>--%>
     <asp:TemplateField HeaderText="Potential" meta:resourceKey="grdReseller_Potential">
        <ItemTemplate>
            <SalesLogix:Currency runat="server" Text='<%# Eval("SalesPotential") %>' DisplayMode="AsText" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
         </ItemTemplate>
     </asp:TemplateField>
     <asp:BoundField DataField="CloseProbability" DataFormatString="{0}%" HtmlEncode="False"   HeaderText="Probability"  meta:resourcekey="grdReseller_Probability"    >
         <itemstyle horizontalalign="Right" />
     </asp:BoundField>
     <asp:BoundField DataField="DaysOpen"    HeaderText="Days Open"  meta:resourcekey="grdReseller_DaysOpen"   >
         <itemstyle horizontalalign="Center" />
     </asp:BoundField>
   </Columns>
      <AlternatingRowStyle CssClass="rowdk" />
      <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>