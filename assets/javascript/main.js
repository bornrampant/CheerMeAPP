//faceplusplus access keys
var faceApiKey  = "88ee016e54cec327a568b7a6c13c893b";
var faceApiSecret = "L49upHZ3wsjLB7y_Q1YZhT-zi1fyrxYp";
//spotify access keys
var spotifyApiID = "5a202c5e7bc24cc98a23a5a8130e5f4f";
var spotifyApiSecret = "8b12b7a08c5e42449127d6c2ce411c26";

//string to hold playlist api call
var mood = "";


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

//var imageData = "http://www.faceplusplus.com/wp-content/themes/faceplusplus/assets/img/demo/thumbnail/1.jpg";

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
				mood = "/v1/users/" + spotifyApiID + "/playlists/4hfsKDh1xp5SBsJGJWt4pd";
				$(".section1").addClass("happy-section1");
				$(".jumbotron").addClass("happy-jumbotron");
				$(".content").addClass("happy-content");
				$(".middle").addClass("happy-middle");
				$(".playlist").addClass("happy-playlist");
				$(".section2").addClass("happy-section2");
				console.log("Happy: " + smileAvg);
			}
			else if (smileAvg <= 33){
				mood = "/v1/users/" + spotifyApiID + "/playlists/{playlist_id}";
				$(".section1").addClass("sad-section1");
				$(".jumbotron").addClass("sad-jumbotron");
				$(".content").addClass("sad-content");
				$(".middle").addClass("sad-middle");
				$(".playlist").addClass("sad-playlist");
				$(".section2").addClass("sad-section2");
				console.log("Sad: " + smileAvg);
			}
			else{
				mood = "/v1/users/" + spotifyApiID + "/playlists/{playlist_id}";
				console.log("Neutral: " + smileAvg);
			}
			
			runSpotify(mood);
        });

}

function runSpotify (mood){
	
	var queryURL = "https://accounts.spotify.com/authorize/?client_id=" + spotifyApiID + "&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09"
	
	//var queryURL = "https://api.spotify.com" + mood;
	
	console.log(queryURL);
	
	$.ajax({
            url: queryURL,
            method: "GET"
        })
		.done(function(Spotify) {
			console.log(Spotify);
			var track = Spotify.tracks[0].track.uri;
			console.log(track);
        });
	
	
	
	$(".player").html("<iframe src='https://embed.spotify.com/?uri=" + track + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>")
}


