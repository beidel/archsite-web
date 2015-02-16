	function viewTrans(alink, nid, path)
	{
		coords = getAnchorPosition(alink);
	
		document.getElementById("divNews").style.top = coords.y + 30 + 'px';
		document.getElementById("divNews").style.left = coords.x + 50 + 'px';
	
		showTrans(nid, path);
	}
	
	function hideTrans()
	{
		document.getElementById("divNews").innerHTML = "";
		document.getElementById("divNews").style.display = "none";
	}
	
	var xmlHttp, vContent;

	function GetXmlHttpObject()
	{ 
		var objXMLHttp = null;
		
		if (window.XMLHttpRequest)
			objXMLHttp = new XMLHttpRequest();
		else if (window.ActiveXObject)
			objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
		
		return objXMLHttp;
	}
	
	function stateChanged() 
	{
		if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete")
		{
			if (xmlHttp.responseText != "")
			{
				document.getElementById("divNews").style.display = "block";
				document.getElementById("divNews").innerHTML = xmlHttp.responseText;
			}
		}
	}
	
	function showTrans(nid, path)
	{
		xmlHttp = GetXmlHttpObject();
	
		if (xmlHttp == null)
		{
			alert ("Browser does not support HTTP Request");
			return;
		}
	
		var url = path + "portal2/admin/ajax/loadnews.php?nid=" + nid;
	
		xmlHttp.onreadystatechange = stateChanged;
		xmlHttp.open("GET",url,true);
		xmlHttp.send(null);
	}