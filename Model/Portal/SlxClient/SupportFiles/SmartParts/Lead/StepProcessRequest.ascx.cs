using System;
using System.Data;
using System.Data.OleDb;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Threading;
using log4net;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Services.Import;
using Telerik.WebControls;
using System.Text;
using System.IO;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Data;
using Sage.SalesLogix.Web;

public partial class StepProcessRequest : UserControl
{
    private IWebDialogService _DialogService;
    static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);

    #region Public Properties
    /// <summary>
    /// Gets or sets an instance of the Dialog Service.
    /// </summary>
    /// <value>The dialog service.</value>
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        set
        {
            _DialogService = value;
        }
        get
        {
            return _DialogService;
        }
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Starts the import process inside its own thread.
    /// </summary>
    /// <param name="args">The args.</param>
    public void StartImportProcess(Object args)
    {
        
        SetImportSourceValue();
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            SetStartProcessInfo();
            
            try
            {
                Page.Session["importManager"] = null;
                SetStartProcessInfo();
                AddJob(importManager);
                AddCrossReferenceMananager(importManager);
                importManager.StartImportProcess(ImportHandler);
                SetCompleteProcessInfo();
                string sourceFileName = ((ImportCSVReader)importManager.SourceReader).SourceFileName;
                if (sourceFileName != null)
                {
                    string targetFileName = ImportService.GetImportCompletedPath() + importManager.ImportHistory.ImportNumber + ".csv";
                    ImportService.MoveToPath(sourceFileName, targetFileName);
                }
                //Page.Session["importHistoryId"] = importManager.ImportHistory.Id;

            }
            catch
            {

                
            }
            finally 
            {
                SetCompleteProcessInfo();
                RemoveJob(importManager);
                importManager.Dispose();
                importManager = null;
                object objShutDown = Page.Session["SessionShutDown"];
                if (System.Convert.ToBoolean(objShutDown))
                {

                    if (CanShutDown())
                    {
                        ApplicationContext.Shutdown();
                        Page.Session.Abandon();
                    }
                }
            
            }
                  
        }
        else
        {
            //raise exception
        }
    }

    
    #endregion

    #region Private Methods

    private void AddJob(ImportManager importManager)
    {

         IDictionary<string, string> jobs =  Page.Session["importJobs"] as Dictionary<string,string>;
         if (jobs == null)
         {
             jobs = new Dictionary<string, string>();
             
         }
         if (!jobs.ContainsKey(importManager.ToString()))
         {
             jobs.Add(importManager.ToString(), importManager.SourceFileName);
         
         }
         Page.Session["importJobs"] = jobs;
         
    
    }

    private void RemoveJob(ImportManager importManager)
    {
        IDictionary<string, string> jobs = Page.Session["importJobs"] as Dictionary<string, string>;
        
        if (jobs != null)
        {
            jobs.Remove(importManager.ToString());

        }
        Page.Session["importJobs"] = jobs;
     
    }

    private bool CanShutDown()
    {
        IDictionary<string, string> jobs = Page.Session["importJobs"] as Dictionary<string, string>;

        if (jobs != null)
        {
            if (jobs.Count == 0)
            {
                return true;            
            }
        }
        return false;
    }


    /// <summary>
    /// Sets the import source value.
    /// </summary>
    private void SetImportSourceValue()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        ImportTargetProperty prop = importManager.EntityManager.GetEntityProperty("ImportSource");
        if (prop != null)
        {
            string importSource = Path.GetFileName(importManager.SourceFileName);
            if (importSource.Length > 24)
                importSource = importSource.Substring(0, 24);
            prop.DefaultValue = importSource;
            importManager.TargetPropertyDefaults.Add(prop);
            Page.Session["importManager"] = importManager;
        }
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        InitRegisterClientScripts();
    }

    /// <summary>
    /// Inits the register client scripts.
    /// </summary>
    protected void InitRegisterClientScripts()
    {
        
            string script = GetLocalResourceObject("ImportLeadProgress_ClientScript").ToString();
            StringBuilder sb = new StringBuilder(script);
            sb.Replace("@cmdCloseCtrlId", cmdCompleted.ClientID);
            //this.Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "ImportLeadProgress_ClientScript", sb.ToString(), false);
            ScriptManager.RegisterStartupScript(Page, this.GetType(), "ImportLeadProgress_ClientScript", sb.ToString(), false);
        
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        IImportHistory importHistory = null;
        if (importManager != null)
        {
            importHistory = importManager.ImportHistory;
        }
        else 
        {
            string historyId =  Page.Session["importHistoryId"] as string;
            importHistory = Sage.Platform.EntityFactory.GetById<IImportHistory>(historyId);
                
        }


        if (importHistory != null)
        {
            
            try
            {
                lnkImportNumber.Text = string.Format("{0}-{1}", importHistory.Alternatekeyprefix, importHistory.Alternatekeysuffix);

                ImportProcessState processState = (ImportProcessState)Enum.Parse(typeof(ImportProcessState), importHistory.ProcessState);
                if (processState.Equals(ImportProcessState.Abort))
                {
                    //lblHeader.Text = string.Format(GetLocalResourceObject("AbortMsg").ToString());
                    if (importHistory.ErrorCount > 0)
                        lblHeader2.Text = string.Format("{0}  {1}", GetLocalResourceObject("ViewImportHistoryMsgWithErrors").ToString(), GetLocalResourceObject("ViewImportHistoryMsg").ToString());
                    else
                        lblHeader2.Text = string.Format("{0}", GetLocalResourceObject("ViewImportHistoryMsg").ToString());

                    cmdAbort.Visible = false;

                }
                else
                {
                    if (processState.Equals(ImportProcessState.Completed))
                    {
                        cmdAbort.Visible = false;
                        lblHeader.Text = string.Format(GetLocalResourceObject("CompletedMsg").ToString());
                        if(importHistory.ErrorCount > 0)
                            lblHeader2.Text = string.Format("{0}  {1}", GetLocalResourceObject("ViewImportHistoryMsgWithErrors").ToString(), GetLocalResourceObject("ViewImportHistoryMsg").ToString());
                        else
                            lblHeader2.Text = string.Format("{0}", GetLocalResourceObject("ViewImportHistoryMsg").ToString());

                        importManager = null;
                        Page.Session["importManager"] = null;
                        
                    }
                    else
                    {
                        cmdAbort.Visible = true;
                        lblHeader.Text = string.Format(GetLocalResourceObject("lblPrimary_Progress.Caption").ToString());
                        lblHeader2.Text = string.Format(GetLocalResourceObject("ProcessingMsg").ToString());
                    }
                }

            }
            catch (Exception)
            {
            }
        }
        else
        {
        }
        base.OnPreRender(e);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCompleted control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCompleted_OnClick(object sender, EventArgs e)
    {
        SetCompleteProcessInfo();
    }

    /// <summary>
    /// Handles the OnClick event of the lnkImportNumber control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lnkImportNumber_OnClick(object sender, EventArgs e)
    {
        GoToImportHistory();
    }

    /// <summary>
    /// Goes to import history.
    /// </summary>
    protected void GoToImportHistory()
    {
        object importHistoryId = Page.Session["importHistoryId"];
        if (importHistoryId != null)
        {
            Response.Redirect(string.Format("~/ImportHistory.aspx?entityId={0}", importHistoryId.ToString()));
        }
    }

    /// <summary>
    /// Gets the arguements from the handler to set the progress indicator.
    /// </summary>
    /// <param name="args">The args.</param>
    private void ImportHandler(ImportProgressArgs args)
    {
        RadProgressContext importProgress = RadProgressContext.Current;
        string percent;
        try
        {
            percent = Convert.ToString(Math.Round(Decimal.Divide(args.ProcessedCount, args.RecordCount) * 100));
            importProgress["PrimaryPercent"] = percent;
        }
        catch(Exception) 
        {
            percent = "0";
        }
        if (args.ProcessedCount < 2)
        { 
             if (args.ImportManager != null)
             {
                 if (args.ImportManager.ImportHistory != null)
                 {
                     Page.Session["importHistoryId"] = args.ImportManager.ImportHistory.Id;
                 }
             }
        
        }
        
        importProgress["PrimaryPercent"] = percent;
        importProgress["PrimaryValue"] = String.Format("({0})", args.ProcessedCount.ToString());
        importProgress["PrimaryTotal"] = String.Format("({0})", args.RecordCount.ToString());
        importProgress["SecondaryValue"] = args.ImportedCount.ToString();
        importProgress["SecondaryTotal"] = String.Format("{0} Duplicates:{1} Merged:{2} ", args.ErrorCount, args.DuplicateCount, args.MergeCount);
        if (args.ErrorCount > 0)
        {
            importProgress["ProcessCompleted"] = "True";
            ImportManager importManager = args.ImportManager; // Page.Session["importManager"] as ImportManager;
            if (importManager != null)
            {
                importManager.ImportHistory.ErrorCount = args.ErrorCount;
                importManager.ImportHistory.ProcessState = Enum.GetName(typeof(ImportProcessState),
                                                                        ImportProcessState.Completed);
                //importManager.ImportHistory. args.Message
                SetProcessState(importManager.ImportHistory.Id.ToString(), Enum.GetName(typeof(ImportProcessState), ImportProcessState.Abort), GetLocalResourceObject("AbortedMsg").ToString());
            }
        }
        else
        {
            importProgress["ProcessCompleted"] = "False";
        }
        //Thread.Sleep(10000);
    }

    /// <summary>
    /// Sets the complete process info.
    /// </summary>
    private void SetCompleteProcessInfo()
    {
        Page.Session["ProcessRunning"] = null;
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["ProcessCompleted"] = "True";
    }

    /// <summary>
    /// Sets the start process info.
    /// </summary>
    private void SetStartProcessInfo()
    {
        Page.Session["ProcessRunning"] = true;       
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["PrimaryPercent"] = "0";
        importProgress["PrimaryValue"] = "0";
        importProgress["PrimaryTotal"] = "0";
        importProgress["SecondaryValue"] = "0";
        importProgress["SecondaryTotal"] = "0";
        importProgress["ProcessCompleted"] = "False";
    }

    

    private void AddCrossReferenceMananager(ImportManager importManager)
    {
        IImportTransformationProvider transformationProvider = importManager.TransformationProvider;
        if ((transformationProvider.CrossRefManager == null)||(transformationProvider.CrossRefManager.Sets.Count == 0))
        {
            ImportCrossRefManager crossRefManager = new ImportCrossRefManager();
            ImportCrossRefSet crossRefSet = new ImportCrossRefSet();
            crossRefSet.AddCrossReference("T", true);
            crossRefSet.AddCrossReference("F", false);
            crossRefSet.AddCrossReference("Y", true);
            crossRefSet.AddCrossReference("N", true);
            crossRefSet.AddCrossReference("Yes", true);
            crossRefSet.AddCrossReference("No", false);
            crossRefSet.AddCrossReference("True", true);
            crossRefSet.AddCrossReference("False", false);
            crossRefManager.Sets.Add("TrueFalse_Set", crossRefSet);

            crossRefSet = new ImportCrossRefSet();
            crossRefSet.AddCrossReference("M", "Male");
            crossRefSet.AddCrossReference("F", "Female");
            crossRefSet.AddCrossReference("", "Unknown");
            crossRefSet.AddCrossReference("U", "Unknown");
            crossRefManager.Sets.Add("Gender_Set", crossRefSet);

            transformationProvider.CrossRefManager = crossRefManager;
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdAbort control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdAbort_OnClick(object sender, EventArgs e)
    {

        object importHistoryId = Page.Session["importHistoryId"];
        AbortImport(importHistoryId.ToString());

    }  

    /// <summary>
    /// Aborts the import.
    /// </summary>
    /// <param name="importHistory">The import history.</param>
    private void AbortImport(string importHistoryId)
    {
        SetProcessState(importHistoryId, Enum.GetName(typeof(ImportProcessState), ImportProcessState.Abort), "Aborted");
        GoToImportHistory();
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

                    string SQL = "UPDATE IMPORTHISTORY SET PROCESSSTATE = ?, STATUS = ? WHERE IMPORTHISTORYID = ?";
                    var factory = service.GetDbProviderFactory();
                    cmd.CommandText = SQL;
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(factory.CreateParameter("@PROCESSSTATE", processState));
                    cmd.Parameters.Add(factory.CreateParameter("@STATUS", status));
                    cmd.Parameters.Add(factory.CreateParameter("@IMPORTHISTORTYID", importId));
                    cmd.ExecuteNonQuery();
                    slxTransaction.Commit();
                }
                catch (Exception ex)
                {
                    slxTransaction.Rollback();
                    throw new Exception(ex.Message);
                }
                finally
                {
                    conn.Close();
                }
            }
        }
    }
    #endregion
}