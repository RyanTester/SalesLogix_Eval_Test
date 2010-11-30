<?xml version="1.0" encoding="utf-8"?>
<project path="" name="SagePlatform" author="Sage Software" version="7.5.2" copyright="$projectName&#xD;&#xA;Copyright(c) 2009, $author." output="$project\sage-platform" source="False" source-dir="$output\source" minify="true" min-dir="$output\docs" doc="False" doc-dir="$output\docs" master="true" master-file="$output\yui-ext.js" zip="true" zip-file="$output\yuo-ext.$version.zip">
  <directory name="sage-platform" />
  <file name="sage-platform\sage-platform-clientbindingmgr.js" path="" />
  <file name="sage-platform\sage-platform-clientcontext.js" path="" />
  <file name="sage-platform\sage-platform-cliententitycontext.js" path="" />
  <file name="sage-platform\sage-platform-clientmessageservice.js" path="" />
  <file name="sage-platform\sage-platform-dashboardworkspace.js" path="" />
  <file name="sage-platform\sage-platform-dialogworkspace.js" path="" />
  <file name="sage-platform\sage-platform-maincontentworkspace.js" path="" />
  <file name="sage-platform\sage-platform-servicecontainer.js" path="" />
  <file name="sage-platform\sage-platform-standardworkspace.js" path="" />
  <file name="sage-platform\sage-platform-tabworkspace.js" path="" />
  <file name="sage-platform\sage-platform-taskpaneworkspace.js" path="" />
  <target name="Sage Platform" file="$output\sage-platform.js" debug="True" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="sage-platform\sage-platform-servicecontainer.js" />
    <include name="sage-platform\sage-platform-clientbindingmgr.js" />
    <include name="sage-platform\sage-platform-clientcontext.js" />
    <include name="sage-platform\sage-platform-cliententitycontext.js" />
    <include name="sage-platform\sage-platform-clientmessageservice.js" />
    <include name="sage-platform\sage-platform-dashboardworkspace.js" />
    <include name="sage-platform\sage-platform-dialogworkspace.js" />
    <include name="sage-platform\sage-platform-maincontentworkspace.js" />
    <include name="sage-platform\sage-platform-standardworkspace.js" />
    <include name="sage-platform\sage-platform-tabworkspace.js" />
    <include name="sage-platform\sage-platform-taskpaneworkspace.js" />
  </target>
</project>