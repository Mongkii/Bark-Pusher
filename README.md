# Bark Pusher

> 一个将网页内容推送到 Bark 的 Chrome 扩展。

> A Chrome extension to push content to iOS via Bark app.

## 介绍

Bark 是一款开源的 iOS app，可以推送你自定义的消息到设备上。

[Bark 下载地址](https://apps.apple.com/cn/app/id1403753865)

[Bark 的 GitHub 页面](https://github.com/Finb/Bark)

本扩展的功能就是将网页中的信息，通过 Bark 推送到 iOS 端。

**功能：**

* 支持推送网址、选中文本、剪贴板、自定义文本等。
* 支持多设备推送。

## 安装

### 在线安装（推荐）

* 从 [Chrome 应用商店](https://chrome.google.com/webstore/detail/poomlolhjphfnijbbhplbggnddahgdpp/)下载

### 本地安装

* 在 [Release 页面](https://github.com/Mongkii/Bark-Pusher/releases)下载 `Bash_Pusher.zip` 并解压。打开 Chrome 的「扩展程序」页面，启用开发者模式。点击「加载已解压的扩展程序」，选择解压的文件夹。
* 在 [Release 页面](https://github.com/Mongkii/Bark-Pusher/releases)下载 `Bash_Pusher.crx` 并安装。最新版 Chrome 已禁止直接安装 crx 格式扩展，请自行寻找安装方法。

## 使用

### 使用前的准备

1. 确认已在 iOS 端的 Bark 上注册了推送 URL
2. 在扩展的设置页面输入推送 URL，添加设备

### 右键菜单

* 在链接上右击，可将该链接推送至默认设备
* 选中文字后右击，将选择的文字推送至默认设备
* 其他情况下，推送当前页面网址至默认设备
----
*\* 默认设备可在扩展的设置页面切换*

### 菜单栏图标

* 点击图标进入推送界面。支持推送当前页面网址、剪贴板内容和自定义文字
* 有多个设备时，可在界面最上方选择推送目标设备
* 点击界面最下方的「设置」按钮进入设置界面

## 致谢

本扩展的图标中所使用的 Bark 元素，已得到 Bark 作者授权。

项目使用的 iconfont 来自[阿里巴巴矢量图标库](https://www.iconfont.cn)中的「淘票票官方图标库」和「千牛图标库」。