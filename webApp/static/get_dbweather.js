function getWeather(str){
    if(str== ""){
        document.getElementById("dispDat").innerHTML = "";
        return;
    }else{
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("dispDat").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","http://webapp.physics/rest-api/api.php?name="+str,true);
        xmlhttp.send();
    }
}