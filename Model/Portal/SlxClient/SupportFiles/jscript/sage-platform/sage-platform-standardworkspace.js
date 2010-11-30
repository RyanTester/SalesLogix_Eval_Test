var imgCollapse = new Image();
imgCollapse.src = "images/collapsedark.gif";
var imgExpand = new Image();
imgExpand.src = "images/expanddark.gif";

function toggleSmartPartVisiblity(contentID, img){
    var content = document.getElementById(contentID);
    if(content.style.display =="none"){
        content.style.display = "block";
    }
    else{
        content.style.display = "none";
    }
    if(img.src == imgCollapse.src){
        img.src = imgExpand.src;
    }
    else{
        img.src = imgCollapse.src;
    }
}
