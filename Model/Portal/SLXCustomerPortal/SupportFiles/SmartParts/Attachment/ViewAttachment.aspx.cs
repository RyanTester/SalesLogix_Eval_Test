using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using Microsoft.Win32;
using Sage.Entity.Interfaces;
using Sage.Platform;

public partial class ViewAttachment : System.Web.UI.Page
{
    /// <summary>
    /// The type of attachment link.
    /// </summary>
    private enum AttachmentLink
    {
        /// <summary>
        /// Create a file name based on the attachment description.
        /// </summary>
        alDescription,
        /// <summary>
        /// Create a file name based on the attachment file name.
        /// </summary>
        alFileName
    }

    /// <summary>
    /// The default type of attachment file name to create when the user clicks the attachment hyperlink.
    /// This value can be set here.
    /// </summary>
    private AttachmentLink _attachmentLinkType = AttachmentLink.alDescription; // AttachmentLink.alFileName;

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        OpenAttachment();
    }

    /// <summary>
    /// Gets the type of the attachment.
    /// </summary>
    /// <param name="DataType">Type of the data.</param>
    /// <returns></returns>
    protected static string GetAttachmentType(string DataType)
    {
        switch (DataType)
        {
            case "R":
                return "Attachment";
            case "T":
                return "Template";
            case "D":
                return "Data";
            case "F":
                return "general"; //virtual directory
            case "FA":
                return "Attachment";
            case "FS":
                return "Library";
            default:
                return String.Empty;
        }
    }

    /// <summary>
    /// Gets the file extension.
    /// </summary>
    /// <param name="file">The file.</param>
    /// <returns></returns>
    protected static string GetFileExtension(string file)
    {
        return Path.GetExtension(file);
    }

    /// <summary>
    /// Opens the attachment.
    /// </summary>
    protected void OpenAttachment()
    {
        try
        {
            Response.Buffer = true;
            Response.Clear();
            Response.ClearContent();
            Response.ClearHeaders();
            string fileName = Request.QueryString["Filename"];
            string fileDesc = Request.QueryString["Description"];
            string historyid = Request.QueryString["historyid"];
            if (string.IsNullOrEmpty(fileName) && string.IsNullOrEmpty(historyid))
            {
                Response.ContentType = "text/html";
                Response.Write(string.Format(GetLocalResourceObject("Error_NoFileRequested_lz").ToString() + "\r\n{0}",
                    Request.PathInfo + "?" + Request.QueryString));
                return;
            }
            else
            {
                if (!string.IsNullOrEmpty(fileName))
                {
                    //remove backslash from file name
                    if (fileName.IndexOf("/") == 0)
                        fileName = fileName.Remove(0, 1);
                }
                else if (!string.IsNullOrEmpty(historyid))
                {
                    IHistory history = Sage.Platform.EntityFactory.GetById<IHistory>(historyid);
                    if (history != null)
                    {
                        IList<IAttachment> attachments =
                            Sage.SalesLogix.Attachment.Rules.GetAttachmentsFor(typeof(IHistory), history.HistoryId);
                        if (attachments != null)
                        {
                            IAttachment attachment = null;
                            foreach (IAttachment att in attachments)
                            {
                                if (att.FileName.ToUpper().EndsWith(".MSG"))
                                {
                                    fileName = att.FileName;
                                    attachment = att;
                                    break;
                                }
                            }
                            if (attachment == null)
                            {
                                Response.ContentType = "text/html";
                                Response.Write(GetLocalResourceObject("Error_EmailMsgAttachment").ToString());
                                return;
                            }
                        }
                        else
                        {
                            Response.ContentType = "text/html";
                            Response.Write(GetLocalResourceObject("Error_EmailMsgAttachment").ToString());
                            return;
                        }
                    }
                }
            }

            string filePath = String.Empty;
            string DataType = GetAttachmentType(Request.QueryString["DataType"]);
            if (DataType.Equals("Library"))
            {
                object fileId = Request.QueryString["fileId"];
                //can't use query string to get library directory as Whats New attachment/documents won't contain that property
                string libraryPath = Sage.SalesLogix.Attachment.Rules.GetLibraryPath();
                ILibraryDocs libraryDoc = EntityFactory.GetRepository<ILibraryDocs>().Get(fileId);
                if (libraryDoc != null)
                    filePath = String.Format("{0}{1}\\", libraryPath, libraryDoc.Directory.FullPath);
            }
            else
                filePath = Sage.SalesLogix.Attachment.Rules.GetAttachmentPath();
            
            if (DataType.Equals("Template"))
                filePath += "Word Templates/";

            string tempPath = Sage.SalesLogix.Attachment.Rules.GetTempAttachmentPath();
            bool bIsTempAttachment = File.Exists(tempPath + fileName);

            if (bIsTempAttachment || File.Exists(filePath + fileName))
            {
                if (bIsTempAttachment)
                    filePath = tempPath;

                FileStream fileStream = new FileStream(filePath + fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
                try
                {
                    const int CHUNK_SIZE = 1024 * 10;
                    long iFileLength = fileStream.Length;

                    BinaryReader binaryReader = new BinaryReader(fileStream);
                    try
                    {
                        Response.Buffer = false;
                        Response.Clear();
                        Response.ClearContent();
                        Response.ClearHeaders();

                        string strFilePart = string.Empty;
                        switch (_attachmentLinkType)
                        {
                            case AttachmentLink.alDescription:
                                strFilePart = MakeValidFileName(fileName);
                                if (string.IsNullOrEmpty(strFilePart))
                                    strFilePart = GetLocalResourceObject("DefaultUnknownFileName").ToString();
                                break;
                            case AttachmentLink.alFileName:
                                strFilePart = Path.GetFileNameWithoutExtension(filePath + fileName);
                                if (string.IsNullOrEmpty(strFilePart))
                                    strFilePart = GetLocalResourceObject("DefaultUnknownFileName").ToString();
                                const int ATTACHMENTID_LENGTH = 13;
                                if (strFilePart.StartsWith("!") && (strFilePart.Length > ATTACHMENTID_LENGTH))
                                    // Grab everything after the Attachment ID.
                                    strFilePart = strFilePart.Substring(ATTACHMENTID_LENGTH);
                                else
                                {
                                    // If it's not a regular attachment then check to see if it's a mail merge attachment... 
                                    if (!fileName.ToUpper().StartsWith("MAIL MERGE\\"))
                                        strFilePart = GetLocalResourceObject("DefaultUnknownFileName").ToString();
                                }
                                break;
                        }

                        if (string.IsNullOrEmpty(strFilePart))
                            strFilePart = GetLocalResourceObject("DefaultUnknownFileName").ToString();

                        if (strFilePart.Equals(GetLocalResourceObject("DefaultUnknownFileName").ToString()))
                            // Just in case the translation contains invalid file name characters.
                            strFilePart = MakeValidFileName(strFilePart);

                        string strExtPart = Path.GetExtension(filePath + fileName);
                        if (string.IsNullOrEmpty(strExtPart))
                            strExtPart = ".dat";

                        Response.ContentType = GetMIMEFromReg(strExtPart);

                        if (IsIE())
                        {
                            // Note: Internet Explorer will only allow 20 characters to be used for the file name (including extension)
                            //       when double byte characters are used. However, if more than 20 characters are used the Save As dialog
                            //       will show an invalid file name and an invalid file extension under the following conditions:
                            //       http://support.microsoft.com/kb/897168. The code below handles the truncation of the file name when
                            //       the file name contains double byte characters, which works around this bug.

                            // Will return false if there were any double byte characters. 
                            bool bCanUseFullFileName;
                            try
                            {
                                bCanUseFullFileName = Sage.Platform.Data.DataUtil.CalculateStorageLengthRequired(fileName).Equals(fileName.Length);
                            }
                            catch (Exception)
                            {
                                bCanUseFullFileName = false;
                            }

                            if (bCanUseFullFileName.Equals(false))
                            {
                                int iExtLength = strExtPart.Length;
                                int iCopyLength = 20 - iExtLength;
                                // We can only use 20 characters for the filename + ext if there were double byte characters.
                                if (strFilePart.Length > iCopyLength)
                                {
                                    strFilePart = strFilePart.Substring(0, iCopyLength);
                                }
                            }
                        }

                        fileName = strFilePart.Replace("+", "%20");

                        Response.Clear();
                        Response.Charset = String.Empty;
                        Encoding headerEncoding = Encoding.GetEncoding(1252);
                        Response.HeaderEncoding = headerEncoding;

                        Response.AddHeader("Content-Disposition",
                            string.Format("attachment; filename{0}=\"", (IsFirefox() || IsMozilla()) ? "*" : "") + fileName + "\";");

                        binaryReader.BaseStream.Seek(0, SeekOrigin.Begin);
                        int iMaxCount = (int)Math.Ceiling((iFileLength + 0.0) / CHUNK_SIZE);
                        for (int i = 0; i < iMaxCount && Response.IsClientConnected; i++)
                        {
                            Response.BinaryWrite(binaryReader.ReadBytes(CHUNK_SIZE));
                            Response.Flush();
                        }
                        HttpContext.Current.ApplicationInstance.CompleteRequest();
                    }
                    finally
                    {
                        binaryReader.Close();
                    }
                    fileStream.Close();
                }
                finally
                {
                    fileStream.Dispose();
                }
            }
            else
            {
                Response.Write(string.Format(GetLocalResourceObject("Error_RequestedFileNotFound_lz").ToString() + "\r\n{0}" +
                    GetLocalResourceObject("Error_RequestedFileNotFoundName_lz").ToString() + "\r\n{1}",
                        fileName, filePath.Replace("\\\\", "\\") + fileName));
            }
        }
        catch (Exception ex)
        {
            Response.ContentType = "text/html";
            if (ex.Message.IndexOf("because it is being used by another") > 0)
            {
                Response.Write(string.Format(GetLocalResourceObject("Error_FileInUse_lz").ToString() + "\r\n{0}", ex.Message));
            }
            else
            {
                Response.Write(string.Format(GetLocalResourceObject("Error_NoFileRequested_lz").ToString() + "\r\n{0}",
                        Request.PathInfo + "?" + Request.QueryString));
            }
        }
    }

    /// <summary>
    /// Returns a name that can be used as a valid file name.
    /// </summary>
    /// <param name="name">The name.</param>
    /// <returns></returns>
    private static string MakeValidFileName(string name)
    {
        const string BAD_FILENAME_CHARS = "\\/:*?\"<>|";
        if (!string.IsNullOrEmpty(name))
        {
            char[] badChars = BAD_FILENAME_CHARS.ToCharArray();
            char[] nameChars = name.ToCharArray();
            int i = 0;
            bool bModified = false;
            foreach (char chName in nameChars)
            {
                foreach (char chBad in badChars)
                {
                    if (chName.Equals(chBad))
                    {
                        nameChars[i] = '_';
                        bModified = true;
                        break;
                    }
                }
                i++;
            }
            if (bModified)
            {
                return new string(nameChars);
            }
        }
        return name;
    }

    /// <summary>
    /// Determines if the client browser is Mozilla.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if the client browser is Mozilla; otherwise, <c>false</c>.
    /// </returns>
    private bool IsMozilla()
    {
        string strUpperUserAgent = Request.UserAgent;
        if (!string.IsNullOrEmpty(strUpperUserAgent))
        {
            return ((strUpperUserAgent.Contains("MOZILLA")).Equals(true) &&
                    (strUpperUserAgent.Contains("COMPATIBLE;")).Equals(false));
        }
        return false;
    }

    /// <summary>
    /// Determines if the client browser is IE.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if the client browser is IE; otherwise, <c>false</c>.
    /// </returns>
    private bool IsIE()
    {
        return Request.Browser.Browser.ToUpper().Equals("IE");
    }

    /// <summary>
    /// Determines if the client browser is Firefox.
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if the client browser is Firefox; otherwise, <c>false</c>.
    /// </returns>
    private bool IsFirefox()
    {
        return Request.Browser.Browser.ToUpper().Equals("FIREFOX");
    }

    /// <summary>
    /// Gets the MIME from reg.
    /// </summary>
    /// <param name="aExt">A ext.</param>
    /// <returns></returns>
    protected static String GetMIMEFromReg(String aExt)
    {
        string result = "";
        RegistryKey rootkey = Registry.ClassesRoot.OpenSubKey(aExt, false);
        if (rootkey != null)
        {
            object key = rootkey.GetValue("Content Type");
            if (key != null)
                result = key.ToString();
            if (result == "")
            {
                switch (aExt)
                {
                    case ".xslx":
                        result = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        break;
                    case ".docm":
                        result = "application/vnd.ms-word.document.macroEnabled.12";
                        break;
                    case ".docx":
                        result = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        break;
                    case ".dotm":
                        result = "application/vnd.ms-word.template.macroEnabled.12";
                        break;
                    case ".dotx":
                        result = "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
                        break;
                    case ".ppsm":
                        result = "application/vnd.ms-powerpoint.slideshow.macroEnabled.12";
                        break;
                    case ".ppsx":
                        result = "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
                        break;
                    case ".pptm":
                        result = "application/vnd.ms-powerpoint.presentation.macroEnabled.12";
                        break;
                    case ".pptx":
                        result = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                        break;
                    case ".xlsb":
                        result = "application/vnd.ms-excel.sheet.binary.macroEnabled.12";
                        break;
                    case ".xlsm":
                        result = "application/vnd.ms-excel.sheet.macroEnabled.12";
                        break;
                    case ".xlsx":
                        result = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        break;
                    case ".xps":
                        result = "application/vnd.ms-xpsdocument";
                        break;
                    default:
                        result = "application/octet-stream";
                        break;
                }
            }
        }
        return result;
    }
}