$("document").ready(function() {

  // variable setUp
  var streamer, channel, channelName, streamDesrc, thumbnail, channelLink, channelIdName;
  var z = 0;
  var streamArr = [];
  var channelArr = [];
  var channelurl, streamurl;
  var itemTemplate;
  var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "rAx1337", "ESL_SC2"];
  var baseUrl = 'https://api.twitch.tv/kraken';


  // function to populate DOM
  function populateChannel(data) {
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


  // check if channel is streaming and mark as online if so
  function checkOnline(data) {
    if (data.stream) {
      var tempName = data.stream.channel.name;
      $("#"+tempName).removeClass("offline");
      $("#"+tempName).addClass("online");
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


  // main call to api for information on channels specified in channels array
  for (var i = 0; i < channels.length; i++) {

    channel = channels[i];

    channelurl = baseUrl + "/channels/" + channel;
    $.ajax({
      "url": channelurl,
      dataType: "jsonp",
      success: populateChannel,
      error: errorChannel,
    });
  }


  // search for streams
  $(".searchbar").keypress(function(){

    var search = $(".searchbar").val();
    console.log(search);
    if(search.length > 2){
    $.ajax({
      url: baseUrl + "/search/channels?limit=25&q=" + search,
      dataType: "jsonp",
      success: searchReturn,
      error: console.log("fuck"),
    });
  }
  });

  function searchReturn(data){
    console.log("this is the data");
    console.log(data);

  }


  //******************* User Interaction *****************************//

  // show/hide online offline channels

  $("button.online").on("click", function(){
    $(".item").show();
    $(".offline").closest(".item").hide();
  });
  $("button.offline").on("click", function(){
    $(".item").show();
    $(".online").closest(".item").hide();
  });
  $("button.all").on("click", function(){
    $(".item").show();
  });

});
