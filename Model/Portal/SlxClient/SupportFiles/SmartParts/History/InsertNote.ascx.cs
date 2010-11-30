using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Web.Controls.Lookup;

public partial class SmartParts_History_InsertNote : EntityBoundSmartPart
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();

        SetTitleBar();
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        ClientBindingMgr.RegisterSaveButton(cmdOK);
    }

    private void SetTitleBar()
    {
        lblDialogTitle.Text = GetLocalResourceObject("DialogTitle").ToString();
        imgInsertNote.ImageUrl = Page.ResolveClientUrl("../../images/icons/New_Note_24x24.gif");
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        cmdOK.Click += cmdOK_ClickAction;
        cmdOK.Click += DialogService.CloseEventHappened;
        cmdOK.Click += Refresh;
        cmdCancel.Click += DialogService.CloseEventHappened;
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IHistory); }
    }

    protected override void OnAddEntityBindings()
    {
    }

    public void cmdOK_ClickAction(object sender, EventArgs e)
    {
        IHistory _entity = BindingSource.Current as IHistory;
        if (_entity != null)
        {
            if (DialogService.ChildInsertInfo != null)
            {
                object _parent = GetParentEntity();
                if (_parent != null)
                {
                    if (DialogService.ChildInsertInfo.ParentReferenceProperty != null)
                    {
                        DialogService.ChildInsertInfo.ParentReferenceProperty.SetValue(_entity, _parent, null);
                    }
                    if (DialogService.ChildInsertInfo.ParentsCollectionProperty != null)
                    {
                        System.Reflection.MethodInfo _add = DialogService.ChildInsertInfo.ParentsCollectionProperty.PropertyType.GetMethod("Add");
                        _add.Invoke(DialogService.ChildInsertInfo.ParentsCollectionProperty.GetValue(_parent, null), new object[] { _entity });
                    }
                }
            }
            bool shouldSave = true;
            IPersistentEntity persistentEntity = BindingSource.Current as IPersistentEntity;
            bool isInsert = false;
            if (persistentEntity != null)
            {
                isInsert = ((persistentEntity.PersistentState & PersistentState.New) > 0);
            }
            if (!isInsert)
                shouldSave = false;

            if (shouldSave)
                _entity.Save();
        }
        Save_ClickActionBRC(sender, e);
    }

    protected void Save_ClickActionBRC(object sender, EventArgs e)
    {
        History history = BindingSource.Current as History;
        if (history != null)
        {
            /* Update any attachment records that were created in Insert mode. */
            Sage.Platform.Application.WorkItem workItem = PageWorkItem;
            if (workItem != null)
            {
                Object oStrTempAssociationID = workItem.State["TempAssociationID"];
                if (oStrTempAssociationID != null)
                {
                    String strTempAssociationID = oStrTempAssociationID.ToString();
                    Type typ = EntityContext.EntityType;
                    System.Collections.Generic.IList<IAttachment> attachments =
                        Sage.SalesLogix.Attachment.Rules.GetAttachmentsFor(typ, strTempAssociationID);
                    if (attachments != null)
                    {
                        foreach (IAttachment attach in attachments)
                        {
                            attach.HistoryId = history.Id;
                            attach.Save();
                            /* Move the attachment from the \Attachment\_temporary path to the \Attachment path. */
                            Sage.SalesLogix.Attachment.Rules.MoveTempAttachment(attach);
                        }
                    }
                    workItem.State.Remove("TempAssociationID");
                }
            }

            LookupControl Lead = null;
            RadioButtonList ContactOrLead = null;
            TabPanel Details = InsertNotesDialog.Panels[0];

            foreach (Control c in Details.Controls)
            {
                Lead = c.FindControl("Lead") as LookupControl;
                ContactOrLead = c.FindControl("ContactOrLead") as RadioButtonList;
            }

            if (ContactOrLead.SelectedValue == ContactOrLead.Items[0].Value)
            {
                history.LeadId = String.Empty;
            }
            else
            {
                history.ContactId = String.Empty;
                history.AccountId = String.Empty;
                history.OpportunityId = String.Empty;
                history.TicketId = String.Empty;
            }
            if (Lead.LookupResultValue.ToString().Length == 12)
            {
                history.AccountName = EntityFactory.GetById<ILead>(history.LeadId).Company;
                history.ContactName = EntityFactory.GetById<ILead>(history.LeadId).LeadFullName;
            }
            history.Save();
        }
    }
}