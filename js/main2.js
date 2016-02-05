$("document").ready(function() {

  //******************* VARIABLES ********************************************//

  // variable setUp
  var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "rAx1337", "ESL_SC2"];
  var baseUrl = 'https://api.twitch.tv/kraken';


  //******************* MAIN FUNCTIONS TO HANDLE AJAX AND POPULATE DOM *******//
  function populateInit() {
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      var channelurl = baseUrl + "/channels/" + channel;
      $.ajax({
        "url": channelurl,
        dataType: "jsonp",
        success: populateDOM,
        error: console.log("error loading channels"),
      });
    }
  }


  function startSearch() {
    var search = $(".searchbar").val();
    console.log(search);
    $.ajax({
      url: baseUrl + "/search/channels?limit=25&q=" + search,
      dataType: "jsonp",
      success: searchFunc,
      error: console.log("fuck"),
    });
  }

  function searchFunc(data) {
    $(".item").remove();
    var arr = extractArr(data, 'channels');
    for (var i = 0; i < arr.length; i++) {
      populateDOM(arr[i]);
    }
  }
  // extract channels from obj and return arr of channels
  //generic function takes two arguments: 1. obj 2. what to extract

  function extractArr(data, toExtract) {
    var arr = data[toExtract];
    return arr;
  }

  // add new element to DOM -- elem needs to be object
  function populateDOM(elem) {
    var channelName, streamDesrc, thumbnail, channelIdName, channelLink;
    console.log("populateDom");
    // case 1 error is returned - happens only on exact search
    if (elem.error) {
      console.log("if statement fired");
      channelName = "Sorry, nothing found.";
      streamDesrc = "Account does not exist or has been deleted.";
      thumbnail = "../assets/warning.png";
      channelIdName = "";
      channelLink = "";

      // default behavior
    } else {
      channelName = elem.display_name;
      channelIdName = elem.name;
      if (elem.status) {
        streamDesrc = elem.status;
      } else {
        streamDesrc = "Description unavailable.";
      }
      channelLink = elem.url;
      thumbnail = elem.logo;
    }
    // template has to be inside func and after variables to work
    var itemTemplate =
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
    // call to api to check if channel is online here
    if (channelIdName !== "") {
      ajaxCallOnline(channelIdName);
    }
  }

  //call to api to check if channel is online
  function ajaxCallOnline(channelIdName) {
    var streamurl = baseUrl + "/streams/" + channelIdName;
    $.ajax({
      url: streamurl,
      dataType: "jsonp",
      success: checkOnline,
      error: console.log("error loading streams"),
    });
  }

  //adds class online to items of the list if so
  function checkOnline(data) {
    if (data.stream) {
      var tempName = data.stream.channel.name;
      $("#" + tempName).removeClass("offline");
      $("#" + tempName).addClass("online");
    }
  }

  function exactSearch() {
    $(".item").remove();
    var exactChannel = $(".searchbar").val();
    var exactChannelUrl = baseUrl + "/channels/" + exactChannel;
    $.ajax({
      url: exactChannelUrl,
      dataType: "jsonp",
      success: populateDOM,
      // doesn't work!!!
      error: errorMsgDOM,
    });
  }

  // doesn't work!!!!!!
  function errorMsgDOM() {
    console.log("blub");
    var template = `<div class="errormsg">
                      <h4>${exactChannel}</h4>
                      <p>...unfortunately this channel not available...</p>
                    </div>`;
    $(".list").append(template);
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
  $("button.exact").on("click", function() {
    exactSearch();
  });

  // start search
  $("button.go").click(startSearch);
  $(".searchbar").keypress(function(e) {
    if (e.which == 13) {
      startSearch();
    }
  });

  // run initial load of channels
  populateInit();
});
