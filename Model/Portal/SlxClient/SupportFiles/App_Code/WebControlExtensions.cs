using System;
using System.Collections.Generic;
using System.Web.UI.WebControls;

public static class WebControlExtensions
{
    public static void DataBind(
        this ListControl list,
        IEnumerable<KeyValuePair<string, string>> dataSource)
    {
        if (list == null) throw new ArgumentNullException("list");

        list.DataTextField = "Key";
        list.DataValueField = "Value";
        list.DataSource = dataSource;
        list.DataBind();
    }
}