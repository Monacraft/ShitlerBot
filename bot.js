const Discord = require("discord.js");          // [Global]
const client = new Discord.Client();            // [Global]
var games = [];                                 // [Global]
var myID = '396082583244636160';                // [Global]
var fs = require('fs');                         // [Global] 

var token;
client.on('ready', () => {
    m = client.guilds.map(function (obj) {
        return obj.members;
    });
    for (var i = 0; i < m.length; i++) {

        console.log("\n\nNew Guild: ");
        console.log(m[i].map(function (obj) {
            return obj.guild.name + ", " + obj.user.username;
        }).join('\n')
        );
    }
    client.user.setGame("$start or $help");
    console.log(`Logged in as ${client.user.tag}!`);
});

var shutdown = false;
var existingGames = [];


function GarbageDump(id, callback) {
    console.log(games);
    for (var i = 0; i < games.length; i++) {
        console.log(games[i].id);
    }
}

function canStart(id, callback, fail) {
    console.log(id);
    var started = false;
    console.log(games);
    existingGames.map(function (obj) {
        console.log(obj);
        if (obj === id) {
            started = true;
        }
    });
    if (!started) {
        callback();
    } else {
        fail();
    }
}

client.on('message', msg => {
    if (msg.content === '$ping') {
        msg.reply("Pong!")
        if (client.user.lastMessage == null) {
            const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === client.user.id, { time: 10000 });
            collector.on('collect', message => {
                console.log(message.content);
                collector.stop("Got my message");
            });
        } else {
            console.log(client.user.lastMessage.content);
        }
    }
    if (msg.content === '$start') {
        canStart(msg.channel.id, function () {
            games.push(new classGame(msg.channel, msg.author, msg));
            games[games.length - 1].id = games.length - 1;
            existingGames.push(msg.channel.id)
            msg.author.send('Hello, you own the lobby in ' + msg.guild.name + ' (' + msg.channel.name + ')');
        },
            function () {
                msg.author.send('Lobby already in ' + msg.guild.name + ' (' + msg.channel.name + ')');
            }
        );
    }
    if (msg.content === '$shutdown') {
        if (msg.author.id === '130568487679688704') {
            shutdown = true;
            msg.reply("Goodbye :')");
        }
    }
    if (msg.content === '$help') {
        msg.author.send(
            `Here is a rules site:
https://secrethitler.io/rules

Explanation of interface coming soon...
        `);
    }
    if (msg.author.id === myID && shutdown) {
        process.exit();
    }
});

fs.readFile('..\\ShitlerBot.token', 'utf8', function (err, data) {
    if (err) throw err;
    token = data;
    client.login(token);
});


/// GAME CLASS

function calculateRoles(n, callback) {
    var liberals;
    switch (n) {
        case 1:
            liberals = 0;
            break;
        case 4:
            liberals = 2;
            break;
        case 5:
            liberals = 3;
            break;
        case 6:
            liberals = 4;
            break;
        case 7:
            liberals = 4;
            break;
        case 8:
            liberals = 5;
            break;
        case 9:
            liberals = 5;
            break;
        case 10:
            liberals = 6;
            break;
        default:
            // Should never happen
            console.log("Invalid Players");
            liberals = -1;
            break;
    }
    var fascists = n - liberals - 1;
    callback(liberals, fascists);
}

var pass = "✅";
var fail = "❌";
var letterL = "🇱";
var letterF = "🇫";
var heart = "❤";
var question = "❔";
var box = "⬛";
var numbers = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];


function classGame(channelArg, ownerArg, msgArg) {
    var stopGame = false;
    var players = [];
    var alivePlayers = [];
    var channel = channelArg;
    var owner = ownerArg;
    var currentmsg;
    var directmsg = ownerArg;
    var currentGameRound = 0;
    var roundStage = 0;
    var liberalCount = 0;
    var fascistCount = 0;
    var liberals = [];
    var fascists = [];
    var liberalPolicies = 0;
    var fascistPolicies = 0;
    var hitler = '';
    var idRoles = {};
    var roomName = '';
    var turn = 0;
    var selectedId = 0;
    var passVotes = 0;
    var passVoters = '';
    var failVotes = 0;
    var failVoters = '';
    var deck = [];
    var ldecksize = 6;
    var fdecksize = 11;
    var currentCards = [];
    var policy;

    msgArg.channel.send('Starting Game');
    client.on('message', msg => {
        if (!stopGame && msg.channel.type === 'text') {
            if (msg.channel.id === channel.id) {
                if (currentGameRound === 0) {
                    if (msg.author.id === myID) {
                        if (msg.content === 'Starting Game') {
                            currentmsg = msg;
                            roomName = msg.guild.name + ' (' + msg.channel.name + ')';
                            currentmsg.react(heart);
                            ShuffleDeck(function () {

                            });
                        }
                    } else {
                        if (msg.author.id === owner.id) {
                            if (msg.content === 'ready') {
                                if (/* players.length < 4 ||*/ players.length > 10) {
                                    msg.delete();
                                    currentmsg.react(fail);
                                } else {
                                    alivePlayers = players;
                                    ChainRoles(function () {
                                        alivePlayers.map(function (p) {
                                            if (p.id in idRoles) {
                                                p.send('Hello, you are ' + idRoles[p.id] + ' in ' + roomName);
                                            }
                                        });
                                        currentGameRound = 1;
                                        msg.channel.send("Next Round!");
                                    });
                                }
                            }
                            if (msg.content === 'test') {
                                alivePlayers.push(msg.author);
                                console.log(msg.author.dmChannel.id)
                                liberalPolicies = 2;
                                fascistPolicies = 3;
                                currentGameRound = 1;
                                turn = -1;
                                msg.channel.send("Next Round!");
                            }
                        }
                    }
                }
                if (currentGameRound > 0) {
                    if (msg.author.id === myID) {
                        if (msg.content === 'Next Round!') {
                            turn++;
                            if (turn >= alivePlayers.length) {
                                turn = 0;
                            }
                            currentmsg = msg;
                            roundStage = 1;
                            inGamePrint(function (s) {
                                msg.edit(s);
                                for (var i = 0; i < alivePlayers.length; i++) {
                                    if (i !== turn) {
                                        msg.react(numbers[i]);
                                    }
                                }
                            });
                        }
                        if (msg.content === "VoteCall") {
                            currentmsg = msg;
                            passVotes = 0;
                            passVoters = '';
                            failVotes = 0;
                            failVoters = '';
                            roundStage = 2;
                            msg.edit(
                                `\`\`\`
${alivePlayers[turn].username} Selected: ${alivePlayers[selectedId].username} (ID: ${selectedId})
Vote: Yes or No
_______________________________________________________________
\`\`\`
`);
                            msg.react(pass);
                            msg.react(fail);
                        }
                        if (msg.content === "VoteFinish") {
                            if (passVotes > failVotes) {
                                // WIN DETECTION
                                if (fascistPolicies >= 3 && hitler === alivePlayers[selectedId].id) {
                                    // Game Lose
                                } else {
                                    roundStage = 3;
                                    alivePlayers[turn].createDM();
                                    currentmsg = msg;
                                    msg.edit("Vote Passed: " + alivePlayers[turn].username + " is selecting policies to pass on");
                                    alivePlayers[turn].send("PCardChoose");
                                    directmsg = alivePlayers[turn];
                                }
                            } else {
                                msg.edit("Vote Failed!\nNext Round...")
                                currentGameRound++;
                                msg.channel.send("Next Round!");
                            }
                        }
                        if (msg.content === "PolicyResult") {
                            if (policy === 'l') {
                                ldecksize--;
                                liberalPolicies++;
                                msg.edit("The Policy is in favour of the Liberals!")
                            } else {
                                fdecksize--;
                                fascistPolicies++;
                                msg.edit("The Policy is in favour of the Fascists!")
                                // SPECIAL STUFF PER ROUND
                            }
                            // WIN DETECTION
                            if (liberalPolicies === 5) {
                                // Game Win
                            }
                            if (fascistPolicies === 6) {
                                // Game Lose
                            }
                            msg.channel.send("Next Round!");
                        }
                    }
                }
                // Regardless of gameRound
                if (msg.author.id !== myID) {
                    if (msg.content === "end" && msg.author.id === owner.id) {
                        stopGame = true;
                        msg.channel.send(
                            `Game Forcefully Terminated: 
${alivePlayers.map(function (obj) { return obj.username + " : " + idRoles[obj.id]; }).join('\n')}
`);
                        GarbageDump(this.id, function () { });

                        // TODO: Announce gg
                        // TODO: Message who was what
                    } else {
                        msg.delete();
                        //console.log(client.users);
                    }
                }
            }
            // END
        }
        if (!stopGame && msg.author.id === myID && msg.channel.type === 'dm') {
            if (msg.channel.recipient.id === directmsg.id) {
                if (msg.content === "PCardChoose") {
                    if (deck.length < 3) {
                        ShuffleDeck(function () {
                            currentCards = deck.splice(0, 3);
                        });
                    } else {
                        currentCards = deck.splice(0, 3);
                    }
                    msg.edit("Cards: " + currentCards.map(function (obj) { if (obj === 'l') { return "Liberal" } return "Fascist" }).join(', ') + "\nSelect the Policy to *DISCARD*");
                    if (currentCards.indexOf('l') > -1) {
                        msg.react(pass);
                    }
                    if (currentCards.indexOf('f') > -1) {
                        msg.react(fail);
                    }
                }
                if (msg.content === "CCardChoose") {
                    roundStage = 4;
                    msg.edit("Cards: " + currentCards.map(function (obj) { if (obj === 'l') { return "Liberal" } return "Fascist" }).join(', ') + "\nSelect the Policy to *PASS ON*");
                    if (currentCards.indexOf('l') > -1) {
                        msg.react(pass);
                    }
                    if (currentCards.indexOf('f') > -1) {
                        msg.react(fail);
                    }
                }
            }
        }
    });
    client.on('messageReactionAdd', react => {
        if (!stopGame && react.message.channel.id === currentmsg.channel.id) {
            console.log("Reacted: " + react.emoji.name);
            if (currentGameRound === 0) {
                if (react.message.id === currentmsg.id) {
                    //console.log(react.emoji.reaction["users"].map(function(obj) {return obj.username}).join(', '));
                    //console.log(react.emoji.name);
                    //console.log(react.count);
                    if (react.emoji.name === heart) {
                        preGamePrint(react, function (s) {
                            react.message.edit(s);
                        });
                    }
                }
            }
            if (currentGameRound > 0) {
                if (react.message.id === currentmsg.id) {
                    if (roundStage === 2) {
                        if (react.emoji.name === pass) {
                            passVotes = react.count - 1;
                            passVoters = '';
                            passVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                            passVoters = "/* " + passVoters.substring(2, passVoters.length) + " *";
                        }
                        if (react.emoji.name === fail) {
                            failVotes = react.count - 1;
                            failVoters = '';
                            failVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                            failVoters = "/* " + failVoters.substring(2, passVoters.length) + " *";
                        }
                        react.message.edit(
                            `\`\`\`
${alivePlayers[turn].username} Selected: ${alivePlayers[selectedId].username} (ID: ${selectedId})
Vote: Yes or No
_______________________________________________________________
Pass Votes: ${passVoters}
Fail Votes: ${failVoters}
\`\`\`
`);
                        if (passVotes + failVotes === alivePlayers.length) {
                            react.message.channel.send("VoteFinish");
                        }
                    }
                    if (roundStage === 1) {

                        //console.log(react.emoji.reaction["users"]);
                        //var u = react.emoji.reaction.users.filter(function (obj) { return obj.id === alivePlayers[turn].id });
                        if (react.emoji.name === "0" || react.emoji.name === "1" || react.emoji.name === "2" || react.emoji.name === "3" ||
                            react.emoji.name === "4" || react.emoji.name === "5" || react.emoji.name === "6" || react.emoji.name === "7" ||
                            react.emoji.name === "8" || react.emoji.name === "9") { }
                        reactFilter(react, alivePlayers[turn].id, function () {
                            // Move to Vote
                            selectedId = parseInt(react.emoji.name);
                            if (selectedId > -1 && selectedId < alivePlayers.length /*&& selectedId !== turn*/)
                                react.message.channel.send("VoteCall");
                        });
                    }
                }
            }
            // End
        }
        if (!stopGame && react.message.channel.type === "dm") {
            if (react.message.channel.recipient.id === directmsg.id) {
                if (roundStage === 3) {
                    reactFilter(react, alivePlayers[turn].id, function () {
                        var choice = '';
                        if (react.emoji.name === pass) {
                            choice = 'l';
                        } else {
                            choice = 'f';
                        }
                        if (currentCards.indexOf(choice) > -1) {
                            react.message.send("You have selected to discard " + choice);
                            directmsg = alivePlayers[selectedId];
                            currentCards.splice(currentCards.indexOf(choice), 1);
                            // Chancelor
                            alivePlayers[selectedId].createDM();
                            currentmsg.edit("Vote Passed: /* " + alivePlayers[selectedId].username + " * is finalising policy");
                            alivePlayers[selectedId].send("CCardChoose");
                        }
                    });
                }
            }
            if (roundStage === 4) {
                reactFilter(react, alivePlayers[selectedId].id, function () {
                    var choice = '';
                    if (react.emoji.name === pass) {
                        choice = 'l';
                    } else {
                        choice = 'f';
                    }
                    if (currentCards.indexOf(choice) > -1) {
                        // Policy
                        policy = choice;
                        react.message.send("You have selected to discard " + choice);
                        currentmsg.edit("Vote Passed: /* " + alivePlayers[turn].username + " * and /* " + alivePlayers[selectedId].username + " * have selected a policy:");
                        currentmsg.channel.send("PolicyResult");
                    }
                });
            }
        }
    });
    client.on('messageReactionRemove', react => {
        if (!stopGame && react.message.channel.id === currentmsg.channel.id) {
            if (currentGameRound === 0) {
                if (react.message.id === currentmsg.id) {
                    preGamePrint(react, function (s) {
                        react.message.edit(s);
                    });
                }
            }
            if (currentGameRound > 0) {
                if (react.message.id === currentmsg.id) {
                    if (roundStage === 2) {
                        if (react.emoji.name === pass) {
                            passVotes = react.count - 1;
                            passVoters = '';
                            passVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                            passVoters = "/* " + passVoters.substring(2, passVoters.length) + " *";
                        }
                        if (react.emoji.name === fail) {
                            failVotes = react.count - 1;
                            failVoters = '';
                            failVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                            failVoters = "/* " + failVoters.substring(2, passVoters.length) + " *";
                        }
                        react.message.edit(
                            `\`\`\`
/* ${alivePlayers[turn].username} * Selected: /* ${alivePlayers[selectedId].username} * (ID: ${selectedId})
Vote: Yes or No
_______________________________________________________________
Pass Votes: ${passVoters}
Fail Votes: ${failVoters}
\`\`\`
`);
                    }
                }
                // END
            }
        }
    });
    function preGamePrint(react, callback) {
        players = react.users.array();
        players = players.filter(function (obj) { return obj.id !== myID });
        var readyText = 'An Error Occured';
        var stats = '';
        if (players.length > 4 && players.length < 11) {
            calculateRoles(players.length, function (l, f) {
                stats = `\n_______________________________________________________________
There will be ${l} Liberals, ${f} Fascists and a Secret Hitler.
`;
            });
            readyText = owner.username + ' type ready when everyone has joined.'
        } else {
            readyText = 'Not enough players, need atleast 5...'
        }
        callback(
            `\`\`\`asciidoc
[Welcome to SecretHitler :)]
Current Players: /* ${players.map(function (obj) { return obj.username }).join(', ')} *

React [${heart}] to join.
${readyText}${stats}
\`\`\``);
    }
    function inGamePrint(callback) {
        var outlist = [];
        var f = [];
        var l = [];
        for (var i = 0; i < 10; i++) {
            if (i < alivePlayers.length) {
                outlist.push("\n" + i + '. ' + alivePlayers[i].username);
            } else {
                outlist.push('');
            }
        }
        callback(
            `\`\`\`md
The current round is: ${currentGameRound}
===================================================================
 The President is: /* ${alivePlayers[turn].username} (ID: ${turn}) *

Liberal Policies: <${liberalPolicies}>
Fascist Policies: <${fascistPolicies}>

Players
===================================================================
${outlist[0]}${outlist[1]}${outlist[2]}${outlist[3]}${outlist[4]}${outlist[5]}${outlist[6]}${outlist[7]}${outlist[8]}${outlist[9]}

Cards in Deck: <${deck.length}>
${alivePlayers[turn].username} Select Your Chancellor:
\`\`\``
            /*
            `\`\`\`md
The current round is: ${currentGameRound}
===================================================================
/* The President is: ${alivePlayers[turn].username} (ID: ${turn}) *
\`\`\`**LIBERAL POLICIES**                                                                                                                  ${box}    __**Players:**__
-----------    -----------    -----------   -----------    -----------                                               ${box}    ${outlist[0]}
|               |    |               |    |               |     |               |    |               |                                               ${box}    ${outlist[1]}
|    ${l[0]}    |    |    ${l[1]}    |    |    ${l[2]}    |    |    ${l[3]}    |    |    ${l[4]}    |                                               ${box}    ${outlist[2]}
|               |    |               |    |               |     |               |    |               |                                               ${box}    ${outlist[3]}   
-----------    -----------    -----------   -----------    -----------                                               ${box}    ${outlist[4]}
**FASCIST POLICIES**                                                                                                                  ${box}    ${outlist[5]}
-----------    -----------    -----------   -----------    -----------    -----------                        ${box}    ${outlist[6]}
|               |    |               |    |               |     |               |    |               |    |               |                        ${box}    ${outlist[7]}
|    ${f[0]}    |    |    ${f[1]}    |    |    ${f[2]}    |    |    ${f[3]}    |    |    ${f[4]}    |    |    ${f[4]}    |                        ${box}    ${outlist[8]}
|               |    |               |    |               |     |               |    |               |    |               |                        ${box}    ${outlist[9]}
-----------    -----------    -----------   -----------    -----------    -----------                        ${box}    

Card in Deck: *${deck.length}*
__${alivePlayers[turn].username}__ Select Your Chancellor:`*/
        );
    }
    function AssignRoles(callback) {
        var roles = [];
        hitler = '';
        liberals = [];
        fascists = [];
        calculateRoles(alivePlayers.length, function (l, f) {
            roles.push('Hitler');
            for (var i = 0; i < l; i++) {
                roles.push('Liberal');
            }
            for (var i = 0; i < f; i++) {
                roles.push('Fascist');
            }
        });
        callback(roles);
    }
    function ChainRoles(callback) {
        AssignRoles(function (roles) {
            console.log('Generating Roles: ')
            console.log(roles);
            console.log(roles.length);
            alivePlayers.map(function (p) {
                console.log(p.username)
                var r = random(0, roles.length - 1);
                console.log(r);
                console.log(roles[r]);
                idRoles[p.id] = roles[r];
                if (roles[r] == "Hitler") {
                    hitler = p.id;
                }
                if (roles[r] == "Liberal") {
                    liberals.push(p.id);
                }
                if (roles[r] == "Fascist") {
                    fascists.push(p.id);
                }
                roles.splice(r, 1);
            });
            console.log(idRoles);
        });
        callback();
    }
    function ShuffleDeck(callback) {
        deck = [];
        var cards = [];
        for (var i = 0; i < ldecksize; i++) {
            cards.push('l');
        }
        for (var i = 0; i < fdecksize; i++) {
            cards.push('f');
        }
        for (var i = 0; i < ldecksize + fdecksize; i++) {
            var r = random(0, cards.length - 1);
            deck.push(cards[r]);
            cards.splice(r, 1);
        }
        callback();
    }
}
/*
    client.on('message', msg => {
        if (msg.channel.id === channel.id && msg.author.id !== myID) {
            
        }
    });

*/

function random(low, high) {
    // Inclusive for low, exclusive for high
    min = Math.ceil(low);
    max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function reactFilter(react, id, callback) {
    var match = false;
    var u = react.emoji.reaction.users.filter(function (obj) {
        if (obj.id === id) {
            match = true;
        }
        return obj.id === id
    });
    if (match) {
        callback();
    }
}