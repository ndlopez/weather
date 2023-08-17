// number of drops created.
const nbDrop = 158;//868 

// function to generate a random number range.
function randRange( minNum, maxNum) {
	return String(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// function to generate drops
function createRain() {
	for(let i=0;i<nbDrop;i++) {
		// build nbDrop divs
		console.log("sizze", window.screen.width);
		const width = window.screen.width;
		const height = window.screen.height;
		const dropLeft = randRange(0,width) + "px";
		const dropTop = randRange(-1000,height) + "px";

		//unnecessary jquery
		// $('.rain').append('<div class="drop" id="drop'+i+'"></div>');
		// $('#drop'+i).css('left',dropLeft);
		// .css("propertyName",value)
		// $('#drop'+i).css('top',dropTop);
		const raindiv = document.getElementById("rainDiv");
		const dropss = document.createElement("div");
		// = `<div class="drop" id="drop${i}"></div>`;
		dropss.classList.add("drop");
		dropss.setAttribute("id","drop"+i);
		dropss.style.left = dropLeft;
		dropss.style.top = dropTop;
		raindiv.appendChild(dropss)
	}

}
// Make it rain
createRain();