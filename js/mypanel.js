// var devtoolsData={
// 	status: false,
// 	requestCount: 0,
// 	requestList: []
// };
let status = false;
let requestCount = 0;
let choosen = {};
let requestList = [];

function openWorkpage () {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && tab.url==chrome.extension.getURL('background.html')) {
				console.log(chrome.extension.getURL('background.html'), tab.url);
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
		chrome.tabs.create({url: chrome.extension.getURL('background.html')});
	});
}

requestListener = function(request){
	requestCount += 1;
	$('#data_box').text('catch data'+requestCount);
	requestList.push(request);
	console.error(request);
	let tmp = 
	`<tr>
	<td>${requestCount}</td>
	<td>${request.request.url}</td>
	<td>${request.request.method}</td>
	<td>${JSON.stringify(request.request.queryString)}</td>
	<td><button type="button" class="btn btn-default" id="${requestCount}">select</button></td>
	</tr>`;
	$('#table_body').append(tmp);
}

// 监听请求
$('#listen_request').click(()=>{
	status = !status;
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && tab.url==chrome.extension.getURL('background.html')) {
				console.log(chrome.extension.getURL('background.html'), tab.url);
				// chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
		chrome.tabs.create({url: chrome.extension.getURL('background.html')});
	});
	$('#listen_request').text(status?'stop listening':'start listening');
	$('#listen_request').attr("class", function(i,origValue){
		return status?'btn btn-danger':'btn btn-success';
	});
	if(status){
		chrome.devtools.network.onRequestFinished.addListener(requestListener);
	}
	else {
		chrome.devtools.network
		.onRequestFinished.removeListener(requestListener);
	}
});

$('body').on('click', 'td button', function (e){
	// console.error(e);
	choosen = requestList[parseInt(e.currentTarget.id)-1];
	// $('#choosen').text(`The ${e.currentTarget.id}th request is selected.`);
	$(this).text(`selected`);
	// $(this).attr(`disabled`, `true`);
	$(this).attr("class", 'btn btn-success');
	chrome.runtime.sendMessage(choosen);
	$("#alert").append(`<div class="alert alert-success alert-dismissible" role="alert">
	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	<strong>Success</strong> Request ${e.currentTarget.id} is selected.
	<button type="button" class="btn btn-success" id="open_background">open workpage</button>
  	</div>
	`)
	$('#open_background').click(e => {
		openWorkpage();
	});
	// alert('Selected requests are recorded. Please switch to Requestool workpage to continue.');
	// window.open(chrome.extension.getURL('background.html'));
});
