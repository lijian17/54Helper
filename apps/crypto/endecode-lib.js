/**
 * 本库提供几个常用方法：
 * 1、enDecodeTools.coreValuesEncode(text); 将文本进行“社会主义核心价值观”编码并输出
 * 2、enDecodeTools.coreValuesDecode(text); 将经过“社会主义核心价值观”编码的文本进行“社会主义核心价值观”解码并输出
 */
module.exports = (() => {

	let _TEAencrypt = function(plaintext, password) {
		if(plaintext.length == 0) return(''); // nothing to encrypt
		// 'escape' plaintext so chars outside ISO-8859-1 work in single-byte packing, but keep
		// spaces as spaces (not '%20') so encrypted text doesn't grow too long (quick & dirty)
		var asciitext = escape(plaintext).replace(/%20/g, ' ');
		var v = _strToLongs(asciitext); // convert string to array of longs
		if(v.length <= 1) v[1] = 0; // algorithm doesn't work for n<2 so fudge by adding a null
		var k = _strToLongs(password.slice(0, 16)); // simply convert first 16 chars of password as key
		var n = v.length;

		var z = v[n - 1],
			y = v[0],
			delta = 0x9E3779B9;
		var mx, e, q = Math.floor(6 + 52 / n),
			sum = 0;

		while(q-- > 0) { // 6 + 52/n operations gives between 6 & 32 mixes on each word
			sum += delta;
			e = sum >>> 2 & 3;
			for(var p = 0; p < n; p++) {
				y = v[(p + 1) % n];
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
				z = v[p] += mx;
			}
		}
		var ciphertext = _longsToStr(v);
		return _escCtrlCh(ciphertext);
	};

	//
	// TEAdecrypt: Use Corrected Block TEA to decrypt ciphertext using password
	//
	let _TEAdecrypt = function(ciphertext, password) {
		if(ciphertext.length == 0) return('');
		var v = _strToLongs(_unescCtrlCh(ciphertext));
		var k = _strToLongs(password.slice(0, 16));
		var n = v.length;

		var z = v[n - 1],
			y = v[0],
			delta = 0x9E3779B9;
		var mx, e, q = Math.floor(6 + 52 / n),
			sum = q * delta;

		while(sum != 0) {
			e = sum >>> 2 & 3;
			for(var p = n - 1; p >= 0; p--) {
				z = v[p > 0 ? p - 1 : n - 1];
				mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
				y = v[p] -= mx;
			}
			sum -= delta;
		}
		var plaintext = _longsToStr(v);
		// strip trailing null chars resulting from filling 4-char blocks:
		plaintext = plaintext.replace(/\0+$/, '');
		return unescape(plaintext);
	};

	// supporting functions

	let _strToLongs = function (s) { // convert string to array of longs, each containing 4 chars
		// note chars must be within ISO-8859-1 (with Unicode code-point < 256) to fit 4/long
		var l = new Array(Math.ceil(s.length / 4));
		for(var i = 0; i < l.length; i++) {
			// note little-endian encoding - endianness is irrelevant as long as 
			// it is the same in _longsToStr() 
			l[i] = s.charCodeAt(i * 4) + (s.charCodeAt(i * 4 + 1) << 8) +
				(s.charCodeAt(i * 4 + 2) << 16) + (s.charCodeAt(i * 4 + 3) << 24);
		}
		return l; // note running off the end of the string generates nulls since 
	}; // bitwise operators treat NaN as 0

	let _longsToStr = function (l) { // convert array of longs back to string
		var a = new Array(l.length);
		for(var i = 0; i < l.length; i++) {
			a[i] = String.fromCharCode(l[i] & 0xFF, l[i] >>> 8 & 0xFF,
				l[i] >>> 16 & 0xFF, l[i] >>> 24 & 0xFF);
		}
		return a.join(''); // use Array.join() rather than repeated string appends for efficiency
	};

	let _escCtrlCh = function (str) { // escape control chars etc which might cause problems with encrypted texts
		return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, function(c) {
			return '!' + c.charCodeAt(0) + '!';
		});
	};

	let _unescCtrlCh = function (str) { // unescape potentially problematic nulls and control characters
		return str.replace(/!\d\d?\d?!/g, function(c) {
			return String.fromCharCode(c.slice(1, -1));
		});
	};

	var _Base64 = function() {}
	_Base64.encodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	_Base64.decodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
		63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
		19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28,
		29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
		48, 49, 50, 51, -1, -1, -1, -1, -1);

	_Base64.encode = function(str) {
		var out, i, len;
		var c1, c2, c3;

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
				out += _Base64.encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >>
					4));
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
		var c1, c2, c3, c4;
		var i, len, out;

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
		var out, i, len, c;

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
		var out, i, len, c;
		var char2, char3;

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
					out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) <<
						6) | ((char3 & 0x3F) << 0));
					break;
			}
		}

		return out;
	}

	function doSecure() {
		var str = TEAencrypt(document.getElementById("txtUnsecure").value, document.getElementById("txtPassw").value);
		document.getElementById("txtSecure").value = _Base64.encode(_Base64.utf16to8(str));
	}

	function doUnsecure() {
		var str = _Base64.utf8to16(_Base64.decode(document.getElementById("txtSecure").value));
		document.getElementById("txtUnsecure").value = TEAdecrypt(str, document.getElementById("txtPassw").value);
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
		return _TEAencrypt(_Base64.utf8to16(_Base64.decode(ciphertext)), pwd);
	};

	return {
		TEAencrypt: _TEAencrypt,
		TEAdecrypt: _TEAdecrypt,
		encrypt: _encrypt,
		decrypt: _decrypt
	};
})();