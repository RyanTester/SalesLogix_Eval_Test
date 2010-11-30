using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Repository;
using Sage.Platform.Data;
using Sage.Platform.Application;
using Sage.Platform;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;

public partial class SmartParts_ImportHistory_ImportHistoryDetail : EntityBoundSmartPartInfoProvider
{
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IImportHistory); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        LoadForm();
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
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control c in Controls)
        {
            SmartPartToolsContainer cont = c as SmartPartToolsContainer;
            if (cont != null)
            {
                switch (cont.ToolbarLocation)
                {
                    case SmartPartToolsLocation.Right:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.RightTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Center:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.CenterTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Left:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.LeftTools.Add(tool);
                        }
                        break;
                }
            }
        }
        return tinfo;
    }

    /// <summary>
    /// Handles the OnClick event of the cmdAbort control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdAbort_OnClick(object sender, EventArgs e)
    {
        IImportHistory importHistory = BindingSource.Current as IImportHistory;
        AbortImport(importHistory);
        Response.Redirect(string.Format("ImportHistory.aspx?entityid={0}", importHistory.Id));
    }

    /// <summary>
    /// Aborts the import.
    /// </summary>
    /// <param name="importHistory">The import history.</param>
    private void AbortImport(IImportHistory importHistory)
    {
        try
        {
            IRepository<IImportHistory> rep = EntityFactory.GetRepository<IImportHistory>();
            IQueryable qry = (IQueryable)rep;
            IExpressionFactory ep = qry.GetExpressionFactory();
            Sage.Platform.Repository.ICriteria crit = qry.CreateCriteria();
            crit.Add(ep.Eq("Id", importHistory.Id));
            IProjections projections = qry.GetProjectionsFactory();
            crit.SetProjection(projections.Property("ProcessState"));
            object state = crit.UniqueResult();
            if (state != null)
            {
                ImportProcessState processState = (ImportProcessState)Enum.Parse(typeof(ImportProcessState), state.ToString());
                if (!processState.Equals(ImportProcessState.Completed) || !processState.Equals(ImportProcessState.Abort))
                    SetProcessState(importHistory.Id.ToString(), Enum.GetName(typeof(ImportProcessState), ImportProcessState.Abort), "Aborted");
            }
        }
        catch (Exception)
        {
            //throw new ApplicationException("Error getting process state");
        }
    }

    /// <summary>
    /// Sets the state of the process.
    /// </summary>
    /// <param name="importId">The import id.</param>
    /// <param name="processState">State of the process.</param>
    /// <param name="status">The status.</param>
    private void SetProcessState(string importId, string processState, string status)
    {
        IDataService service = ApplicationContext.Current.Services.Get<IDataService>();
        using (var conn = service.GetOpenConnection())
        {
            var slxTransaction = conn.BeginTransaction();

            using (var cmd = conn.CreateCommand())
            {
                try
                {
                    cmd.Transaction = slxTransaction;
                    string SQL = "UPDATE IMPORTHISTORY SET PROCESSSTATE = ?, STATUS = ? WHERE IMPORTHISTORYID = ? AND PROCESSSTATE= ?";
                    cmd.CommandText = SQL;
                    var factory = service.GetDbProviderFactory();
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(factory.CreateParameter("@PROCESSSTATE", processState));
                    cmd.Parameters.Add(factory.CreateParameter("@STATUS", status));
                    cmd.Parameters.Add(factory.CreateParameter("@IMPORTHISTORTYID", importId));
                    cmd.Parameters.Add(factory.CreateParameter("@PROCESSSTATE", Enum.GetName(typeof(ImportProcessState), ImportProcessState.Processing)));
                    cmd.ExecuteNonQuery();
                    slxTransaction.Commit();
                }
                catch (Exception ex)
                {
                    slxTransaction.Rollback();
                    throw new Exception(ex.Message);
                }
            }
        }
    }

    /// <summary>
    /// Loads the form.
    /// </summary>
    private void LoadForm()
    {
        IImportHistory importHistory = BindingSource.Current as IImportHistory;

        if (importHistory != null)
        {
            txtImportFileName.Text = importHistory.Description;
            txtStatus.Text = importHistory.Status;
            txtImportId.Text = importHistory.ImportNumber;
            txtTemplate.Text = importHistory.Template;
            dtpStartDate.DateTimeValue = importHistory.CreateDate;
            dtpCompleteDate.DateTimeValue = importHistory.ModifyDate;
            usrStartedBy.LookupResultValue = importHistory.CreateUser;
            txtTotalRecords.Text = importHistory.RecordCount.ToString();
            txtRecordsProcessed.Text = importHistory.ProcessedCount.ToString();
            txtRecordsImported.Text = importHistory.ImportedCount.ToString();
            txtTotalErrors.Text = importHistory.ErrorCount.ToString();
            txtWarningCount.Text = importHistory.WarningCount.ToString();
            txtDuplicateCount.Text = importHistory.DuplicateCount.ToString();
            txtMergedCount.Text = importHistory.MergeCount.ToString();
            if (!string.IsNullOrEmpty(importHistory.ProcessState))
            {
                try
                {
                    ImportProcessState processState = (ImportProcessState)Enum.Parse(typeof(ImportProcessState), importHistory.ProcessState);
                    if ((processState.Equals(ImportProcessState.Completed)) || (processState.Equals(ImportProcessState.Abort)))
                    {
                        cmdAbort.Visible = false;
                    }
                    else
                    {
                        cmdAbort.Visible = true;
                    }
                }
                catch (Exception)
                {
                    cmdAbort.Visible = false;
                }
            }
        }
    }
}