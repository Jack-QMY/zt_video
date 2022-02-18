const svgXML =
    '<svg t="1639447366341" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3233" width="200" height="200"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="#3D3D3D" p-id="3234"></path></svg>';
// const svgXML = `  `;

function getPath(str) {
    let prefix = '<path d="',
        plen = 9,
        suffix = '" p-id="',
        slen = 8;
    let strlen = str.length;
    let width_i = str.indexOf('width');
    str = str.substr(width_i, strlen - width_i - 1);
    //console.log("修剪后的str 为 : ",str);
    let out = [];
    let round = 1;
    while (true) {
        let strlen = str.length;
        let p = str.indexOf(prefix);
        if (p < 0) {
            break;
        } //遍历结束
        let s = str.indexOf(suffix);
        let sub = str.substr(p + plen, s - p - slen - 1); //目标子串
        //console.log("第"+round+"轮中获取到的路径数据: ",sub);
        out.push(sub);
        str = str.substr(s + 8, strlen - s);
        //console.log("第"+round+"轮结束后截取的剩余字符串为: ",str);
    }
    console.log(out);
}

getPath(svgXML);
