function fancyNumber(x) {
	//var x = toFixed(x)
    if (typeof x === 'string') {return x}
	
	var negative = "";
	if (x < 0) {negative = "-";}
	x = Math.abs(x);
	
	if (x < 1000000) {return negative + (Math.ceil(x*10)/10).toFixed(1);}
	else if (x>=1e6 && x<1e9) {return negative + roundPlace(x/1e6).toFixed(2)+" Million"}
	else if (x>=1e9 && x<1e12) {return negative + roundPlace(x/1e9).toFixed(2)+" Billion"}
	else if (x>=1e12 && x<1e15) {return negative + roundPlace(x/1e12).toFixed(2)+" Trillion"}
	else if (x>=1e15 && x<1e18) {return negative + roundPlace(x/1e15).toFixed(2)+" Quadrillion"}
	else if (x>=1e18 && x<1e21) {return negative + roundPlace(x/1e18).toFixed(2)+" Quintillion"}
	else if (x>=1e21 && x<1e24) {return negative + roundPlace(x/1e21).toFixed(2)+" Sextillion"}
	else if (x>=1e24 && x<1e27) {return negative + roundPlace(x/1e24).toFixed(2)+" Septillion"}
	else if (x>=1e27 && x<1e30) {return negative + roundPlace(x/1e27).toFixed(2)+" Octillion"}
	else if (x>=1e30 && x<1e33) {return negative + roundPlace(x/1e30).toFixed(2)+" Nonillion"}
	else if (x>=1e33 && x<1e36) {return negative + roundPlace(x/1e33).toFixed(2)+" Decillion"}
	else if (x>=1e36 && x<1e39) {return negative + roundPlace(x/1e36).toFixed(2)+" Undecillion"}
	else if (x>=1e39 && x<1e42) {return negative + roundPlace(x/1e39).toFixed(2)+" Duodecillion"}
	else if (x>=1e42 && x<1e45) {return negative + roundPlace(x/1e42).toFixed(2)+" Tredecillion"}
	else if (x>=1e45 && x<1e48) {return negative + roundPlace(x/1e45).toFixed(2)+" Quaddecillion"}
	else if (x>=1e48 && x<1e51) {return negative + roundPlace(x/1e48).toFixed(2)+" Quindecillion"}
	else if (x>=1e51 && x<1e54) {return negative + roundPlace(x/1e51).toFixed(2)+" Sexdecillion"}
	else if (x>=1e54 && x<1e57) {return negative + roundPlace(x/1e54).toFixed(2)+" Septendecillion"}
	else if (x>=1e57 && x<1e60) {return negative + roundPlace(x/1e57).toFixed(2)+" Octodecillion"}
	else if (x>=1e60 && x<1e63) {return negative + roundPlace(x/1e60).toFixed(2)+" Novemdecillion"}
	else {return "Infinity"}
}
function shortNumber(x) {
	//var x = toFixed(x)
    if (typeof x === 'string') {return x}
	
	var negative = "";
	if (x < 0) {negative = "-";}
	x = Math.abs(x);
	
	if (x < 1000000) {return negative + (Math.ceil(x*10)/10).toFixed(0);}
	else if (x>=1e6 && x<1e9) {return negative + roundPlace(x/1e6).toFixed(2)+" M"}
	else if (x>=1e9 && x<1e12) {return negative + roundPlace(x/1e9).toFixed(2)+" B"}
	else if (x>=1e12 && x<1e15) {return negative + roundPlace(x/1e12).toFixed(2)+" T"}
	else if (x>=1e15 && x<1e18) {return negative + roundPlace(x/1e15).toFixed(2)+" Qu"}
	else if (x>=1e18 && x<1e21) {return negative + roundPlace(x/1e18).toFixed(2)+" Qin"}
	else if (x>=1e21 && x<1e24) {return negative + roundPlace(x/1e21).toFixed(2)+" Sx"}
	else if (x>=1e24 && x<1e27) {return negative + roundPlace(x/1e24).toFixed(2)+" Sp"}
	else if (x>=1e27 && x<1e30) {return negative + roundPlace(x/1e27).toFixed(2)+" Oc"}
	else if (x>=1e30 && x<1e33) {return negative + roundPlace(x/1e30).toFixed(2)+" No"}
	else if (x>=1e33 && x<1e36) {return negative + roundPlace(x/1e33).toFixed(2)+" Dec"}
	else if (x>=1e36 && x<1e39) {return negative + roundPlace(x/1e36).toFixed(2)+" Un"}
	else if (x>=1e39 && x<1e42) {return negative + roundPlace(x/1e39).toFixed(2)+" Duo"}
	else if (x>=1e42 && x<1e45) {return negative + roundPlace(x/1e42).toFixed(2)+" Tre"}
	else if (x>=1e45 && x<1e48) {return negative + roundPlace(x/1e45).toFixed(2)+" Qude"}
	else if (x>=1e48 && x<1e51) {return negative + roundPlace(x/1e48).toFixed(2)+" Qnde"}
	else if (x>=1e51 && x<1e54) {return negative + roundPlace(x/1e51).toFixed(2)+" Sxde"}
	else if (x>=1e54 && x<1e57) {return negative + roundPlace(x/1e54).toFixed(2)+" Spen"}
	else if (x>=1e57 && x<1e60) {return negative + roundPlace(x/1e57).toFixed(2)+" Ocde"}
	else if (x>=1e60 && x<1e63) {return negative + roundPlace(x/1e60).toFixed(2)+" Node"}
	else {return "Infinity"}
}
function roundPlace(x) {
	return (Math.round(x*100)/100);
}
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}
function secondsToTime(x) {
	var hours   = Math.floor(x / 3600);
    var minutes = Math.floor((x - (hours * 3600)) / 60);
    var seconds = Math.floor(x - (hours * 3600) - (minutes * 60));

	var hours_dis = "";
	var minutes_dis = "";
	
    if (hours != 0) {hours_dis = hours + "h ";}
    if (minutes != 0) {minutes_dis = minutes + "m ";}
    seconds_dis = seconds + "s";
	return hours_dis + minutes_dis + seconds_dis;
	
}