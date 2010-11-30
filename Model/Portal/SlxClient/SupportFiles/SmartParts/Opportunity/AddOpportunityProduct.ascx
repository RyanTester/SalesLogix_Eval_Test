<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddOpportunityProduct.ascx.cs" Inherits="SmartParts_AddOpportunityProduct" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<style type="text/css">
    .fixer DIV {display:inline;}
    .firstTable td      { padding-right:4px; white-space:nowrap; } 
    .firstTable label   { padding-left:2px; }
</style>

<div style="display:none">
<asp:Panel ID="AddOpportunityProducts_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkOpportunityProductsHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="addproduct.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        &nbsp;
    </SalesLogix:PageLink>
</asp:Panel>
</div>
<table border="0" cellpadding="8" cellspacing="0" style="margin: 8px" class="firstTable" >
    <tr>
        <td>
            <asp:CheckBox ID="chkName" class="slxlabel" runat="server" Text="<%$ resources: chkName_rsc %>" />
         </td>
         <td>
            <asp:DropDownList ID="ddlName" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="<%$ resources: StartingWith_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="1" Text="<%$ resources: Contains_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="2" Text="<%$ resources: EqualTo_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="3" Text="<%$ resources: NotEqualTo_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="4" Text="<%$ resources: EqualOrLessThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="5" Text="<%$ resources: EqualOrGreaterThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="6" Text="<%$ resources: LessThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="7" Text="<%$ resources: GreaterThan_rsc.Text %>" ></asp:ListItem>
            </asp:DropDownList>
            <asp:TextBox ID="txtName" runat="server" ></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox ID="chkFamily" class="slxlabel" runat="server" Text="<%$ resources: chkFamily_rsc.Text %>" />&nbsp;
        </td>
        <td>
            <SalesLogix:PickListControl DisplayMode="AsControl" PickListId="kSYST0000309" PickListName="Product Family" NoneEditable="True"
                ID="pklProductFamily" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" />
        </td>
        <td style="padding-left: 8px;">    
            <asp:Button ID="btnShowResults" runat="server" Text="<%$ resources: btnShowResults_rsc.Text %>" OnClick="btnShowResults_Click" CssClass="slxbutton" />
        </td>
    </tr>
    <tr>
        <td>
            <asp:CheckBox ID="chkSKU" class="slxlabel" runat="server" Text="<%$ resources: chkSKU_rsc.Text %>" />
        </td>
        <td>
            <asp:DropDownList ID="ddlSKU" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="<%$ resources: StartingWith_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="1" Text="<%$ resources: Contains_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="2" Text="<%$ resources: EqualTo_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="3" Text="<%$ resources: NotEqualTo_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="4" Text="<%$ resources: EqualOrLessThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="5" Text="<%$ resources: EqualOrGreaterThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="6" Text="<%$ resources: LessThan_rsc.Text %>" ></asp:ListItem>
                <asp:ListItem Value="7" Text="<%$ resources: GreaterThan_rsc.Text %>" ></asp:ListItem>
            </asp:DropDownList>
           
            <asp:TextBox ID="txtSKU" runat="server" ></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox ID="chkStatus" class="slxlabel" runat="server" Text="<%$ resources: chkStatus_rsc.Text %>" /> 
        </td>
        <td>
            <SalesLogix:PickListControl DisplayMode="AsControl" PickListId="kSYST0000306" PickListName="Product Status" NoneEditable="True"
                ID="pklProductStatus" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" />
        </td>  
        <td style="padding-left: 8px;">
            <asp:Button ID="btnClearFilters" runat="server" Text="<%$ resources: btnClearFilters_rsc.Text %>" OnClick="Clear_Click" CssClass="slxbutton" />
        </td>        
    </tr>
    <tr>
       <td colspan="2">
            <asp:CheckBox AutoPostBack="True" class="slxlabel" ID="chkPackage" style="white-space:nowrap" runat="server"
                Text="<%$ resources: chkPackage_rsc.Text %>" OnCheckedChanged="chkPackage_CheckedChanged" />
        </td>
        <td colspan="3">&nbsp;</td>
    </tr>
</table><br />
<table cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td valign="top" rowspan="2" style=" padding-left: 2px; width: 180px;">
            <div style="vertical-align:top;">             
                <div id="<%= ClientID %>_tree_container">
                    <asp:Label ID="lblEnterCriteriaMessage" runat="server" Text="<%$ resources: EnterFilterCriteriaMessage %>"
                        Width="180px">
                    </asp:Label>
                </div>
                <asp:HiddenField runat="server" ID="selectedNodes" />
            </div>
        </td>
        <td align="left" valign="top" style="width: 1%; white-space: nowrap; padding-left: 8px; padding-right: 8px;">
            <br />
            <asp:Button Text="<%$ resources: btnAdd_rsc.Text %>" runat="server" Visible="false" ID="btnAdd" OnClick="btnAdd_Click"
                EnableViewState="False" CssClass="slxbutton" />
        </td>     
        <td align="left" valign="top" style="width: auto">
            <div style="padding: 0 10px 0 10px;">
                <asp:Label ID="lblSelectedProducts" runat="server" Text="<%$ resources: lblSelectedProducts_rsc.Text %>" CssClass="slxlabel"></asp:Label>
                <asp:GridView CssClass="datagrid" HeaderStyle-CssClass="rowhead" AutoGenerateColumns="False" ID="grdProducts" runat="server"
                    GridLines="none" DataSourceID="dtsProducts" AlternatingRowStyle-CssClass="rowdk" EnableViewState="False" 
                    AutoGenerateEditButton="false" RowStyle-CssClass="rowlt" meta:resourceKey="grdProductsResource1" BorderWidth="0"
                    DataKeyNames="Id, InstanceId" AutoGenerateDeleteButton="false" 
                    onrowupdating="grdProducts_RowUpdating">
                    <Columns>
                        <asp:CommandField ShowEditButton="true" ShowDeleteButton="true" EditText='<%$ resources: grdProductsEditText %>'
                            DeleteText='<%$ resources: grdProductsDeleteText %>' CancelText='<%$ resources: grdProductsCancelText %>'
                            UpdateText='<%$ resources: grdProductsUpdateText %>' ButtonType="Link" />
                        <asp:BoundField DataField="Sort" HtmlEncode="false" HeaderStyle-Width="35px" HeaderText='<%$ resources: BFSort_rsc.HeaderText %>'
                            ReadOnly="True" SortExpression="Sort" />
                        <asp:TemplateField HeaderText='<%$ resources: TFName_rsc.HeaderText %>' >
                            <ItemTemplate>
                                <%# Eval("Product.Name") %>
                            </ItemTemplate>
                            <ItemStyle wrap="True" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: TFFamily_rsc.HeaderText %>' HeaderStyle-Width="70px" >
                            <ItemTemplate>
                                <%# Eval("Product.Family") %>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: TFProgram_rsc.HeaderText %>' >
                            <ItemTemplate>
                                <%# Eval("Program") %>
                            </ItemTemplate>
                            <EditItemTemplate>
                                <SalesLogix:PickListControl style="white-space:nowrap;" runat="server" ID="txtProgram" AutoPostBack="true"
                                    PickListId="kSYST0000319" PickListName="Price Description" CanEditText="false" AlphaSort="true"
                                    PickListValue='<%# Bind("Program") %>' OnPickListValueChanged="pklProductFamily_PickListValueChanged" />
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: TFPrice_rsc.HeaderText %>' >
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curPrice" runat="server" Text='<%# Eval("Price") %>' DisplayMode="AsText"
                                    ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: BFDiscount_rsc.HeaderText %>' HeaderStyle-Width="65px" SortExpression="Discount">
                            <ItemTemplate>
                                <asp:Label ID="lblDiscount" runat="server" Text='<%# string.Format("{0:P}", Eval("Discount")) %>' />
                            </ItemTemplate>
                            <EditItemTemplate>
                                <SalesLogix:NumericControl ID="txtDiscount" runat="server" FormatType="Percent" Width="65"
                                    Text='<%# Bind("Discount") %>' />
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: TFAdjPrice_rsc.HeaderText %>' >
                            <EditItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice1" runat="server" Text='<%# Bind("CalculatedPrice") %>'
                                    DisplayMode="AsControl" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </EditItemTemplate>
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice" runat="server" Text='<%# Eval("CalculatedPrice") %>'
                                    DisplayMode="AsText" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />    
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText='<%$ resources: TFAdjPrice_rsc.HeaderText %>' >
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPriceMC" runat="server" ExchangeRate='<%# Eval("Opportunity.ExchangeRate") %>'
                                    ExchangeRateType="OpportunityRate" CurrentCode='<%# Eval("Opportunity.ExchangeRateCode") %>' DisplayMode="AsText"
                                    DisplayCurrencyCode="true" Text='<%# Eval("CalculatedPrice") %>' />
                            </ItemTemplate> 
                        </asp:TemplateField>
                        <asp:BoundField DataField="Quantity" HtmlEncode="False" HeaderStyle-Width="70px" SortExpression="Quantity"
                            HeaderText='<%$ resources: BFQuatity_rsc.HeaderText %>' />
                        <asp:TemplateField HeaderText='<%$ resources: TFExtendedPrice_rsc.HeaderText %>' >
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curExtPriceMC" runat="server" ExchangeRate='<%# Eval("Opportunity.ExchangeRate") %>' 
                                    ExchangeRateType="OpportunityRate" CurrentCode='<%# Eval("Opportunity.ExchangeRateCode") %>' DisplayMode="AsText"
                                    DisplayCurrencyCode="true" Text='<%# Eval("CalculatedPrice") %>' />
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
                <asp:ObjectDataSource ID="dtsProducts" runat="server" OldValuesParameterFormatString="original_{0}" 
                    TypeName="Sage.SalesLogix.Client.App_Code.AddOpportunityProductHelperClass"
                    UpdateMethod="Update" DeleteMethod="Delete" SelectMethod="Select" OnUpdating="dtsProducts_Updating">
                    <InsertParameters>
                        <asp:Parameter Name="original_Id" Type="string" />
                        <asp:Parameter Name="original_InstanceId" Type="Object" />
                    </InsertParameters>
                    <UpdateParameters>
                        <asp:Parameter Name="original_Id" Type="string" />
                        <asp:Parameter Name="original_InstanceId" Type="Object" />
                        <asp:Parameter Name="Discount" Type="double" />
                        <asp:Parameter Name="CalculatedPrice" Type="decimal" />
                        <asp:Parameter Name="Quantity" Type="double" />
            			<asp:Parameter Name="Program" Type="string" />
                    </UpdateParameters>
                    <DeleteParameters>
                        <asp:Parameter Name="original_Id" Type="string" />    
                        <asp:Parameter Name="original_InstanceId" Type="Object" />
                    </DeleteParameters>
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
                <asp:Button ID="cmdCancel" Text="<%$ resources: btnCancel_rsc %>" runat="server" width="100px" OnClick="cmdCancel_Click" CssClass="slxbutton" />
            </div>
        </td>
    </tr>
</table>
<asp:HiddenField ID="hidIsTreeLoaded" runat="server" Value="false" />