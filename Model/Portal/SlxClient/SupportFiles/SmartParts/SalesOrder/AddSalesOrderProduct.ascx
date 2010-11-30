<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddSalesOrderProduct.ascx.cs" Inherits="SmartParts_AddSalesOrderProduct" %>
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
<asp:Panel ID="AddSalesOrderProducts_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkSalesOrderProductsHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="addproduct.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    &nbsp;
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<table border="0" cellpadding="8" cellspacing="0" style="margin: 8px" class="firstTable" >
    <tr>
        <td>
            <asp:CheckBox ID="chkName" class="slxlabel" runat="server" Text="<%$ resources: chkName.Caption %>"/>
         </td>
         <td>
            <asp:DropDownList ID="ddlName" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="<%$ resources: ddlFilter.StartingWith.Caption %>"></asp:ListItem>
                <asp:ListItem Value="1" Text="<%$ resources: ddlFilter.Contains.Caption %>"></asp:ListItem>
                <asp:ListItem Value="2" Text="<%$ resources: ddlFilter.EqualTo.Caption %>"></asp:ListItem>
                <asp:ListItem Value="3" Text="<%$ resources: ddlFilter.NotEqualTo.Caption %>"></asp:ListItem>
                <asp:ListItem Value="4" Text="<%$ resources: ddlFilter.EqualOrLessThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="5" Text="<%$ resources: ddlFilter.EqualOrGreaterThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="6" Text="<%$ resources: ddlFilter.LessThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="7" Text="<%$ resources: ddlFilter.GreaterThan.Caption %>"></asp:ListItem>
            </asp:DropDownList>
            <asp:TextBox  ID="txtName" runat="server"></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox ID="chkFamily" class="slxlabel" runat="server" Text="<%$ resources: chkFamily.Caption %>"/>&nbsp;
        </td>
        <td>        
                <SalesLogix:PickListControl runat="server" ID="pklProductFamily" PickListName="Product Family" />            
        </td>
        <td style="padding-left: 30px;">
            <asp:Button ID="btnShowResults" runat="server" Text="<%$ resources: btnShowResults.Caption %>" 
                OnClick="btnShowResults_Click" CssClass="slxbutton" />
        </td>
    </tr>
    <tr>
        <td>
            <asp:CheckBox ID="chkSKU" class="slxlabel" runat="server" Text="<%$ resources: chkSKU.Caption %>"/>
        </td>
        <td>
            <asp:DropDownList ID="ddlSKU" runat="server" CssClass="slxtext">
                <asp:ListItem Value="0" Text="<%$ resources: ddlFilter.StartingWith.Caption %>"></asp:ListItem>
                <asp:ListItem Value="1" Text="<%$ resources: ddlFilter.Contains.Caption %>"></asp:ListItem>
                <asp:ListItem Value="2" Text="<%$ resources: ddlFilter.EqualTo.Caption %>"></asp:ListItem>
                <asp:ListItem Value="3" Text="<%$ resources: ddlFilter.NotEqualTo.Caption %>"></asp:ListItem>
                <asp:ListItem Value="4" Text="<%$ resources: ddlFilter.EqualOrLessThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="5" Text="<%$ resources: ddlFilter.EqualOrGreaterThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="6" Text="<%$ resources: ddlFilter.LessThan.Caption %>"></asp:ListItem>
                <asp:ListItem Value="7" Text="<%$ resources: ddlFilter.GreaterThan.Caption %>"></asp:ListItem>
            </asp:DropDownList>
           
            <asp:TextBox ID="txtSKU" runat="server"></asp:TextBox>
        </td>
        <td>
            <asp:CheckBox ID="chkStatus" class="slxlabel" runat="server" Text="<%$ resources: chkStatus.Caption %>"/> 
        </td>
        <td>            
                <SalesLogix:PickListControl runat="server" ID="pklProductStatus" PickListName="Product Status"/>
        </td>  
        <td style="padding-left: 30px;">
            <asp:Button ID="btnClearFilters" runat="server" Text="<%$ resources: btnClearFilters.Caption %>"
                OnClick="Clear_Click" CssClass="slxbutton" />
        </td>        
    </tr>
    <tr>
       <td colspan="2">
            <asp:CheckBox AutoPostBack="True" class="slxlabel" ID="chkPackage" style="white-space:nowrap" runat="server" Text="<%$ resources: chkPackage.Caption %>" OnCheckedChanged="chkPackage_CheckedChanged" />
        </td>
        <td colspan="3">&nbsp;</td>
    </tr>
</table><br />
<table cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td valign="top" rowspan="2" style=" padding-left: 2px; width: 180px;">
            <div style="vertical-align:top;">
                <asp:Label ID="lblAvailableProducts" runat="server" Text="<%$ resources: lblAvailableProducts.Caption %>" CssClass="slxlabel"></asp:Label>                
                <div id="<%= ClientID %>_tree_container">
                    <asp:Label ID="lblEnterCriteriaMessage" runat="server" Text="<%$ resources: lblFilterCriteriaMessage.Caption %>"
                        Width="180px">
                    </asp:Label>
                </div>
                <asp:HiddenField runat="server" ID="selectedNodes" />
            </div>
        </td>
        <td align="left" valign="top" style="width: 1%; white-space: nowrap; padding-left: 8px; padding-right: 8px;">
            <br />
            <asp:Button Text="<%$ resources: btnAdd.Caption %>" runat="server" Visible="false" ID="btnAdd" OnClick="btnAdd_Click"
                EnableViewState="False" CssClass="slxbutton" />
        </td>
        <td align="left" valign="top" style="width: auto">
            <div style="padding: 0 10px 0 10px;">
                <asp:Label ID="lblSelectedProducts" runat="server" Text="<%$ resources: lblSelectedProducts.Caption %>" CssClass="slxlabel"></asp:Label>
                <asp:GridView CssClass="datagrid" HeaderStyle-CssClass="rowhead" ID="grdProducts" runat="server" BorderWidth="0" GridLines="None"
                    AlternatingRowStyle-CssClass="rowdk" AutoGenerateEditButton="True" RowStyle-CssClass="rowlt" AutoGenerateColumns="false"
                    DataKeyNames="Id, InstanceId" AutoGenerateDeleteButton="true" EnableViewState="False" CellPadding="4" ExpandableRows="True"
                    DataSourceID="dtsProducts" ResizableColumns="True" meta:resourceKey="grdProducts" >
                    <Columns>
                   <%-- TODO: Neet to extend Sales Order to include Sort  --%>
                        <%--<asp:BoundField DataField="Sort" HtmlEncode="false" HeaderStyle-Width="35px" HeaderText="Sort" ReadOnly="True" SortExpression="Sort" />--%>
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.Name.ColumnHeader %>">
                            <ItemTemplate>
                                <%# Eval("ProductName") %>
                            </ItemTemplate>
                            <ItemStyle wrap="True" />
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.Family.ColumnHeader %>" HeaderStyle-Width="60px">
                            <ItemTemplate>
                                <SalesLogix:PickListControl style="white-space:nowrap;" runat="server" ID="pklFamily" DisplayMode="AsText"
                                    PickListName="Product Family" PickListValue='<%# Eval("Family") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.PriceLevel.ColumnHeader %>">
                            <ItemTemplate>
                                <SalesLogix:PickListControl PickListName="Price Description" runat="server" ID="pklProgramDisplay"
                                    style="white-space:nowrap;" OnPickListValueChanged="pklProductProgram_PickListValueChanged"
                                    AutoPostBack="false" DisplayMode="AsText" PickListValue='<%# Eval("Program") %>' />
                            </ItemTemplate>
                            <EditItemTemplate>
                                <SalesLogix:PickListControl PickListName="Price Description" runat="server" ID="pklProgram"
                                    style="white-space:nowrap;" OnPickListValueChanged="pklProductProgram_PickListValueChanged"
                                    AutoPostBack="true" DisplayMode="AsHyperlink" PickListValue='<%# Bind("Program") %>' />
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.Price.ColumnHeader %>" ItemStyle-HorizontalAlign="Right">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curPrice" runat="server" Text='<%# Eval("Price") %>' DisplayMode="AsText"
                                    ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Discount" HtmlEncode="False" HeaderStyle-Width="65px" HeaderText="<%$ resources: grdProducts.Discount.ColumnHeader %>"
                            DataFormatString="{0:p}" SortExpression="Discount" ItemStyle-HorizontalAlign="Right" />
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.AdjustedPrice.ColumnHeader %>" ItemStyle-HorizontalAlign="Right">
                            <EditItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice1" runat="server" Text='<%# Bind("CalculatedPrice") %>'
                                    DisplayMode="AsControl" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />
                            </EditItemTemplate>
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPrice" runat="server" Text='<%# Bind("CalculatedPrice") %>'
                                    DisplayMode="AsText" ExchangeRateType="baseRate" DisplayCurrencyCode="true" />    
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.AdjustedPrice.ColumnHeader %>" ItemStyle-HorizontalAlign="Right">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="curCalcPriceMC" runat="server" ExchangeRate='<%# Eval("SalesOrder.ExchangeRate") %>' 
                                    ExchangeRateType="SalesOrderRate" CurrentCode='<%# Eval("SalesOrder.CurrencyCode") %>' DisplayMode="AsText"
                                    DisplayCurrencyCode="true" Text='<%# Eval("CalculatedPrice") %>' />
                            </ItemTemplate> 
                        </asp:TemplateField>
                        <asp:BoundField DataField="Quantity" HtmlEncode="False" HeaderStyle-Width="70px" HeaderText="<%$ resources: grdProducts.Quantity.ColumnHeader %>"
                            SortExpression="Quantity" />
                        <asp:TemplateField HeaderText="<%$ resources: grdProducts.ExtendedPrice.ColumnHeader %>" ItemStyle-HorizontalAlign="Right">
                            <ItemTemplate>
                                <SalesLogix:Currency ID="Currency2" runat="server" DisplayMode="AsText" ExchangeRate='<%# Eval("SalesOrder.ExchangeRate") %>'
                                    ExchangeRateType="SalesOrderRate" CurrentCode='<%# Eval("SalesOrder.CurrencyCode") %>' DisplayCurrencyCode="true"
                                    Text='<%# Eval("ExtendedPrice") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>   
                        <asp:TemplateField>
                            <EditItemTemplate>
                                <asp:HiddenField ID="hidProductId" runat="server" Value='<%#Eval("Product.Id") %>' />
                            </EditItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>
            </div>
        </td>
    </tr>
</table>
<table id="tblButtons" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width="99%" />
    <col width="1" />
    <col width="1" />
    <tr>
        <td colspan="3" >
            <hr />
        </td>
    </tr>
    <tr>
        <td>
        </td>
        <td align="right">
            <div class="slxButton" style="margin-right:10px">
                <asp:Button ID="cmdOK" Text="<%$ resources: btnOK.Caption %>" runat="server" OnClick="cmdOK_Click" CssClass="slxbutton" />
            </div>
        </td>
        <td align="right">
            <div class="slxButton" style="margin-right:40px">
                <asp:Button ID="cmdCancel" Text="<%$ resources: btnCancel.Caption %>" runat="server" OnClick="cmdCancel_Click" CssClass="slxbutton" />
            </div>
        </td>
    </tr>
</table>
<asp:ObjectDataSource ID="dtsProducts" runat="server" OldValuesParameterFormatString="original_{0}"
    TypeName="Sage.SalesLogix.Client.App_Code.AddSalesOrderProductHelperClass"
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
<asp:HiddenField ID="hidIsTreeLoaded" runat="server" Value="false" />