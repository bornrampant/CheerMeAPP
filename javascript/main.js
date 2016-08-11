//faceplusplus access keys
var faceApiKey  = "88ee016e54cec327a568b7a6c13c893b";
var faceApiSecret = "L49upHZ3wsjLB7y_Q1YZhT-zi1fyrxYp";
//spotify access keys
var FMAApiID = "EY3GTFSU7C99N1R7";

//string to hold playlist api call
var mood = "";
var trackToPlay = "";

//input user image url
$(".submitURL").on("click", function(){
	
	//clear old added classes
	clearClasses();
	
	//get user input from text box
	var imgURL = document.getElementById('imgURL').value;
	// stop if input is null
	if (imgURL == null){
		return false;
	}
	
	//set to lower case for checks
	var isImage = imgURL.toLowerCase();
	
	console.log(isImage);
	
	var isFileType = isImage.split(":");
	
	if (isFileType[0] == "http"){
	}
	else if (isFileType[0] == "https"){
	}
	else{
		return false;
	}
	
	console.log(isFileType);
	
	//check if file is image type
	var isFileType = isImage.split(".");
	
	if (isFileType[isFileType.length - 1] == "jpg"){
	}
	else if (isFileType[isFileType.length - 1] == "gif"){
	}
	else if (isFileType[isFileType.length - 1] == "png"){
	}
	else{
		return false;
	}

	console.log(isFileType);
	
	//run API on image
	runFacePlusPlus(imgURL);
	
	//empty text box
	$("#imgURL").val('');
	
	return false;
});

//clear theme classes
function clearClasses() {
	$(".pagewrap").removeClass("happy-pagewrap");
	$(".jumbotron").removeClass("happy-jumbotron");
	$(".content").removeClass("happy-content");
	$(".middle").removeClass("happy-middle");
	$(".playlist").removeClass("happy-playlist");
	$(".btn").removeClass("happy-btn");
	$(".pagewrap").removeClass("sad-pagewrap");
	$(".jumbotron").removeClass("sad-jumbotron");
	$(".content").removeClass("sad-content");
	$(".middle").removeClass("sad-middle");
	$(".playlist").removeClass("sad-playlist");
	$(".btn").removeClass("sad-btn");
}


//runFacePlusPlus(imageData);
function runFacePlusPlus(imageData) {
	
	//create query address
	var queryURL = "https://apius.faceplusplus.com/v2/detection/detect?url=" + imageData + "&api_secret=" + faceApiSecret + "&api_key=" + faceApiKey + "&attribute=glass,pose,gender,age,race,smiling";
	
	$.ajax({
            url: queryURL,
            method: "GET"
        })
		.done(function(FacePlus) {
			console.log(FacePlus);
			
			//get length of face array
			var faceNum = FacePlus.face.length - 1;
			console.log(faceNum);
			//create empty list for smile values
			var smileValues = [];
			//read smile values into list
			while(faceNum >= 0){
				smileValues.push(FacePlus.face[faceNum].attribute.smiling.value);
				faceNum -= 1;
			}
			
			//set starting values to zero
			faceNum = 0;
			var smileAvg = 0;
			
			console.log("Smile List: " + smileValues);
			
			//add all smile values together and count number of values
			for (i in smileValues){
				faceNum += 1;
				smileAvg += smileValues[i];
			}
			
			console.log("total smile: " + smileAvg);
			console.log("number smile: " + faceNum);
			
			//divided total value but number of values
			smileAvg = smileAvg / faceNum;
			
			//take action based on total smiliness in picture
			if (smileAvg >= 66){
				mood = "Electronic";
				$(".section1").addClass("happy-section1");
				$(".jumbotron").addClass("happy-jumbotron");
				$(".content").addClass("happy-content");
				$(".middle").addClass("happy-middle");
				$(".playlist").addClass("happy-playlist");
				$(".section2").addClass("happy-section2");
				console.log("Happy: " + smileAvg);
			}
			else if (smileAvg <= 33){
				mood = "Blues";
				$(".section1").addClass("sad-section1");
				$(".jumbotron").addClass("sad-jumbotron");
				$(".content").addClass("sad-content");
				$(".middle").addClass("sad-middle");
				$(".playlist").addClass("sad-playlist");
				$(".section2").addClass("sad-section2");
				console.log("Sad: " + smileAvg);
			}
			else{
				mood = "Classical";
				console.log("Neutral: " + smileAvg);
			}
			
			//get music tracks
			runFMA(mood);
        });

}

function runFMA (mood){
	
	
	var queryURL = "https://freemusicarchive.org/api/get/tracks.json?api_key=" + FMAApiID + "&limit=50";
	
	//set starting object
	var trackNum = 49;
	var trackFound = false;
	
	//get music data from API
	$.ajax({
			dataType: "json",
            url: queryURL,
            method: "GET"
        })
		.done(function(FMA) {
			console.log(FMA);
			
			//clear section
			$(".playlist").html("");
			
			//count tracks added to section
			var tracksAdded = 0;
			
			while(trackFound != true){
				
				var newTrack = false;
				
				var genresNum = FMA.dataset[trackNum].track_genres.length - 1;
				
				while(genresNum >= 0){
					
					//get track genre
					var genres = FMA.dataset[trackNum].track_genres[genresNum].genre_title;
					
					//check if genre is the same as mood
					if(genres == mood){
						trackToPlay = FMA.dataset[trackNum].track_url;
						tracksAdded += 1;
						newTrack = true;
					}
					
					//set to next genre for track
					genresNum = genresNum - 1;
				}
				
				// add tack to section
				if (newTrack == true){
				$(".playlist").append("<a href='" + trackToPlay + "' target='_blank'><h1>Track " + tracksAdded + "</h1></a>");
				}
				
				//change to next track to check
				trackNum = trackNum - 1;
				
				// when all tracks are checked end loop
				if(trackNum < 0){
					trackFound = true;
				}
			}
			
        });	
}


