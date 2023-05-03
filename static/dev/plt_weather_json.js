/*Weather bars plot*/

//var timeNow = new Date();
let currHour = 9; //timeNow.getHours();
currHour = currHour < 10? "0"+currHour:currHour;
let currDate = "20221008";
let dataURL = "https://www.jma.go.jp/bosai/amedas/data/point/51106/"+currDate+"_"+currHour+".json";
var margin ={top:40,right:20,bottom:50,left:40},
w = 500 - margin.left - margin.right,
h = 500 - margin.top - margin.bottom;

var hour = [parseInt(currHour),parseInt(currHour)+1,parseInt(currHour)+2];
var svg2=d3.select("#weather_bar")
.append("svg")
.attr('width',w+margin.left+margin.right)
.attr('height',h+margin.top+margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

d3.json(dataURL,function(data){

  var tempp = [data[currDate+currHour+"0000"].temp[0],data[currDate+hour[1]+"0000"].temp[0],data[currDate+hour[2]+"0000"].temp[0]];
  console.log(tempp,hour);

  var xScale=d3.scaleBand().range([0,w])
  .domain([0,1,2,3,4,5,6,7,8,9,10,11,12])
  .padding(0.2);

  svg2.append("g")
  .attr("transform","translate(0,"+h+")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform","translate(5,0)rotate(0)")
  .attr("font-size","12")
  .style("text-anchor","end");

  const tMin = 10;//d3.min(data,(d)=>{return d.temp;});
  const tMax = 30;//d3.max(data,(d)=>{return d.temp;});
  //console.log(parseInt(tMax) +4,tMin-2);
  var yScale=d3.scaleLinear()
  .domain([tMin-1,parseInt(tMax)+1]).range([h,0]);

  svg2.append("g").call(d3.axisLeft(yScale)).attr("font-size","12");
  svg2.selectAll("bar")
  .data(data).enter()
  .append("rect")
  .attr("x",function(i){
    return xScale(hour);})
  .attr("width",xScale.bandwidth())
  /*.attr("fill",function(d){return d.color;})*/
  .attr("rx",4)
  .attr("height",function(d){return h-yScale(0);})
  .attr("y",function(d){return yScale(0);})

  svg2.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y",function(d){return yScale(tempp);})
  .attr("height",function(d){return h-yScale(tempp);});

  console.log(yScale(tempp),h-yScale(tempp),xScale(hour));
  /*.attr("class",function(d){return d.class;})*/
  /*.delay(function(d,i){return(i*100)})*/

  svg2.append("g")
    .append("text")
    .text("\u2103")
    .attr("x",-24)
    .attr("y",-10); //@bottom yMax +15 //top -10
});

/*console.log(thisColor);
randIdx=Math.floor(Math.random()*thisColor.length);*/
