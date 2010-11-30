using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Text;

namespace Sage.SalesLogix.Client.GroupBuilder
{
	/// <summary>
	/// Summary description for QBEditLayout.
	/// </summary>
	public partial class QBEditLayout : SlxUserControlBase
	{
        protected override void LoadImages()
        {
            //QBEditLayoutHeader.Src = Page.ClientScript.GetWebResourceUrl(typeof(SlxUserControlBase), "Sage.SalesLogix.Client.GroupBuilder.images.help.gif"); 
        }
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
            LoadImages();
            RegisterClientScripts(); 
		}

        protected override void RegisterClientScripts()
        {
            base.RegisterClientScripts();

            //RegisterIncludeScript("QueryBuilder", "Sage.SalesLogix.Client.GroupBuilder.jscript.querybuilder.js", true);
            RegisterIncludeScript("Yahoo_yahoo", "jscript/YUI/yahoo.js", false);
            RegisterIncludeScript("Yahoo_event", "jscript/YUI/event.js", false);

        }
	}
}
