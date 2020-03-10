const Discord = require('discord.js');
const client = new Discord.Client();
const {google} = require('googleapis');
const calendar =google.calendar('v3');
const API_KEY="[YOUR_GAPI_KEY]";



client.once('ready', () => {

	console.log('[INIT] Ready!!');
});



client.on('message', message => {

	const embed = new Discord.MessageEmbed()
  // Calling !weekly
  if (message.content.toLowerCase()==='!weekly'){

		var answer='';

		let calendarPromise=calendar.events.list({
			"auth" : API_KEY,
			"calendarId" : "zsrstaff@gmail.com",
			"maxResults" : 1,
			"orderBy" : "startTime",
			"q" : "Minish Cap Randomizer Weekly",
			"singleEvents" : true,
			"timeMin" : (new Date()).toISOString()
		});

		calendarPromise.then(function(result){
			if (result.status!=200){
				console.log ('Error '+result.statusText);
				embed.setTitle('Unable to get calendar events!')
				.setColor(0xff0000)
				  message.channel.send(embed);
			} else {
				if (result.data.items.length){
				let nextEvent=result.data.items[0];
				let neStartDate=new Date(nextEvent.start.dateTime);
				let neDescription=nextEvent.description;
				let neTwitchChannel=neDescription.match(/(https:\/\/twitch\.tv\/[^\s\"]*)/m)[0];
				let now=new Date();
				let neGap=dhm(neStartDate-now);
			 	embed.setTitle('Next weekly is in '+ neGap.days+' days, '+neGap.hours+' hours, and ' +neGap.minutes+ ' minutes')
				embed.setDescription("Restream will be on: "+neTwitchChannel+"\n\n");
				embed.setURL(neTwitchChannel);
				// "YELLARI" YELLOW 4 THE WIN
				embed.setColor(0xffad21);
				message.channel.send(embed);
			} else {
				embed.setTitle('Didn\'t find any weekly!')
				.setColor(0xff0000)
				  message.channel.send(embed);
				}
			}
		});
  }
})

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return {
		'days':d,
		'hours':pad(h),
		'minutes':pad(m)
	};
}

client.login('YOUR_DISCORD_BOT_KEY');
