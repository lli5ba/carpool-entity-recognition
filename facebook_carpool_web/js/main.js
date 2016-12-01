function httpGetAsync(theUrl, callback)
{
		console.log("getasync")
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function generatePost (detail) { 
  // create a new div element 
  // and give it some content
  //var permalink = "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/";
  //var posterName = "hi";
  //var messageBody = "Create your own custom Facebook Status.";
  //var datePosted = "November 30 at 10:20am";
  //var locations = "(Duke, UVa)"
  //var dates = "(1, 2)"
  //var refinedDates = "11/30/2016"
  //var riderOrDriver = "driver"
  var permalink = detail['permalink'];
  var posterName = detail['post_author'];
  var messageBody = detail['message_body'];
  var datePosted = detail['date_posted'];
  var locations = detail['locations'];
  var dates = detail['dates'];
  var refinedDates = detail['refined_dates'];
  var riderOrDriver = detail['driver_or_rider'];
  var roundtripOrOneway = detail['roundtrip_or_oneway'];
  
  var mainDiv = document.createElement("div"); 
  var classicDiv = document.createElement("div"); 
  classicDiv.className = "classic";
  

  
  var statusPicDiv = document.createElement("div"); 
  statusPicDiv.className = "statusPic";
  var img = document.createElement("img"); 
  img.src = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR1sepJuEsxnvEzxeRAXMhkIlASvDvRL1JLss3j9VpBZ7IytoKKr-QMcw";
  
  statusPicDiv.appendChild(img);
  classicDiv.appendChild(statusPicDiv);
  
  var statusContentDiv = document.createElement("div"); 
  statusContentDiv.className = "statusContent";
  var aEle = document.createElement("a"); 
  aEle.href = permalink;
  var statusNameP = document.createElement("p"); 
  statusNameP.className = "statusName";
  var statusName = document.createTextNode(posterName); 
  statusNameP.appendChild(statusName);
  aEle.appendChild(statusNameP);
  statusContentDiv.appendChild(aEle);
  
  var statusTextP = document.createElement("p"); 
  statusTextP.className = "statusText";
  var statusText = document.createTextNode(messageBody); 
  statusTextP.appendChild(statusText);
  statusContentDiv.appendChild(statusTextP);
  
  var statusLinksP = document.createElement("p"); 
  statusLinksP.className = "statusLinks";
  var statusDateSpan = document.createElement("span");
  statusDateSpan.className = "statusDate";
  var statusDate = document.createTextNode(datePosted); 
  statusDateSpan.appendChild(statusDate);
  statusLinksP.appendChild(statusDateSpan);
  statusContentDiv.appendChild(statusLinksP);
  
  classicDiv.appendChild(statusContentDiv);
  

  var extractedLocationsP = document.createElement("p"); 
  var extractedLocations = document.createTextNode(locations); 
  
  var extractedLocationsB = document.createElement("b"); 
  var extractedLocationsHead = document.createTextNode("Locations: "); 
  extractedLocationsB.appendChild(extractedLocationsHead);
  extractedLocationsP.appendChild(extractedLocationsB);
  extractedLocationsP.appendChild(extractedLocations);
  classicDiv.appendChild(extractedLocationsP);
  
  var extractedDatesP = document.createElement("p"); 
  var extractedDates = document.createTextNode(dates); 
  var B1 = document.createElement("b");
  var T1 = document.createTextNode("Dates: ");
  B1.appendChild(T1);
  extractedDatesP.appendChild(B1);
  extractedDatesP.appendChild(extractedDates);
  classicDiv.appendChild(extractedDatesP);
  
  var refinedDatesP = document.createElement("p"); 
  var refinedDates = document.createTextNode(refinedDates);
  var B2 = document.createElement("b");
  var T2 = document.createTextNode("Refined Dates: ");
  B2.appendChild(T2)
  refinedDatesP.appendChild(B2);
    
  refinedDatesP.appendChild(refinedDates);
  classicDiv.appendChild(refinedDatesP);
  
  var riderDriverP = document.createElement("p"); 
  var riderDriver = document.createTextNode(riderOrDriver); 
  riderDriverP.appendChild(riderDriver);
  classicDiv.appendChild(riderDriverP);
  
  var roundtripOnewayP = document.createElement("p"); 
  var roundtripOneway = document.createTextNode(roundtripOrOneway); 
  roundtripOnewayP.appendChild(roundtripOneway);
  classicDiv.appendChild(roundtripOnewayP);
  
 
	return classicDiv;
}

function addRouteAndMarkers(map, infowindow, coords, detail) {
    
		var content = generatePost(detail);
		var marker = new google.maps.Marker({
    position: coords[0],
    map: map,
    title: coords[0]
  	});
    var marker = new google.maps.Marker({
    position: coords[1],
    map: map,
    title: coords[1]
  	});
    var polyline = new google.maps.Polyline({
        content: content,
        path: coords,
        strokeColor: '#FF3300',
        strokeOpacity: 0.8,
        strokeWeight: 1.2
    });

    polyline.setMap(map);

    // Add a "click" event for this route
    google.maps.event.addListener(polyline, "click", function (e) {
        infowindow.setPosition(e.latLng);
        infowindow.setContent(this.content);
        infowindow.open(map);
    });
    

}

function initMap(responseText) {
		responseText = responseText['results'];
    var myOptions = {
        zoom: 7,
        center: responseText['home_coord'],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

    // Define an info window
    var infowindow = new google.maps.InfoWindow({
        content: ""
    });

    // ---------------------------------------------------------
		console.log(responseText['map_results'])
    // Route array
    for (var i = 0; i < responseText['map_results'].length; i++) {
    	console.log(i)
    	for (var j = 0; j < responseText['map_results'][i]['routes'].length; j++) {
      	console.log(j)
      	addRouteAndMarkers(map, infowindow, responseText['map_results'][i]['routes'][j], responseText['map_results'][i]['detail']);
      }
		}
    // ---------------------------------------------------------

    // Click anywhere on the map to close the info window
    google.maps.event.addListener(map, "click", function () {
        infowindow.close();
    });
}

function initialize() {
	//httpGetAsync("http://127.0.0.1:5000/results?group_id=36509972655&home_location=university%20of%20virginia&state=virginia&num_posts=1", initMap);
	var results = {
    "group_id": "36509972655", 
    "home_location": "university of virginia", 
    "num_posts": 30, 
    "results": {
        "dates": {
            "drivers": {
                "11/28/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155421741097656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155421838857656/?sale_post_id=10155421838857656"
                ], 
                "11/29/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155426001407656/?sale_post_id=10155426001407656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155422714167656/?sale_post_id=10155422714167656"
                ], 
                "12/02/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155425755907656/?sale_post_id=10155425755907656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155425960632656/?sale_post_id=10155425960632656"
                ], 
                "12/10/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155427338037656/?sale_post_id=10155427338037656"
                ], 
                "12/17/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155425868477656/?sale_post_id=10155425868477656"
                ]
            }, 
            "riders": {
                "11/16/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155382253112656/?sale_post_id=10155382253112656"
                ], 
                "11/28/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155421380352656/?sale_post_id=10155421380352656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155421024622656/?sale_post_id=10155421024622656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656"
                ], 
                "11/29/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155425736112656/?sale_post_id=10155425736112656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155424317712656/?sale_post_id=10155424317712656"
                ], 
                "11/30/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155428903787656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155425961882656/?sale_post_id=10155425961882656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155425961882656/?sale_post_id=10155425961882656"
                ], 
                "12/02/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155422415067656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/?sale_post_id=10155427234222656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155424396152656/?sale_post_id=10155424396152656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155420973202656/?sale_post_id=10155420973202656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155421941917656/?sale_post_id=10155421941917656", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155421920752656/"
                ], 
                "12/03/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155421779162656/?sale_post_id=10155421779162656"
                ], 
                "12/04/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/"
                ], 
                "12/11/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155422819912656/", 
                    "https://www.facebook.com/groups/36509972655/permalink/10155420945967656/"
                ], 
                "12/14/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155423083457656/"
                ], 
                "12/15/2016": [
                    "https://www.facebook.com/groups/36509972655/permalink/10155421848682656/"
                ]
            }
        }, 
        "home_coord": {
            "lat": 38.0335529, 
            "lng": -78.5079772
        }, 
        "locations": {
            "drivers": [
                {
                    "key": [
                        38.435092, 
                        -78.8697548
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425755907656/?sale_post_id=10155425755907656"
                    ]
                }, 
                {
                    "key": [
                        40.51106499999999, 
                        -74.37895
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155421741097656/"
                    ]
                }, 
                {
                    "key": [
                        38.9531162, 
                        -77.45653879999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155426001407656/?sale_post_id=10155426001407656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425868477656/?sale_post_id=10155425868477656"
                    ]
                }, 
                {
                    "key": [
                        40.9290779, 
                        -74.077072
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155427338037656/?sale_post_id=10155427338037656"
                    ]
                }, 
                {
                    "key": [
                        37.22838429999999, 
                        -80.42341669999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425960632656/?sale_post_id=10155425960632656"
                    ]
                }, 
                {
                    "key": [
                        38.0293059, 
                        -78.47667810000002
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155422714167656/?sale_post_id=10155422714167656"
                    ]
                }, 
                {
                    "key": [
                        38.851242, 
                        -77.04023149999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155422714167656/?sale_post_id=10155422714167656"
                    ]
                }, 
                {
                    "key": [
                        41.3329406, 
                        21.5392803
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155426001407656/?sale_post_id=10155426001407656"
                    ]
                }, 
                {
                    "key": [
                        38.0335529, 
                        -78.5079772
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425755907656/?sale_post_id=10155425755907656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155427338037656/?sale_post_id=10155427338037656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155421741097656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425868477656/?sale_post_id=10155425868477656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425960632656/?sale_post_id=10155425960632656"
                    ]
                }
            ], 
            "riders": [
                {
                    "key": [
                        27.6648274, 
                        -81.5157535
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155420945967656/"
                    ]
                }, 
                {
                    "key": [
                        38.435092, 
                        -78.8697548
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155422415067656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425736112656/?sale_post_id=10155425736112656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155424396152656/?sale_post_id=10155424396152656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420973202656/?sale_post_id=10155420973202656"
                    ]
                }, 
                {
                    "key": [
                        40.75387550000001, 
                        -74.02831669999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155382253112656/?sale_post_id=10155382253112656"
                    ]
                }, 
                {
                    "key": [
                        38.9531162, 
                        -77.45653879999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155428903787656/"
                    ]
                }, 
                {
                    "key": [
                        38.9055607, 
                        -77.0491638
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656"
                    ]
                }, 
                {
                    "key": [
                        38.1393837, 
                        -78.4492753
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155421779162656/?sale_post_id=10155421779162656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155421779162656/?sale_post_id=10155421779162656"
                    ]
                }, 
                {
                    "key": [
                        41.022554, 
                        -80.82708199999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155423083457656/"
                    ]
                }, 
                {
                    "key": [
                        40.554634, 
                        -74.571736
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155421380352656/?sale_post_id=10155421380352656"
                    ]
                }, 
                {
                    "key": [
                        38.0293059, 
                        -78.47667810000002
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656"
                    ]
                }, 
                {
                    "key": [
                        40.0583238, 
                        -74.4056612
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155421380352656/?sale_post_id=10155421380352656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155421848682656/"
                    ]
                }, 
                {
                    "key": [
                        40.7127837, 
                        -74.0059413
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155422819912656/"
                    ]
                }, 
                {
                    "key": [
                        37.5489872, 
                        -77.4534286
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/?sale_post_id=10155427234222656"
                    ]
                }, 
                {
                    "key": [
                        39.0457549, 
                        -76.64127119999999
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656"
                    ]
                }, 
                {
                    "key": [
                        37.5407246, 
                        -77.4360481
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155421941917656/?sale_post_id=10155421941917656"
                    ]
                }, 
                {
                    "key": [
                        38.9071923, 
                        -77.0368707
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656"
                    ]
                }, 
                {
                    "key": [
                        35.2040494, 
                        -80.8352402
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155425961882656/?sale_post_id=10155425961882656"
                    ]
                }, 
                {
                    "key": [
                        38.0335529, 
                        -78.5079772
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155428903787656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155422415067656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/?sale_post_id=10155427234222656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425736112656/?sale_post_id=10155425736112656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425961882656/?sale_post_id=10155425961882656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155382253112656/?sale_post_id=10155382253112656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155424396152656/?sale_post_id=10155424396152656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420973202656/?sale_post_id=10155420973202656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155424317712656/?sale_post_id=10155424317712656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155423083457656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155422819912656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155421941917656/?sale_post_id=10155421941917656", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155421848682656/", 
                        "https://www.facebook.com/groups/36509972655/permalink/10155420945967656/"
                    ]
                }, 
                {
                    "key": [
                        39.2903848, 
                        -76.6121893
                    ], 
                    "value": [
                        "https://www.facebook.com/groups/36509972655/permalink/10155424317712656/?sale_post_id=10155424317712656"
                    ]
                }
            ]
        }, 
        "map_results": [
            {
                "detail": {
                    "date_posted": "11/30/2016 20:58", 
                    "dates": [
                        "1pm"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "dulles"
                    ], 
                    "message_body": "looking for a ride to dulles on the 10th around 1pm will pay for gas plsss take me i need to know that i can go home in order to survive my finals", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155428903787656/", 
                    "post_author": "Lal Toker", 
                    "refined_dates": [
                        "11/30/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.9531162, 
                            "lng": -77.45653879999999
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 19:15", 
                    "dates": [
                        "Friday evening"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "JMU"
                    ], 
                    "message_body": "looking for a ride to JMU Friday evening!!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155422415067656/", 
                    "post_author": "Melissa Zhu", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 20:59", 
                    "dates": [
                        "Friday at midnight", 
                        "Sunday"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "JMU", 
                        "UVA"
                    ], 
                    "message_body": "JMU & Back. Driving to JMU on Friday at midnight (sorry) and coming back to UVA sometime Sunday!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425755907656/?sale_post_id=10155425755907656", 
                    "post_author": "Morgan Assel", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 21:29", 
                    "dates": [
                        "saturday", 
                        "Saturday", 
                        "afternoon"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "Cville", 
                        "Maryland", 
                        "DC", 
                        "Charlottesville"
                    ], 
                    "message_body": "Ride back to Cville on saturday!! Looking for a ride from Maryland or DC back to Charlottesville on Saturday. Any time in the afternoon really. I will pitch in some money!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656", 
                    "post_author": "David Truesdell", 
                    "refined_dates": [
                        "11/29/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": []
            }, 
            {
                "detail": {
                    "date_posted": "11/30/2016 10:39", 
                    "dates": [
                        "the morning of Saturday, December 10th"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "northern NJ"
                    ], 
                    "message_body": "Driving up to northern NJ the morning of Saturday, December 10th. Message me if you need a ride!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155427338037656/?sale_post_id=10155427338037656", 
                    "post_author": "Dana Serruto", 
                    "refined_dates": [
                        "12/10/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.9290779, 
                            "lng": -74.077072
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/30/2016 09:51", 
                    "dates": [
                        "this Friday", 
                        "Sunday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "VCURichmond"
                    ], 
                    "message_body": "Looking for a ride to VCU/Richmond this Friday coming back Sunday. Will pay for gas!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/?sale_post_id=10155427234222656", 
                    "post_author": "Sofia Ferrara", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": [
                    [
                        {
                            "lat": 37.5489872, 
                            "lng": -77.4534286
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 20:54", 
                    "dates": [], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "JMU"
                    ], 
                    "message_body": "is anybody going to JMU this friday/saturday? I will pay for your gas friend xoxo. pls just fb message me if you are willing to give a rando chick a ride i never get on here anymore", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425736112656/?sale_post_id=10155425736112656", 
                    "post_author": "Melissa Throckmorton", 
                    "refined_dates": [
                        "11/29/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            
            {
                "detail": {
                    "date_posted": "11/28/2016 14:21", 
                    "dates": [
                        "2 pm"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "central NJ"
                    ], 
                    "message_body": "driving to central NJ 12/15 around 2 pm..still have space so message me if you're looking for a ride!!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421741097656/", 
                    "post_author": "Maeve Humphreys", 
                    "refined_dates": [
                        "11/28/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.51106499999999, 
                            "lng": -74.37895
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 21:37", 
                    "dates": [
                        "saturday December 17th", 
                        "morning"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "dulles"
                    ], 
                    "message_body": "ride to dulles on saturday December 17th(preferably morning).", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425868477656/?sale_post_id=10155425868477656", 
                    "post_author": "Aditya Seth", 
                    "refined_dates": [
                        "12/17/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.9531162, 
                            "lng": -77.45653879999999
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
           
            {
                "detail": {
                    "date_posted": "11/29/2016 22:17", 
                    "dates": [
                        "Friday", 
                        "11:30", 
                        "Sunday"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "VT", 
                        "VT"
                    ], 
                    "message_body": "Ride to VT and back. Driving to VT on Friday around 11:30 and returning Sunday around 2, have space for 3 message if you need a ride!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425960632656/?sale_post_id=10155425960632656", 
                    "post_author": "Allison Belkowitz", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": [
                    [
                        {
                            "lat": 37.22838429999999, 
                            "lng": -80.42341669999999
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 20:34", 
                    "dates": [
                        "this weekend", 
                        "Dec."
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "JMU"
                    ], 
                    "message_body": "Is anyone headed to JMU this weekend (Friday-Sunday Dec. 2-4)? Looking for a ride", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/", 
                    "post_author": "Michael Gerard Wood", 
                    "refined_dates": [
                        "12/02/2016", 
                        "12/03/2016", 
                        "12/04/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/16/2016 11:14", 
                    "dates": [
                        "Winter"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "NYCHobokenNorthern New"
                    ], 
                    "message_body": "Ride to NYC/Northern New Jersey for Winter Break! looking for a ride to NYC/Hoboken/Northern New Jersey for winter break!! looking to leave sometime after 5pm on dec. 13 or early dec. 14! will help pay for gas and snacks :)", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155382253112656/?sale_post_id=10155382253112656", 
                    "post_author": "Audrey Kent", 
                    "refined_dates": [
                        "11/16/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.75387550000001, 
                            "lng": -74.02831669999999
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 12:05", 
                    "dates": [
                        "the day", 
                        "friday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "jmu"
                    ], 
                    "message_body": "anyone driving to jmu during the day on friday?", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155424396152656/?sale_post_id=10155424396152656", 
                    "post_author": "Mattie Leibowitz", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 11:34", 
                    "dates": [
                        "Friday", 
                        "Friday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "JMU", 
                        "JMUany"
                    ], 
                    "message_body": "ride to JMU Friday 12/2. Looking for a ride to JMU/any farther up 81 Friday anytime after 2! Willing to give some money for gas!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656", 
                    "post_author": "Kendall White", 
                    "refined_dates": [
                        "12/02/2016", 
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 08:44", 
                    "dates": [
                        "this Friday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "JMU"
                    ], 
                    "message_body": "looking for a ride to JMU this Friday the 2nd, willing to pay for gas!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155420973202656/?sale_post_id=10155420973202656", 
                    "post_author": "Nicholas Mann", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.435092, 
                            "lng": -78.8697548
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 11:25", 
                    "dates": [], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "UVa", 
                        "Baltimore", 
                        "Cville", 
                        "Baltimore"
                    ], 
                    "message_body": "Ride from UVa to Baltimore. Looking for a ride from Cville to Baltimore 12/17. Will pay for gas/snacks, etc.", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155424317712656/?sale_post_id=10155424317712656", 
                    "post_author": "Elizabeth Dorton", 
                    "refined_dates": [
                        "11/29/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }, 
                        {
                            "lat": 39.2903848, 
                            "lng": -76.6121893
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 15:09", 
                    "dates": [], 
                    "driver_or_rider": "driver", 
                    "locations": [], 
                    "message_body": "driving to orlando after finals. Trying to leave 12/15. I'll have my dog in the car too", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421838857656/?sale_post_id=10155421838857656", 
                    "post_author": "Adrien Carr\u00e9", 
                    "refined_dates": [
                        "11/28/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": []
            }, 
            {
                "detail": {
                    "date_posted": "11/29/2016 00:35", 
                    "dates": [
                        "Dec. 14"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "CTNY"
                    ], 
                    "message_body": "Anyone driving up to CT/NY on Dec. 14? Hmu", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155423083457656/", 
                    "post_author": "Victoria Moran", 
                    "refined_dates": [
                        "12/14/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 41.022554, 
                            "lng": -80.82708199999999
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 22:05", 
                    "dates": [
                        "Sunday 11th of December"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "NYCNJ"
                    ], 
                    "message_body": "Looking for a ride to NYC/NJ on Sunday 11th of December. Let me know, will chip in for gas :)", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155422819912656/", 
                    "post_author": "Laurent Weil", 
                    "refined_dates": [
                        "12/11/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.7127837, 
                            "lng": -74.0059413
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 21:11", 
                    "dates": [
                        "tomorrow evening"
                    ], 
                    "driver_or_rider": "driver", 
                    "locations": [
                        "Charlottesville", 
                        "DCA", 
                        "Cville"
                    ], 
                    "message_body": "Ride to Charlottesville. Driving down from DCA to Cville tomorrow evening. Let me know if you need a ride.", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155422714167656/?sale_post_id=10155422714167656", 
                    "post_author": "Eric Kim", 
                    "refined_dates": [
                        "11/29/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.0293059, 
                            "lng": -78.47667810000002
                        }, 
                        {
                            "lat": 38.851242, 
                            "lng": -77.04023149999999
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 15:54", 
                    "dates": [
                        "this Friday", 
                        "Sunday", 
                        "Friday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "RVA"
                    ], 
                    "message_body": "Looking for a ride to RVA this Friday 12/2 and back Sunday 12/4. Hoping to leave any time after 4 on Friday", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421941917656/?sale_post_id=10155421941917656", 
                    "post_author": "Alex Hendel", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": [
                    [
                        {
                            "lat": 37.5407246, 
                            "lng": -77.4360481
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 15:43", 
                    "dates": [
                        "this Friday", 
                        "Saturday"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "CNUthe general 757 vicinity"
                    ], 
                    "message_body": "Hi hello is anyone heading to CNU/the general 757 vicinity this Friday (12/2) and coming back on Saturday? Will exchange gummy worms, my eternal gratitude, and ca$h money for such a ride!!!!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421920752656/", 
                    "post_author": "Rachel Catalano", 
                    "refined_dates": [
                        "12/02/2016"
                    ], 
                    "roundtrip_or_oneway": "roundtrip"
                }, 
                "routes": []
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 12:09", 
                    "dates": [], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "NJ", 
                        "North Jersey ( Somerset County"
                    ], 
                    "message_body": "Ride to NJ, NYC area. Looking for a ride to North Jersey (Somerset County) either late on the 15th or anytime the 16th. I will chip in for gas and some food. Anywhere close or in that direction would be good.", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421380352656/?sale_post_id=10155421380352656", 
                    "post_author": "David Truesdell", 
                    "refined_dates": [
                        "11/28/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.0583238, 
                            "lng": -74.4056612
                        }, 
                        {
                            "lat": 40.554634, 
                            "lng": -74.571736
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 15:11", 
                    "dates": [
                        "December 15th", 
                        "5pm"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "New Jersey"
                    ], 
                    "message_body": "Looking for a ride to New Jersey on December 15th(after 5pm) or on the 16th! Please message me!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421848682656/", 
                    "post_author": "Tricia Stump", 
                    "refined_dates": [
                        "12/15/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 40.0583238, 
                            "lng": -74.4056612
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 14:39", 
                    "dates": [
                        "December 3rd", 
                        "8 am"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "Charlottesville Airport", 
                        "the Charlottesville Airport", 
                        "the area"
                    ], 
                    "message_body": "Ride to Charlottesville Airport Satruday 12/3. Looking for a ride to the Charlottesville Airport on December 3rd, anytime before 8 am. I would prefer to pay someone a couple bucks to drop me off rather than an Uber ($$). Please let me know if you will be passing through the area or would be interested in making a little trip up the road! Thanks!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421779162656/?sale_post_id=10155421779162656", 
                    "post_author": "Sarah Woolf", 
                    "refined_dates": [
                        "12/03/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 38.1393837, 
                            "lng": -78.4492753
                        }, 
                        {
                            "lat": 38.1393837, 
                            "lng": -78.4492753
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 09:07", 
                    "dates": [
                        "Tuesday the 13th"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [], 
                    "message_body": "Ride north on 12/13. Looking for someone who is leaving Tuesday the 13th anytime after 5 and heading anywhere north, whether it's only NOVA or farther! From NJ and trying to get closer to home to cut out some travel time for my mom!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155421024622656/?sale_post_id=10155421024622656", 
                    "post_author": "Julie Hohenstein", 
                    "refined_dates": [
                        "11/28/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": []
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 08:35", 
                    "dates": [
                        "December 11"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "Florida"
                    ], 
                    "message_body": "Anyone need a ride down to Florida on December 11? I'm driving my car and would prefer not to drive by myself", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155420945967656/", 
                    "post_author": "Ashley Kalbac", 
                    "refined_dates": [
                        "12/11/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": [
                    [
                        {
                            "lat": 27.6648274, 
                            "lng": -81.5157535
                        }, 
                        {
                            "lat": 38.0335529, 
                            "lng": -78.5079772
                        }
                    ]
                ]
            }, 
            {
                "detail": {
                    "date_posted": "11/28/2016 08:48", 
                    "dates": [
                        "today", 
                        "today", 
                        "noon"
                    ], 
                    "driver_or_rider": "rider", 
                    "locations": [
                        "DC", 
                        "Cville", 
                        "DC area", 
                        "Charlottesville"
                    ], 
                    "message_body": "Ride from DC to Cville today! Need ride from DC area to Charlottesville today around noon!!", 
                    "permalink": "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656", 
                    "post_author": "Fabi BC", 
                    "refined_dates": [
                        "11/28/2016"
                    ], 
                    "roundtrip_or_oneway": "oneway"
                }, 
                "routes": []
            }
        ], 
        "posts": {
            "drivers": {
                "https://www.facebook.com/groups/36509972655/permalink/10155421741097656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 40.51106499999999, 
                                "lng": -74.37895
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421838857656/?sale_post_id=10155421838857656": {
                    "routes": []
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155422714167656/?sale_post_id=10155422714167656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.851242, 
                                "lng": -77.04023149999999
                            }, 
                            "start": {
                                "lat": 38.0293059, 
                                "lng": -78.47667810000002
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425755907656/?sale_post_id=10155425755907656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425868477656/?sale_post_id=10155425868477656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.9531162, 
                                "lng": -77.45653879999999
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425960632656/?sale_post_id=10155425960632656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 37.22838429999999, 
                                "lng": -80.42341669999999
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155426001407656/?sale_post_id=10155426001407656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.9531162, 
                                "lng": -77.45653879999999
                            }, 
                            "start": {
                                "lat": 41.3329406, 
                                "lng": 21.5392803
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155427338037656/?sale_post_id=10155427338037656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 40.9290779, 
                                "lng": -74.077072
                            }
                        }
                    ]
                }
            }, 
            "riders": {
                "https://www.facebook.com/groups/36509972655/permalink/10155382253112656/?sale_post_id=10155382253112656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 40.75387550000001, 
                                "lng": -74.02831669999999
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155420945967656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 27.6648274, 
                                "lng": -81.5157535
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155420973202656/?sale_post_id=10155420973202656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155420982052656/?sale_post_id=10155420982052656": {
                    "routes": []
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421024622656/?sale_post_id=10155421024622656": {
                    "routes": []
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421380352656/?sale_post_id=10155421380352656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 40.554634, 
                                "lng": -74.571736
                            }, 
                            "start": {
                                "lat": 40.0583238, 
                                "lng": -74.4056612
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421779162656/?sale_post_id=10155421779162656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.1393837, 
                                "lng": -78.4492753
                            }, 
                            "start": {
                                "lat": 38.1393837, 
                                "lng": -78.4492753
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421848682656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 40.0583238, 
                                "lng": -74.4056612
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421920752656/": {
                    "routes": []
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155421941917656/?sale_post_id=10155421941917656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 37.5407246, 
                                "lng": -77.4360481
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155422415067656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155422819912656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 40.7127837, 
                                "lng": -74.0059413
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155423083457656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 41.022554, 
                                "lng": -80.82708199999999
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155424317712656/?sale_post_id=10155424317712656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 39.2903848, 
                                "lng": -76.6121893
                            }, 
                            "start": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155424336807656/?sale_post_id=10155424336807656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155424396152656/?sale_post_id=10155424396152656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425639847656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425736112656/?sale_post_id=10155425736112656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.435092, 
                                "lng": -78.8697548
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425852277656/?sale_post_id=10155425852277656": {
                    "routes": []
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155425961882656/?sale_post_id=10155425961882656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 35.2040494, 
                                "lng": -80.8352402
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155427234222656/?sale_post_id=10155427234222656": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 37.5489872, 
                                "lng": -77.4534286
                            }
                        }
                    ]
                }, 
                "https://www.facebook.com/groups/36509972655/permalink/10155428903787656/": {
                    "routes": [
                        {
                            "end": {
                                "lat": 38.0335529, 
                                "lng": -78.5079772
                            }, 
                            "start": {
                                "lat": 38.9531162, 
                                "lng": -77.45653879999999
                            }
                        }
                    ]
                }
            }
        }
    }, 
    "state": "virginia"
}
           
             
     ;
  initMap(results);
  
}



google.maps.event.addDomListener(window, 'load', initialize);