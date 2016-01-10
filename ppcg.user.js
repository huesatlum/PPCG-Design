// ==UserScript==
// @name        PPCG Graduation Script
// @namespace   https://github.com/vihanb/PPCG-Design
// @version     2.1.0
// @description A script to self-graduate PPCG
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// @author      PPCG Community
// @grant       none
// ==/UserScript==

var site = 'other';
if(location.hostname === 'codegolf.stackexchange.com') site = 'main';
if(location.hostname === 'meta.codegolf.stackexchange.com') site = 'meta';
if(location.hostname === 'chat.stackexchange.com') site = 'chat';

function qS(x){return document.querySelector(x)}
function unicodes(x){return(x.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|./g)||[]).map(function(c){return c[1]?(c.charCodeAt(0)&1023)*1024+(c.charCodeAt(1)&1023)+65536:c.charCodeAt(0)})}
function chars(x){return unicodes(x).length}
function fchars(x){var y=chars(x);return y+" char"+(y==1?"":"s")}
function bf(x,y){return x+" "+y+" byte"+(x==1?"":"s")}
function bytes(x,y){ // Takes in a length of text and piece of header text, and returns "(# of bytes) (encoding) bytes"
  var ISO_8859_1 = /Japt|TeaScript|Retina/i;
  var UTF_16 = /Ziim|Funciton/i;
  var custom = /GS2|Seriously|Unicorn|Jelly|APL/i;
  y=y||"";
  if(PARSE_HEXDUMPS){
    var a="";
    x.replace(/[\da-f]{6,8}:? ((?:[\da-f][\da-f] ?){10,})[^\n]*\n?/gi,function(_,z){a+=z.replace(/\s/g,'')});
    if(a)return bf(a.length/2,"hex");
    if(/^[\da-f\s-]+$/i.test(x.replace(/\n/g,'')))return bf(x.replace(/[\s-]/g,'').length/2,"hex");
  }
  if(/iso.?8859.1/i.test(y)||ISO_8859_1.test(y))return bf(chars(x),"ISO-8859-1");
  if(/utf.?16/i.test(y)||UTF_16.test(y))return bf(x.length*2,"UTF-16");
  if(custom.test(y))return bf(chars(x),y.match(custom)[0]);
  // Else, fallback to UTF-8
  return bf(unicodes(x).map(function(c){return c>>16?4:c>>11?3:c>>7?2:1}).reduce(function(a,b){return a+b},0),"UTF-8");
}
function loadAnswers(onFinish) {
    var answers = [], i=5;
    function loadPage() {
        $.get(
            'https://api.stackexchange.com/2.2/questions/' +
            $('#question').data('questionid') + '/answers?page=' +
            (page++).toString() + '&pagesize=100&order=asc&sort=creation&site=codegolf&filter=!)Q29lpdRHRpfMsoUn(ODuEiP', readPage);
    }
    function readPage(data) {
        if (data.hasOwnProperty('error_id'))
            onFinish(data.error_id.toString());
        else {
           answers = answers.concat(data.items);
           if (data.has_more)
               loadPage();
           else
               onFinish(answers,console.log("answers",answers));
        }
    }
    var page = 1;
    loadPage(page, readPage);
}

var PARSE_CODEBLOCKS = true; // set to false to not parse code block lengths
var PARSE_HEXDUMPS = true; // set to false to not parse hexdump lengths

// Fonts
var HEADER_FONT = "'Exo 2', Verdana, sans-serif";  // Header text
var TEXT_FONT = "'Open Sans', 'Trebuchet MS', sans-serif"; // Everything else besides code
var FONT_URL = "//fonts.googleapis.com/css?family=Exo+2|Open+Sans"; // import any webfonts here
  
/** ~~~~~~~~~~~~~~~~ MAIN SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/
  
var main = {
  FAVICON: "//i.imgur.com/FMih93I.png",
  SPRITE_SHEET: "//rawgit.com/vihanb/PPCG-Design/master/sprites.svg",
  
  // Set to empty string for no background image
  BACKGROUND_IMAGE: "http://i.stack.imgur.com/t8GhU.png",
  BACKGROUND_TINT: "linear-gradient(rgba(153, 255, 165, 0.26), rgba(140, 255, 149, 0.26))", // Only a linear graident works

  BACKGROUND_LIGHT: localStorage.getItem("main.BACKGROUND_LIGHT") === "true", // Lighter shade of the background, CHANGE THROUGH OPTIONS
  MODE_DARK: localStorage.getItem("main.MODE_DARK") === "true",
  NO_LEADERBOARD: localStorage.getItem("main.NO_LEADERBOARD") === "true",
    
  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#EDFAEE",
  HEADER_BG_COLOR: "transparent",
  HEADER_BG_IMAGE: "",
  HEADER_TEXT_COLOR: "#4C4C4C",
  CONTAINER_BG_COLOR: "rgb(250, 250, 250)",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  STATS_COLOR: "#FAFAFA",
  TAG_COLOR: "#E7FFD8", /* Alternative Option: "rgb(177, 235, 124)"*/
  TAG_BORDER_COLOR: "transparent",
  
  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
};
  
/** ~~~~~~~~~~~~~~~~ META SITE CUSTOMIZABLE PROPERTIES ~~~~~~~~~~~~~~~~ **/
  
var meta = {
  FAVICON: "//i.imgur.com/xJx4Jdd.png",
  SPRITE_SHEET: "//rawgit.com/vihanb/PPCG-Design/master/sprites.svg",
  
  // Set to empty string for no background image
  BACKGROUND_IMAGE: "http://i.stack.imgur.com/HLJI4.png",
  BACKGROUND_TINT: "", 
    
  // You can use RGB, hex, or color names
  BACKGROUND_COLOR: "#F4F4F4",
  HEADER_BG_COLOR: "transparent",
  HEADER_TEXT_COLOR: "#4C4C4C",
  CONTAINER_BG_COLOR: "#FAFAFA",
  CURR_TAB_COLOR: "rgb(72,125,75)",
  BULLETIN_BG_COLOR: "#fff8dc",
  TAG_COLOR: "",
  TAG_BORDER_COLOR: "",
  
  // Specify nothing to make these default color
  BOUNTY_COLOR: "rgb(72,125,75)",
  BOUNTY_BG_COLOR: "rgb(172,225,175)",
};

var darktheme = {
	BACKGROUND_COLOR: "black"
};

var optionbox = { // Customizes option box
	BACKGROUND_TINT: "linear-gradient(rgba(69, 174, 103, 0.57), rgba(73, 166, 83, 0.47))",
	BACKGROUND_COLOR: "#FAFAFA"
};

if (localStorage.getItem('main.MODE_DARK') === "true") main = $.extend(main, darktheme);


/** ~~~~~~~~~~~~~~~~ END CSS PROPERTIES ~~~~~~~~~~~~~~~~ **/

if(site === 'main' || site === 'meta'){
  var obj = site == "meta" ? meta : main;
  
  // Options Menu
  $(".topbar-wrapper > .network-items").append('<a href="#" id="USER_Opt" class="topbar-icon yes-hover" style="z-index:1;width: 36px; background-image: url('+main.SPRITE_SHEET+'); background-position: 0px 0px;" title="Customize graduation design"></a>');
  $("body").prepend('<div id="USER_OptMenu" style="display: none; width: inherit; height: inherit;"><div id="USER_Backblur" style="position:absolute;z-index:2;width:100%;height:100%;background:rgba(0,0,0,0.5)"></div>'+
					'<div style="position:absolute;z-index:3;width:40%;height:40%;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);background:'+optionbox.BACKGROUND_COLOR+';padding:1em;">'+
					'<h1>Userscript Options</h1><div>'+
					'<div style="width:50%;height:100%;float:left;">'+
					'<input class="OPT_Bool" data-var="main.BACKGROUND_LIGHT" type="checkbox" id="light_bg_on"><label for="light_bg_on">Lighter Background?</label><br>'+
					'<input class="OPT_Bool" data-var="main.MODE_DARK" type="checkbox" id="dark_theme_on"><label for="dark_theme_on">Dark Theme? (WIP)</label><br>'+
					'<input class="OPT_Bool" data-var="main.NO_LEADERBOARD" type="checkbox" id="noleader"><label for="noleader">Disable Auto Leaderboard?</label>'+
					'</div><div style="width:50%;height:100%;float:right;">'+
					'</div></div>For changes to take effect: <button onclick="location.reload()">Refresh</button></div></div>');
  $("#USER_Opt").click(function() { $("#USER_OptMenu").fadeIn(50); });
  $("#USER_Backblur").click(function() { $("#USER_OptMenu").fadeOut(50); });
  $(".OPT_Bool").each(function() { $(this).prop("checked", eval(localStorage.getItem($(this).data('var'))) || eval($(this).data('var'))); });
  $(".OPT_Bool").change(function() {
	  localStorage.setItem($(this).data('var'), $(this).is(':checked'));
	  $(this).prop('checked', eval(localStorage.getItem($(this).data('var'))));
	  console.log(localStorage.getItem('main.BACKGROUND_LIGHT'));
  });
    
  $('#hlogo a').css({width: 'auto', 'font-family': HEADER_FONT}).prepend('<img src="' + main.FAVICON + '" height="50" style="vertical-align: middle; margin-right: 15px;" />');
  $('#hlogo').css('margin-top', '20px');
  
  if(site === "main") {
    $('.beta-title').remove();
      
    document.head.innerHTML += "<style>#sidebar #beta-stats,#sidebar #promo-box{border:none;background:"+main.STATS_COLOR+";}</style>";
	// Leaderboard
    if(!main.NO_LEADERBOARD && $('a.post-tag[href="/questions/tagged/code-golf"]')[0] && $(".answer")[1]) { // Tagged code-golf and has more than 1 answer
      var answers = [];
      loadAnswers(function(json) {
        answers = json.map(function(i,l,a) {
		  var copyvalue = i.body.slice().replace(/<(strike|s|del)>.*<\/\1>/g,"");
          i.body = i.body.replace(/^(?!<p><strong>|<h\d>)(.(?!<p><strong>|<h\d>))*/,"").replace(/<(strike|s|del)>.*<\/\1>/g,"").replace(/<a [^>]+>(.*)<\/a>/g,"$1").replace(/\(\s*(\d+)/g,", $1").replace(/\s*-\s+|:\s*/,", ");
          var j=+( (i.body.match(/(?:<h\d>|<p><strong>).+(-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1] || (i.body.match(/^\s*(?:<h\d>|<p><strong>).*?(\d+)\D*?<\/(?:h\d|strong)>/)||[])[1] );
          i.body = i.body.replace(RegExp(",?\\s*"+j+".*"),"");
          return [j, i, copyvalue];
        });
        var lv = 0;
        answers=answers.filter(function(a){return(""+a[0])!="NaN";}).sort(function(a,b){return a[0]-b[0];}).map(function(l,i,a) {
        if((a[i-1]||[NaN])[0] !== l[0]) lv = (i||0) + 1;
			console.log((l[2].match(/(?:<h\d>|<p><strong>)(.+?)[, -]\s*(?:-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1]);
        return '<tr><td>'+lv+'</td><td>' + ( (l[2].match(/(?:<h\d>|<p><strong>)(.+?)[, -]\s*(?:(?:\d*\.\d+|\d+)(?:\s*%)?(?:\s*[+*\/\-]\s*(?:\d*\.\d+|\d+)(?:\s*%)?)+\s*=\s*)?(?:-?\b\d+(?:\.\d+)?)\s*(?:bytes?|chars?|char[ea]ct[ea]?rs?)/)||[])[1]||(l[2].match(/\s*(?:<h\d>|<p><strong>)(\s*<a [^ >]+.+?<\/a>|(?:[#A-Za-z_\s\.\u00FF-\uFFFF!?]|(?:(?=\d+[^\d\n]+\d+\D*(?:<\/|$|\n))\d)|(?:(?=-\s?[A-Za-z_\u00FF-\uFFFF!?]).)|(?:(?=.+(,)),))+)/)||[0,"Lang N/A"])[1]).trim() + "</td><td>" + l[0] + ' bytes</td><td><a href="' + l[1].link + '">Link</a></td></tr>';
			  });
			  $(".question .post-text").append('<span><a id="USER_BOARD_TEXT">Show Answer Leadboard ▶</a></span>'+
				  			   '<div id="USER_BOARD" style="display:none"><table class="LEADERBOARD"><thead><tr><td>Rank</td><td>Language</td><td>Score</td><td>Link</td></tr></thead><tbody>'+answers.join("\n")+'</tbody></table> </div>');
		      $("#USER_BOARD_TEXT").click(function() {
			      $("#USER_BOARD").slideToggle(50, function() {
				      $("#USER_BOARD_TEXT").text(function () {
					      return $("#USER_BOARD").is(":visible") ? "Hide Answer Leadboard ▼" : "Show Answer Leadboard ▶";
				      });
			      });
		      });
        });
    }
  } else {
	  $('#hlogo img').attr('src', meta.FAVICON);
  }
  document.head.innerHTML += ("<style>@import url("+FONT_URL+");"+
    ".envelope-on,.envelope-off,.vote-up-off,.vote-up-on,.vote-down-off,.vote-down-on,.star-on,.star-off,.comment-up-off,.comment-up-on,.comment-flag,.edited-yes,.feed-icon,.vote-accepted-off,.vote-accepted-on,.vote-accepted-bounty,.badge-earned-check,.delete-tag,.grippie,.expander-arrow-hide,.expander-arrow-show,.expander-arrow-small-hide,.expander-arrow-small-show,.anonymous-gravatar,.badge1,.badge2,.badge3,.gp-share,.fb-share,.twitter-share,#notify-containerspan.notify-close,.migrated.to,.migrated.from{background-image:url(\"$$SPRITE_SHEET\");background-size: initial;}"+
    ".youarehere, #tabs a:hover{color:$$CURR_TAB_COLOR !important;border-bottom-color:$$CURR_TAB_COLOR !important;}"+
    (obj.BOUNTY_COLOR?".bounty-indicator-tab, .bounty-indicator, .bounty-award{background:$$BOUNTY_BG_COLOR;color:$$BOUNTY_COLOR !important;}":"")+
    "#sidebar .module.community-bulletin{background:$$BULLETIN_BG_COLOR;}"+
    "div.module.newuser,#promo-box{border-color:#e0dcbf;border-style:solid;border-width:1px;}"+
    ".yes-hover{cursor:pointer !important;}"+
    ".LEADERBOARD {border-collapse: collapse} .LEADERBOARD td { padding: 6px 8px } .LEADERBOARD tr:nth-child(even) { background-color: #F1F1F1 } .LEADERBOARD thead { border-bottom: 1px solid #DDD }"+
    "html,body{font-family:"+TEXT_FONT+";}"+
    "#header{background:$$HEADER_BG_COLOR;}#header *{color:$$HEADER_TEXT_COLOR !important;}"+
    (site=="meta"?".container{background:$$CONTAINER_BG_COLOR}":"")+
    "a.post-tag{background-color:$$TAG_COLOR;border-color:$$TAG_BORDER_COLOR}"+
    "div.module.newuser,div.module.community-bulletin,div.categories{background-color:$$BACKGROUND_COLOR;}"+
    (site=="meta"?".container{"+(obj.BACKGROUND_IMAGE?(obj.BACKGROUND_TINT?"background: $$BACKGROUND_TINT, url(\"$$BACKGROUND_IMAGE\");":"background-image:url(\"$$BACKGROUND_IMAGE\");")+"background-repeat:repeat-x;":"")+"background-color:$$BACKGROUND_COLOR;box-shadow:none !important;}":"")+
	 "</style>").replace(/\$\$(\w+)/g,function(_,x){return eval(site+"."+x);});
  try{qS("link[rel$=\"icon\"]").href = obj.FAVICON;}catch(e){}
  if(PARSE_CODEBLOCKS){
  $(".answer").each(function() {
    // Find the first header or strong element (some old posts use **bold** for header) and set h to its text
    var $header = $(this).find("h1, h2, h3, strong").first();
    var h = $header.length ? $header.text() : "";
    $(this).find("pre code").each(function() {
      var t=$(this).text().trim().replace("\r\n", "\n");
      $(this).parent().before('<div style="padding-bottom:4px;font-size:11px;">'+bytes(t,h)+", "+fchars(t)+"</div>");
    });
  });
  }
  if (site == "main") {
    $("#content").css("background", "none");
	$("body > .container").css("box-shadow", "none");
	$("#mainbar, .user-page #content").css('background', main.STATS_COLOR);
	$("#mainbar").css('padding', '15px');
	$("body .container").prepend('<div style="position: absolute; width: inherit; height: 120px; background: '+(localStorage.getItem('main.BACKGROUND_LIGHT')==="true"?'':main.BACKGROUND_TINT+', ')+ 'url('+main.BACKGROUND_IMAGE+')"></div>');
  }
  window.addEventListener("load",function(){
  setTimeout(function(){document.getElementById("footer").style.backgroundColor=obj.BACKGROUND_COLOR},300);
  });
if (site !== 'chat') {
  /*=== SHOWS VOTE COUNTS ===*/
  void function(t){var e=t.head||t.getElementsByTagName("head")[0]||t.documentElement,o=t.createElement("style"),n="/*Added through UserScript*/.vote-count-post{cursor:pointer;}.vote-count-post[title]{cursor:default;}.vote-count-separator{height:0;*margin-left:0;}";e.appendChild(o),o.styleSheet?o.styleSheet.cssText=n:o.appendChild(t.createTextNode(n));var s=t.createElement("script");s["textContent"in s?"textContent":"text"]="("+function(){var t=location.protocol+"//api.stackexchange.com/2.0/posts/",e="?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site="+location.host,o=1,n=StackExchange.helpers,s=$.fn.click;$.fn.click=function(){return this.hasClass("vote-count-post")&&!o?this:s.apply(this,arguments)};var r=function(s){var r,a=$(this),i=this.title;if(!(/up \/ /.test(i)||/View/.test(i)&&o)){o=0;var c=a.siblings('input[type="hidden"]').val();if(c||(r=a.closest("[data-questionid],[data-answerid]"),c=r.attr("data-answerid")||r.attr("data-questionid")),c||(r=a.closest(".suggested-edit"),c=$.trim(r.find(".post-id").text())),c||(r=a.closest(".question-summary"),c=/\d+/.exec(r.attr("id")),c=c&&c[0]),!c)return void console.error("Post ID not found! Please report this at http://stackapps.com/q/3082/9699");n.addSpinner(a),$.ajax({type:"GET",url:t+c+e+"&callback=?",dataType:"json",success:function(t){t=t.items[0];var e=t.up_vote_count,o=t.down_vote_count;e=e?"+"+e:0,o=o?"-"+o:0,$(".error-notification").fadeOut("fast",function(){$(this).remove()}),a.css("cursor","default").attr("title",e+" up / "+o+" down").html('<div style="color:green">'+e+'</div><div class="vote-count-separator"></div><div style="color:maroon">'+o+"</div>")},error:function(t){n.removeSpinner(),n.showErrorPopup(a.parent(),t.responseText&&t.responseText.length<100?t.responseText:"An error occurred during vote count fetch")}}),s.stopImmediatePropagation()}};$.fn.on?$(document).on("click",".vote-count-post",r):$(document).delegate(".vote-count-post","click",r)}+")();",e.appendChild(s),s.parentNode.removeChild(s)}(document);
}
}

if(site === 'chat') {
  // TODO: make these show up on new messages
  $('img.small-site-logo[title="Programming Puzzles & Code Golf"], .ob-post-siteicon[title="Programming Puzzles & Code Golf"]').attr('src', main.FAVICON);
  $('.ob-post-siteicon[title="Programming Puzzles & Code Golf Meta"]').attr('src', meta.FAVICON);
}

// Change the PPCG HNQ icon on all sijtes
$('.favicon-codegolf, .favicon-codegolfmeta').css({
  'background-image': 'url("' + main.FAVICON + '")',
  'background-position': 'initial',
  'background-size': 'contain'
});
$('.favicon-codegolfmeta').css('background-image', 'url("' + meta.FAVICON + '")');
