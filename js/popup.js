$(function() {
	// // 加载设置
	// var defaultConfig = {color: 'white'}; // 默认配置
	// chrome.storage.sync.get(defaultConfig, function(items) {
	// 	document.body.style.backgroundColor = items.color;
	// });
});

// 打开后台页
$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});

$('#open_github').click(e => {
	window.open('https://github.com/windingwind/Requestool');
})
