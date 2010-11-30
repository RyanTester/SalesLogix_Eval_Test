<%@ Control Language="C#" ClassName="LeadQualifications" Inherits="SmartParts_Lead_LeadQualificaitons" CodeFile="LeadQualifications.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<%--Used to store true/false confirmation from the dialog displayed via javascript for the cboQualifications control.--%>

<asp:HiddenField runat="server" ID="htxtConfirmation" Value="" />

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col id="col_1" width="55%" /><col id="col_2" width="45%" /><tr>
<td colspan="2" style="height: 24px" >  
           <span style="width:85px" class="twocollbl"><asp:Label ID="cboQualifications_lz" AssociatedControlID="cboQualifications" runat="server" Text="<%$ resources: cboQualifications.Caption %>"></asp:Label></span> 
<span style="width:190px" class="twocoltextcontrol" >
<asp:DropDownList runat="server" ID="cboQualifications" AutoPostBack="True" >
</asp:DropDownList>
</span> 
</td>
  </tr>
<tr><td colspan="2" >  
        
<span >
 <asp:LinkButton runat="server" ID="cmdConvertLeadLink"
 Text="<%$ resources: cmdConvertLeadLink.Caption %>"  />

</span> 
</td>
  </tr>
<tr><td style="height: 25px" >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected1" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected1_lz" AssociatedControlID="chkQualificaitonSelected1" runat="server" Text="<%$ resources: chkQualificaitonSelected1.Caption %>"></asp:Label></span></td>
  <td style="height: 25px" >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription1" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected2" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected2_lz" AssociatedControlID="chkQualificaitonSelected2" runat="server" Text="<%$ resources: chkQualificaitonSelected2.Caption %>"></asp:Label></span></td>
  <td >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription2" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td style="height: 26px" >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected3" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected3_lz" AssociatedControlID="chkQualificaitonSelected3" runat="server" Text="<%$ resources: chkQualificaitonSelected3.Caption %>"></asp:Label></span></td>
  <td style="height: 26px" >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription3" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td style="height: 26px" >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected4" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected4_lz" AssociatedControlID="chkQualificaitonSelected4" runat="server" Text="<%$ resources: chkQualificaitonSelected4.Caption %>"></asp:Label></span></td>
  <td style="height: 26px" >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription4" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected5" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected5_lz" AssociatedControlID="chkQualificaitonSelected5" runat="server" Text="<%$ resources: chkQualificaitonSelected5.Caption %>"></asp:Label></span></td>
  <td >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription5" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td style="height: 26px" >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected6" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected6_lz" AssociatedControlID="chkQualificaitonSelected6" runat="server" Text="<%$ resources: chkQualificaitonSelected6.Caption %>"></asp:Label></span></td>
  <td style="height: 26px" >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription6" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected7" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected7_lz" AssociatedControlID="chkQualificaitonSelected7" runat="server" Text="<%$ resources: chkQualificaitonSelected7.Caption %>"></asp:Label></span></td>
  <td >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription7" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
<tr><td >  
        
<span>
<asp:CheckBox style="display:none" runat="server" ID="chkQualificaitonSelected8" Text="" AutoPostBack="True"  />
</span> 
<span class="lblright"><asp:Label style="display:none" ID="chkQualificaitonSelected8_lz" AssociatedControlID="chkQualificaitonSelected8" runat="server" Text="<%$ resources: chkQualificaitonSelected8.Caption %>"></asp:Label></span></td>
  <td >  
            
<span class="textcontrol">
<asp:TextBox Width="100px" style="display:none" runat="server" ID="txtQualificationDescription8" AutoPostBack="True" Wrap="False"  />

</span> 
</td>
  </tr>
</table>
