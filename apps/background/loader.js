(function() {
	/**
	 * 动态加载一个js/css文件
	 * 
	 * @param {Object} filetype
	 * @param {Object} filename
	 */
	function loadjscssfile(filetype, filename) {
		if(filetype == "js") {
			var fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		} else if(filetype == "css") {
			var fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if(typeof fileref != "undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}

	/**
	 * 移动已经加载过的js/css
	 * 
	 * @param {Object} filetype
	 * @param {Object} filename
	 */
	function removejscssfile(filetype, filename) {
		var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
		var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
		var allsuspects = document.getElementsByTagName(targetelement);
		for(var i = allsuspects.length; i >= 0; i--) {
			if(allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
				allsuspects[i].parentNode.removeChild(allsuspects[i]);
			}
		}
	}

	function init() {
		var GOOGLE_ASSISTANT = localStorage['GOOGLE_ASSISTANT'] == 'true' ? true : false;
		console.log('GOOGLE_ASSISTANT3: ' + GOOGLE_ASSISTANT);
		//		      "google-assistant/lib/sea.js",
		//    "google-assistant/bg.js",
		if(GOOGLE_ASSISTANT) {
			loadjscssfile('js', '../google-assistant/lib/sea.js');
			loadjscssfile('js', '../google-assistant/bg.js');
		} else {
			removejscssfile('js', '../google-assistant/lib/sea.js');
			removejscssfile('js', '../google-assistant/bg.js');
		}
	}
	
	init();
})();