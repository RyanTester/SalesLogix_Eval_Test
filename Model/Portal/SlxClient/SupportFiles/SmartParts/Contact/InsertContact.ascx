<%@ Import Namespace="Sage.Platform.Application.UI"%>
<%@ Import Namespace="Sage.Platform.WebPortal.SmartParts"%>
<%@ Import namespace="Sage.SalesLogix.Entities"%>
<%@ Import namespace="Sage.Platform"%>
<%@ Import namespace="Sage.Entity.Interfaces"%>
<%@ Control Language="C#" ClassName="InsertContact" Inherits="Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPartInfoProvider" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Binding" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Services" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.WebUserOptions" Namespace="Sage.SalesLogix.WebUserOptions" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.Application" Namespace="Sage.Platform.Application.Services" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.Application" Namespace="Sage.Platform.Application" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="pnlInsertContact_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="pnlInsertContact_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="pnlInsertContact_RTools" runat="server">
     <asp:ImageButton runat="server" ID="cmdSave"
     AlternateText="<%$ resources: cmdSave.Caption %>"  ToolTip="<%$ resources: cmdSave.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Save_16x16"  />

     <asp:ImageButton runat="server" ID="cmdSaveNew"
     AlternateText="<%$ resources: cmdSaveNew.Caption %>"  ToolTip="<%$ resources: cmdSaveNew.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Save_New16x16"  />

     <asp:ImageButton runat="server" ID="cmdSaveClear"
     AlternateText="<%$ resources: cmdSaveClear.Caption %>"  ToolTip="<%$ resources: cmdSaveClear.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Save_Clear16x16"  />

     <SalesLogix:PageLink ID="lnkInsertContactHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: lnkHelp.Caption %>" Target="<%$ resources: lnkHelp.ToolTip %>" NavigateUrl="contactadd1.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
     </SalesLogix:PageLink>
</asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
	<col width="33%" /><col width="33%" /><col width="33%" />
	<tr>
		<td>  
			<span class="lbl"><asp:Label ID="nmeContactName_lz" AssociatedControlID="nmeContactName" runat="server" Text="<%$ resources: nmeContactName.Caption %>"></asp:Label></span> 
			<span>
				<span class="textcontrol"><SalesLogix:FullName runat="server" ID="nmeContactName"  /></span>
			</span> 
		</td>
		<td colspan="2">  
			<span class="lbl"><asp:Label ID="lueUseExistingAccount_lz" AssociatedControlID="lueUseExistingAccount" runat="server" Text="<%$ resources: lueUseExistingAccount.Caption %>"></asp:Label></span> 
			<span   class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="lueUseExistingAccount" LookupEntityName="Account" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" LookupDisplayMode="HyperText" AutoPostBack="true" >
					<LookupProperties>
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.AccountName.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.Address.City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.Address.State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.MainPhone.PropertyHeader %>" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>	
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.Type.PropertyHeader %>" PropertyName="Type" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.SubType.PropertyHeader %>" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>					
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>				
					    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.AccountManager.PropertyHeader %>" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>				
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueUseExistingAccount.LookupProperties.Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False"></SalesLogix:LookupProperty>
					</LookupProperties>
					<LookupPreFilters>
					</LookupPreFilters>
				</SalesLogix:LookupControl>
			</span> 
		</td>
	</tr>
	<tr>
		<td>  
			<span class="lbl"><asp:Label ID="txtContactAccountName_lz" AssociatedControlID="txtContactAccountName" runat="server" Text="<%$ resources: txtContactAccountName.Caption %>"></asp:Label></span> 
			<span class="textcontrol"><asp:TextBox runat="server" ID="txtContactAccountName"  /></span> 
		</td>
		<td rowspan="2" colspan="2" >  
			<asp:Localize runat="server" ID="lblLookForMatches" Text="<%$ resources: lblLookForMatches.Caption %>"></asp:Localize>
		</td>
	</tr>
	<tr>
		<td >  
			<span class="lbl"><asp:Label ID="emlContactEmail_lz" AssociatedControlID="emlContactEmail" runat="server" Text="<%$ resources: emlContactEmail.Caption %>"></asp:Label></span> 
			<span class="textcontrol">
				<SalesLogix:Email runat="server" ID="emlContactEmail" EmailTextBoxStyle-ForeColor="#000099"
				 EmailTextBoxStyle-Font-Underline="false" ToolTip="<%$ resources: emlEmail.ToolTip %>" >
				</SalesLogix:Email>
			</span>
		</td>
	</tr>
	<tr>
		<td >  
			<span class="lbl"><asp:Label ID="webContactWebAddress_lz" AssociatedControlID="webContactWebAddress" runat="server" Text="<%$ resources: webContactWebAddress.Caption %>"></asp:Label></span> 
			<span class="textcontrol">
			    <SalesLogix:URL runat="server" ID="webContactWebAddress" URLTextBoxStyle-ForeColor="#000099" URLTextBoxStyle-Font-Underline="false" ButtonToolTip="<%$ resources: webContactWebAddress.ButtonToolTip %>" />
			</span> 
		</td>
		<td colspan="2">  
			<span>
				<asp:Button runat="server" ID="cmdMatchingRecords" Text="<%$ resources: cmdMatchingRecords.Caption %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Find_16x16" CssClass="slxbutton" />
			</span>
		</td>
	</tr>
	<tr>
		<td >
			<span class="lbl"><asp:Label ID="phnContactWorkPhone_lz" AssociatedControlID="phnContactWorkPhone" runat="server" Text="<%$ resources: phnContactWorkPhone.Caption %>"></asp:Label></span> 
			<span class="textcontrol"><SalesLogix:Phone runat="server" ID="phnContactWorkPhone" AutoPostBack="true"  /></span> 
		</td>
		<td colspan="2">
			<span ><asp:CheckBox runat="server" ID="chkAutoSearch" Text=""  /></span> 
			<span class="lblright"><asp:Label ID="chkAutoSearch_lz" AssociatedControlID="chkAutoSearch" runat="server" Text="<%$ resources: chkAutoSearch.Caption %>"></asp:Label></span>
		</td>
	</tr>

	<tr>
		<td colspan="3" style="padding:5px 0px;">
			<div class="mainContentHeader">
				<span id="hzsContactInformation" style="padding-left:30px">
					<asp:Localize ID="Localize1" runat="server" Text="<%$ resources: hzsContactInformation.Caption %>" >Contact Information</asp:Localize>
				</span>
			</div>
		</td>	
	</tr>
	<tr>
		<td >  
           <span class="lbl"><asp:Label ID="pklContactTitle_lz" AssociatedControlID="pklContactTitle" runat="server" Text="<%$ resources: pklContactTitle.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="pklContactTitle" PickListId="kSYST0000385" PickListName="Title" MustExistInList="false" AlphaSort="true" />

</span> 
</td>
  <td >  
           <span class="lbl"><asp:Label ID="phnContactHomePhone_lz" AssociatedControlID="phnContactHomePhone" runat="server" Text="<%$ resources: phnContactHomePhone.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:Phone runat="server" ID="phnContactHomePhone"  />
</span> 
</td>
  </tr>
<tr><td rowspan="3" >  
           <span class="lbl"><asp:Label ID="adrContactAddress_lz" AssociatedControlID="adrContactAddress" runat="server" Text="<%$ resources: adrContactAddress.Caption %>"></asp:Label></span> 
<span >
<span class="textcontrol">
    <SalesLogix:AddressControl runat="server" ID="adrContactAddress" AddressDescriptionPickListId="kSYST0000013" AutoPostBack="true" AddressDescriptionPickListName="Address Description (Contact)"
        AddressToolTip="<%$ resources: adrContactAddress.AddressToolTip %>" ButtonToolTip="<%$ resources: adrContactAddress.ButtonToolTip %>" >
        <AddressDescStyle Height="80" />
    </SalesLogix:AddressControl></span>
</span> 
</td>
                  <td >  
           <span class="lbl"><asp:Label ID="phnContactMobile_lz" AssociatedControlID="phnContactMobile" runat="server" Text="<%$ resources: phnContactMobile.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:Phone runat="server" ID="phnContactMobile"  />
</span> 
</td>
  </tr>
<tr><td >  
           <span class="lbl"><asp:Label ID="phnContactFax_lz" AssociatedControlID="phnContactFax" runat="server" Text="<%$ resources: phnContactFax.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:Phone runat="server" ID="phnContactFax"  />
</span> 
</td>
  </tr>
<tr><td >  
        
<span >
 <asp:Button runat="server" ID="cmdSelectAddress"
 Text="<%$ resources: cmdSelectAddress.Caption %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Alternate_Address_16x16" CssClass="slxbutton" />

</span> 
</td>
  </tr>
<tr><td colspan="3" style="padding:5px 0px;">  
        
<span >
<div class="mainContentHeader"><span id="hzsAccountInformation" style="padding-left:30px">
<asp:Localize ID="Localize2" runat="server" Text="<%$ resources: hzsAccountInformation.Caption %>" >Account Information</asp:Localize></span></div>


</span> 
</td>
  </tr>
<tr><td rowspan="5" >  
           <span class="lbl"><asp:Label ID="adrAccountAddress_lz" AssociatedControlID="adrAccountAddress" runat="server" Text="<%$ resources: adrAccountAddress.Caption %>"></asp:Label></span> 
<span >
<span class="textcontrol">
    <SalesLogix:AddressControl runat="server" ID="adrAccountAddress" AddressDescriptionPickListId="kSYST0000014" AddressDescriptionPickListName="Address Description (Account)"
        AddressToolTip="<%$ resources: adrContactAddress.AddressToolTip %>" ButtonToolTip="<%$ resources: adrContactAddress.ButtonToolTip %>" >
        <AddressDescStyle Height="80" />
    </SalesLogix:AddressControl></span>
</span> 
</td>
                  <td >  
           <span class="lbl"><asp:Label ID="phnAccountMainPhone_lz" AssociatedControlID="phnAccountMainPhone" runat="server" Text="<%$ resources: phnAccountMainPhone.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:Phone runat="server" ID="phnAccountMainPhone"  />
</span> 
</td>
  <td >  
           <span class="lbl"><asp:Label ID="pklAccountIndustry_lz" AssociatedControlID="pklAccountIndustry" runat="server" Text="<%$ resources: pklAccountIndustry.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="pklAccountIndustry" PickListId="kSYST0000388" PickListName="Industry" MustExistInList="false" NoneEditable="true" AlphaSort="true" />

</span> 
</td>
  </tr>
<tr><td >  
           <span class="lbl"><asp:Label ID="phnAccountFax_lz" AssociatedControlID="phnAccountFax" runat="server" Text="<%$ resources: phnAccountFax.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:Phone runat="server" ID="phnAccountFax"  />
</span> 
</td>
  <td rowspan="4" >  
           <span class="lbl"><asp:Label ID="txtAccountBusinessDescription_lz" AssociatedControlID="txtAccountBusinessDescription" runat="server" Text="<%$ resources: txtAccountBusinessDescription.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<asp:TextBox runat="server" ID="txtAccountBusinessDescription" TextMode="MultiLine" Columns="40" Rows="4"  />

</span> 
</td>
                  </tr>
<tr><td >  
           <span class="lbl"><asp:Label ID="pklAccountType_lz" AssociatedControlID="pklAccountType" runat="server" Text="<%$ resources: pklAccountType.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="pklAccountType" PickListId="kSYST0000382" PickListName="Account Type" AutoPostBack="true" NoneEditable="true" OnPickListValueChanged="pklAccountType_PickListValueChanged" />

</span> 
</td>
  </tr>
<tr><td>     <span class="lbl"><asp:Label ID="pklAccountSubType_lz" AssociatedControlID="pklAccountSubType" runat="server" Text="<%$ resources: pklAccountSubType.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="pklAccountSubType" PickListId="kSYST0000382"  MustExistInList="false" />

</span> 
</td>
  </tr>
<tr>
<td>     <span class="lbl"><asp:Label ID="pklAccountStatus_lz" AssociatedControlID="pklAccountStatus" runat="server" Text="<%$ resources: pklAccountStatus.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:PickListControl runat="server" ID="pklAccountStatus" PickListId="kSYST0000381" PickListName="Account Status" MustExistInList="false" AlphaSort="true" />

</span> 
</td>
  </tr>
<tr><td colspan="3" style="padding:5px 0px;">  
        
<span >
  <hr />
 

</span> 
</td>
  </tr>
<tr><td >  
           <span class="lbl"><asp:Label ID="usrAccountManager_lz" AssociatedControlID="usrAccountManager" runat="server" Text="<%$ resources: usrAccountManager.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:SlxUserControl runat="server" ID="usrAccountManager"  />

</span> 
</td>
  <td >  
           <span class="lbl"><asp:Label ID="ownAccountOwner_lz" AssociatedControlID="ownAccountOwner" runat="server" Text="<%$ resources: ownAccountOwner.Caption %>"></asp:Label></span> 
<span   class="textcontrol">
<SalesLogix:OwnerControl runat="server" ID="ownAccountOwner"  />

</span> 
</td>
  </tr>
</table>
 
<script runat="server" type="text/C#">
	public override Type EntityType
	{
		get { return typeof(IContact); }
	}

    private IUserOptionsService _userOpts;
    private Sage.Platform.Application.Services.IUserOptionsService UserOptionsService
    {
        get
        {
            if ((_userOpts == null) && (ApplicationContext.Current != null))
                _userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
            return _userOpts;
        }
    }
    
    
    
    private void DiasbleFLS()
    {
        foreach (Sage.Platform.EntityBinding.IEntityBinding eb in BindingSource.Bindings)
        { 
            WebEntityBinding wb = eb as WebEntityBinding;
            wb.IgnoreFLSDisabling = true;
        }
    }
    private void IgnoreAccountBindings()
    {

        
        foreach (Sage.Platform.EntityBinding.IEntityBinding eb in BindingSource.Bindings)
        {
            Sage.Platform.WebPortal.Binding.WebEntityBinding wb = eb as Sage.Platform.WebPortal.Binding.WebEntityBinding;
            if (IsAccountBinding(wb.EntityBindingString))
            {
                wb.IgnoreControlChanges = true;
            }          
            
        }

    }

    private bool IsAccountBinding(string propertyName)
    {
        
        switch (propertyName)
        {
            case "Account.AccountName":
                return true;
            case "Account.MainPhone":
                return true;
            case "Account.Industry":
                return true;
            case "Account.Fax":
                return true;
            case "Account.BusinessDescription":
                return true;
            case "Account.Type":
                return true;
            case "Account.SubTyp":
                return true;
            case "Account.Status":
                return true;
            case "Account.AccountManager":
                return true;
            case "Account.Owner":
                return true;  
            case "Account.Address.FullAddress":
                return true;  
            case "Account.Address.City":
                return true;  
            case "Account.Address.Country":
                return true;  
            case "Account.Address.County":
                return true;  
            case "Account.Address.Address1":
                return true;  
            case "Account.Address.Address2":
                return true;  
            case "Account.Address.Address3":
                return true; 
            case "Account.Address.Description":
                return true; 
            case "Account.Address.IsMailing":
                return true; 
            case "Account.Address.IsPrimary":
                return true; 
            case "Account.Address.PostalCode":
                return true;
            case "Account.Address.Salutation":
                return true; 
            case "Account.Address.State":
                return true;    
            default:
                return false;
                       
        }
        
    }
    
	protected override void OnAddEntityBindings() 
	{
        BindingSource.Bindings.Add(new WebEntityBinding("Prefix", nmeContactName, "NamePrefix"));
        BindingSource.Bindings.Add(new WebEntityBinding("FirstName", nmeContactName, "NameFirst"));
		BindingSource.Bindings.Add(new WebEntityBinding("MiddleName", nmeContactName, "NameMiddle"));
		BindingSource.Bindings.Add(new WebEntityBinding("LastName", nmeContactName, "NameLast"));
		BindingSource.Bindings.Add(new WebEntityBinding("Suffix", nmeContactName, "NameSuffix"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.AccountName", txtContactAccountName, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Email", emlContactEmail, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("WebAddress", webContactWebAddress, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("WorkPhone", phnContactWorkPhone, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Title", pklContactTitle, "PickListValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("HomePhone", phnContactHomePhone, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Address.FullAddress", adrContactAddress, "AddressDisplay"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Description", adrContactAddress, "AddressDescription"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.IsPrimary", adrContactAddress, "AddressIsPrimary"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.IsMailing", adrContactAddress, "AddressIsMailing"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Address1", adrContactAddress, "AddressDesc1"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Address2", adrContactAddress, "AddressDesc2"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Address3", adrContactAddress, "AddressDesc3"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.City", adrContactAddress, "AddressCity"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.State", adrContactAddress, "AddressState"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.PostalCode", adrContactAddress, "AddressPostalCode"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.County", adrContactAddress, "AddressCounty"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Country", adrContactAddress, "AddressCountry"));
        BindingSource.Bindings.Add(new WebEntityBinding("Address.Salutation", adrContactAddress, "AddressSalutation"));
        BindingSource.Bindings.Add(new WebEntityBinding("Mobile", phnContactMobile, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("Fax", phnContactFax, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.FullAddress", adrAccountAddress, "AddressDisplay"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.City", adrAccountAddress, "AddressCity"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Country", adrAccountAddress, "AddressCountry"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.County", adrAccountAddress, "AddressCounty"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Address1", adrAccountAddress, "AddressDesc1"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Address2", adrAccountAddress, "AddressDesc2"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Address3", adrAccountAddress, "AddressDesc3"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Description", adrAccountAddress, "AddressDescription"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.IsMailing", adrAccountAddress, "AddressIsMailing"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.IsPrimary", adrAccountAddress, "AddressIsPrimary"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.PostalCode", adrAccountAddress, "AddressPostalCode"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.Salutation", adrAccountAddress, "AddressSalutation"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Address.State", adrAccountAddress, "AddressState"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.MainPhone", phnAccountMainPhone, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Industry", pklAccountIndustry, "PickListValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Fax", phnAccountFax, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.BusinessDescription", txtAccountBusinessDescription, "Text"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Type", pklAccountType, "PickListValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.SubType", pklAccountSubType, "PickListValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Status", pklAccountStatus, "PickListValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.AccountManager", usrAccountManager, "LookupResultValue"));
		BindingSource.Bindings.Add(new WebEntityBinding("Account.Owner", ownAccountOwner, "LookupResultValue"));
        DiasbleFLS();
    }

	protected void lueUseExistingAccount_ChangeAction(object sender, EventArgs e)
	{
        IgnoreAccountBindings();
        IAccount account = (lueUseExistingAccount.LookupResultValue as IAccount);
		IContact contact = (BindingSource.Current as IContact);
		if ((account != null) && (contact != null))
		{
			txtContactAccountName.Enabled = false;
			adrAccountAddress.Enabled = false;
			phnAccountMainPhone.Enabled = false;
			phnAccountFax.Enabled = false;
			pklAccountType.Enabled = false;
			pklAccountSubType.Enabled = false;
			pklAccountStatus.Enabled = false;
			pklAccountIndustry.Enabled = false;
			txtAccountBusinessDescription.Enabled = false;
			usrAccountManager.Enabled = false;
			ownAccountOwner.Enabled = false;

			cmdSelectAddress.Enabled = (account.Addresses.Count > 0);

			contact.Account = account;
			contact.AccountName = account.AccountName;

			contact.WebAddress = account.WebAddress;
			contact.WorkPhone = account.MainPhone;
			contact.Fax = account.Fax;

			contact.Address.Address1 = account.Address.Address1;
			contact.Address.Address2 = account.Address.Address2;
			contact.Address.Address3 = account.Address.Address3;
			contact.Address.Address4 = account.Address.Address4;
			contact.Address.City = account.Address.City;
			contact.Address.Country = account.Address.Country;
			contact.Address.County = account.Address.County;
			contact.Address.IsMailing = true;
			contact.Address.IsPrimary = true;
			contact.Address.PostalCode = account.Address.PostalCode;
			contact.Address.Routing = account.Address.Routing;
			contact.Address.Salutation = contact.FirstName;
			contact.Address.State = account.Address.State;
			contact.Address.TimeZone = account.Address.TimeZone;
			contact.Address.Type = account.Address.Type;

            if (string.IsNullOrEmpty(account.Address.Description))
            {
                contact.Address.Description = GetLocalResourceObject("Contact_Address_Description_Default").ToString();
            }
            else 
            { 
                contact.Address.Description = account.Address.Description;
            }
            lueUseExistingAccount.LookupResultValue = account;
		}
	}

	protected void DialogService_onDialogClosing(object from, WebDialogClosingEventArgs e)
    {
        if (DialogService != null)
        {
            if (DialogService.SmartPartMappedID == "ContactSearchForDuplicates")
            {
                if (DialogService.DialogParameters.ContainsKey("JumpID"))
                {
                    string strJumpID = DialogService.DialogParameters["JumpID"].ToString();
                    if (strJumpID != EntityContext.EntityID.ToString())
                    {
                        IgnoreAccountBindings();
                        IAccount account = EntityFactory.GetById<IAccount>(strJumpID);
                        lueUseExistingAccount.LookupResultValue = account;
                        lueUseExistingAccount_ChangeAction(from, e);

                        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
                        if (refresher != null)
                        {
                            refresher.RefreshAll();
                        }
                    }
                }
            }            
        }
    }

	protected void phnContactWorkPhone_ChangeAction(object sender, EventArgs e)
	{
		///* If we're dealing with a new Account and Contact. */
		IContact contact = BindingSource.Current as IContact;
		if (contact != null)
		{
			if (contact.Account.Id == null)
			{
				contact.Account.MainPhone = contact.WorkPhone;
			}
			if ((DialogService != null) && (chkAutoSearch.Checked))
			{
				contact.AccountName = contact.Account.AccountName;
				DialogService.DialogParameters.Clear();
				DialogService.DialogParameters.Add("Contact", BindingSource.Current);
				DialogService.DialogParameters.Add("Account", contact.Account);
                DialogService.SetSpecs(0, 0, 800, 1000, "ContactSearchForDuplicates", "", true);
				DialogService.ShowDialog();
			}
		}
	}

	protected void cmdMatchingRecords_ClickAction(object sender, EventArgs e)    
    {
		if (DialogService != null)
		{
			IContact contact = BindingSource.Current as IContact;
			if (contact != null)
			{
				IAccount account = contact.Account;
				contact.AccountName = account.AccountName;
				DialogService.DialogParameters.Clear();
				DialogService.DialogParameters.Add("Contact", BindingSource.Current);
				DialogService.DialogParameters.Add("Account", account);
				DialogService.SetSpecs(0, 0, 800, 1000, "ContactSearchForDuplicates", "", true);
				DialogService.ShowDialog();
			}
		}
    }
	
	protected void adrContactAddress_ChangeAction(object sender, EventArgs e)
	{
        /* If we're dealing with a new Account and Contact. */
        IContact contact = BindingSource.Current as IContact;
        if (contact != null)
        {
            if (contact.Account.Id == null)
            {
                contact.Account.Address.Address1 = adrContactAddress.AddressDesc1;
                contact.Account.Address.Address2 = adrContactAddress.AddressDesc2;
                contact.Account.Address.Address3 = adrContactAddress.AddressDesc3;
                contact.Account.Address.Address4 = "";
                contact.Account.Address.City = adrContactAddress.AddressCity;
                contact.Account.Address.Country = adrContactAddress.AddressCountry;
                contact.Account.Address.County = adrContactAddress.AddressCounty;
                contact.Account.Address.Description = adrContactAddress.AddressDescription;
                contact.Account.Address.PostalCode = adrContactAddress.AddressPostalCode;
                contact.Account.Address.Routing = "";
                contact.Account.Address.Salutation = adrContactAddress.AddressSalutation;
                contact.Account.Address.State = adrContactAddress.AddressState;
                contact.Account.Address.TimeZone = "";
                contact.Account.Address.IsMailing = true;
                contact.Account.Address.IsPrimary = true;
            }
        }
	}

	protected void cmdSelectAddress_ClickAction(object sender, EventArgs e)
	{
		if (DialogService != null)
		{
            DialogService.SetSpecs(100, 100, 300, 800, "SelectAccountAddress", GetLocalResourceObject("SelectAddress_rsc.DialogTitleOverride").ToString(), true);
			DialogService.ShowDialog();
		}
	}

	protected void cmdSave_ClickAction(object sender, EventArgs e)
	{
        saveOptions();
        IContact contact = BindingSource.Current as IContact;
		if (contact != null)
		{
			object[] objarray = new object[] { contact, contact.Account };
			object contactId = EntityFactory.Execute<Contact>("Contact.SaveContactAccount", objarray);
			if (contactId != null)
				Response.Redirect(string.Format("Contact.aspx?entityId={0}", (contactId)));
		}
	}

	protected void cmdSaveNew_ClickAction(object sender, EventArgs e)
	{
        saveOptions();
        IContact contact = BindingSource.Current as IContact;
		if (contact != null)
		{
			object[] objarray = new object[] {contact, contact.Account};
			EntityFactory.Execute<Contact>("Contact.SaveContactAccount", objarray);
			Response.Redirect(string.Format("InsertContactAccount.aspx?modeid=Insert&accountId={0}", contact.Account.Id));
		}
	}

	protected void cmdSaveClear_ClickAction(object sender, EventArgs e)
	{
        saveOptions();
        IContact contact = BindingSource.Current as IContact;
		if (contact != null)
		{
			object[] objarray = new object[] {contact, contact.Account};
			EntityFactory.Execute<Contact>("Contact.SaveContactAccount", objarray);
			Response.Redirect("InsertContactAccount.aspx?modeid=Insert");
		}
	}

	protected override void OnLoad(EventArgs e)
	{
		base.OnLoad(e);

        ClientBindingMgr.RegisterBoundControl(lueUseExistingAccount);
        ClientBindingMgr.RegisterSaveButton(cmdSave);
        ClientBindingMgr.RegisterSaveButton(cmdSaveClear);
        ClientBindingMgr.RegisterSaveButton(cmdSaveNew);
        LoadView();
	}

    private void LoadView()
    {
        IContact contact = (BindingSource.Current as IContact);
        if (contact != null)
        {
            if (contact.Id == null)
            {
                if (!Page.IsPostBack)
                {
                    chkAutoSearch.Checked = TurnOnAutoSearch();
                }
            }
           
            IAccount account = GetCurrentAccount(contact);
            if (account != null)
            {
                Boolean changeEnable = (account.Id == null);
                txtContactAccountName.Enabled = changeEnable;
                adrAccountAddress.Enabled = changeEnable;
                phnAccountMainPhone.Enabled = changeEnable;
                phnAccountFax.Enabled = changeEnable;
                pklAccountType.Enabled = changeEnable;
                pklAccountSubType.Enabled = changeEnable;
                pklAccountStatus.Enabled = changeEnable;
                pklAccountIndustry.Enabled = changeEnable;
                txtAccountBusinessDescription.Enabled = changeEnable;
                usrAccountManager.Enabled = changeEnable;
                ownAccountOwner.Enabled = changeEnable;

                pklAccountSubType.PickListName = account.GetSubTypePickListName();
                cmdSelectAddress.Enabled = (account.Addresses.Count > 0);
                if (account.Id != null)
                {
                    lueUseExistingAccount.LookupResultValue = account;
                    pklAccountSubType.PickListName = account.GetSubTypePickListName();
                }
                
                if (!IsPostBack)
                {
                    
                    contact.WebAddress = account.WebAddress;
                    contact.WorkPhone = account.MainPhone;
                    contact.Fax = account.Fax;
                    contact.Address.Address1 = account.Address.Address1;
                    contact.Address.Address2 = account.Address.Address2;
                    contact.Address.Address3 = account.Address.Address3;
                    contact.Address.Address4 = account.Address.Address4;
                    contact.Address.City = account.Address.City;
                    contact.Address.Country = account.Address.Country;
                    contact.Address.County = account.Address.County;
                    contact.Address.IsMailing = true;
                    contact.Address.IsPrimary = true;
                    contact.Address.PostalCode = account.Address.PostalCode;
                    contact.Address.Routing = account.Address.Routing;
                    contact.Address.Salutation = contact.FirstName;
                    contact.Address.State = account.Address.State;
                    contact.Address.TimeZone = account.Address.TimeZone;
                    contact.Address.Type = account.Address.Type;

                    if (string.IsNullOrEmpty(contact.PreferredContact))
                    {
                        contact.PreferredContact = GetLocalResourceObject("Default_Contact_Preferred_Contact").ToString();
                    }
                    
                    
                    if (string.IsNullOrEmpty(account.Address.Description))
                    {
                        account.Address.Description = GetLocalResourceObject("Account_Address_Description_Default").ToString();
                    }
                    
                    contact.Address.Description  = account.Address.Description;
                    
                }
            }
        }
    }

    private IAccount GetCurrentAccount(IContact contact)
    {
        IAccount account;
        if (!Page.IsPostBack)
        {
            if (Request.QueryString["accountId"] != null)
            {
                string accountId = Request.QueryString["accountId"];
                account = EntityFactory.GetById<IAccount>(accountId);
            }
            else
            {
                account = EntityFactory.Create<IAccount>();
            }
            contact.Account = account;
            nmeContactName.Focus(); 
        }
        else
        {
            account = contact.Account;
        }
        return account;
    }

	protected override void OnWireEventHandlers()
	{
		base.OnWireEventHandlers();
		lueUseExistingAccount.LookupResultValueChanged += lueUseExistingAccount_ChangeAction;
		phnContactWorkPhone.TextChanged += phnContactWorkPhone_ChangeAction;
		cmdMatchingRecords.Click += cmdMatchingRecords_ClickAction;
		adrContactAddress.TextChanged += adrContactAddress_ChangeAction;
		cmdSelectAddress.Click += cmdSelectAddress_ClickAction;
		cmdSave.Click += cmdSave_ClickAction;
		cmdSaveNew.Click += cmdSaveNew_ClickAction;
		cmdSaveClear.Click += cmdSaveClear_ClickAction;
		DialogService.onDialogClosing += DialogService_onDialogClosing;
	}

	protected override void OnFormBound()
	{
        IContact contact = (BindingSource.Current as IContact);
        IAccount account = contact.Account;
        if (account != null)
        {
            pklAccountSubType.PickListName = account.GetSubTypePickListName();
            cmdSelectAddress.Enabled = (account.Addresses.Count > 0);
            if (account.Id != null)
            {
                lueUseExistingAccount.LookupResultValue = account;

                pklAccountSubType.PickListName = account.GetSubTypePickListName();
            }
        }
        base.OnFormBound();
	}


	public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
	{
		ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
		foreach (Control c in pnlInsertContact_LTools.Controls)
		{
			tinfo.LeftTools.Add(c);
		}
		foreach (Control c in pnlInsertContact_CTools.Controls)
		{
			tinfo.CenterTools.Add(c);
		}
		foreach (Control c in pnlInsertContact_RTools.Controls)
		{
			tinfo.RightTools.Add(c);
		}
        return tinfo;
	}

    public void pklAccountType_PickListValueChanged(object sender, EventArgs e)
    {
        IContact contact = (BindingSource.Current as IContact);
        if (contact != null)
        {
            IAccount account = GetCurrentAccount(contact);
            if (account != null)
                account.SubType = string.Empty;
        }
    }

    private bool TurnOnAutoSearch()
    {
       string option = UserOptionsService.GetCommonOption("InsertNewContactAccount.AutoSearch", "Insert");
       if (option.Equals("Y"))
       {
           return true;
       }
       return false;
    }
    private void saveOptions()
    {
        
        string option = "N";
        if (chkAutoSearch.Checked)
        {
            option = "Y";
        }
        UserOptionsService.SetCommonOption("InsertNewContactAccount.AutoSearch", "Insert", option, false);     
    }
    
    
</script>

<script type="text/javascript">
</script>
