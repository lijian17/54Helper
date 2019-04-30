(function() {
	// 两侧对联广告(二维码)	
	function createAD() {
		var ad = '<div id="ad_left" style="position:fixed;bottom:auto; top:0;  z-index:99999; margin-top:158px; left: 0px;">\n' +
			'	<a target="_blank" href="" style="display:block; cursor:pointer;"><img src="../static/img/alipay.png"></a>\n' +
			'	<a id="ad_left_a" style="display:block; cursor:pointer;">关闭</a>\n' +
			'</div>\n' +
			'<div id="ad_right" style="position:fixed;bottom:auto; top:0;  z-index:99999; margin-top:158px; right: 0px;">\n' +
			'	<a target="_blank" href="" style="display:block; cursor:pointer;"><img src="../static/img/wxpay.png"></a>\n' +
			'	<a id="ad_right_a" style="display:block; cursor:pointer;">关闭</a>\n' +
			'</div>';

		var span = document.createElement("span");
		span.innerHTML = ad;

		document.getElementsByTagName("body")[0].appendChild(span);
	}

	function ad_left() {
		document.getElementById('ad_left').style.display = "none";
	}

	function ad_right() {
		document.getElementById('ad_right').style.display = "none";
	}

	function init() {
		createAD();
		document.getElementById("ad_left_a").addEventListener("click", ad_left, false);
		document.getElementById("ad_right_a").addEventListener("click", ad_right, false);
	}

	init();
})();