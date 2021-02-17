<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.FileNotFoundException"%>
<%@ page import="java.io.FileOutputStream"%>
<%@ page import="java.io.IOException"%>
<%@ page import="org.w3c.dom.*"%>
<%@ page import="org.xml.sax.SAXException"%>
<%@ page import="javax.xml.parsers.*"%>
<%@ page import="javax.xml.transform.*"%>
<%@ page import="javax.xml.transform.dom.DOMSource"%>
<%@ page import="javax.xml.transform.stream.*"%>
<%@ page import="javax.xml.xpath.*"%>

<%!
	  public static void output(Node node) {//将node的XML字符串输出到控制台
        TransformerFactory transFactory=TransformerFactory.newInstance();
        try {
            Transformer transformer = transFactory.newTransformer();
            transformer.setOutputProperty("encoding", "utf-8");
            transformer.setOutputProperty("indent", "yes");
            DOMSource source=new DOMSource();
            source.setNode(node);
            StreamResult result=new StreamResult();
            result.setOutputStream(System.out);
            
            transformer.transform(source, result);
        } catch (TransformerConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        }   
    }
    
    public static Node selectSingleNode(String express, Object source) {//查找节点，并返回第一个符合条件节点
        Node result=null;
        XPathFactory xpathFactory=XPathFactory.newInstance();
        XPath xpath=xpathFactory.newXPath();
        try {
            result=(Node) xpath.evaluate(express, source, XPathConstants.NODE);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }
        
        return result;
    }
    
    public static NodeList selectNodes(String express, Object source) {//查找节点，返回符合条件的节点集。
        NodeList result=null;
        XPathFactory xpathFactory=XPathFactory.newInstance();
        XPath xpath=xpathFactory.newXPath();
        try {
            result=(NodeList) xpath.evaluate(express, source, XPathConstants.NODESET);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }
        
        return result;
    }
    
    public static void saveXml(String fileName, Document doc) {//将Document输出到文件
        TransformerFactory transFactory=TransformerFactory.newInstance();
        try {
            Transformer transformer = transFactory.newTransformer();
            transformer.setOutputProperty("indent", "yes");
            DOMSource source=new DOMSource();
            source.setNode(doc);
            StreamResult result=new StreamResult();
            result.setOutputStream(new FileOutputStream(fileName));
            
            transformer.transform(source, result);
        } catch (TransformerConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }   
    }
%>
<%
	String icon=(String)request.getParameter("icon");
	String img_color=(String)request.getParameter("img_color");
	String bg=(String)request.getParameter("bg");
	String music_list=(String)request.getParameter("music_list");
	String isPlay_sound=(String)request.getParameter("isPlay_sound");
	String isPlay_music=(String)request.getParameter("isPlay_music");
	String volume_sound=(String)request.getParameter("volume_sound");
	String volume_music=(String)request.getParameter("volume_music");
	
	DocumentBuilderFactory factory=DocumentBuilderFactory.newInstance();
    Element theBook=null, theElem=null, root=null;
	try {
		factory.setIgnoringElementContentWhitespace(true);
        DocumentBuilder db=factory.newDocumentBuilder();
        Document xmldoc=db.parse(new File("../webapps/lianliankan/setUp.xml"));
        root=xmldoc.getDocumentElement();
	
		((Element)selectSingleNode("/setUp/img", root)).getElementsByTagName("icon").item(0).setTextContent(icon);
      	((Element)selectSingleNode("/setUp/img", root)).getElementsByTagName("img_color").item(0).setTextContent(img_color);
      	((Element)selectSingleNode("/setUp/background", root)).getElementsByTagName("bg").item(0).setTextContent(bg);
      	((Element)selectSingleNode("/setUp/music", root)).getElementsByTagName("music_list").item(0).setTextContent(music_list);
      	((Element)selectSingleNode("/setUp/volume", root)).getElementsByTagName("isPlay_sound").item(0).setTextContent(isPlay_sound);
      	((Element)selectSingleNode("/setUp/volume", root)).getElementsByTagName("isPlay_music").item(0).setTextContent(isPlay_music);
      	((Element)selectSingleNode("/setUp/volume", root)).getElementsByTagName("volume_sound").item(0).setTextContent(volume_sound);
      	((Element)selectSingleNode("/setUp/volume", root)).getElementsByTagName("volume_music").item(0).setTextContent(volume_music);
	
        saveXml("../webapps/lianliankan/setUp.xml", xmldoc);	
	} catch (Exception e) {
		e.printStackTrace();
	}
%>