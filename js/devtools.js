// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('RequestTool', 'img/icon.png', 'mypanel.html', function(panel)
{
	window.open(chrome.extension.getURL('background.html'));
});