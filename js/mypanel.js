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
	$('#data_box').text('catch data'+requestCount);
	requestList.push(request);
	// console.error(request);
	let tmp = 
	`<tr>
	<td>${requestCount}</td>
	<td data-toggle="tooltip" data-placement="top" title="${request.request.url}">${request.request.url.length<=20?request.request.url:request.request.url.substring(0,20)+'...'}</td>
	<td>${request.request.method}</td>
	<td>${request.response.status}</td>
	<td><button type="button" class="btn btn-primary" id="${requestCount}">choose</button></td>
	</tr>`;
	$('#table_body').append(tmp);
}

// 监听
$('#listen_request').click(()=>{
	status = !status;
	$('#listen_request').text(status?'stop listen':'begin listen');
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
	$('#choosen').text(`choose the ${e.currentTarget.id}th request`);
	console.warn(choosen);
	chrome.runtime.sendMessage(choosen);
	alert('OK.Please go to Requestool workpage to continue.');
	// window.open(chrome.extension.getURL('background.html'));
});

$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
})
