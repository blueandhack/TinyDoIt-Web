TinyDoIt Web App
================

![Logo](https://raw.githubusercontent.com/blueandhack/TinyDoItWeb/master/public/images/favicon.png)

[**TinyDoIt(微动)**](http://tinydoit.com) Web App 是一款在线任务管理应用，我们的目的是，将您的行动记录下来，并一一完成他们，我们不同的地方在于，我们拥有ShareCircle（共享圈），让您与您的团队分享任务，共同探讨分享的任务并完成他们。您可以将您觉得有意思的任务、应该做的任务分享到共享圈里，与您的团队成员一起分享，您也可以选择他人分享的任务模板，快速创建自己的任务。

如何使用？
----------
您需要安装[nodejs](http://nodejs.org/download/)、[mongodb](http://www.mongodb.org/downloads)以及web服务器，也许您需要一台VPS或者其他云服务来部署此应用。
或者，您并不需要部署，您也可以使用，只需访问我们的在线平台注册即可。
我们的在线地址：[**TinyDoIt(微动)**](http://tinydoit.com)

管理员控制面板如何使用
------------------------
在未配置管理员控制面板的网站，请输入

    http://您的网站地址/admin/config

按照提示对您的网站管理员控制面板进行配置

在何种情境下使用？
-----------------
*   小组协作设计
*   个人减肥计划
*   作业完成情况记录
*   ...

依赖的模块
----------

    connect             2.14.3
    express             3.4.8
    jade                1.3.0
    moment              2.5.1
    mongodb             1.4.0
    mongoose            3.8.8
    session-mongoose    0.4.1

如何部署？
---------
最简单的方法，您可以在您的本地计算机中运行此应用，在cmd中打开应用所在文件夹，例如我的app.js文件在F盘TinyDoItWeb目录下

    F:
    cd TinyDoItWeb
    npm install
    node app.js

之后您就可以在您的本地计算机中的网页浏览器中输入

    http://127.0.0.1:3000

即可访问此应用（默认端口为3000）

更新日志
-------
v1.0.1

+ 添加管理员后台

v0.1.1

+ 基本功能实现，初始版本

如何联系我
---------

+ [我的博客](http://blueandhack.com)
+ [基于此应用的网站](http://tinydoit.com)
+ 我的邮箱 blueandhack # gmail.com

感谢
----

+ 感谢[女朋友](http://yogashirley.com)一直对我的支持
+ 感谢Logo设计者 [iMc](http://www.7imc.com/)

协议
-----
遵守MIT协议