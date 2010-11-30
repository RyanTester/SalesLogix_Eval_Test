using System;
using System.Web.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.ComponentModel;
using Sage.Platform.EntityBinding;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Address;

public partial class SmartParts_Address_AddEditAddress : EntityBoundSmartPartInfoProvider
{
    private IPersistentEntity _parentEntity;
    private IComponentReference _parentEntityReference;

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IAddress); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.AddBindingProvider(txtEntityId as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("EntityId", txtEntityId, "Value", "", ""));

        BindingSource.AddBindingProvider(pklDecription as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Description", pklDecription, "PickListValue", "", ""));

        BindingSource.AddBindingProvider(cbxIsPrimary as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("IsPrimary", cbxIsPrimary, "Checked", "", false));

        BindingSource.AddBindingProvider(cbxIsShipping as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("IsMailing", cbxIsShipping, "Checked", "", false));

        BindingSource.AddBindingProvider(txtAddress1 as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Address1", txtAddress1, "Text", "", ""));

        BindingSource.AddBindingProvider(txtAddress1 as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Address2", txtAddress2, "Text", "", ""));

        BindingSource.AddBindingProvider(txtAddress1 as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Address3", txtAddress3, "Text", "", ""));

        BindingSource.AddBindingProvider(pklCity as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("City", pklCity, "PickListValue", "", ""));

        BindingSource.AddBindingProvider(pklState as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("State", pklState, "PickListValue", "", ""));

        BindingSource.AddBindingProvider(txtPostalCode as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("PostalCode", txtPostalCode, "Text", "", ""));

        BindingSource.AddBindingProvider(pklCountry as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Country", pklCountry, "PickListValue", "", ""));

        BindingSource.AddBindingProvider(txtSalutation as IEntityBindingProvider);
        BindingSource.Bindings.Add(new PropertyBinding("Salutation", txtSalutation, "Text", "", ""));
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        pklDecription.MaxLength = 64;
        pklCity.MaxLength = 32;
        pklState.MaxLength = 32;
        pklCountry.MaxLength = 32;
        txtAddress1.MaxLength = 64;
        txtAddress2.MaxLength = 64;
        txtAddress3.MaxLength = 64;
        txtPostalCode.MaxLength = 24;
        txtSalutation.MaxLength = 64;
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnSave.Click += btnSave_ClickAction;
        btnSave.Click += DialogService.CloseEventHappened;
        btnCancel.Click += DialogService.CloseEventHappened;

        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        _parentEntity = GetParentEntity() as IPersistentEntity;
        _parentEntityReference = _parentEntity as IComponentReference;
        ClientBindingMgr.RegisterDialogCancelButton(btnCancel);
    }

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                IAddress address = (IAddress)BindingSource.Current;

                txtEntityId.Value = _parentEntityReference.Id.ToString();

                if (address.Id != null)
                {
                    cbxIsPrimary.Enabled = (address.IsPrimary != true);
                    cbxIsShipping.Enabled = (address.IsMailing != true);
                    Mode.Value = "UPDATE";
                }
                else
                {
                    Mode.Value = "ADD";
                    pklDecription.PickListValue = GetLocalResourceObject("DefaultDescription").ToString();
                }

                if (_parentEntityReference is IAccount)
                {
                    if (Mode.Value == "ADD")
                        tinfo.Title = GetLocalResourceObject("DialogTitleAccountAdd").ToString();
                    else
                        tinfo.Title = GetLocalResourceObject("DialogTitleAccountEdit").ToString();
                }
                if (_parentEntityReference is IContact)
                {
                    if (Mode.Value == "ADD")
                        tinfo.Title = GetLocalResourceObject("DialogTitleContactAdd").ToString();
                    else
                        tinfo.Title = GetLocalResourceObject("DialogTitleContactEdit").ToString();
                }

                if (!(_parentEntityReference is IAccount || _parentEntityReference is IContact))
                {
                    if (Mode.Value == "ADD")
                        tinfo.Title = GetLocalResourceObject("DialogTitleAdd").ToString();
                    else
                        tinfo.Title = GetLocalResourceObject("DialogTitleEdit").ToString();
                }
            }
        }

        foreach (Control c in AddressForm_LTools.Controls)
            tinfo.LeftTools.Add(c);
        foreach (Control c in AddressForm_CTools.Controls)
            tinfo.CenterTools.Add(c);
        foreach (Control c in AddressForm_RTools.Controls)
            tinfo.RightTools.Add(c);
        return tinfo;
    }

    /// <summary>
    /// Handles the ClickAction event of the btnSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnSave_ClickAction(object sender, EventArgs e)
    {
        IPersistentEntity persistentEntity = BindingSource.Current as IPersistentEntity;

        _parentEntity = GetParentEntity() as IPersistentEntity;
        _parentEntityReference = _parentEntity as IComponentReference;

        if (persistentEntity != null)
        {
            bool hasContactMatches = false;
            bool hasSalesOrderMatches = false;
            IAddress address = (IAddress)BindingSource.Current;
            if (Mode.Value == "ADD")
                persistentEntity.Save();
            if (Mode.Value == "UPDATE")
            {
                IContact contact = _parentEntityReference as IContact;
                IAccount account = _parentEntityReference as IAccount;

                hasSalesOrderMatches = (Helpers.HasMatchingSalesOrderAddresses(_parentEntityReference));
                if (contact != null)
                    hasContactMatches = contact.HasAddressChanges();
                else if (account != null)
                    hasContactMatches = account.HasAddressChanges();
                if ((hasContactMatches || hasSalesOrderMatches) && DialogService != null)
                {
                    UpdateAddressOptionManager addressOptions = new UpdateAddressOptionManager();
                    addressOptions.HasContactAddressChanges = hasContactMatches;
                    if (contact != null)
                        addressOptions.OldAddressValues = Sage.SalesLogix.Contact.Rules.getOriginalAddressValues(contact);
                    else
                        addressOptions.OldAddressValues = Sage.SalesLogix.Account.Rules.getOriginalAddressValues(account);
                    addressOptions.HasSalesOrderAddressChanges = hasSalesOrderMatches;
                    addressOptions.ParentEntityReference = _parentEntityReference;
                    addressOptions.IsPrimaryAddress = (address.IsPrimary.HasValue && (bool)address.IsPrimary);

                    if (contact != null)
                        DialogService.SetSpecs(200, 200, 200, 450, "UpdateContactOptions", "", true);
                    else
                        DialogService.SetSpecs(200, 200, 200, 450, "UpdateAccountOptions", "", true);
                    DialogService.EntityType = typeof(IAddress);
                    DialogService.EntityID = address.Id.ToString();
                    DialogService.DialogParameters.Add("UpdateAddressOptionManager", addressOptions);
                    DialogService.ShowDialog();
                }
                persistentEntity.Save();
            }
        }
        btnSave_ClickActionBRC(sender, e);
    }

    /// <summary>
    /// Handles the ClickActionBRC event of the btnSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnSave_ClickActionBRC(object sender, EventArgs e)
    {
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
    }
}