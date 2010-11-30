// ---------- Cross Browser XML parser ---------------------------------------
   	  
   function getNodeXML(aNode)
   {
        var xml;
        if (aNode.xml) {
            xml = aNode.xml;
        }
        else {   
            var objXMLSerializer = new XMLSerializer( );
            xml = objXMLSerializer.serializeToString(aNode);
        }
        return xml;
   }
   
   function getNodeText(aNode)
   {
        var text = "";
        if (aNode.text) {
            text = aNode.text;
        }
        else {  
            if (aNode.firstChild) {
                text = aNode.firstChild.nodeValue;
            }
        }
        return text;
   }
   
       
   function getXMLDoc(xmlString) { 
        var xmlDoc; 
        if (window.ActiveXObject) { 
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
            xmlDoc.async = false; 
            xmlDoc.loadXML(xmlString);
        } 
        else {
            var objDOMParser = new DOMParser();
            xmlDoc = objDOMParser.parseFromString(xmlString, "text/xml");
           
        } 
        return xmlDoc;
    }


