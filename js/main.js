$("document").ready(function() {

  //******************* VARIABLES ********************************************//

  // variable setUp
  var streamer, channel, channelName, streamDesrc, thumbnail, channelLink, channelIdName;
  var z = 0;
  var streamArr = [];
  var channelArr = [];
  var channelurl, streamurl;
  var itemTemplate;
  var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "rAx1337", "ESL_SC2"];
  var baseUrl = 'https://api.twitch.tv/kraken';


  //******************* MAIN FUNCTIONS TO HANDLE AJAX AND POPULATE DOM *******//

  //load list of channels provided on start up
  


  // search for streams
  function startSearch() {
    var search = $(".searchbar").val();
    console.log(search);
    if (search.length > 2) {
      $.ajax({
        url: baseUrl + "/search/channels?limit=25&q=" + search,
        dataType: "jsonp",
        success: populateChannel,
        error: console.log("fuck"),
      });
    }
  }

  // function to populate DOM
  function populateChannel(obj) {
    $(".item").remove();
    var arr = obj.channels;
    for (var i = 0; i < arr.length; i++) {
      var data = arr[i];
      channelName = data.display_name;
      channelIdName = data.name;
      if (data.status) {
        streamDesrc = data.status;
      } else {
        streamDesrc = "Description unavailable.";
      }
      channelLink = data.url;
      thumbnail = data.logo;

      // template has to be inside func and after variables to work
      itemTemplate =
        `         <div class="item">
                <div class="indicator offline" id="${channelIdName}"></div>
                <div class="text">
                  <h4 class="text--title">${channelName}</h4>
                  <p>${streamDesrc}</p>
                </div>
                <a href="${channelLink}" class="logo" style="background-image: '${thumbnail}'">
                </a>
              </div>`;
      $(".list").append(itemTemplate);


      // call to api to check if channel is online
      streamurl = baseUrl + "/streams/" + channelIdName;
      $.ajax({
        url: streamurl,
        dataType: "jsonp",
        success: checkOnline,
        error: errorStream
      });
    }
  }


  // check if channel is streaming and mark as online if so
  function checkOnline(data) {
    if (data.stream) {
      var tempName = data.stream.channel.name;
      $("#" + tempName).removeClass("offline");
      $("#" + tempName).addClass("online");
    }
    console.log(data);
  }


  // error functions
  function errorChannel() {
    console.log("error loading channels");
  }

  function errorStream() {
    console.log("error loading streams");
  }




  //******************* User Interaction *****************************//

  // show/hide online offline channels

  $("button.online").on("click", function() {
    $(".item").show();
    $(".offline").closest(".item").hide();
  });
  $("button.offline").on("click", function() {
    $(".item").show();
    $(".online").closest(".item").hide();
  });
  $("button.all").on("click", function() {
    $(".item").show();
  });

  // start search
  $("button.go").click(startSearch);
  $(".searchbar").keypress(function(e){
    if(e.which == 13){
      startSearch();
    }
  });
});
