(function() {
    'use strict';
    const yaju1919 = yaju1919_library;
    const unit = 4; // 単位文字数
    const shape0 = (n,str) => ("0".repeat(n) + str).slice(-n).toUpperCase(); // strを左から0詰めでn文字に整形
    const encode = (str, key = 0) => insert_space(r(str.trim().replace(/(.|\n)/g, c => shape0(unit,overflow(Number(c.charCodeAt(0)) + key).toString(16).slice(-unit)))));
    const decode = (str, key = 0) => r(str.replace(/[^0-9A-Fa-f]/g,"")).replace(new RegExp("[0-9A-Fa-f]{" + unit + "}", "g"), n => String.fromCharCode(overflow(parseInt(n, 16) - key)));

    const reverse = str => str.split('').reverse().join(''); // 文字列の反転
    const r = str => {
        if(!reverse_flag() || !str.length) return str;
        const n = input_reverse();
        if(isNaN(n) || n < 2) return str;
        return str.match(new RegExp('.{1,' + n + '}', "g")).map(v=>reverse(v)).join('');
    }

    const insert_space = str => {
        if(!space_flag()) return str;
        return str.match(/.{2}/g).map(v=>v+" ").join('');
    }

    const OVERFLOW_NUMBER = 16 ** unit; // 16進数がunit文字 オーバーフローする数値
    const BIG_NUMBER = 16 ** 8; // とりあえず大きい数値

    const overflow = n => (BIG_NUMBER + n) % OVERFLOW_NUMBER;

    const isHex = v => !/[^0-9A-Fa-f ]/.test(v); // 16進数かどうか


    const h = $("<div>").appendTo($("body")).css({
        padding: "1em"
    });
    $("<h1>",{text:"文字列を16進数に暗号化"}).appendTo(h);
    const textarea = () => h.find("textarea");
    //------------------------------------------------------------------------------------------------
    const appendBtn = (title, func) => $("<button>",{text: title}).appendTo(h).click(func);
    (()=>{
        if(!navigator.clipboard) return;
        if(!navigator.clipboard.readText) return;
        appendBtn("貼り付け", () => navigator.clipboard.readText().then(text=>textarea().val(text)));
    })();
    appendBtn("暗号化", () => result(encode(input(),input_key())));
    appendBtn("復元", () => result(decode(input(),input_key())));
    h.append("<br>");
    yaju1919.appendCheckButton(h,{
        title: "オプション機能",
        change: f => f ? h_opt.show() : h_opt.hide()
    });
    h.append("<br>");
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    const h_opt = $("<div>").appendTo(h).hide();
    const space_flag = yaju1919.appendCheckButton(h_opt,{
        title: "半角スペースを挿入する",
        value: true
    });
    h_opt.append("<br>");
    const input_key = yaju1919.appendInputNumber(h_opt,{
        title: "暗号化キー",
        width: "5em",
        max: BIG_NUMBER,
        min: -BIG_NUMBER,
        value: 0,
        int: true
    });
    h_opt.append("<br>");
    const reverse_flag = yaju1919.appendCheckButton(h_opt,{
        title: "反転処理",
        change: f => f ? h_rev.show() : h_rev.hide()
    });
    const h_rev = $("<span>").appendTo(h_opt).hide();
    const input_reverse = yaju1919.appendInputNumber(h_rev,{
        title: "反転キー",
        width: "5em",
        max: 1000,
        min: 2,
        value: 2,
        int: true
    });
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    h.append("<br>");
    h.append("<br>");
    const input = yaju1919.appendInputText(h,{
        placeholder: "暗号化 or 復元したい文章をここに入力してください。",
        width: "50%",
        textarea: true,
    });
    textarea().css({
        height: "6em",
    }).focus(function(){ // フォーカス時全選択
        $(this).select();
    }).click(function(){
        $(this).select();
        return false;
    });
    h.append("<br>");
    h.append("結果　");
    appendBtn("コピー", () => {
        yaju1919.copy(result_elm.text().trim());
    });
    const result_elm = $("<div>").appendTo(h).css({
        backgroundColor: "lightblue",
        color: "blue"
    });
    const result = text => {
        result_elm.empty();
        text.split('\n').map(e=>{
            result_elm.append(e+'\n');
            result_elm.append("<br>");
        });
    }
    //------------------------------------------------------------------------------------------------
})();
