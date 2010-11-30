<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" Debug="true" MasterPageFile="~/Masters/Main.master" %>
<asp:Content ContentPlaceHolderID="ContentPlaceHolderArea" runat="server">

<div id="splashimg">
	<div id="LoginForm">
       <table border="0" cellpadding="0"  class="slxlogin">
            <tr>
                <td style="padding-left:300px"></td>
                <td style="padding-top:80px;padding-left:3px;">
				</td>
			</tr>
			<tr>
                <td style="padding-left:220px" colspan="2"></td>
                </td>
            </tr>
            <tr>
                <td style="padding-left:220px">
                 &nbsp;   
                </td>
            </tr>
            <tr>
                <td style="padding-left:220px;" colspan="2">
                </td>
            </tr>
            <tr>
                <td style="padding-left:300px;font-size:80%;" colspan="2">
                <asp:Label ID="VersionLabel" runat="server" Text="Version"></asp:Label></td>
            </tr>
            <tr>
                <td style="padding-left:300px; font-size:80%" colspan="2">
                    <div><asp:Label ID="Copyright" runat="server" Text="Copyright 1997-2007" meta:resourcekey="CopyrightResource1"></asp:Label></div>
					<div><asp:Label ID="Sage" runat="server" Text="Sage Software, Inc." meta:resourcekey="SageResource1"></asp:Label></div>
					<div><asp:Label ID="Rights" runat="server" Text="All Rights Reserved" meta:resourcekey="RightsResource1"></asp:Label></div>
                </td>
            </tr>  
            <tr>
                <td style="padding-left:300px"></td>
				<td style="font-size:80%;padding-left:3px">
					
				</td>
            </tr>  
            <tr>
                <td style="padding-left:300px"></td>
                <td align="left" style="font-size:80%; padding-top:2px;">
                    <span></span>
				</td>
            </tr>                        
            <tr>
                    <td colspan="2" style="font-size:80%; padding-top:15px;"></td>
                </tr>
                <tr>
                <td colspan="2" style="font-size:80%; padding-left:10px;">
                    <div></div>
                </td>
            </tr>
             <tr>
                <td colspan="2" align="center" style="padding-left:10px;padding-right:10px;padding-top:10px">
                    <asp:Panel ID="intellisyncDownload" runat="server">
                        <asp:Label ID="Label1" runat="server" Text="Download the Intellisync Client from "></asp:Label>
                        <asp:Hyperlink ID="Hyperlink1" runat="server" Text="here" NavigateUrl="Downloads/IntellisyncInstall.zip"></asp:Hyperlink>
                    </asp:Panel>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="right" style="padding-left:10px;padding-right:10px;padding-top:10px">
                    <table cellspacing="5" cellpadding="2">
                        <tr>
                            <td style="border-left:solid 1px Black;border-bottom:solid 1px Black;width:80px;text-align:left;">
                                <asp:HyperLink NavigateUrl="~/Diagnostics.aspx" ID="diagnostics" runat="server" Text="Diagnostics" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        </div>     
     </div>
</asp:Content>