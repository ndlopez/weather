window.onload = function(){
    var width = 100;
    var height = 100;
    var centerX = Math.floor(width/2);
    var centerY = Math.floor(height/2);
    var canvas = document.getElementById('clock');
    var context = canvas.getContext('2d');

    setInterval(drawClock,1000);
    drawClock();

    function drawClock(){
	var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var sec = date.getSeconds();
        //console.log(hour+":"+minute+":"+sec);
        //set color
        context.strokeStyle = '#666666';
        context.clearRect(0,0,canvas.width,canvas.height);
        //add texts
        context.beginPath();
        context.arc(centerX,centerY,centerX - 1,0,Math.PI*2,false);
        context.stroke();

        context.save();
        context.translate(width/2,height/2);
        for(var i=0;i<360;i+=30){
	    context.rotate(30*Math.PI/180);
	    context.beginPath();
            context.moveTo(0,centerY*0.8);
            context.lineTo(0,centerY*0.9);
            context.stroke();
	}
        context.translate(-width/2,-height/2);
        context.restore();

        context.strokeStyle = '#333333';
        drawHand(centerY*0.5,hour*30+minute/60*30);
        drawHand(centerY*0.8,minute*6+sec/60*6);
        context.strokeStyle = '#EE0000';
        drawHand(centerY*0.8,sec*6);
    }
    //draw the hand
    function drawHand(length,angle){
	context.save();
        context.translate(centerX,centerY);
        context.rotate(angle*Math.PI/180);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(0,-length);
        context.stroke();
        context.translate(-centerX,-centerY);
        context.restore();
    }

}
