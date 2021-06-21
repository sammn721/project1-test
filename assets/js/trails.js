var idd = [];
var info = [];
var data1;
var data2;

function trailsDisplayed(data, mindist = 1, maxdist = 10) {

    for (var x = 0; x < data.data.length; x++) {
		info[x] = [parseFloat(data.data[x].length), data.data[x].name, data.data[x].url, data.data[x].description]
	}
	// console.log(info)
	// Sort trail list in descending order
	info.sort(function (a, b) {
		return b[0] - a[0];
	});
	console.log("info",info)
	console.log("first",info[0][0], mindist, maxdist, "last",info[info.length-1][0])
	// Flag error through modal if trail distance requirements aren't met
	var end= info.length-1;
	console.log(maxdist,info[end][0] )
	if(mindist > info[0][0] || maxdist<info[end][0]){
		modal.style.display = "block";
		return;
	}
	
    trailsDisplay.empty();
	for (let t= 0; t < info.length; t++) {
		console.log(info[t][0]< maxdist)
		if(info[t][0] > mindist && info[t][0] < maxdist){
			trailsDisplay.append(`
            <div id="trails-list">
            <div class="card blue-grey darken-1">
                <div class="card-content">
                    <span class=".trail-name card-title">${info[t][1]}</span>
                    <p>${info[t][3]}
                    <br>
                    <br>Trail length: ${info[t][0]} miles</p>
                    <br><a href="${info[t][2]}">More info</a>
                </div>
            </div> `);
		}	
	}
	return

}


// function trailsDisplayed(local, mindist, maxdist) {
//     trailsDisplay.empty();
// 	for (var x = 0; x < local.data.length; x++) {
// 		info[x] = [parseFloat(local.data[x].length).toFixed(2), local.data[x].name, local.data[x].url, local.data[x].description]
// 	}
// 	info.sort(function (a, b) {
// 		return b[0] - a[0];
// 	});
// 	t = 0;
// 	while (info[t][0] > mindist && t < info.length) {
// 		if (info[t][0] < maxdist) {
// 			$('#trails-display').append(`
            // <div id="trails-list">
            //     <div class="card blue-grey darken-1">
            //         <div class="card-content">
            //             <span class=".trail-name card-title">${info[t][1]}</span>
            //             <p>${info[t][3]}
            //             <br>
            //             <br>Trail length: ${info[t][0]} miles</p>
            //             <br><a href="${info[t][2]}">More info</a>
            //         </div>
            //     </div>
            // </div> `);
// 		}
// 		t++
// 	}
// }

// SEARCH TRAILS USING WEATHER CITY COORDINATES
function searchTrailsByCoordinates (lon, lat) {
    var trailQueryURL = `${trailURL}explore/?${lon}&${lat}`;
    fetch(trailQueryURL, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "141b99fa69msha39bd18b0462d26p198d40jsn9dad0efbd107",
            "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com"
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (local) {
        trailsData = local.data;
        trailsDisplayed(local, 0, 20);
        return (trailsData);
    })
    .catch(function (error) {
        return error;
    });
}