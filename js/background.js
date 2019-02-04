let requestList = [];
let requestCount = 0;
let status = false;
let controlTimer = {};

//-------------------- 右键菜单 ------------------------//
chrome.contextMenus.create({
	title: "open Requestool's workpage",
	onclick: function(){
		window.open(chrome.extension.getURL('background.html'));
	}
});

// 监听请求
messageListener = function(request, sender, sendResponse)
{
	console.log('get message from devtool');
	request.repeatTimes = 1;
	request.gapTime = 1000;
	request.sendCount = 0;
	request.successCount = 0;
	request.failCount = 0;
	request.timer = {};
	request.sendFlag = false;
	request.successCheck = "";
	request.failCheck = "";
	requestList.push(request);
	requestList[requestList.length-1]
	let tmp = 
	`<tr id="${requestCount}_table">
	<td>${requestCount}</td>
	<td>${request.request.url.length<=20?request.request.url:request.request.url.substring(0,20)+'...'}</td>
	<td>${request.request.method}</td>
	<td>${request.response.status}</td>
	<td id="${requestCount}_success">0</td>
	<td id="${requestCount}_fail">0</td>
	<td><input type="number" class="form-control" id="${requestCount}_repeat"></td>
	<td><input type="number" class="form-control" id="${requestCount}_timeInterval"></td>
	<td><input type="text" class="form-control" id="${requestCount}_successcheck"></td>
	<td><input type="text" class="form-control" id="${requestCount}_failcheck"></td>
	<td><button type="button" class="btn btn-primary" id="${requestCount}_delete">delete</button></td>
	</tr>`;
	$('#table_body').append(tmp);
	$(`#${requestCount}_repeat`).prop('value', request.repeatTimes);
	$(`#${requestCount}_timeInterval`).prop('value', request.gapTime);
	$(`#${requestCount}_successcheck`).prop('value', request.successCheck);
	$(`#${requestCount}_failcheck`).prop('value', request.failCheck);
	requestCount += 1;
	$('#data_box').text(`Load ${requestCount} requests`);
	sendResponse('success');
	console.log(requestList);
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(messageListener);

// 停止发送状态
stopRequest = function(e) {
	$('input').removeAttr('disabled');
	$('button').removeAttr('disabled');
	status = false;
	chrome.runtime.onMessage.addListener(messageListener);
	$('#send_request').text('begin send');
	clearInterval(controlTimer);
	alert(e);
}

// 发送请求处理
$('#send_request').click(()=>{
	console.log(status, requestList);
	status = !status;
	$('#send_request').text(status?'stop send':'bedin send');
	if(status){
		chrome.runtime.onMessage.removeListener(messageListener);
		alert(`${requestCount} tasks are about to begin`);
		$('input').attr('disabled', 'disabled');
		// $('button').attr('disabled', 'disabled');
		controlTimer = setInterval(
			function() {
				let flag = false;
				requestList.forEach((value)=>{
					if(value.sendFlag){
						flag = true;
					}
				});
				if(!flag) {
					stopRequest('finish');
				}
			},500
		);
		requestList.forEach(function(value, index){
			value.sendFlag = true;
			let requestData = value.request;
			let headerData = {};
			requestList[index].request.headers.forEach(function(vvalue){
				headerData[vvalue.name]=vvalue.value;
			});
			requestList[index].timer = setInterval(
				function() {
					// let flag = false;
					$.ajax(
						{
							url:requestData.url,
							type:requestData.method,
							dateType:'json',
							headers:headerData,
							data:typeof(requestData.postData)==='undefined'?undefined:requestData.postData.text,
							success:function(data){
								// flag = true;
								let tmp = JSON.stringify(data);
								if (!tmp) tmp = 'The request has no respond data available.';
								tmp = tmp.length>=150?tmp.substring(0,150)+'...':tmp;
								$(`#card`).append(
									`<br><p style="color: green;">------respondData of task ${index}------</p><br><p>${tmp}</p>`
								);
								requestList[index].successCount+=1;
								$(`#${index}_success`).text(requestList[index].successCount);
								console.log(data)
								// 执行自定义脚本
								if(requestList[index].successCheck!==""){
									try {
										let customCheck = JSON.parse(requestList[index].successCheck);
										console.log(customCheck);
										for (let key in data) {
											if (data.hasOwnProperty(key)&&customCheck.hasOwnProperty(key)) {
												if(data[key]===customCheck[key]){
													clearInterval(requestList[index].timer);
													stopRequest(`stopped by custom success check: ${key}`);
												}
											}
										}
									} catch (error) {
										clearInterval(requestList[index].timer);
										stopRequest(`custom success check error: ${error}`);
									}
								}
							},
							error:function(data){
								// flag = false;
								let tmp = JSON.stringify(data);
								if (!tmp) tmp = 'The request has no respond data available.';
								tmp = tmp.length>=150?tmp.substring(0,150)+'...':tmp;
								$(`#card`).append(
									`<br><p style="color: red;">------respondData of task ${index}------</p><br><p>${tmp}</p>`
								);
								requestList[index].failCount+=1;
								$(`#${index}_fail`).text(requestList[index].failCount);
								// 执行自定义脚本
								if(requestList[index].failCheck!==""){
									try {
										let customCheck = JSON.parse(requestList[index].failCheck);
										console.log(customCheck);
										for (let key in data) {
											if (data.hasOwnProperty(key)&&customCheck.hasOwnProperty(key)) {
												if(data[key]===customCheck[key]){
													clearInterval(requestList[index].timer);
													stopRequest(`stopped by custom fail check: ${key}`);
												}
											}
										}
									} catch (error) {
										clearInterval(requestList[index].timer);
										stopRequest(`custom success check error: ${error}`);
									}
								}
							},
						}
					);
					requestList[index].sendCount+=1;
					if(requestList[index].sendCount>=requestList[index].repeatTimes){
						clearInterval(requestList[index].timer);
						requestList[index].sendFlag = false;
					}
				},requestList[index].gapTime
			);
		})
	}
	else {
		stopRequest('over');
	}
});

// 删除列表项
$('body').on('click', 'td button', (e)=>{
	// console.error(e);
	let index = parseInt(e.currentTarget.id.split('_')[0]);
	requestList.splice(index, 1);
	requestCount -= 1;
	$(`#${index}_table`).remove();
	$('#data_box').text(`Load ${requestCount} requests`);
});

// 输入框事件
$('body').on('input', 'td input', (e)=>{
	// console.log(e);
	let index = parseInt(e.currentTarget.id.split('_')[0]);
	switch (e.currentTarget.id.split('_')[1]){
		case 'repeat': {
			requestList[index].repeatTimes = e.currentTarget.valueAsNumber;
			break;
		}
		case 'timeInterval': {
			requestList[index].gapTime = e.currentTarget.valueAsNumber;
			break;
		}
		case 'successcheck': {
			requestList[index].successCheck = e.currentTarget.value;
			break;
		}
		case 'failcheck': {
			requestList[index].failCheck = e.currentTarget.value;
			break;
		}
		default: break;
	}
	
});

$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
})

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});