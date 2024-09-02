function cheat(){
  var code = jQuery("#selection > nobr").text();
  if(code.charCodeAt() == 160){
    code = 32;
  }else{ 
    code = code.charCodeAt();
  }
  jQuery.event.trigger({ type: 'keypress', which: code });
}

var time = [];
var StartTime = 0;
var stopped = false;
function timer(){
  if(!stopped){
    TIPP10.main.stopTimer();
    stopped = true;
  }
 
  var time1 = (time[0]*60)+(time[1])-1;
  time[1] = (time1)%60;
  time[0] = Math.floor(time1/60);
  jQuery("#seconds").text(`Zeit: ${time[0]}:${String(time[1]).padStart(2,0)}`);
  jQuery("#cpm").text(`A/min: ${Math.round(parseInt($("#chars").text().split("Zeichen: ")[1])/1.5)}`);
  if(time1 <= 0){
    TIPP10.main.saveResult()
  }
};

document.addEventListener("keypress",function(){setInterval(cheat, 0.1);time = jQuery("#seconds").text().split("Zeit: ")[1].split(":");time[0] = parseInt(time[0]);time[1] = parseInt(time[1]);StartTime=(time[0]*60)+(time[1])-1;setInterval(timer, 1000);})


