using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using IntellisyncTestEngine;
using System.IO;
using System.Reflection;

public partial class Diagnostics : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
       // if (!IsPostBack)
       // {
            EnumerateAssemblies();
       // }
    }

    // Handle the connection to the server 
    protected void btnConnect_Click(object sender, EventArgs e)
    {

        string Port = Request.ServerVariables["SERVER_PORT"];
        string Protocol = Request.ServerVariables["SERVER_PORT_SECURE"];
        string basePath = string.Empty;

        if (Port == null || Port == "80" || Port == "443")
            Port = "";
        else
            Port = String.Format(":{0}", Port);
        
        if (Protocol == null || Protocol == "0")
            Protocol = "http://";
        else
            Protocol = "https://";

        basePath = String.Format("{0}{1}{2}{3}/Default.aspx", Protocol, Request.ServerVariables["SERVER_NAME"], Port, Request.ApplicationPath);

        IntellisyncServer server = new IntellisyncServer(basePath);
        UserCredentials credentials = new UserCredentials(userId.Text, password.Text, "");

        if (server.TestAuthenticate(userId.Text, credentials.Password, string.Empty))
        {
            testMessage.Text =  GetResource("SuccessMessage");
        } else 
        {
            testMessage.Text = GetResource("FailMessage");
        }
    }

    private void EnumerateAssemblies()
    {

        List<AssemblyContainer> _items = new List<AssemblyContainer>();

        string path = Server.MapPath("bin");
        if (System.IO.Directory.Exists(path))
        {
            string[] files = System.IO.Directory.GetFiles(path, "*.dll");
         
            foreach (string file in files)
            {
                try
                {
                    Assembly assembly = Assembly.LoadFile(file);
                    string fullName = assembly.FullName;

                    _items.Add(new AssemblyContainer(file, fullName));

                }
                catch
                {

                }
            }

         
        }


        DataList1.DataSource = _items;
        DataList1.DataBind();
    }

    public string GetNiceName(object value) {
        return Path.GetFileName((string)value);
    }

    public string GetPrettyVersion(object value)
    {
        string result = (string)value;
        result = result.Substring(result.IndexOf("Version=")+8);
        result = result.Substring(0, result.IndexOf(","));

        return result; 
    }

    private class AssemblyContainer
    {
        private string _AssemblyName;
        public string AssemblyName
        {
            get { return _AssemblyName; }
            set
            {
                _AssemblyName = value;
            }
        }

        private string _FullName;
        public string FullName
        {
            get { return _FullName; }
            set
            {
                _FullName = value;
            }
        }
        
        /// <summary>
        /// Initializes a new instance of the Container class.
        /// </summary>
        /// <param name="assemblyName"></param>
        /// <param name="fullName"></param>
        public AssemblyContainer(string assemblyName, string fullName)
        {
            AssemblyName = assemblyName;
            FullName = fullName;
        }
    }


    protected void OnPageIndexChanged(object source, DataGridPageChangedEventArgs e)
    {
        DataList1.CurrentPageIndex = e.NewPageIndex;
        DataList1.DataBind();

    }

    string GetResource(string url, string key)
    {
        object obj = HttpContext.GetLocalResourceObject(url, key);
        if (obj != null)
            return obj.ToString();
        else
            return String.Empty;
    }
    string GetResource(string key)
    {
        return GetResource("~/Diagnostics.aspx", key);
    }
}

