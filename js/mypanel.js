// var devtoolsData={
// 	status: false,
// 	requestCount: 0,
// 	requestList: []
// };
let status = false;
let requestCount = 0;
let choosen = {};
let requestList = [];



requestListener = function(request){
	requestCount += 1;
	$('#data_box').text('监听到数据'+requestCount+'条');
	requestList.push(request);
	// console.error(request);
	let tmp = 
	`<tr>
	<td>${requestCount}</td>
	<td>${request.request.url.length<=20?request.request.url:request.request.url.substring(0,20)+'...'}</td>
	<td>${request.request.method}</td>
	<td>${request.response.status}</td>
	<td><button type="button" class="btn btn-primary" id="${requestCount}">选择</button></td>
	</tr>`;
	$('#table_body').append(tmp);
}

// 监听
$('#listen_request').click(()=>{
	status = !status;
	$('#listen_request').text(status?'停止监听':'开始监听');
	if(status){
		chrome.devtools.network.onRequestFinished.addListener(requestListener);
	}
	else {
		chrome.devtools.network.onRequestFinished.removeListener(requestListener);
	}
});

$('body').on('click', 'td button', (e)=>{
	// console.error(e);
	choosen = requestList[parseInt(e.currentTarget.id)-1];
	$('#choosen').text(`已选择第${e.currentTarget.id}条请求`);
	console.warn(choosen);
	chrome.runtime.sendMessage(choosen);
	alert('已完成记录。请在Requestool工作页面继续操作。');
	// window.open(chrome.extension.getURL('background.html'));
});
