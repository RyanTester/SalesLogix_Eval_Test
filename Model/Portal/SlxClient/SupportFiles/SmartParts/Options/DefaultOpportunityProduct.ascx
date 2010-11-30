<%@ Control Language="C#" AutoEventWireup="true" CodeFile="DefaultOpportunityProduct.ascx.cs" Inherits="SmartParts_DefaultOpportunityProduct" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<style type="text/css">
        .fixer DIV {display:inline;}
        label {padding-left:4px; font-weight:bold}
        .formtable td {white-space:nowrap; padding: 0;}
</style>
<div style="display:none">
<asp:Panel ID="AddOpportunityProducts_RTools" runat="server" meta:resourcekey="AddOpportunityProducts_RToolsResource1">
    <asp:ImageButton runat="server" ID="cmdSave" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="cmdSave_rsc" />
    <SalesLogix:PageLink ID="OpportunityProductsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16" Target="Help" 
        NavigateUrl="addproduct.aspx"></SalesLogix:PageLink>
</asp:Panel>
</div>

<table border="0" cellpadding="8" cellspacing="0" style="margin: 8px" class="firstTable" >
    <tr>
        <td>
            <asp:CheckBox ID="chkName" class="checkbox" runat="server" Text="Name:" meta:resourceKey="chkName_rsc"/>
         </td>
         <td>
            <asp:DropDownList ID="ddlName" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="Starting With" meta:resourceKey="StartingWith_rsc"></asp:ListItem>
                <asp:ListItem Value="1" Text="Contains" meta:resourceKey="Contains_rsc"></asp:ListItem>
                <asp:ListItem Value="2" Text="Equal to" meta:resourceKey="EqualTo_rsc"></asp:ListItem>
                <asp:ListItem Value="3" Text="Not Equal to" meta:resourceKey="NotEqualTo_rsc"></asp:ListItem>
                <asp:ListItem Value="4" Text="Equal or less than" meta:resourceKey="EqualOrLessThan_rsc"></asp:ListItem>
                <asp:ListItem Value="5" Text="Equal or greater than" meta:resourceKey="EqualOrGreaterThan_rsc"></asp:ListItem>
                <asp:ListItem Value="6" Text="Less than" meta:resourceKey="LessThan_rsc"></asp:ListItem>
                <asp:ListItem Value="7" Text="Greater than" meta:resourceKey="GreaterThan_rsc"></asp:ListItem>
            </asp:DropDownList>
            <asp:TextBox  ID="txtName" runat="server" meta:resourcekey="txtNameResource1"></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox  ID="chkFamily" class="checkbox" runat="server" Text=" Family:" meta:resourceKey="chkFamily_rsc"/>&nbsp;
        </td>
        <td>
            <SalesLogix:PickListControl  DisplayMode="AsControl" PickListId="kSYST0000309" PickListName="Product Family" ID="pklProductFamily" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" meta:resourcekey="pklProductFamilyResource1" NoneEditable="True" />
        </td>
        <td style="padding-left: 8px;">    
            <asp:Button ID="btnShowResults" runat="server" Text="Show Results" OnClick="btnShowResults_Click" meta:resourceKey="btnShowResults_rsc" CssClass="slxbutton" />
        </td>
    </tr>
    <tr>
        <td>
            <asp:CheckBox ID="chkSKU" class="checkbox" runat="server" Text="SKU:" meta:resourceKey="chkSKU_rsc"/>
        </td>
        <td>
            <asp:DropDownList ID="ddlSKU" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="Starting With" meta:resourceKey="StartingWith_rsc"></asp:ListItem>
                <asp:ListItem Value="1" Text="Contains" meta:resourceKey="Contains_rsc"></asp:ListItem>
                <asp:ListItem Value="2" Text="Equal to" meta:resourceKey="EqualTo_rsc"></asp:ListItem>
                <asp:ListItem Value="3" Text="Not Equal to" meta:resourceKey="NotEqualTo_rsc"></asp:ListItem>
                <asp:ListItem Value="4" Text="Equal or less than" meta:resourceKey="EqualOrLessThan_rsc"></asp:ListItem>
                <asp:ListItem Value="5" Text="Equal or greater than" meta:resourceKey="EqualOrGreaterThan_rsc"></asp:ListItem>
                <asp:ListItem Value="6" Text="Less than" meta:resourceKey="LessThan_rsc"></asp:ListItem>
                <asp:ListItem Value="7" Text="Greater than" meta:resourceKey="GreaterThan_rsc"></asp:ListItem>
            </asp:DropDownList>
           
            <asp:TextBox ID="txtSKU" runat="server" meta:resourcekey="txtSKUResource1"></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox ID="chkStatus" class="checkbox" runat="server" Text=" Status:" meta:resourceKey="chkStatus_rsc"/> 
        </td>
        <td>
            <SalesLogix:PickListControl  DisplayMode="AsControl" PickListId="kSYST0000306" PickListName="Product Status" ID="pklProductStatus" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" meta:resourcekey="pklProductStatusResource1" NoneEditable="True" />
        </td>  
        <td style="padding-left: 8px;">
            <asp:Button ID="btnClearFilters" runat="server" Text="Clear Filters" OnClick="Clear_Click" meta:resourceKey="btnClearFilters_rsc" CssClass="slxbutton" />
        </td>        
    </tr>
    <tr>
       <td colspan="2">
            <asp:CheckBox AutoPostBack="True" class="checkbox" ID="chkPackage" style="white-space:nowrap" runat="server" Text=" Display product packages only" meta:resourceKey="chkPackage_rsc" OnCheckedChanged="chkPackage_CheckedChanged" />
        </td>
        <td colspan="3">&nbsp;</td>
    </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td valign="top" rowspan="2" style="padding-left: 2px; width: 180px;">
            <div style="vertical-align:top;">  
                <asp:Label ID="lblAvailableProducts" runat="server" Text="Available Products:" CssClass="slxlabel" meta:resourceKey="lblAvailableProducts_rsc"></asp:Label>             
                <div id="<%= ClientID %>_tree_container"><asp:Label ID="lblEnterCriteriaMessage" runat="server" Text="<%$ resources: EnterFilterCriteriaMessage %>" Width="180px"></asp:Label></div>
                <asp:HiddenField runat="server" ID="selectedNodes" />
            </div>
        </td>  
        <td align="left" valign="top"  style="width: 1%; white-space: nowrap; padding-left: 8px; padding-right: 8px;">
                <br />
                <asp:Button Text="Add" runat="server" Visible="false" ID="btnAdd" OnClick="btnAdd_Click" EnableViewState="False" meta:resourceKey="btnAdd_rsc" CssClass="slxbutton" />
        </td> 
  
        <td align="left" valign="top" style="width: auto">
            <div style="padding: 0 10px 0 10px;">
                <asp:Label ID="lblSelectedProducts" runat="server" Text="Selected Products:" CssClass="slxlabel" meta:resourceKey="lblSelectedProducts_rsc"></asp:Label>
                 <asp:GridView CssClass="datagrid" HeaderStyle-CssClass="rowhead" AutoGenerateColumns="False" ID="grdProducts" runat="server" BorderWidth="0" GridLines="none"
                     DataSourceID="dtsProducts" AlternatingRowStyle-CssClass="rowdk" AutoGenerateEditButton="false" RowStyle-CssClass="rowlt" 
                     DataKeyNames="Sort" AutoGenerateDeleteButton="false" EnableViewState="False" OnRowCreated="grdProducts_RowDataBound" meta:resourceKey="grdProductsResource1" OnRowUpdating="grdProducts_RowUpdating">
                    <Columns>
                        <asp:CommandField ShowEditButton="true" ShowDeleteButton="true" EditText='<%$ resources: grdProductsEditText %>' DeleteText='<%$ resources: grdProductsDeleteText %>' CancelText='<%$ resources: grdProductsCancelText %>' UpdateText='<%$ resources: grdProductsUpdateText %>' ButtonType="Link" />
                        <asp:BoundField DataField="Sort" HtmlEncode="false" HeaderStyle-Width="35px" HeaderText="Sort" ReadOnly="True" SortExpression="Sort" meta:resourceKey="BFSort_rsc" />
                        <asp:TemplateField HeaderText="Name" meta:resourceKey="TFName_rsc">
                            <ItemTemplate>
                                <%# Eval("Product.Name") %>
                            </ItemTemplate>
                            <ItemStyle wrap="True" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Family" HeaderStyle-Width="70px" meta:resourceKey="TFFamily_rsc">
                            <ItemTemplate>
                                <%# Eval("Product.Family") %>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Price Level" meta:resourceKey="TFProgram_rsc">
                            <ItemTemplate>
                                <%# Eval("Program") %>
                            </ItemTemplate>
                            <EditItemTemplate>
                                <SalesLogix:PickListControl style="white-space:nowrap;" runat="server" ID="txtProgram" PickListId="kSYST0000319" PickListName="Price Description" CanEditText="false" AlphaSort="true" PickListValue='<%# Bind("Program") %>' OnPickListValueChanged="pklProductFamily_PickListValueChanged" AutoPostBack="true" />
                            </EditItemTemplate>
                        </asp:TemplateField>                        
                        <asp:TemplateField HeaderText="Price" meta:resourceKey="TFPrice_rsc">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="Currency1" runat="server" Text='<%# Eval("Price") %>' DisplayMode="AsText" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Discount" HeaderStyle-Width="65px" SortExpression="Discount" meta:resourceKey="BFDiscount_rsc">
                            <ItemTemplate>
                                <asp:Label ID="lblDiscount" runat="server" Text='<%# string.Format("{0:P}", Eval("Discount")) %>' />
                            </ItemTemplate>
                            <EditItemTemplate>
                                <SalesLogix:NumericControl ID="txtDiscount" runat="server" FormatType="Percent" Width="65" Text='<%# Bind("Discount") %>' />
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField  HeaderText="Adj. Price" meta:resourceKey="TFAdjPrice_rsc">
                            <EditItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice1" runat="server" Text='<%# Bind("CalculatedPrice") %>' DisplayMode="AsControl" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </EditItemTemplate>
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice" runat="server" Text='<%# Bind("CalculatedPrice") %>' DisplayMode="AsText" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />    
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Price" meta:resourceKey="TFPrice_rsc">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPriceMC" runat="server" Text='<%# Eval("CalculatedPrice") %>' DisplayMode="AsText" ExchangeRateType="OpportunityRate"  DisplayCurrencyCode="true" />
                            </ItemTemplate> 
                        </asp:TemplateField>
                        <asp:BoundField DataField="Quantity" HtmlEncode="False" HeaderStyle-Width="70px" HeaderText="Quantity" SortExpression="Quantity" meta:resourceKey="BFQuantity_rsc" />
                        <asp:TemplateField HeaderText="Extended Price" meta:resourceKey="TFExtendedPrice_rsc">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="Currency2" runat="server" Text='<%# Eval("ExtendedPrice") %>' DisplayMode="AsText" ExchangeRateType="OpportunityRate"  DisplayCurrencyCode="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField>
                            <EditItemTemplate>
                                <asp:HiddenField ID="hidProductId" runat="server" Value='<%#Eval("Product.Id") %>' />
                            </EditItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                    <RowStyle CssClass="rowlt" />
                    <AlternatingRowStyle CssClass="rowdk" />
                </asp:GridView>
                <asp:ObjectDataSource ID="dtsProducts" runat="server" SelectMethod="Select" OldValuesParameterFormatString="original_{0}"
                    TypeName="Sage.SalesLogix.WebUserOptions.DefOppProdHelper" UpdateMethod="Update" DeleteMethod="Delete" OnUpdating="dtsProducts_Updating">
                    <UpdateParameters>
                        <asp:Parameter Name="Discount" Type="Double" />
                        <asp:Parameter Name="CalculatedPrice" Type="Decimal" />
                        <asp:Parameter Name="Quantity" Type="Double" />
                        <asp:Parameter Name="Program" Type="string" />
                    </UpdateParameters>
                </asp:ObjectDataSource>
            </div>
        </td>
    </tr>
</table>
<table id="tblButtons" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width="99%" />
    <col width="1" />
    <col width="1" />
    <tr>
        <td  colspan="3" >
            <hr />
        </td>
    </tr>
    <tr>
        <td>
        </td>
        <td align="right">
            <div class="slxButton" style="margin-right:10px">
                <asp:Button ID="cmdOK" Text="<%$ resources: btnOK_rsc %>" width="100px" runat="server" OnClick="cmdOK_Click" CssClass="slxbutton" />
            </div>
        </td>
        <td align="right"> 
            <div class="slxButton" style="margin-right:40px">
                <asp:Button ID="cmdCancel" Text="<%$ resources: btnCancel_rsc %>" runat="server" width="100px" CssClass="slxbutton" />
            </div>
        </td>
    </tr>
</table>
<asp:HiddenField ID="hidIsTreeLoaded" runat="server" Value="false" />