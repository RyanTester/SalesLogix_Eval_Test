using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Address;

public partial class SmartParts_Account_UpdateAccountOptions : EntityBoundSmartPartInfoProvider
{
    private bool _Saved = false;
    private IAccount _Account;

    /// <summary>
    /// Gets or sets the account.
    /// </summary>
    /// <value>The account.</value>
    private IAccount Account
    {
        set { _Account = value; }
        get { return _Account; }
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IAccount); }
    }

    /// <summary>
    /// Inners the page load.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        IAccount account = GetParentEntity() as IAccount;
        Account = account;
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnOK.Click += new EventHandler(btnOK_Click);
        btnCancel.Click += new EventHandler(btnCancel_Click);
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(btnCancel);
        LoadView();
    }

    /// <summary>
    /// Called when this smartpart is in a dialog that is closing.
    /// </summary>
    /// <param name="from">The dialog service.</param>
    /// <param name="e">The <see cref="T:Sage.Platform.WebPortal.Services.WebDialogClosingEventArgs"/> instance containing the event data.</param>
    protected override void OnMyDialogClosing(object from, WebDialogClosingEventArgs e)
    {
        base.OnMyDialogClosing(from, e);

        if (!_Saved)
        {
            try
            {
                SaveAccount(false);
                _Saved = true;
            }
            catch (Exception ex)
            {
                handleException(ex);
            }
        }
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        foreach (Control c in AddressForm_LTools.Controls)
            tinfo.LeftTools.Add(c);
        foreach (Control c in AddressForm_CTools.Controls)
            tinfo.CenterTools.Add(c);
        foreach (Control c in AddressForm_RTools.Controls)
            tinfo.RightTools.Add(c);
        return tinfo;
    }

    /// <summary>
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        IAccount account = GetParentEntity() as IAccount;
        Account = account;
        bool setOptions = true;

        UpdateAddressOptionManager addressManager = GetAddressOptionManager();
        if (addressManager != null)
        {
            setOptions = false;
            if (addressManager.HasContactAddressChanges)
            {
                divAddress.Style.Add("display", "block");
                chkAddress.Enabled = true;
                chkAddress.Checked = true;
            }
            else
            {
                chkAddress.Enabled = false;
                divAddress.Style.Add("display", "none");
                chkAddress.Checked = false;
            }
            if (addressManager.HasSalesOrderAddressChanges)
            {
                divSalesOrderAddress.Style.Add("display", "block");
                chkSalesOrderAddress.Enabled = true;
                chkSalesOrderAddress.Checked = true;
            }
            else
            {
                divSalesOrderAddress.Style.Add("display", "none");
                chkSalesOrderAddress.Enabled = false;
                chkSalesOrderAddress.Checked = false;
            }
        }
        if (setOptions)
            SetOptions();
    }

    private UpdateAddressOptionManager GetAddressOptionManager()
    {
        if (DialogService.DialogParameters.Count > 0)
        {
            object addressManagerObj;
            if (DialogService.DialogParameters.TryGetValue("UpdateAddressOptionManager", out addressManagerObj))
            {
                return addressManagerObj as UpdateAddressOptionManager;
            }
        }
        return null;
    }

    /// <summary>
    /// Handles the Click event of the btnOK control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnOK_Click(object sender, EventArgs e)
    {
        try
        {
            SaveAccount(true);
            _Saved = true;
            DialogService.CloseEventHappened(sender, e);
            Refresh();
        }
        catch (Exception ex)
        {
            handleException(ex);
        }
    }

    /// <summary>
    /// Handles the Click event of the btnCancel control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnCancel_Click(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Handles the exception.
    /// </summary>
    /// <param name="e">The e.</param>
    private void handleException(Exception e)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(e.Message);
        Exception innerEx = e.InnerException;
        int check = 0;
        while (innerEx != null)
        {
            if (innerEx is ValidationException)
            {
                sb.Remove(0, sb.Length);
                sb.Append(innerEx.Message);
                break;
            }
            sb.Append(": <br />");
            sb.Append(innerEx.Message);
            innerEx = innerEx.InnerException;
            if (check++ > 3) break;
        }
        DialogService.ShowMessage(sb.ToString());
    }

    /// <summary>
    /// Saves the account.
    /// </summary>
    /// <param name="updateContacts">if set to <c>true</c> [update contacts].</param>
    private void SaveAccount(bool updateContacts)
    {
        if (Account != null && updateContacts)
        {
            if (chkAddress.Checked)
            {
                UpdateAddressOptionManager addressManager = GetAddressOptionManager();
                Dictionary<string, string> oldAddresValues = addressManager == null
                                                 ? Sage.SalesLogix.Account.Rules.getOriginalAddressValues(Account)
                                                 : addressManager.OldAddressValues;
                Helpers.UpdateContactAddresses(Account, Account.Address, oldAddresValues);
                if (chkSalesOrderAddress.Checked)
                {
                    if (addressManager != null)
                        Helpers.UpdateSalesOrderAddresses(Account, oldAddresValues, Account.Address);
                    else
                        Helpers.UpdateSalesOrderAddresses(Account);
                }
            }
            if (chkPhone.Checked)
                Account.UpdateMainPhoneChanges();
            if (chkFax.Checked)
                Account.UpdateFaxChanges();
            if (chkWeb.Checked)
                Account.UpdateWebAddressChanges();
            if (chkAcctMgr.Checked)
                Account.UpdateAccountManagerChanges();
            _Saved = true;
            Account.Save();
        }
    }

    /// <summary>
    /// Sets the options.
    /// </summary>
    private void SetOptions()
    {
        IAccount account = GetParentEntity() as IAccount;
        Account = account;

        if (account.HasMainPhoneChanges())
        {
            chkPhone.Enabled = true;
            divPhone.Style.Add("display", "block");
            chkPhone.Checked = true;
        }
        else
        {
            chkPhone.Enabled = false;
            divPhone.Style.Add("display", "none");
            chkPhone.Checked = false;
        }

        if (account.HasFaxChanges())
        {
            chkFax.Enabled = true;
            divFax.Style.Add("display", "block");
            chkFax.Checked = true;
        }
        else
        {
            chkFax.Enabled = false;
            divFax.Style.Add("display", "none");
            chkFax.Checked = false;
        }

        if (account.HasWebAddressChanges())
        {
            chkWeb.Enabled = true;
            divWeb.Style.Add("display", "block");
            chkWeb.Checked = true;
        }
        else
        {
            chkWeb.Enabled = false;
            divWeb.Style.Add("display", "none");
            chkWeb.Checked = false;
        }

        if (account.HasAddressChanges())
        {
            divAddress.Style.Add("display", "block");
            chkAddress.Enabled = true;
            chkAddress.Checked = true;

            //check to see if this address is being used for a Sales Order
            if (Helpers.HasMatchingSalesOrderAddresses(account))
            {
                chkAddress.Visible = chkAddress.Enabled;
                divSalesOrderAddress.Style.Add("display", "block");
                chkSalesOrderAddress.Enabled = true;
                chkSalesOrderAddress.Checked = true;
            }
            else
            {
                divSalesOrderAddress.Style.Add("display", "none");
                chkSalesOrderAddress.Enabled = false;
                chkSalesOrderAddress.Checked = false;
            }
        }
        else
        {
            chkAddress.Enabled = false;
            divAddress.Style.Add("display", "none");
            chkAddress.Checked = false;
        }

        if (account.HasAccountManagerChanges())
        {
            divAcctMgr.Style.Add("display", "block");
            chkAcctMgr.Enabled = true;
            chkAcctMgr.Checked = true;
        }
        else
        {
            chkAcctMgr.Enabled = false;
            divAcctMgr.Style.Add("display", "none");
            chkAcctMgr.Checked = false;
        }
    }
}