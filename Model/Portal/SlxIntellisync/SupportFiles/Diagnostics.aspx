<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Diagnostics.aspx.cs" Inherits="Diagnostics" MasterPageFile="~/Masters/Diagnostics.master" %>
<asp:Content runat="server" ContentPlaceHolderID="ContentPlaceHolderArea">
<div>
    <h1>
        <asp:Label runat="server" ID="DiagnosticsDescription" meta:ResourceKey="DiagnosticsDescription" Text="..." />
    </h1>
</div>
<div>
    <table cellpadding="4" cellspacing="0">
        <tr>
            <td valign="top">
                <asp:DataGrid ID="DataList1" runat="server" style="background-color:White;border:Solid 1px Black;" 
                              AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333" 
                              GridLines="None" AllowPaging="true" PageSize="20" OnPageIndexChanged="OnPageIndexChanged">
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <EditItemStyle BackColor="#2461BF" />
                    <SelectedItemStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <AlternatingItemStyle BackColor="White" />
                    <ItemStyle BackColor="#EFF3FB" />
                    <Columns>
                        <asp:TemplateColumn HeaderText="Assembly">
                            <ItemTemplate>
                                <asp:Label ID="Label1" runat="server" Text='<%# GetNiceName(Eval("AssemblyName")) %>'></asp:Label>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                        <asp:TemplateColumn HeaderText="Version">
                            <ItemTemplate>
                                <asp:Label ID="Label2" runat="server" Text='<%# GetPrettyVersion(Eval("FullName")) %>'></asp:Label>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                    </Columns>
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                </asp:DataGrid>
            </td>
            <td valign="top">
            <table cellpadding="0" cellspacing="0">
	            <tr>
		            <td>
			            <table width="500" cellpadding="4" cellspacing="0" style="background-color:#EFF3FB;border: Solid 1px Black;">
				            <col />
				            <col />
				            <tr style="background-color:#507CD1;color:White;">
					            <td colspan="2" style="font-weight:bold;">
						            <asp:Label ID="LoginTitle" runat="server" meta:resourcekey="LoginTitle" Text="..."></asp:Label>
					            </td>
				            </tr>
				            <tr style="height:100px;">
					            <td colspan="2" style="margin:5px">
						            <table>
							            <tr>
								            <td><img src="Images/icons/Lock64.png"</td>
								            <td><asp:Label ID="LoginDescription" meta:resourcekey="LoginDescription" Text=".." runat="server" /></td>
							            </tr>
						            </table>
					            </td>
				            </tr>
				            <tr>
					            <td colspan="2" style="text-align:center;color:Red;"><asp:Label runat="server" ID="testMessage" /></td>
				            </tr>
				            <tr>
					            <td><asp:Label runat="server" ID="lblUserId" meta:resourcekey="lblUserId" Text="..." /></td>
					            <td><asp:TextBox runat="server" ID="userId" /></td>
				            </tr>
				            <tr>
					            <td><asp:Label runat="server" ID="lblPassword" meta:resourcekey="lblPassword" Text="..." /></td>
					            <td><asp:TextBox runat="server" ID="password" TextMode="Password"></asp:TextBox></td>
				            </tr>
				            <tr>
					            <td colspan="2" align="right"><asp:Button runat="server" ID="btnConnect" meta:resourcekey="btnConnect" Text="..." onclick="btnConnect_Click" /></td>
				            </tr>
			            </table>
		            </td>
	            </tr>
            </table>
          </td>
        </tr>
    </table>
</div>
</asp:Content>

    
