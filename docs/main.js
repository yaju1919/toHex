(function() {
    'use strict';
    var unit = 4; // 単位文字数
    function shape0(n,str){ // strを左から0詰めでn文字に整形
        return ("0".repeat(n) + str).slice(-n).toUpperCase();
    }
    function encode(str, key){
        if(!key) key = 0;
        return insert_space(r(str.replace(/(.|\n)/g, function(c){
            return shape0(unit,(Number(c.charCodeAt(0)) + key).toString(16).slice(-unit));
        })));
    }
    function decode(str, key){
        if(!key) key = 0;
        return r(str.replace(/[^0-9A-Fa-f]/g,"")).replace(new RegExp("[0-9A-Fa-f]{" + unit + "}", "g"), function(n){
            return String.fromCharCode(parseInt(n, 16) - key);
        });
    }
    function reverse(str){ // 文字列の反転
        return str.split('').reverse().join('');
    }
    function r(str){if(!reverse_flag() || !str.length) return str;
        var n = input_reverse();
        if(isNaN(n) || n < 2) return str;
        return str.match(new RegExp('.{1,' + n + '}', "g")).map(function(v){
            return reverse(v);
        }).join('');
    }

    function insert_space(str){
        if(!space_flag()) return str;
        return str.match(/.{2}/g).map(function(v){
            return v+" ";
        }).join('');
    }

    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>",{text:"文字列を16進数に暗号化"}).appendTo(h);
    $("<div>",{text:"F2,F4,F7,F8,F9,F10,Altキーに復元ボタンが割り当てられています。"}).appendTo(h);
    $("<div>",{text:"暗号化キーを上下しつつ復元する総当たり作業用にお使いください。"}).appendTo(h);
    window.addEventListener("keydown", function(e){
        switch(e.key){
            case 'F2':
            case 'F4':
            case 'F7':
            case 'F8':
            case 'F9':
            case 'F10':
            case 'Alt':
                btn.click();
                break;
        }
    });
    //------------------------------------------------------------------------------------------------
    function appendBtn(title, func){
        return $("<button>",{text: title}).appendTo(h).click(func);
    }
    h.append("<br>");
    (function(){
        if(!navigator.clipboard) return;
        if(!navigator.clipboard.readText) return;
        appendBtn("貼り付け", function(){
            navigator.clipboard.readText().then(function(text){
                $("#input").val(text);
            });
        });
    })();
    h.append("<br>");
    h.append("<br>");
    var input = yaju1919.addInputText(h,{
        placeholder: "暗号化 or 復元したい文章をここに入力してください。",
        textarea: true,
        hankaku: false,
        id: "input",
        save: "input"
    });
    $("#input").focus(function(){ // フォーカス時全選択
        $(this).select();
    }).click(function(){
        $(this).select();
        return false;
    });
    h.append("<br>");
    h.append("<br>");
    appendBtn("暗号化", function(){
        return result(encode(input(),input_key()));
    });
    var btn = appendBtn("復元", function(){
        result(decode(input(),input_key()));
    });
    h.append("<br>");
    h.append("<br>");
    yaju1919.addHideArea(h,{
        title: "オプション機能",
        id2: "opt",
        save: "opt"
    });
    var h_opt = $("#opt");
    h.append("<br>");
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    var space_flag = yaju1919.addInputBool(h_opt,{
        title: "半角スペースを挿入する",
        value: true,
        save: "space"
    });
    h_opt.append("<br>");
    var input_key = yaju1919.addInputNumber(h_opt,{
        title: "暗号化キー",
        value: 0,
        int: true,
        save: "key"
    });
    h_opt.append("<br>");
   var reverse_flag = yaju1919.addHideArea(h_opt,{
        title: "反転処理",
        id2: "rev",
        save: "rev"
    });
    var h_rev = $("#rev");
    var input_reverse = yaju1919.addInputNumber(h_rev,{
        title: "反転キー",
        max: 1000,
        min: 2,
        value: 2,
        int: true,
        save: "rev_key"
    });
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    h.append("<br>");
    h.append("▼結果　");
    appendBtn("コピー", function(){
        if(result_log) yaju1919.copy(result_log);
    });
    var show_length = $("<span>").appendTo(h);
    var result_elm = $("<div>").appendTo(h).css({
        backgroundColor: "lightblue",
        color: "blue"
    });
    var result_log = "";
    function result(text){
        if(text) result_log = text;
        show_length.text("　文字数：" + text.length);
        result_elm.text(text);
    }
    //------------------------------------------------------------------------------------------------
})();
