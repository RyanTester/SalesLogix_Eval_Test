using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Telerik.WebControls;
using System.Text;
using Sage.Platform.Orm;
using Sage.Platform.Application.UI.Web.Threading;
using System.Threading;
using Sage.Platform.Application;

public partial class ImportRunTest : EntityBoundSmartPartInfoProvider
{
    //private ImportProgressArgs _testResults = null;
    private IContextService _Context;

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ILead); }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in this.ImportRunTest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Gets or sets the entity context.
    /// </summary>
    /// <value>The entity context.</value>
    /// <returns>The specified <see cref="T:System.Web.HttpContext"></see> object associated with the current request.</returns>
    [ServiceDependency]
    public IContextService ContextService
    {
        set
        {
            _Context = ApplicationContext.Current.Services.Get<IContextService>();
        }
        get
        {
            return _Context;
        }
    }

    #endregion

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when [register client scripts].
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        //IntRegisterClientSctipts();
        base.OnRegisterClientScripts();
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnOK.Click += DialogService.CloseEventHappened;
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Raises the <see cref="E:PreRender"/> event.
    /// </summary>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        
        IntRegisterClientSctipts();
        Loadview();
    }
    /// <summary>
    /// Ints the register client sctipts.
    /// </summary>
    private void IntRegisterClientSctipts()
    {
        string script = GetLocalResourceObject("ImportRunTest_ClientScript").ToString();
        StringBuilder sb = new StringBuilder(script);
        sb.Replace("@cmdStartImportTestId", cmdStartImportTest.ClientID);
        sb.Replace("@cmdLoadResultsId", cmdLoadResults.ClientID);
        sb.Replace("@hdStartTestId", hdStartTest.ClientID);
        sb.Replace("@hdCompletedTestId", hdCompetedTest.ClientID);
        if (ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
            ScriptManager.RegisterStartupScript(Page, typeof(Page), "ImportRunTest_ClientScript", sb.ToString(), false);
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
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        
        
    }

    /// <summary>
    /// Loadviews this instance.
    /// </summary>
    private void Loadview()
    {
        if (this.Page.IsPostBack)
        {
            if (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("startTest")))
            {
                DialogService.DialogParameters.Remove("startTest");
                ContextService.RemoveContext("TestResultsInfo");
                hdStartTest.Value = "true";
                hdCompetedTest.Value = "false";
                pnlProgressArea.Visible = true;
            }
            else
            {
                hdStartTest.Value = "false";
                
            }
            if(hdCompetedTest.Value == "true")
            {
               LoadResults();
               pnlProgressArea.Visible = false; 
            }
            else
            {
                ClearResults();                 
            }

           
        }
    
    }


    /// <summary>
    /// Handles the OnClick event of the StartProcess control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void StartImportTest_OnClick(object sender, EventArgs e)
    {
        
        using (new SessionScopeWrapper(true))
        {
            ThreadPoolHelper.QueueTask(new WaitCallback(StartTestImport));
        }
    }

    /// <summary>
    /// Starts the test import process.
    /// </summary>
    private void StartTestImport(Object args)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        SetStartProcessInfo();
        importManager.StartImportTest(100, ImportHandler);
        SetCompleteProcessInfo();
    }

    /// <summary>
    /// Sets the start process info.
    /// </summary>
    private void SetStartProcessInfo()
    {
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["PrimaryPercent"] = "0";
        importProgress["PrimaryValue"] = "0";
        importProgress["PrimaryTotal"] = "0";
        importProgress["SecondaryValue"] = "0";
        importProgress["SecondaryTotal"] = "0";
        importProgress["ProcessCompleted"] = "False";
    }

    /// <summary>
    /// Gets the arguements from the handler to set the progress indicator.
    /// </summary>
    /// <param name="args">The args.</param>
    private void ImportHandler(ImportProgressArgs args)
    {

        //ImportManager importManager = Page.Session["testimportManager"] as ImportManager;
        TestResultsInfo testResultInfo = GetTestResultInfo();
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["PrimaryPercent"] = Convert.ToString(Math.Round(Decimal.Divide(args.ProcessedCount, args.RecordCount) * 100));
        importProgress["PrimaryValue"] = String.Format("({0})", args.ProcessedCount.ToString());
        importProgress["PrimaryTotal"] = String.Format("({0})", args.RecordCount.ToString());
        //importProgress["SecondaryTotal"] = String.Format("{0}   Duplicates:{1}", args.ErrorCount, args.DuplicateCount);
        importProgress["ProcessCompleted"] = "False";
        testResultInfo.TotalRecords = args.RecordCount.ToString();
        testResultInfo.TotalRecordsProcessed = args.ProcessedCount.ToString();
        testResultInfo.TotalDuplicates = args.DuplicateCount.ToString();
        testResultInfo.TotalWarnings = args.WarningCount.ToString();
        testResultInfo.TotalTotalMerged = args.MergeCount.ToString();
        testResultInfo.TotalErrors = args.ErrorCount.ToString();
        try
        {
            if (args.RecordCount == 0)
            {
                testResultInfo.ProjectedDuplicateRate = string.Format("{0:P}", 0);
            }
            else 
            {
                testResultInfo.ProjectedDuplicateRate = string.Format("{0:P}", Decimal.Divide(args.DuplicateCount, args.RecordCount));
            }
           
        }
        catch (Exception)
        { 
        }
        SaveTestResultInfo(testResultInfo);
        LoadResults();
    }

    /// <summary>
    /// Sets the complete process info.
    /// </summary>
    private void SetCompleteProcessInfo()
    {
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["ProcessCompleted"] = "True";
    }

    /// <summary>
    /// Loads the results.
    /// </summary>
    private void LoadResults()
    {
        TestResultsInfo testResultInfo = GetTestResultInfo();
        txtTotalRecordsProcessed.Text = testResultInfo.TotalRecordsProcessed;
        txtTotalDuplicates.Text = testResultInfo.TotalDuplicates;
        txtProjectedDuplicates.Text = testResultInfo.ProjectedDuplicateRate;
    }

    private void ClearResults()
    {
        txtTotalRecordsProcessed.Text = GetLocalResourceObject("MSG.Calculating").ToString();
        txtTotalDuplicates.Text = GetLocalResourceObject("MSG.Calculating").ToString();
        txtProjectedDuplicates.Text = GetLocalResourceObject("MSG.Calculating").ToString();    
    }

    /// <summary>
    /// Handles the Click event of the cmdOK control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdOK_Click(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdClose control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdLoadResults_OnClick(object sender, EventArgs e)
    {
        //pnlProgressArea.Visible = false;
    }

    /// <summary>
    /// Called when the dialog is closing.
    /// </summary>
    protected override void OnClosing()
    {
        RadProgressContext importProgress = RadProgressContext.Current;
        importProgress["PrimaryPercent"] = "0";
        importProgress["PrimaryValue"] = "0";
        importProgress["ProcessCompleted"] = "False";
        ContextService.RemoveContext("TestResultsInfo");
        //hdStartTest.Value = "false";
        //DialogService.DialogParameters.Remove("startTest");
        base.OnClosing();
    }

    private TestResultsInfo GetTestResultInfo()
    {
       TestResultsInfo testInfo = ContextService.GetContext("TestResultsInfo") as TestResultsInfo;
       if (testInfo == null)
       {
           testInfo = new TestResultsInfo();
                   
       }
       return testInfo;

    }
    private void SaveTestResultInfo(TestResultsInfo  testResultInfo)
    {
        ContextService.SetContext("TestResultsInfo", testResultInfo);
    }

    
}

public class TestResultsInfo
{
    public string CurrentProcessId = string.Empty;
    public string TotalRecords = string.Empty;
    public string TotalRecordsProcessed = string.Empty;
    public string TotalErrors = string.Empty;
    public string TotalDuplicates = string.Empty;
    public string TotalWarnings = string.Empty;
    public string TotalTotalMerged = string.Empty;
    public string ProjectedDuplicateRate = string.Empty;
}