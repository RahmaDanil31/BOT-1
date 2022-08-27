const {Client,MessageEmbed} = require('discord.js');
const bot = new Client;
const mysql = require('mysql2');

const dbLaporan = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `bismillah(99)`,
    database:`db_laporan`
});

dbLaporan.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Db Connected');
    }
})

const token = 'MTAwOTM1MTg2MTkyNjYyOTM4Nw.GRLCCO.uzorDPL5P0NEYOvwWnQvrYX-BKu-Xdv0cloHKk';
var PREFIX='_';
var SUFFIX='?';

bot.on('ready',()=>{
    console.log('boot sedang online');
});

bot.on('message',message=>{
    let arrayMessage = message.content.split(/\r\n|\r|\n/g);
    let args = arrayMessage[0].substring(PREFIX.length).split(' ');

   switch(args[0]){
        case 'Laporan':
            if(Validasi(arrayMessage) && validasiData(arrayMessage)){
                const d = new Date( message.createdTimestamp );
                var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
                var dateInfo = d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
          
                var hour = arrayMessage[3].substring(arrayMessage[3].indexOf(SUFFIX)+1);
                var time=0;
                if(hour.includes(":")){
                    time = ((parseInt(hour.charAt(0))*60)+parseInt(hour.substring(hour.indexOf(":")+1)))/60;
                }else{
                    time=parseInt(hour);
                }

                dbLaporan.query(`INSERT INTO laporan (author,project,description,date,time_work) VALUES ('${message.author.username}',
                '${arrayMessage[1].substring(arrayMessage[1].indexOf(SUFFIX)+1).toUpperCase()}','${arrayMessage[2].substring(arrayMessage[2].indexOf(SUFFIX)+1)}',
                '${date}','${time}')`,(err)=>{
                    if(err){
                        message.reply("Format laporan anda tidak Valid!!");
                    }else{
                        const embed = new MessageEmbed()
                        .setColor(0x0099FF)
                        .setTitle('Laporan Kerja Harian')
                        .setAuthor('PT Sirius Indonesia', 'https://cdn.discordapp.com/attachments/690521827990175814/1012663569445310586/sirius-logo-128.png', 'https://www.siriuserp.com/')
                        .setDescription(message.author.username+' telah mengisi laporan harian kerja pada : '+dateInfo)
                        message.channel.send(embed);
                    }
                });
            }else{
                message.reply("Format laporan anda tidak Valid!!");
            }
        break;
   }
});

function Validasi(array){
    return (array.length==4 && array[1].split(SUFFIX)[0]=='Ngerjain project apa ni' && array[2].split(SUFFIX)[0]=='Membahas apa ya' && array[3].split(SUFFIX)[0]=='Hmm berapa lama/jam');
}

function validasiData(array){
    return !(array[3].substring(array[3].indexOf(SUFFIX)+1).includes(' ') || array[1].substring(array[1].indexOf(SUFFIX)+1).includes(' '));
}

bot.login(token);