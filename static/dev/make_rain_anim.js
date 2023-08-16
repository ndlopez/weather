// number of drops created.
const nbDrop = 858; 

// function to generate a random number range.
function randRange( minNum, maxNum) {
	return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// function to generate drops
function createRain() {

	for(let i=1;i<nbDrop;i++) {
		const dropLeft = randRange(0,1600);
		const dropTop = randRange(-1000,1400);

		//unnecessary jquery
		$('.rain').append('<div class="drop" id="drop'+i+'"></div>');
		$('#drop'+i).css('left',dropLeft);
		// .css("propertyName",value)
		$('#drop'+i).css('top',dropTop);
		const raindiv = document.getElementsById("rainDiv");
		raindiv.innerHTML = `<div class="drop" id="drop${i}"></div>`;
		document.getElementById('drop'+i).style.left = dropLeft;
		document.getElementById('drop'+i).style.top = dropTop;
	}

}
// Make it rain
createRain();