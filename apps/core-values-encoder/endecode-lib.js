/**
 * 本库提供几个常用方法：
 * 1、enDecodeTools.coreValuesEncode(text); 将文本进行“社会主义核心价值观”编码并输出
 * 2、enDecodeTools.coreValuesDecode(text); 将经过“社会主义核心价值观”编码的文本进行“社会主义核心价值观”解码并输出
 */
module.exports = (() => {
	const values = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';

	let assert = function (...express){
        const l = express.length;
        const msg = (typeof express[l-1] === 'string')? express[l-1]: 'Assert Error';
        for(let b of express){
            if(!b){
                throw new Error(msg);
            }
        }
    };

    let randBin = function randBin(){
        return Math.random() >= 0.5;
    };
    
    let str2utf8 = function (str){
        // return in hex
    
        const notEncoded = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]/g;
        const str1 = str.replace(notEncoded, c=>c.codePointAt(0).toString(16));
        let str2 = encodeURIComponent(str1);
        const concated = str2.replace(/%/g, '').toUpperCase();
        return concated;
    };

    let utf82str = function (utfs){
        assert(typeof utfs === 'string', 'utfs Error');

        const l = utfs.length;

        assert((l & 1) === 0);

        const splited = [];

        for(let i = 0; i < l; i++){
            if((i & 1) === 0){
                splited.push('%');
            }
            splited.push(utfs[i]);
        }

        return decodeURIComponent(splited.join(''));
    };

    let hex2duo = function (hexs){
        // duodecimal in array of number

        // '0'.. '9' -> 0.. 9
        // 'A'.. 'F' -> 10, c - 10    a2fFlag = 10
        //          or 11, c - 6      a2fFlag = 11
        assert(typeof hexs === 'string')

        const duo = [];

        for(let c of hexs){
            const n = Number.parseInt(c, 16);
            if(n < 10){
                duo.push(n);
            }else{
                if(randBin()){
                    duo.push(10);
                    duo.push(n - 10);
                }else{
                    duo.push(11);
                    duo.push(n - 6);
                }
            }
        }
        return duo;
    };

    let duo2hex = function (duo){
        assert(duo instanceof Array);

        const hex = [];

        const l = duo.length;

        let i = 0;

        while(i < l){
            if(duo[i] < 10){
                hex.push(duo[i]);
            }else{
                if(duo[i] === 10){
                    i++;
                    hex.push(duo[i] + 10);
                }else{
                    i++;
                    hex.push(duo[i] + 6);
                }
            }
            i++;
        }
        return hex.map(v=>v.toString(16).toUpperCase()).join('');
    };
    
    let duo2values = function (duo){
        return duo.map(d=>values[2*d]+values[2*d+1]).join('');
    };
    
    /**
     * 此方法实现正常字符串向“社会主义核心价值观”的转码
     * @param {String} text 需要进行转码的字符串
     * @return {String} “社会主义核心价值观”码
     */
    let _coreValuesEncode = function (text) {
		return duo2values(hex2duo(str2utf8(text)));
    };

    /**
     * 此方法用于将“社会主义核心价值观”码解码为正常字符串
     * @param {Object} text
     */
    let _coreValuesDecode = function (text) {
        const duo = [];

        for(let c of text){
            const i = values.indexOf(c);
            if(i === -1){
                continue;
            }else if(i & 1){
                continue;
            }else{
                // i is even
                duo.push(i >> 1);
            }
        }
        
        const hexs = duo2hex(duo);

        assert((hexs.length & 1) === 0);

        let str;
        try{
            str = utf82str(hexs);
        }catch(e){
            throw e;
        }
        return str;
    };

    return {
        coreValuesEncode: _coreValuesEncode,
        coreValuesDecode: _coreValuesDecode
    };
})();