/*
  Display current Weather status
  Data from tenki.jp, data wrangled using bash 
  Ref https://gitlab.com/justperfection.channel/how-to-create-a-gnome-shell-extension/-/tree/master/example@example.com
*/
const {St,GLib,Clutter} = imports.gi;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelBtn, panelBtnTxt, timeout;
var tenkiArr=[];
var unitArr=[" ","°C 雨 ","%","mm 湿度 ","% 風速","m",""];

function setGrepTenki(){
    var arr = [];
    var now = GLib.DateTime.new_now_local();
    var hora = now.format("%H:%M ");//%Y/%m/%d

    //display weather
    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash /home/diego/Public/get_weather/show_tenki.sh');
    var str = imports.byteArray.toString(out).replace('\n','');

    log(hora+' Current weather: '+ str);
    tenkiArr = str.split(" ");
    var dspStr=tenkiArr[2]+" "+tenkiArr[3]+"°C/風速 "+tenkiArr[7]+"m";
    arr.push(dspStr);

    panelBtnTxt.set_text(arr.join('   '));
    log("tenkiArr out: "+tenkiArr);
    /*let idx=2;
    var txt="",txt2=tenkiArr[9]+":00 ";
    for (;idx < tenkiArr.length){
	if (idx < 9)
	    txt+=tenkiArr[idx]+unitArr[idx];
	else{
	    if (idx == 9)
		log("something with"+idx);
	    else
		txt2+=tenkiArr[idx]+unitArr[idx];
	}}
    log("Might work:"+txt+" and "+txt2);*/
    var nextHr=tenkiArr[9]+":00 "+tenkiArr[10]+" "+tenkiArr[11]+"°C 雨 "+tenkiArr[12]+"% "+tenkiArr[13]+"mm 湿度 "+tenkiArr[14]+"% 風速"+tenkiArr[16]+tenkiArr[15]+"m";
    Main.notify(hora+ tenkiArr[2]+" "+tenkiArr[3]+"°C 雨 "+tenkiArr[4]+"% "+tenkiArr[5]+"mm 湿度 "+tenkiArr[6]+"% 風速"+tenkiArr[8]+tenkiArr[7]+"m",nextHr);
    //天気情報
    return true;
}

function init(){
    panelBtn = new St.Bin({
	style_class:"panel-button"
    });
    //var myArr=[];
    //var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash /home/diego/Public/get_weather/show_tenki.sh');
    //var myStr = imports.byteArray.toString(out).replace('\n','');
    //myArr = myStr.split(" ");
    var cloudy=String.fromCharCode(9925);//works nicely
    panelBtnTxt = new St.Label({
	style_class:"tenkiText",
	text:cloudy+"14C",//"天気更新中",
	//text:myArr[2]+" "+myArr[3]+"°C",
	y_align: Clutter.ActorAlign.CENTER,
    });
    panelBtn.set_child(panelBtnTxt);
}

function enable(){
    Main.panel._rightBox.insert_child_at_index(panelBtn,1);
    timeout=Mainloop.timeout_add_seconds(1800.0,setGrepTenki);
}

function disable(){
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelBtn);
}
