<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:param name="hrefPrefix">content</xsl:param>
	<xsl:param name="relativeURL">~\help\</xsl:param>
	<xsl:param name="mappedURL">D:\PData\Code\TempDev_BranchWork\SlxClient3\help\</xsl:param>

	<xsl:template match="/">
		<html>
			<body>
				<xsl:for-each select="searchResults/page">
					<xsl:sort select="@hitScore" data-type="number" order="descending"/>
					<div>
						<xsl:variable name="newHref">
							<xsl:call-template name="replace-string">
								<xsl:with-param name="text" select="@href"/>
								<xsl:with-param name="from" select="$mappedURL"/>
								<xsl:with-param name="to" select="$relativeURL"/>
							</xsl:call-template>
						</xsl:variable>

						<xsl:element name="a">
							<xsl:attribute name="href">
								<xsl:value-of select="concat($hrefPrefix, $newHref)"/>
							</xsl:attribute>
							<b>
								<xsl:value-of select="@pageTitle"/>
							</b>
							<xsl:text> (Score=</xsl:text>
							<xsl:value-of select="@hitScore"/>
							<xsl:text>) </xsl:text>
						</xsl:element>
						
						<br/>
						<xsl:value-of select="@surroundingText"/>
						<br/>
						<br/>
					</div>
				</xsl:for-each>
			</body>
		</html>
	</xsl:template>

	<!-- reusable replace-string function -->
	<xsl:template name="replace-string">
		<xsl:param name="text"/>
		<xsl:param name="from"/>
		<xsl:param name="to"/>

		<xsl:choose>
			<xsl:when test="contains($text, $from)">

				<xsl:variable name="before" select="substring-before($text, $from)"/>
				<xsl:variable name="after" select="substring-after($text, $from)"/>
				<xsl:variable name="prefix" select="concat($before, $to)"/>

				<xsl:value-of select="$before"/>
				<xsl:value-of select="$to"/>
				<xsl:call-template name="replace-string">
					<xsl:with-param name="text" select="$after"/>
					<xsl:with-param name="from" select="$from"/>
					<xsl:with-param name="to" select="$to"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- test the function 
 <xsl:template match="/">
     <xsl:call-template name="replace-string">
        <xsl:with-param name="text" 
             select="'Mary had a little lamb, little lamb, little lamb.'"/>
        <xsl:with-param name="from" select="'little lamb'"/>
        <xsl:with-param name="to" select="'little steak'"/>
    </xsl:call-template>
 </xsl:template>-->
</xsl:stylesheet>