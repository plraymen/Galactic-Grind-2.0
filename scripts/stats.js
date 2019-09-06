stats = {
	time_played_offline : 0,
    time_played : 0,
    time_played_real : 0,
    time_extra_seconds : 0,
    total_clicks : 0,
	click_value : 0,
	click_credits : 0,
	credits_earned : 0,
}

function getDaysPlayed() {
	var days = stats.time_played_offline / 86400;
	
	return days;
}