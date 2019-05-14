/**
 * 54Helper 信息编解码
 */
new Vue({
	el: '#pageContainer',
	data: {
		selectedType: 'coreValuesEncode',
		sourceContent: '',
		resultContent: ''
	},

	mounted: function() {
		let MSG_TYPE = Tarp.require('../static/js/msg_type');

		// 在tab创建或者更新时候，监听事件，看看是否有参数传递过来
		chrome.runtime.onMessage.addListener((request, sender, callback) => {
			if(request.type === MSG_TYPE.TAB_CREATED_OR_UPDATED && request.event === MSG_TYPE.EN_DECODE) {
				if(request.content) {
					this.sourceContent = request.content;
					this.convert();
				}
			}
		});

		this.$refs.srcText.focus();
	},
	methods: {
		convert: function() {
			this.$nextTick(() => {

				let tools = Tarp.require('./endecode-lib');

				if(this.selectedType === 'coreValuesEncode') {
					this.resultContent = tools.coreValuesEncode(this.sourceContent);
				} else if(this.selectedType === 'coreValuesDecode') {
					this.resultContent = tools.coreValuesDecode(this.sourceContent.replace(/\\U/g, '\\u'));
				}
			});
		},

		clear: function() {
			this.sourceContent = '';
			this.resultContent = '';
		},

		getResult: function() {
			this.$refs.rstCode.select();
		}
	}
});