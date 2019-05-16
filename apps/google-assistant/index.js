/**
 * 54Helper 谷歌访问助手
 */
new Vue({
	el: '#pageContainer',
	data: {
		iii: null,
		bgPage: null,
		popupMessage: '交流QQ群：216966558',
		offStatus: false,
		onStatus: false,
		tips: '',
		startP: false,
		stopP: false
	},

	created: function() {
		this.bgPage = chrome.extension.getBackgroundPage();
	},

	mounted: function() {
		this.show();
		this.iii = setInterval(this.show, 1e3);
	},

	methods: {
		show: function() {
			var e = this.bgPage.popupView;
			console.log("show:" + JSON.stringify(e));
			switch(e.status) {
				case "off":
					this.offStatus = true;
					this.onStatus = false;
					this.tips = e.warming;
					break;
				case "on":
					this.offStatus = false;
					this.onStatus = true;
					break;
				default:
					console.error("这错误不可能")
			}
//			this.popupMessage = localStorage["popup-message"];
			if(localStorage["stop-proxy"] && "true" == localStorage["stop-proxy"]) {
				this.startP = true;
				this.stopP = false;
			} else {
				this.startP = false;
				this.stopP = true;
			}
		},

		refreshF: function() {
			chrome.runtime.sendMessage({
				reqtype: "refresh"
			}, function() {});
		},

		restartF: function() {
			if(localStorage["auto-homepage"] && "true" == localStorage["auto-homepage"]) {
				chrome.runtime.reload()
			} else {
				this.offStatus = true;
				this.tips = "请你打开设置的主页，重启后检测<br>不到主页会激活失败！10秒后重启,请不要关闭页面";
				window.clearInterval(this.iii);
				setTimeout(function() {
					chrome.runtime.reload()
				}, 1e4);
			}
		},

		stopF: function() {
			chrome.runtime.sendMessage({
				reqtype: "stop"
			}, function() {});
		},

		startF: function() {
			chrome.runtime.sendMessage({
				reqtype: "start"
			}, function() {});
		}
	}
});