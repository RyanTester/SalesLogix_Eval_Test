using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using log4net;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Orm.Entities;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Attachment;
using Telerik.WebControls;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Common.Syndication.Json;
using System.Web;

public partial class AttachmentList : EntityBoundSmartPartInfoProvider
{
    private TimeZone _timeZone;
    private int _iRowIdx;
    private bool _hasAccess = true;
    

    #region Public Properties

    /// <summary>
    /// Gets a value indicating whether this user has access to the attachment.
    /// </summary>
    /// <value>
    /// <c>true</c> if this user has access; otherwise, <c>false</c>.
    /// </value>
    public bool HasAccess
    {
        get { return _hasAccess; }
    }

    private ActivityParameters _Params;
    private ActivityParameters Params
    {
        get
        {
            if (_Params != null)
                return _Params;
            _Params = new ActivityParameters(
                (Dictionary<string, string>)AppContext["ActivityParameters"] ?? new Dictionary<string, string>());
            return _Params;
        }
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IAttachment); }
    }

    /// <summary>
    /// Gets or sets the time zone.
    /// </summary>
    /// <value>The time zone.</value>
    [ContextDependency("TimeZone")]
    public TimeZone TimeZone
    {
        get { return _timeZone; }
        set { _timeZone = value; }
    }

    /// <summary>
    /// Gets the current user id.
    /// </summary>
    /// <value>The current user id.</value>
    private static string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    #endregion

    #region Protected Methods

    /// <summary>
    /// Handles the PreRender event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_PreRender(object sender, EventArgs e)
    {
        UpdateUIForCalendarSecurity();
        GenerateScript();
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        uplInsertUpload.Localization["Select"] = GetLocalResourceObject("uplInsertUpload_Button_Caption").ToString();
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// 
    /// </summary>
    internal class AttachmentScriptStrings
    {
        /// <summary>
        /// Gets or sets the grid view control id.
        /// </summary>
        /// <value>The grid view CTL id.</value>
        public string gridViewCtlId { get; set; }

        /// <summary>
        /// Gets or sets the grids selected row index.
        /// </summary>
        /// <value>The sel row indx CTL ID.</value>
        public string selRowIndxCtlID { get; set; }

        /// <summary>
        /// Gets or sets the confirm attach delete MSG.
        /// </summary>
        /// <value>The confirm attach delete MSG.</value>
        public string confirmAttachDeleteMsg { get; set; }

        /// <summary>
        /// Gets or sets the error to be displayed when no attachment record has been selected.
        /// </summary>
        /// <value>The error no record selected MSG.</value>
        public string ErrorNoRecordSelectedMsg { get; set; }

        /// <summary>
        /// Gets or sets the insert div.
        /// </summary>
        /// <value>The insert div.</value>
        public string insertDiv { get; set; }

        /// <summary>
        /// Gets or sets the edit div.
        /// </summary>
        /// <value>The edit div.</value>
        public string editDiv { get; set; }

        /// <summary>
        /// Gets or sets the URL div.
        /// </summary>
        /// <value>The URL div.</value>
        public string urlDiv { get; set; }

        /// <summary>
        /// Gets or sets the URL upload div.
        /// </summary>
        /// <value>The URL upload div.</value>
        public string urlUploadDiv { get; set; }

        /// <summary>
        /// Gets or sets the file div.
        /// </summary>
        /// <value>The file div.</value>
        public string fileDiv { get; set; }

        /// <summary>
        /// Gets or sets the file upload div.
        /// </summary>
        /// <value>The file upload div.</value>
        public string fileUploadDiv { get; set; }

        /// <summary>
        /// Gets or sets the text for the delete confirmation.
        /// </summary>
        /// <value>The TXT confirm delete element.</value>
        public string txtConfirmDeleteElement { get; set; }

        /// <summary>
        /// Gets or sets the attachments help link.
        /// </summary>
        /// <value>The attachments help link.</value>
        public string AttachmentsHelpLink { get; set; }

        /// <summary>
        /// Gets or sets the text for the insert URL ID.
        /// </summary>
        /// <value>The TXT insert URLID.</value>
        public string txtInsertURLID { get; set; }

        /// <summary>
        /// Gets or sets the text for the insert description.
        /// </summary>
        /// <value>The TXT insert desc.</value>
        public string txtInsertDesc { get; set; }

        /// <summary>
        /// Gets or sets the error when no URL description is specified.
        /// </summary>
        /// <value>The error_ no UR l_ description.</value>
        public string Error_NoURL_Description { get; set; }

        /// <summary>
        /// Gets or sets the error display if no URL addres is specified.
        /// </summary>
        /// <value>The error_ no UR l_ address.</value>
        public string Error_NoURL_Address { get; set; }

        /// <summary>
        /// Gets or sets the CMD insert upload.
        /// </summary>
        /// <value>The CMD insert upload.</value>
        public string cmdInsertUpload { get; set; }

        /// <summary>
        /// Gets or sets the text for the edit upload button.
        /// </summary>
        /// <value>The CMD edit upload.</value>
        public string cmdEditUpload { get; set; }

        /// <summary>
        /// Gets or sets the is URL mode.
        /// </summary>
        /// <value>The is URL mode.</value>
        public string IsURLMode { get; set; }

        /// <summary>
        /// Gets or sets the text for the URL.
        /// </summary>
        /// <value>The TXT edit URLID.</value>
        public string txtEditURLID { get; set; }

        /// <summary>
        /// Gets or sets the text for the edit description.
        /// </summary>
        /// <value>The TXT edit desc ID.</value>
        public string txtEditDescID { get; set; }

        /// <summary>
        /// Gets or sets the _CMD delete.
        /// </summary>
        /// <value>The _CMD delete.</value>
        public string cmdDeleteAttachmentID { get; set; }
    }

    /// <summary>
    /// Sets the display style for the appropriate controls to inline when adding an attachment.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void showAddAttachment(object sender, ImageClickEventArgs e)
    {
        txtIsURLMode.Value = "F";
        urlDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        urlUploadDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        fileDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
        fileUploadDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
        insertDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
        editDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        lnkAttachmentsHelp.NavigateUrl = "addattachment.aspx";
    }

    /// <summary>
    /// Sets the display style for the appropriate controls to none.
    /// </summary>
    private void hideAdds()
    {
        txtIsURLMode.Value = "F";
        urlDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        urlUploadDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        fileDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        fileUploadDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        insertDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        editDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
        lnkAttachmentsHelp.NavigateUrl = "attachmentstab.aspx";
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        grdAttachments.PageIndexChanging += new GridViewPageEventHandler(grdAttachments_PageIndexChanging);
        if (ScriptManager.GetCurrent(Page) != null)
        {
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(cmdInsertUpload);
            cmdInsertUpload.Attributes.Add("onclick", "return false;");
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(cmdEditUpload);
            cmdEditUpload.Attributes.Add("onclick", "return false;");
            cmdDeleteAttachment.Attributes.Add("onclick", "return false;");
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(cmdInsertFile);
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(cmdEditAttachment);
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(btnDelete);
        }
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        LoadAttachments();
        base.OnFormBound();
        if (ClientBindingMgr != null)
        {   // register these with the ClientBindingMgr so they can do their thing without causing the dirty data warning message...
            ClientBindingMgr.RegisterBoundControl(cmdInsertFile);
            ClientBindingMgr.RegisterBoundControl(cmdEditAttachment);
            ClientBindingMgr.RegisterBoundControl(cmdInsertUpload);
            ClientBindingMgr.RegisterBoundControl(cmdEditUpload);
            ClientBindingMgr.RegisterBoundControl(btnDelete);
        }

        radUProgressArea.Localization["CancelButton"] = GetLocalResourceObject("radProgress_Cancel").ToString();
        radUProgressArea.Localization["Uploaded"] = GetLocalResourceObject("radProgress_Uploaded").ToString();
        radUProgressArea.Localization["Total"] = GetLocalResourceObject("radProgress_Total").ToString();
        radUProgressArea.Localization["UploadedFiles"] = GetLocalResourceObject("radProgress_UploadedFiles").ToString();
        radUProgressArea.Localization["CurrentFileName"] = GetLocalResourceObject("radProgress_CurrentFile").ToString();
        radUProgressArea.Localization["TimeElapsed"] = GetLocalResourceObject("radProgress_ElapsedTime").ToString();
        radUProgressArea.Localization["TimeEstimated"] = GetLocalResourceObject("radProgress_EstimatedTime").ToString();
        radUProgressArea.Localization["TransferSpeed"] = GetLocalResourceObject("radProgress_TransferSpeed").ToString();
        radUProgressArea.Localization["TotalFiles"] = String.Empty;

        AttachmentScriptStrings jsonobj = new AttachmentScriptStrings();

        jsonobj.gridViewCtlId = grdAttachments.ClientID;
        jsonobj.selRowIndxCtlID = txtSelRowIndx.ClientID;
        jsonobj.confirmAttachDeleteMsg = (!IsRecurringActivity()) ? GetLocalResourceObject("Confrim_DeleteAttachment_lz").ToString() : GetLocalResourceObject("Confrim_Activity_DeleteAttachment").ToString();
        jsonobj.ErrorNoRecordSelectedMsg = GetLocalResourceObject("Error_NoRecordSelected_lz").ToString();
        jsonobj.insertDiv = insertDiv.ClientID;
        jsonobj.editDiv = editDiv.ClientID;
        jsonobj.urlDiv = urlDiv.ClientID;
        jsonobj.urlUploadDiv = urlUploadDiv.ClientID;
        jsonobj.fileDiv = fileDiv.ClientID;
        jsonobj.fileUploadDiv = fileUploadDiv.ClientID;
        jsonobj.txtConfirmDeleteElement = txtDeleteConfirmed.ClientID;
        jsonobj.AttachmentsHelpLink = lnkAttachmentsHelp.ClientID;
        jsonobj.txtInsertURLID = txtInsertURL.ClientID;
        jsonobj.txtInsertDesc = txtInsertDesc.ClientID;
        jsonobj.Error_NoURL_Description = GetLocalResourceObject("Error_NoURL_Description").ToString();
        jsonobj.Error_NoURL_Address = GetLocalResourceObject("Error_NoURL_Address").ToString();
        jsonobj.cmdInsertUpload = cmdInsertUpload.ClientID;
        jsonobj.cmdEditUpload = cmdEditUpload.ClientID;
        jsonobj.IsURLMode = txtIsURLMode.ClientID;
        jsonobj.txtEditURLID = txtEditURL.ClientID;
        jsonobj.txtEditDescID = txtEditDesc.ClientID;
        jsonobj.cmdDeleteAttachmentID = btnDelete.ClientID;

        string script = string.Concat("var slxattachmentstrings = ", JavaScriptConvert.SerializeObject(jsonobj), ";");
        ScriptManager.RegisterStartupScript(Page, GetType(), "AttachmentStrings", script, true);
        ScriptManager.RegisterClientScriptInclude(
                                                    Page,
                                                    GetType(),
                                                    "AttachmentScript",
                                                    Page.ResolveClientUrl("SmartParts/Attachment/AttachmentList_ClientScript.js")
                                                    );
    }

    /// <summary>
    /// Called when [closing].
    /// </summary>
    protected override void OnClosing()
    {
        hideAdds();
        base.OnClosing();
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Handles the Click event of the cmdUpload control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdUpload_Click(object sender, EventArgs e)
    {
        try
        {
            WorkItem workItem = PageWorkItem;
            bool bIsActivityInsert = IsActivityInsert();
            bool bIsHistoryInsert = IsHistoryInsert();
            string strTempAssociationID = string.Empty;

            if (bIsActivityInsert || bIsHistoryInsert)
            {
                if (workItem != null)
                {
                    object oStrTempAssociationID = workItem.State["TempAssociationID"];
                    if (oStrTempAssociationID != null)
                    {
                        strTempAssociationID = oStrTempAssociationID.ToString();
                    }
                }
            }

            string attachPath;
            if (!bIsActivityInsert && !bIsHistoryInsert)
            {
                attachPath = Rules.GetAttachmentPath();
            }
            else
            {
                /* When in Insert mode we keep the attachments in a special location, in case the operation gets cancelled out. */
                attachPath = Rules.GetTempAttachmentPath();
            }

            if (!Directory.Exists(attachPath))
                Directory.CreateDirectory(attachPath);

            if (!String.IsNullOrEmpty(txtInsertURL.Text))
            {
                if (String.IsNullOrEmpty(txtInsertDesc.Text))
                {
                    return;
                }

                string url = "URL=";
                Random random = new Random();
                string urlFile = random.Next(9999) + "-" + txtInsertDesc.Text + "-" + random.Next(9999) + ".URL";
                string path = attachPath + "/" + urlFile;
                if (!txtInsertURL.Text.Contains("://"))
                    url += "http:\\\\";
                FileStream newFile = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                StreamWriter streamWriter = new StreamWriter(newFile);
                streamWriter.WriteLine("[InternetShortcut]");
                streamWriter.WriteLine(url + txtInsertURL.Text);
                streamWriter.WriteLine("IconIndex=0");
                streamWriter.Close();
                newFile.Close();

                IAttachment attachment = EntityFactory.Create<IAttachment>();
                attachment.Description = txtInsertDesc.Text;

                if (!bIsActivityInsert && !bIsHistoryInsert)
                {
                    attachment.InsertURLAttachment(path);
                }
                else
                {
                    if (string.IsNullOrEmpty(strTempAssociationID))
                    {
                        /* Save to get an ID used for temp purposes. */
                        attachment.Save();
                        strTempAssociationID = attachment.Id.ToString();
                        if (workItem != null)
                        {
                            workItem.State["TempAssociationID"] = strTempAssociationID;
                        }
                    }
                    Rules.InsertTempURLAttachment(attachment, EntityContext.EntityType, strTempAssociationID, path);
                }

                txtInsertURL.Text = String.Empty;
                txtInsertDesc.Text = String.Empty;
                LoadAttachments();
            }
            else if (uplInsertUpload.UploadedFiles.Count > 0)
            {
                UploadedFile file = uplInsertUpload.UploadedFiles[0];
                if (file != null)
                {
                    IAttachment attachment = EntityFactory.Create<IAttachment>();
                    attachment.Description = txtInsertDesc.Text;
                    if (String.IsNullOrEmpty(txtInsertDesc.Text))
                        attachment.Description = file.GetNameWithoutExtension();
                    if (!bIsActivityInsert && !bIsHistoryInsert)
                    {
                        attachment.InsertFileAttachment(WriteToFile(file));
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(strTempAssociationID))
                        {
                            /* Save to get an ID used for temp purposes. */
                            attachment.Save();
                            strTempAssociationID = attachment.Id.ToString();
                            if (workItem != null)
                            {
                                workItem.State["TempAssociationID"] = strTempAssociationID;
                            }
                        }
                        Rules.InsertTempFileAttachment(attachment, EntityContext.EntityType, strTempAssociationID, WriteToFile(file));
                    }
                    txtInsertDesc.Text = String.Empty;
                    LoadAttachments();
                }
            }
            else
            {
                DialogService.ShowMessage(GetLocalResourceObject("Error_UnableToLoad_lz").ToString());
                log.Warn(GetLocalResourceObject("Error_UnableToLoad_lz").ToString());
            }
            hideAdds();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            DialogService.ShowMessage(ex.Message);
        }
    }

    /// <summary>
    /// Handles the Click event of the cmdEditSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdEditSave_Click(object sender, EventArgs e)
    {
        try
        {
            IAttachment attachment = EntityFactory.GetById<IAttachment>(txtAttachId1.Value);
            if (attachment != null)
            {
                bool bIsActivityInsert = IsActivityInsert();
                bool bIsHistoryInsert = IsHistoryInsert();
                attachment.Description = txtEditDesc.Text;
                if (Path.GetExtension(attachment.FileName).ToUpper() == ".URL" && !String.IsNullOrEmpty(txtEditURL.Text))
                {
                    if (!bIsActivityInsert && !bIsHistoryInsert)
                        attachment.UpdateURLAttachment(txtEditURL.Text);
                    else
                        Rules.UpdateTempURLAttachment(attachment, txtEditURL.Text);
                }
                else if (uplEditUpload.UploadedFiles.Count > 0)
                {
                    UploadedFile file = uplEditUpload.UploadedFiles[0];
                    if (file != null && !String.IsNullOrEmpty(file.FileName))
                    {
                        if (!bIsActivityInsert && !bIsHistoryInsert)
                            attachment.UpdateFileAttachment(WriteToFile(file));
                        else
                            Rules.UpdateTempFileAttachment(attachment, WriteToFile(file));
                    }
                }
                else
                {
                    attachment.Save();
                }
                LoadAttachments();
            }
            hideAdds();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Handles the RowCreated event of the grdAttachments control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdAttachments_RowCreated(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.Header)
        {
            _iRowIdx = 1;
        }
        else if (e.Row.RowType == DataControlRowType.DataRow)
        {
            _iRowIdx++;
            e.Row.Attributes.Add("onclick", String.Format("onGridViewRowSelected('{0}')", _iRowIdx));
        }
    }

    /// <summary>
    /// Handles the Sorting event of the grdAttachments control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdAttachments_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdAttachments control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdAttachments_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdAttachments.PageIndex = e.NewPageIndex;
    }

    /// <summary>
    /// Handles the Click event of the EditFile control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void EditFile_Click(object sender, ImageClickEventArgs e)
    {
        if (txtSelRowIndx.Value != String.Empty)
        {
            lnkAttachmentsHelp.NavigateUrl = "editattach.aspx";
            string aID = grdAttachments.DataKeys[Convert.ToInt32(txtSelRowIndx.Value) - 2].Value.ToString();
            IAttachment attachment = EntityFactory.GetById<IAttachment>(aID);
            if (attachment != null)
            {
                txtEditFile.Text = GetRealAttachmentName(attachment.FileName);
                txtEditSize.Text = FormatFileSize(Convert.ToInt32(attachment.FileSize));
                txtEditDesc.Text = attachment.Description;
                if (!String.IsNullOrEmpty(attachment.AttachDate.ToString()))
                    dtpAttachedDate.DateTimeValue = attachment.AttachDate.Value;
                if (attachment.User != null && attachment.User.UserInfo != null)
                    txtEditAttachedBy.Text = attachment.User.UserInfo.UserName;
                txtAttachId1.Value = attachment.Id.ToString();

                insertDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
                editDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
                if (Path.GetExtension(attachment.FileName).ToUpper() == ".URL")
                {
                    editFileDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
                    editUrlDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    lblEditUpload.Text = GetLocalResourceObject("lblSaveFile.Caption").ToString();
                    txtIsURLMode.Value = "T";
                }
                else
                {
                    editFileDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    editUrlDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
                    lblEditUpload.Text = GetLocalResourceObject("lblEditUpload.Caption").ToString();
                }
            }
        }
    }

    /// <summary>
    /// Handles the Click event of the DeleteFile control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void DeleteFile_Click(object sender, EventArgs e)
    {
        if ((txtSelRowIndx.Value != String.Empty) && (txtDeleteConfirmed.Value.Equals("T")))
        {
            string aID = grdAttachments.DataKeys[Convert.ToInt32(txtSelRowIndx.Value) - 2].Value.ToString();
            IAttachment attachment = EntityFactory.GetById<IAttachment>(aID);
            if (attachment != null)
            {
                attachment.Delete();
                txtSelRowIndx.Value = String.Empty;
                txtDeleteConfirmed.Value = "F";
                DeletePhysicalFile(attachment);
                LoadAttachments();
                hideAdds();
            }
        }
        else
        {
            log.Warn(GetLocalResourceObject("Error_UnableToLoad_lz").ToString());
        }
    }

    /// <summary>
    /// Returns the formated file size of an attachment.
    /// </summary>
    /// <param name="fileSize">Size of the file.</param>
    /// <returns>
    /// Formated file size of an attachment to be displayed in the grid view.
    /// </returns>
    protected string FormatSize(object fileSize)
    {
        return FormatFileSize(Convert.ToInt32(fileSize));
    }

    /// <summary>
    /// Determines the access.
    /// </summary>
    /// <param name="currentActivity">The current activity.</param>
    protected void DetermineAccess(Activity currentActivity)
    {
        if (currentActivity != null)
        {
            IUserService userServ = ApplicationContext.Current.Services.Get<IUserService>();
            if ((currentActivity.Type == ActivityType.atPersonal) && (userServ.UserId != currentActivity.UserId))
            {
                _hasAccess = false;
                return;
            }
        }
        _hasAccess = true;
    }
    #endregion

    #region Private Methods
    /// <summary>
    /// Loads the attachments.
    /// </summary>
    private void LoadAttachments()
    {
        IList<IAttachment> list;
        bool bIsActivityInsert = IsActivityInsert();
        bool bIsHistoryInsert = IsHistoryInsert();
        WorkItem workItem = PageWorkItem;
        string strId;
        string strTempAssociationID = string.Empty;

        if (bIsActivityInsert || bIsHistoryInsert)
        {
            if (workItem != null)
            {
                object oStrTempAssociationID = workItem.State["TempAssociationID"];
                strTempAssociationID = oStrTempAssociationID != null ? oStrTempAssociationID.ToString() : GetParam("activityid");
            }
        }

        if (!bIsActivityInsert && !bIsHistoryInsert)
            strId = EntityContext.EntityID.ToString();
        else
        {
            strId = string.IsNullOrEmpty(strTempAssociationID) ? EntityContext.EntityID.ToString() : strTempAssociationID;
        }

        list = GetAttachmentList(EntityContext.EntityType, strId);

        grdAttachments.DataSource = list;
        grdAttachments.DataBind();
    }

    /// <summary>
    /// Gets the attachment list.
    /// </summary>
    /// <param name="entity">The entity.</param>
    /// <param name="entityId">The entity id.</param>
    /// <returns>Attachment List</returns>
    private IList<IAttachment> GetAttachmentList(Type entity, string entityId)
    {
        string sortField = grdAttachments.CurrentSortExpression;
        string sortDirection = grdAttachments.CurrentSortDirection;
        if (string.IsNullOrEmpty(sortField))
        {
            sortField = "Description";
            sortDirection = "Descending";
        }

        IList<IAttachment> list = null;
        if (IsActivity() && !IsActivityInsert())
        {
            Activity currentActivity = CurrentActivity();
            if (currentActivity != null)
            {
                list = Rules.GetAttachmentsForSavedActivity(currentActivity, sortField, sortDirection.Equals("Ascending"));
                DetermineAccess(currentActivity);
                if (!HasAccess)
                    DisableFormControls();
            }
        }
        else
        {
            if (IsRecurringActivityInsert())
            {
                string strOriginalActivityId = GetParam("activityid");
                string strTempAssociationID = string.Empty;
                WorkItem workItem = PageWorkItem;
                if (workItem != null)
                {
                    object oStrTempAssociationID = workItem.State["TempAssociationID"];
                    if (oStrTempAssociationID != null)
                    {
                        strTempAssociationID = oStrTempAssociationID.ToString();
                    }
                }
                list =
                    Rules.GetAttachmentsForRecurringActivity(strOriginalActivityId,
                        strTempAssociationID, sortField, sortDirection.Equals("Ascending"));
            }
            else
            {
                if (entity != null)
                    list = Rules.GetAttachmentsFor(entity, entityId, sortField, sortDirection.Equals("Ascending"));
                else
                    log.Error(String.Format(GetLocalResourceObject("Error_InvalidEntityName_lz").ToString(), entity));
            }
        }
        return list;
    }

    /// <summary>
    /// Returns the actual attachment name from its encoded value.
    /// </summary>
    /// <param name="encodedName">Name of the encoded.</param>
    /// <returns>Actual attachment name.</returns>
    private static string GetRealAttachmentName(string encodedName)
    {
        if (encodedName.IndexOf("!") == 0)
            return encodedName.Remove(0, 13);
        return encodedName;
    }

    /// <summary>
    /// Deletes the physical file.
    /// </summary>
    /// <param name="attachment">The attachment.</param>
    private void DeletePhysicalFile(IAttachment attachment)
    {
        bool bIsActivityInsert = IsActivityInsert();
        bool bIsHistoryInsert = IsHistoryInsert();
        string attachPath;
        if (!bIsActivityInsert && !bIsHistoryInsert)
            attachPath = Rules.GetAttachmentPath();
        else
            attachPath = Rules.GetTempAttachmentPath();
        /* Make sure the attachment is not shared before removing the physical file. */
        int count = Rules.CountAttachmentsWithSameName(attachment);
        if (count.Equals(1))
        {
            if (File.Exists(attachPath + attachment.FileName))
            {
                try
                {
                    File.Delete(attachPath + attachment.FileName);
                }
                catch (Exception ex)
                {
                    log.Error(String.Format(GetLocalResourceObject("Error_Delete_Exception").ToString(), attachment.FileName, ex.Message));
                }
            }
            else
            {
                log.Info(String.Format(GetLocalResourceObject("Error_Delete_AttachNotFound").ToString(), attachment.FileName));
            }
        }
    }

    /// <summary>
    /// Streams the data from the posted file into a new FileStream, which is then saved to the attachments folder
    /// specified in BranchOptions.
    /// </summary>
    /// <param name="file">The uploaded file.</param>
    /// <returns>Path file was streamed out to.</returns>
    private string WriteToFile(UploadedFile file)
    {
        int fileLen = file.ContentLength;
        byte[] Data = new byte[fileLen];
        bool bIsActivityInsert = IsActivityInsert();
        bool bIsHistoryInsert = IsHistoryInsert();
        string attachPath;
        if (!bIsActivityInsert && !bIsHistoryInsert)
            attachPath = Rules.GetAttachmentPath();
        else
            attachPath = Rules.GetTempAttachmentPath();
        string path = attachPath + Path.GetFileName(file.FileName);
        file.InputStream.Read(Data, 0, fileLen);
        FileStream newFile = new FileStream(path, FileMode.OpenOrCreate);
        //Write data into the new file
        newFile.Write(Data, 0, Data.Length);
        newFile.Close();
        return path;
    }

    /// <summary>
    /// Returns a formated string of the size of an attachment, based on SalesLogix formating.
    /// </summary>
    /// <param name="fileSize">Size of the file.</param>
    /// <returns>Formated file size of an attachment.</returns>
    private string FormatFileSize(int fileSize)
    {
        if (fileSize <= 0)
        {
            return GetLocalResourceObject("FileSize_Unknown_lz").ToString();
        }
        if (fileSize < 1024)
        {
            return "1 KB";
        }
        fileSize = fileSize / 1024;
        return fileSize + " KB";
    }

    /// <summary>
    /// Formats the URL.
    /// </summary>
    /// <param name="id">The id.</param>
    /// <param name="fileName">Name of the file.</param>
    /// <param name="dataType">Type of the data.</param>
    /// <param name="description">The description.</param>
    /// <returns></returns>
    public string FormatUrl(object id, object fileName, object dataType, object description)
    {
        string url = string.Format("{0}/SmartParts/Attachment/ViewAttachment.aspx?Id={1}&Filename={2}&DataType={3}&Description={4}",
                        Page.Request.ApplicationPath, id, HttpUtility.UrlEncodeUnicode(fileName.ToString()),
                        dataType, HttpUtility.UrlEncodeUnicode(description.ToString()));
        return url;
    }

    /// <summary>
    /// Updates the UI for calendar security.
    /// </summary>
    private void UpdateUIForCalendarSecurity()
    {
        if (IsActivity() || IsHistory())
        {
            UserCalendar userCalendar = GetUserCalendar();
            if (userCalendar != null)
            {
                if (!((bool)userCalendar.AllowEdit))
                    DisableFormControls();
            }
            else
            {
                DisableFormControls();
            }
        }
    }

    /// <summary>
    /// Disables the form controls.
    /// </summary>
    private void DisableFormControls()
    {
        cmdInsertFile.Visible = false;
        cmdInsertUrl.Visible = false;
        cmdEditAttachment.Visible = false;
        cmdDeleteAttachment.Visible = false;
        radUProgressMgr.Enabled = false;
    }

    /// <summary>
    /// Currents the activity.
    /// </summary>
    /// <returns></returns>
    private Activity CurrentActivity()
    {
        Activity currentActivity = null;
        if (IsActivity())
        {
            object activity = EntityContext.GetEntity();
            if (activity != null)
            {
                if (activity is IActivity)
                {
                    return activity as Activity;
                }
            }
        }
        return currentActivity;
    }

    /// <summary>
    /// Currents the history.
    /// </summary>
    /// <returns></returns>
    private History CurrentHistory()
    {
        History currentHistory = null;
        if (IsHistory())
        {
            object history = EntityContext.GetEntity();
            if (history != null)
            {
                if (history is IHistory)
                {
                    return (history as History);
                }
            }
        }
        return currentHistory;
    }

    /// <summary>
    /// Gets the user calendar.
    /// </summary>
    /// <returns></returns>
    private UserCalendar GetUserCalendar()
    {
        UserCalendar userCalendar = null;
        if (IsActivity())
        {
            Activity currentActivity = CurrentActivity();
            if (currentActivity != null)
            {
                List<UserCalendar> calList = GetCurrentUserCalendarList(CurrentUserId);
                if (calList != null)
                {
                    foreach (UserCalendar uc in calList)
                    {
                        if (uc.CalUserId.Trim().Equals(currentActivity.UserId.Trim()))
                        {
                            userCalendar = uc;
                            break;
                        }
                    }
                }
            }
        }
        else if (IsHistory())
        {
            History currentHistory = CurrentHistory();
            if (currentHistory != null)
            {
                List<UserCalendar> calList = GetCurrentUserCalendarList(CurrentUserId);
                if (calList != null)
                {
                    foreach (UserCalendar uc in calList)
                    {
                        if (uc.CalUserId.Trim().Equals(currentHistory.UserId.Trim()))
                        {
                            userCalendar = uc;
                            break;
                        }
                    }
                }
            }
        }

        return userCalendar;
    }

    /// <summary>
    /// Gets the current user calendar list.
    /// </summary>
    /// <param name="CurrentUserID">The current user ID.</param>
    /// <returns></returns>
    private List<UserCalendar> GetCurrentUserCalendarList(string CurrentUserID)
    {
        List<UserCalendar> calList = null;
        if (IsActivity() || IsHistory())
        {
            calList = UserCalendar.GetCalendarAccessList(CurrentUserID);
            if (calList != null)
            {
                UserCalendarComparer ucc = new UserCalendarComparer();
                calList.Sort(ucc);
            }
        }
        return calList;
    }

    /// <summary>
    /// Determines whether this instance is insert.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if this instance is insert; otherwise, <c>false</c>.
    /// </returns>
    private bool IsInsert()
    {
        return IsEntityTypeValid() && EntityContext.EntityID.ToString().Equals(EntityViewMode.Insert.ToString());
    }

    /// <summary>
    /// Determines whether this instance is activity.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if this instance is activity; otherwise, <c>false</c>.
    /// </returns>
    private bool IsActivity()
    {
        return IsEntityTypeValid() && EntityContext.EntityType.Name.Equals("IActivity");
    }

    /// <summary>
    /// Determines whether this instance is history.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if this instance is history; otherwise, <c>false</c>.
    /// </returns>
    private bool IsHistory()
    {
        return IsEntityTypeValid() && EntityContext.EntityType.Name.Equals("IHistory");
    }

    private bool IsEntityTypeValid()
    {
        return EntityContext != null && EntityContext.EntityType != null;
    }

    /// <summary>
    /// Determines whether [is activity insert].
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if [is activity insert]; otherwise, <c>false</c>.
    /// </returns>
    private bool IsActivityInsert()
    {
        return IsInsert() && IsActivity();
    }

    /// <summary>
    /// Determines whether [is history insert].
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if [is history insert]; otherwise, <c>false</c>.
    /// </returns>
    private bool IsHistoryInsert()
    {
        return IsHistory() && IsInsert();
    }

    /// <summary>
    /// Determines whether this instance is recurring.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if this instance is recurring; otherwise, <c>false</c>.
    /// </returns>
    private bool IsRecurring()
    {
        return !string.IsNullOrEmpty(GetParam("recurdate"));
    }

    /// <summary>
    /// Gets the request parameter.
    /// </summary>
    /// <param name="key">The key.</param>
    /// <returns></returns>
    private string GetParam(string key)
    {
        string value;
        return Params.TryGetValue(key, out value) ? value : null;
    }

    /// <summary>
    /// Determines whether [is recurring activity].
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if [is recurring activity]; otherwise, <c>false</c>.
    /// </returns>
    private bool IsRecurringActivity()
    {
        return IsActivity() && IsRecurring();
    }

    /// <summary>
    /// Determines whether [is recurring activity insert].
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if [is recurring activity insert]; otherwise, <c>false</c>.
    /// </returns>
    private bool IsRecurringActivityInsert()
    {
        return IsActivityInsert() && IsRecurring();
    }

    /// <summary>
    /// Generates the script.
    /// </summary>
    private void GenerateScript()
    {
        if (!HasAccess)
        {
            StringBuilder str = new StringBuilder();
            str.AppendLine();
            str.AppendLine("$(document).ready(function(){");
            str.AppendFormat("var list = $(\"#{0} a\").filter('[target=_blank]'); ", grdAttachments.ClientID);
            str.AppendLine();
            str.AppendLine("for (i = 0; i < list.length; i++)");
            str.AppendLine("{");
            str.AppendLine("$(list[i]).replaceWith(list[i].innerHTML);");
            str.AppendLine("}");
            str.AppendLine("});");
            ScriptManager.RegisterStartupScript(Page, GetType(), ClientID, str.ToString(), true);
        }
    }
    #endregion

    #region ISmartPartInfoProvider Members

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in AttachDetails_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
