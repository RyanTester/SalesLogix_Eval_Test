<%@ Control Language="C#" AutoEventWireup="true" CodeFile="MatchingLeadRecords.ascx.cs" Inherits="SmartParts_Lead_MatchingLeadRecords" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LeadMatching_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkMatchOptionsHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl=""
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<div style="padding-left:10px">
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <asp:Label runat="server" ID="lblLead" Text="Lead" meta:resourcekey="lblLead_Text"></asp:Label>
            </td>
        </tr>
        <tr>
            <td>
                <SalesLogix:SlxGridView runat="server" ID="grdLeads" AutoGenerateColumns="false" CssClass="datagrid"
                    EnableViewState="false" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" DataKeyNames="Id">
                    <Columns>
                        <asp:BoundField DataField="Company" ShowHeader="true" HeaderText="Company" meta:resourcekey="Company" HeaderStyle-Width="150px" />
                        <asp:BoundField DataField="FirstName" ShowHeader="true" HeaderText="First Name" meta:resourcekey="FirstName" HeaderStyle-Width="100px"/>
                        <asp:BoundField DataField="LastName" ShowHeader="true" HeaderText="Last Name" meta:resourcekey="LastName" HeaderStyle-Width="100px"/>
                        <asp:BoundField DataField="Title" ShowHeader="true" HeaderText="Title" meta:resourcekey="Title" HeaderStyle-Width="100px"/>
                        <asp:BoundField DataField="Email" ShowHeader="true" HeaderText="E-mail" meta:resourcekey="Email" HeaderStyle-Width="100px"/>
                        <asp:BoundField DataField="Address.LeadCtyStZip" ShowHeader="true" meta:resourcekey="CityStatePostalCode" HeaderText="City/State/Postal Code"/>
                        <asp:TemplateField HeaderText="Work Phone" meta:resourcekey="WorkPhone">
                            <ItemTemplate>
                                <SalesLogix:Phone runat="server" DisplayAsLabel="true" Text='<%# Eval("WorkPhone") %>' HeaderStyle-Width="100px"/>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </SalesLogix:SlxGridView>
            </td>
        </tr>
    </table>
</div>
<div style="padding-left:10px">
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="width:150px">
                <asp:Label runat="server" ID="lblMatchFilters" Text="Match Filters:" meta:resourcekey="lblMatchFilters"></asp:Label>
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkCompany" Text="Company" Checked="true" meta:resourcekey="chkCompany" /><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkLastName" Text="Last Name" meta:resourcekey="chkLastName" Checked="True"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkEmail" Text="E-Mail Address" meta:resourcekey="chkEmail" Checked="True"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkWorkPhone" Text="Work Phone" meta:resourcekey="chkWorkPhone" Checked="True"/><br />
            </td> 
        </tr>
        <tr>
            <td style="width:150px">
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkFirstName" Text="First Name" meta:resourcekey="chkFirstName" Checked="True"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkTitle" Text="Title" meta:resourcekey="chkTitle" Checked="True"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkCityStatePostal" Text="City/State/Postal Code" meta:resourcekey="chkCityStatePostal" Checked="True"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkTollFreePhone" Text="Toll Free Phone" meta:resourcekey="chkTollFreePhone"/><br />
            </td>
        </tr>
        <tr>
            <td style="width:150px">
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkWebAddress" Text="Web Address" meta:resourcekey="chkWebAddress"/><br />
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkIndustry" Text="Industry" meta:resourcekey="chkIndustry"/><br />
            </td>
        </tr>
    </table>
</div>
<div style="padding-left:10px">
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="width:150px; padding-top:12px">
                <asp:Label runat="server" ID="lblOptions" Text="Options:" meta:resourcekey="lblOptions"></asp:Label>
            </td>
            <td  style="padding-top:12px">
                <asp:RadioButton runat="server" ID="rdbMatchAll" Text="Match all selected filters" meta:resourcekey="rdbMatchAll" AutoPostBack="True" OnCheckedChanged="rdbMatchAll_CheckedChanged" />
            </td>
            <td  style="padding-top:12px">
                <asp:RadioButton runat="server" ID="rdbMatchExactly" Text="Match any of the selected filters" meta:resourcekey="rdbMatchExactly" AutoPostBack="True" OnCheckedChanged="rdbMatchExactly_CheckedChanged" Checked="True" />
            </td> 
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr> 
            <td style="width:150px">
            </td>
            <td>
                <asp:CheckBox runat="server" ID="chkMatchExactly" Text="Match exactly (For example, Acme Inc. and Acme Incorporated will not match)" meta:resourcekey="chkMatchExactly" OnCheckedChanged="chkMatchExactly_CheckedChanged" />
            </td>  
        </tr>
        <tr> 
            <td style="width:150px">
            </td>
            <td style="padding-top:12px">
                <asp:Button runat="server" ID="btnUpdate" Text="Update Potential Matches" meta:resourcekey="btnUpdate" OnClick="btnUpdate_Click" CssClass="slxbutton" />
            </td>  
        </tr>
        <tr>
            <td colspan="5">
                <hr />
            </td>
        </tr>
    </table>
</div>
<div style="padding-left:10px">
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="height:32px; width:700px; padding-top:10px">
                <span>
                    <asp:Label runat="server" ID="lblLeadMatches" Text="Potential Lead Matches (0 found)" meta:resourcekey="lblLeadMatches"></asp:Label>
                </span>
            </td>
            <td align="right" style="padding-top:10px">
                <span>
                    <asp:Button runat="server" Text="Open" ID="btnOpenLead" OnClick="btnOpenLead_Click" meta:resourcekey="btnOpenLead" CssClass="slxbutton" />
                </span>
            </td>
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <div style="overflow:scroll; height:75px; width:785px">
                    <SalesLogix:SlxGridView runat="server" ID="grdMatchedLeads" AutoGenerateColumns="false" CssClass="datagrid"
                        EnableViewState="false" SelectedRowStyle-CssClass="rowSelected" AlternatingRowStyle-CssClass="rowdk" 
                        RowStyle-CssClass="rowlt" OnSelectedIndexChanged="grdMatchedLeads_SelectedIndexChanged">
                        <Columns>
                            <asp:CommandField ShowSelectButton="true" SelectText="Select" ButtonType="link" HeaderText="Select" meta:resourcekey="Select"/>
                            <asp:BoundField DataField="Company" ShowHeader="true" HeaderText="Company" meta:resourcekey="Company" />
                            <asp:BoundField DataField="FirstName" ShowHeader="true" HeaderText="First Name" meta:resourcekey="FirstName"/>
                            <asp:BoundField DataField="LastName" ShowHeader="true" HeaderText="Last Name" meta:resourcekey="LastName"/>
                            <asp:BoundField DataField="Title" ShowHeader="true" HeaderText="Title" meta:resourcekey="Title"/>
                            <asp:BoundField DataField="Email" ShowHeader="true" HeaderText="E-mail" meta:resourcekey="Email"/>
                            <asp:BoundField DataField="Address.LeadCtyStZip" ShowHeader="true" meta:resourcekey="CityStatePostalCode" HeaderText="City/State/Postal Code"/>
                            <asp:TemplateField HeaderText="Work Phone" meta:resourcekey="WorkPhone">
                                <ItemTemplate>
                                    <SalesLogix:Phone runat="server" DisplayAsLabel="true" Text='<%# Eval("WorkPhone") %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </SalesLogix:SlxGridView>
                </div>
            </td>
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="height: 32px; width:700px; padding-top:15px">
                <span>
                    <asp:Label runat="server" ID="lblContactMatches" Text="Potential Contact Matches (0 found)" meta:resourcekey="lblPotentialContact"></asp:Label>
                </span>
            </td>
            <td align="right" style="padding-top:15px">
                <span>
                    <asp:Button runat="server" Text="Open" ID="btnOpenContact" OnClick="btnOpenContact_Click" meta:resourcekey="btnOpenContact" CssClass="slxbutton"/>
                </span>
            </td>
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <div style="overflow:scroll; height:75px; width:785px">
                    <SalesLogix:SlxGridView runat="server" ID="grdMatchedContacts" AutoGenerateColumns="false" CssClass="datagrid" 
                        EnableViewState="false" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" 
                        SelectedRowStyle-CssClass="rowSelected" OnSelectedIndexChanged="grdMatchedContacts_SelectedIndexChanged">
                        <Columns>
                            <asp:CommandField ShowSelectButton="true" SelectText="Select" ButtonType="link" HeaderText="Select" meta:resourcekey="Select"/>
                            <asp:BoundField DataField="Account" ShowHeader="true" HeaderText="Account" meta:resourcekey="Account"/>
                            <asp:BoundField DataField="FirstName" ShowHeader="true" HeaderText="First Name" meta:resourcekey="FirstName"/>
                            <asp:BoundField DataField="LastName" ShowHeader="true" HeaderText="Last Name" meta:resourcekey="LastName"/>
                            <asp:BoundField DataField="Title" ShowHeader="true" HeaderText="Title" meta:resourcekey="Title"/>
                            <asp:BoundField DataField="Email" ShowHeader="true" HeaderText="E-mail" meta:resourcekey="Email"/>
                            <asp:BoundField DataField="Address.CityStatePostal" ShowHeader="true" HeaderText="City/State/Postal Code" meta:resourcekey="CityStatePostalCode"/>
                            <asp:TemplateField HeaderText="Work Phone" meta:resourcekey="WorkPhone">
                                <ItemTemplate>
                                    <SalesLogix:Phone runat="server" DisplayAsLabel="true" Text='<%# Eval("WorkPhone") %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </SalesLogix:SlxGridView>
                </div>
            </td>
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="height:32px; width:395px; padding-top:15px">
                <span style="padding-right:80px">
                    <asp:Label runat="server" ID="lblAccountMatches" Text="Potential Account Matches (0 found)" meta:resourcekey="lblPotentialContact"></asp:Label>
                </span>
            </td>
            <td  align="right" style="padding-top:15px">
                <span>
                    <asp:Button runat="server" Text="Convert Lead to Contact for this Account" ID="btnConvert" OnClick="btnConvert_Click" meta:resourcekey="btnConvert" CssClass="slxbutton"/>
                </span>
            </td>
        </tr>
    </table>
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <div style="overflow:scroll; height:75px; width:785px">
                    <SalesLogix:SlxGridView runat="server" ID="grdMatchedAccounts" AutoGenerateColumns="false" CssClass="datagrid" 
                        AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected"
                        EnableViewState="false" OnSelectedIndexChanged="grdMatchedAccounts_SelectedIndexChanged">
                        <Columns>
                            <asp:CommandField ShowSelectButton="true" SelectText="Select" ButtonType="link" HeaderText="Select" meta:resourcekey="Select"/>
                            <asp:BoundField DataField="AccountName" ShowHeader="true" HeaderText="Account" meta:resourcekey="Account"/>
                            <asp:BoundField DataField="Industry" ShowHeader="true" HeaderText="Industry" meta:resourcekey="Industry"/>
                            <asp:BoundField DataField="WebAddress" ShowHeader="true" HeaderText="Web" meta:resourcekey="Industry"/>
                            <asp:BoundField DataField="Address.CityStatePostal" ShowHeader="true" HeaderText="City/State/Postal Code" meta:resourcekey="CityStatePostalCode"/>
                            <asp:TemplateField HeaderText="Main Phone" meta:resourcekey="MainPhone">
                                <ItemTemplate>
                                    <SalesLogix:Phone runat="server" DisplayAsLabel="true" Text='<%# Eval("MainPhone") %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:BoundField DataField="Type" ShowHeader="true" HeaderText="Type" meta:resourcekey="Type"/>
                        </Columns>
                    </SalesLogix:SlxGridView>
                </div>
            </td>
        </tr>
    </table>
</div>

<div style="padding-left:10px">
    <table width="785px" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="right" style="padding-top:15px">
                <asp:Button runat="server" ID="cmdClose" Text="Close" meta:resourcekey="btnClose" Width="100px" CssClass="slxbutton"/> 
            </td>
        </tr>
    </table>
</div>