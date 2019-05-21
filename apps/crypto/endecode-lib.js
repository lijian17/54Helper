/**
 * 本库提供几个常用方法：
 * 1、enDecodeTools.coreValuesEncode(text); 将文本进行“社会主义核心价值观”编码并输出
 * 2、enDecodeTools.coreValuesDecode(text); 将经过“社会主义核心价值观”编码的文本进行“社会主义核心价值观”解码并输出
 */
module.exports = (() => {

	let _TEAencrypt = function(plaintext, password) {
		if(plaintext.length == 0) return '';// 没有要加密的内容
		// 该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： * @ - _ + . / 。
		// 其他所有的字符都会被转义序列替换。其中某些字符被替换成了十六进制的转义序列。
		// “escape”明文，使ISO-8859-1之外的字符以单字节打包方式工作，但将空格保留为空格（而不是“%20”），
		// 以便加密文本不会增长太长（快速和脏）
		let asciitext = escape(plaintext).replace(/%20/g, ' ');
		let v = _strToLongs(asciitext); // 将字符串转换为long数组
		if(v.length <= 1) v[1] = 0; // 算法不适用于n < 2，因此通过添加null来实现
		let k = _strToLongs(password.slice(0, 16)); // 只需将前16个密码转换为密钥即可
		let n = v.length;
		let z = v[n - 1], y = v[0], delta = 0x9E3779B9;
		let mx, e, q = Math.floor(6 + 52 / n), sum = 0;
		while(q-- > 0) { // 6+52/n操作给出每个单词6到32个混合词
			sum += delta;
			e = sum >>> 2 & 3;
			for(let p = 0; p < n; p++) {
				y = v[(p + 1) % n];
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
				z = v[p] += mx;
			}
		}
		let ciphertext = _longsToStr(v);
		return _escCtrlCh(ciphertext);
	};

	let _TEAdecrypt = function(ciphertext, password) {
		if(ciphertext.length == 0) return '';
		let v = _strToLongs(_unescCtrlCh(ciphertext));
		let k = _strToLongs(password.slice(0, 16));
		let n = v.length;

		let z = v[n - 1], y = v[0], delta = 0x9E3779B9;
		let mx, e, q = Math.floor(6 + 52 / n), sum = q * delta;

		while(sum != 0) {
			e = sum >>> 2 & 3;
			for(let p = n - 1; p >= 0; p--) {
				z = v[p > 0 ? p - 1 : n - 1];
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
				y = v[p] -= mx;
			}
			sum -= delta;
		}
		let plaintext = _longsToStr(v);
		// 从填充4个字符的块中去掉尾随的空字符：
		plaintext = plaintext.replace(/\0+$/, '');
		return unescape(plaintext);
	};

	let _strToLongs = function (s) { // 将字符串转换为long数组，每个包含4个字符
		// 注意字符必须在ISO-8859-1（Unicode代码点<256）内，以适合4 / long
		let l = new Array(Math.ceil(s.length / 4));
		for(let i = 0; i < l.length; i++) {
			// 注意little-endian编码 -  endianness是无关紧要的
			// 它在_longsToStr（）中是一样的
			l[i] = s.charCodeAt(i * 4) + (s.charCodeAt(i * 4 + 1) << 8) +
				(s.charCodeAt(i * 4 + 2) << 16) + (s.charCodeAt(i * 4 + 3) << 24);
		}
		return l; // 注意，在字符串末尾运行会生成空值，因为按位运算符将NaN视为0
	};

	let _longsToStr = function (l) { // 将long数组转换回字符串
		let a = new Array(l.length);
		for(let i = 0; i < l.length; i++) {
			a[i] = String.fromCharCode(l[i] & 0xFF, l[i] >>> 8 & 0xFF, l[i] >>> 16 & 0xFF, l[i] >>> 24 & 0xFF);
		}
		return a.join(''); // 使用Array.join()而不是重复的字符串追加来提高效率
	};

	let _escCtrlCh = function (str) { // escape控制字符等可能会导致加密文本出现问题
		return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, function(c) {
			return '!' + c.charCodeAt(0) + '!';
		});
	};

	let _unescCtrlCh = function (str) { // unescape可能有问题的空值和控制字符
		return str.replace(/!\d\d?\d?!/g, function(c) {
			// String.fromCharCode(n1, n2, ..., nX)将 Unicode 编码转换为一个字符串
			// arrayObject.slice(start,end)返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
			return String.fromCharCode(c.slice(1, -1));
		});
	};

	let _Base64 = function() {}
	_Base64.encodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	_Base64.decodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
		-1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, 
		-1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
		19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 
		35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	_Base64.encode = function(str) {
		let out, i, len;
		let c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len) {
				out += _Base64.encodeChars.charAt(c1 >> 2);
				out += _Base64.encodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len) {
				out += _Base64.encodeChars.charAt(c1 >> 2);
				out += _Base64.encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += _Base64.encodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += _Base64.encodeChars.charAt(c1 >> 2);
			out += _Base64.encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += _Base64.encodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += _Base64.encodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	_Base64.decode = function(str) {
		let c1, c2, c3, c4;
		let i, len, out;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			/* c1 */
			do {
				c1 = _Base64.decodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c1 == -1);
			if(c1 == -1)
				break;
			/* c2 */
			do {
				c2 = _Base64.decodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c2 == -1);
			if(c2 == -1)
				break;
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61)
					return out;
				c3 = _Base64.decodeChars[c3];
			}
			while (i < len && c3 == -1);
			if(c3 == -1)
				break;
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61)
					return out;
				c4 = _Base64.decodeChars[c4];
			}
			while (i < len && c4 == -1);
			if(c4 == -1)
				break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}

	_Base64.utf16to8 = function(str) {
		let out, i, len, c;
		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if(c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	}

	_Base64.utf8to16 = function(str) {
		let out, i, len, c;
		let char2, char3;
		out = "";
		len = str.length;
		i = 0;
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12:
				case 13:
					// 110x xxxx    10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx   10xx xxxx   10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}
	
	/**
	 * 加密
	 * 
	 * @param {Object} plaintext 明文
	 * @param {Object} pwd 密码
	 */
	let _encrypt = function (plaintext, pwd) {
		return _Base64.encode(_Base64.utf16to8(_TEAencrypt(plaintext, pwd)));
	};
	
	/**
	 * 解密
	 * 
	 * @param {Object} ciphertext 密文
	 * @param {Object} pwd 密码
	 */
	let _decrypt = function (ciphertext, pwd) {
		return _TEAdecrypt(_Base64.utf8to16(_Base64.decode(ciphertext)), pwd);
	};

	return {
		TEAencrypt: _TEAencrypt,
		TEAdecrypt: _TEAdecrypt,
		encrypt: _encrypt,
		decrypt: _decrypt
	};
})();