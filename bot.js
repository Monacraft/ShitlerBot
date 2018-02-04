const Discord = require("discord.js");          // [Global]
const client = new Discord.Client();            // [Global]
var games = [];                                 // [Global]
var myID = '396082583244636160';                // [Global]
var fs = require('fs');                         // [Global] 

var token;
client.on('ready', () => {
    x = client.guilds.get('393407148836782081').channels.get('393407148836782083')
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
    for (var i = 0; i < games.length; i++) {
        if (games[i].id === id) {
            games.splice(i, 1);
            console.log("REMOVED: " + games[i].id);
        }
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

var runningGames = 0;
var text = `
__** Information **__
dasda
dasdasda
adsdasd`
var x;
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
    if (msg.content === '$spam') {
        msg.channel.send(text)
    }
    if (msg.content === '$test') {
        client.guilds.get('393407148836782081').channels.get('393407148836782083').fetchMessages({ limit: 10 }).then(
            messages => {
                //console.log(messages)
                messages.map(function (obj) {
                    if (obj.content.substring(0, 9) === text.substring(1, 10) && obj.author.id === myID) {
                        client.guilds.get('393407148836782081').channels.get('393407148836782083').fetchMessage(obj.id).then(
                            msg => {
                                msg.delete();
                            }
                        ).catch(console.error)
                    }
                })
            }
        ).catch(console.error);
    }

    if (msg.content === '$start') {
        canStart(msg.channel.id, function () {
            games.push(new classGame(msg.channel, msg.author, msg));
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
    var ls;
    switch (n) {
        case 1:
            ls = 0;
            break;
        case 3:
            ls = 2;
            break;
        case 4:
            ls = 2;
            break;
        case 5:
            ls = 3;
            break;
        case 6:
            ls = 4;
            break;
        case 7:
            ls = 4;
            break;
        case 8:
            ls = 5;
            break;
        case 9:
            ls = 5;
            break;
        case 10:
            ls = 6;
            break;
        default:
            // Should never happen
            console.log("Invalid Players");
            ls = -1;
            break;
    }
    var fs = n - ls - 1;
    callback(fs, ls);
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
    var id = runningGames++;

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
                                                p.send('Hello, you are __**`' + idRoles[p.id] + '`**__ in __' + roomName + '__');
                                                if (idRoles[p.id] === "Fascist") {
                                                    p.send("You're fellow fascist are: " + fascists.join(", ") + " and hitler is: " + hitlerName);
                                                }
                                                if (p.id === hitler) {
                                                    if (fascists.length === 1) {
                                                        p.send("You're fellow fascist are: " + fascists.join(", "));
                                                    }
                                                }
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
                            msg.edit(
                                `\`\`\`
${alivePlayers[turn].username} Selected: ${alivePlayers[selectedId].username} (ID: ${selectedId})
Vote: Yes or No
_______________________________________________________________
\`\`\`
`);
                            //msg.react(pass);
                            //msg.react(fail);
                            if (electionTracker > 2) {
                                passvotes = 1;
                                failvotes = 0;
                                passVoters = "";
                                failVoters = `
Vote Forced due to 3 consecutive failed votes
`;
                                msg.channel.send("VoteFinish");
                            } else {
                                roundStage = 2;
                                for (var i = 0; i < alivePlayers.length; i++) {
                                    alivePlayers[i].send(`Vote`);
                                }
                            }
                        }
                        if (msg.content === "VoteFinish") {
                            if (passVotes > failVotes) {
                                // WIN DETECTION
                                currentmsg.edit(
                                    `\`\`\`md
<${alivePlayers[turn].username}> Selected: <${alivePlayers[selectedId].username}> (ID: ${selectedId})
Vote: Yes or No in your direct messages
_______________________________________________________________
Pass Votes: ${passVoters}
Fail Votes: ${failVoters}
\`\`\`
`);
                                if (fascistPolicies >= 3 && hitler === alivePlayers[selectedId].id) {
                                    // Game Lose
                                    stopGame = true;
                                    msg.channel.send(`\`You elected hitler... Game over
${alivePlayers.map(function (obj) { return obj.username + " : " + idRoles[obj.id]; }).join('\n')}\``);
                                } else {
                                    roundStage = 3;
                                    alivePlayers[turn].createDM();
                                    currentmsg = msg;
                                    electionTracker = 0;
                                    msg.edit("Vote Passed: " + alivePlayers[turn].username + " is selecting policies to pass on");
                                    alivePlayers[turn].send("PCardChoose");
                                    directmsg = alivePlayers[turn];
                                }
                            } else {
                                msg.edit("Vote Failed!\nNext Round...")
                                currentGameRound++;
                                electionTracker++;
                                msg.channel.send("Next Round!");
                            }
                        }
                        if (msg.content === "PolicyResult") {
                            if (policy === letterL) {
                                ldecksize--;
                                liberalPolicies++;
                                msg.edit("The Policy is in favour of the Liberals! " + letterL)
                            } else {
                                fdecksize--;
                                fascistPolicies++;
                                roundStage = 5;
                                msg.edit("The Policy is in favour of the Fascists! " + letterF)
                                // SPECIAL STUFF PER ROUND
                            }
                            // WIN DETECTION
                            if (liberalPolicies === 5) {
                                // Game Win
                                msg.channel.send(`\`The Liberals have WON!!!
${alivePlayers.map(function (obj) { return obj.username + " : " + idRoles[obj.id]; }).join('\n')}\``);
                                stopGame = true;
                            }
                            if (fascistPolicies === 6) {
                                // Game Lose
                                msg.channel.send(`\`The Fascist have WIN!!!
${alivePlayers.map(function (obj) { return obj.username + " : " + idRoles[obj.id]; }).join('\n')}\``);
                                stopGame = true;
                            }
                            msg.channel.send("Special Action");
                        }
                        if (msg.content === "Special Action") {
                            if (roundStage !== 5) {
                                msg.delete();
                                msg.channel.send("Next Round!");
                            }
                            currentmsg = msg;
                            // qwerty
                            if (fascistPolicies === 1) {
                                msg.edit(`\`Investigate Action, \` __\`${alivePlayers[turn].username}\`__ \` select who to investigate\``);
                                alivePlayers[turn].send("Special Action");
                            }
                            if (fascistPolicies === 2) {
                                msg.edit(`Special election is not implemented yet :(`);
                                msg.channel.send("Next Round!");
                            }
                            if (fascistPolicies === 3) {
                                msg.edit(`\`Peek Action, \` __\`${alivePlayers[turn].username}\`__ \` will be shown top 3 cards \``);
                                alivePlayers[turn].send("Special Action");
                            }
                            if (fascistPolicies === 4) {
                                msg.edit(`\`Execute Action, \` __\`${alivePlayers[turn].username}\`__ \` select who to execute \``);
                                alivePlayers[turn].send("Special Action");
                            }
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
                    msg.edit("`Cards: " + currentCards.map(function (obj) { if (obj === letterL) { return letterL + "iberal" } return letterF + "ascist" }).join(', ')
                        + "`(" + currentCards.map(function (obj) { if (obj === letterL) { return letterL } return letterF }).join(',') + ")"
                        + "\n`Select the Policy to` __**`DISCARD`**__");
                    if (currentCards.indexOf(letterL) > -1) {
                        msg.react(letterL);
                    }
                    if (currentCards.indexOf(letterF) > -1) {
                        msg.react(letterF);
                    }
                }
                if (msg.content === "CCardChoose") {
                    roundStage = 4;
                    msg.edit("`Cards: " + currentCards.map(function (obj) { if (obj === letterL) { return letterL + "iberal" } return letterF + "ascist" }).join(', ')
                        + "`(" + currentCards.map(function (obj) { if (obj === letterL) { return letterL } return letterF }).join(',') + ")"
                        + "\n`Select the Policy to` __**`ENACT`**__ ");
                    if (currentCards.indexOf(letterL) > -1) {
                        msg.react(letterL);
                    }
                    if (currentCards.indexOf(letterF) > -1) {
                        msg.react(letterF);
                    }
                }
            }
            if (msg.content === "Vote") {
                if (msg.author.id === myID) {
                    msg.edit(`\`\`\`md
Vote for president: <${alivePlayers[turn].username}> with chancelor <${alivePlayers[selectedId].username}>
\`\`\``);
                    msg.react(pass);
                    msg.react(fail);
                }
            }
            if (msg.content === "Special Action") {
                // qwerty
                if (roundStage === 5) {
                    var outlist = [];
                    for (var i = 0; i < 10; i++) {
                        if (i < alivePlayers.length) {
                            outlist.push("\n" + i + '. ' + alivePlayers[i].username);
                        } else {
                            outlist.push('');
                        }
                    }
                    if (fascistPolicies === 1) {
                        msg.edit(`
\`\`\`md
Who would you like to investigate?
===================================================================
${outlist[0]}${outlist[1]}${outlist[2]}${outlist[3]}${outlist[4]}${outlist[5]}${outlist[6]}${outlist[7]}${outlist[8]}${outlist[9]}
            \`\`\``);
                        for (var i = 0; i < alivePlayers.length; i++) {
                            if (i !== turn) {
                                msg.react(numbers[i]);
                            }
                        }
                    }
                    if (fascistPolicies === 2) {
                        // TODO
                    }
                    if (fascistPolicies === 3) {
                        var cards = deck[0] + ", " + deck[1] + ", " + deck[2];
                        msg.edit("The top 3 cards of the deck are: " + cards);
                        currentmsg.channel.send("Next Round!");
                    }
                    if (fascistPolicies === 4) {
                        msg.edit(`
\`\`\`md
Who would you like to kill?
===================================================================
${outlist[0]}${outlist[1]}${outlist[2]}${outlist[3]}${outlist[4]}${outlist[5]}${outlist[6]}${outlist[7]}${outlist[8]}${outlist[9]}
            \`\`\``);
                        for (var i = 0; i < alivePlayers.length; i++) {
                            if (i !== turn) {
                                msg.react(numbers[i]);
                            }
                        }
                    }
                }
            }
        }
        if (stopGame) {

        }
    });
    var voted = [];
    var electionTracker = 0;
    client.on('messageReactionAdd', (react, user) => {
        if (!stopGame && react.message.channel.id === currentmsg.channel.id) {
            console.log("Reacted: " + react.emoji.name);
            if (currentGameRound === 0) {
                if (react.message.id === currentmsg.id) {
                    if (react.emoji.name === heart) {
                        preGamePrint(react, function (s) {
                            react.message.edit(s);
                        });
                    }
                }
            }
        }
        if (currentGameRound > 0) {
            if (react.message.author.id === myID) {
                if (user.id !== myID) {
                    if (react.message.channel.type === 'dm') {
                        if (roundStage === 2) {
                            var ingame = 0;
                            for (var i = 0; i < alivePlayers.length; i++) {
                                if (alivePlayers[i].id === user.id) {
                                    ingame = 1;
                                }
                            }
                            if (ingame === 0) {
                                user.send("You are not in this game");
                            }
                            for (var i = 0; i < voted.length; i++) {
                                if (voted[i].id === user.id) {
                                    user.send("You have already voted");
                                    react.message.delete();
                                    return;
                                }
                            }
                            if (react.emoji.name === pass) {
                                passVotes++;
                                passVoters = '';
                                passVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                                passVoters = "/* " + passVoters.substring(2, passVoters.length) + " *";
                                voted.push(user.id);
                            }
                            if (react.emoji.name === fail) {
                                failVotes++;
                                failVoters = '';
                                failVoters = react.emoji.reaction["users"].map(function (obj) { if (obj.id !== myID) return obj.username }).join(', ');
                                failVoters = "/* " + failVoters.substring(2, passVoters.length) + " *";
                                voted.push(user.id);
                            }
                            react.message.delete();
                            react.message.channel.send("`You voted " + react.emoji.name + "`");
                            currentmsg.edit(
                                `\`\`\`md
<${alivePlayers[turn].username}> Selected: <${alivePlayers[selectedId].username}> (ID: ${selectedId})
Vote: Yes or No in your direct messages
_______________________________________________________________
Votes In: <${passVotes + failVotes}>
\`\`\`
`);
                            if (passVotes + failVotes === alivePlayers.length) {
                                currentmsg.channel.send("VoteFinish");
                            }
                        }
                    }
                }
                if (react.message.id === currentmsg.id) {
                    if (roundStage === 1) {
                        //var u = react.emoji.reaction.users.filter(function (obj) { return obj.id === alivePlayers[turn].id });
                        if (react.emoji.name === numbers[0] || react.emoji.name === numbers[1] || react.emoji.name === numbers[2] || react.emoji.name === numbers[3] ||
                            react.emoji.name === numbers[4] || react.emoji.name === numbers[5] || react.emoji.name === numbers[6] || react.emoji.name === numbers[7] ||
                            react.emoji.name === numbers[8] || react.emoji.name === numbers[9]) {
                            reactFilter(react, alivePlayers[turn].id, function () {
                                // Move to Vote
                                selectedId = parseInt(react.emoji.name);
                                if (selectedId > -1 && selectedId < alivePlayers.length /*&& selectedId !== turn*/) {
                                    react.message.channel.send("VoteCall");
                                }
                            });
                        }
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
                        if (react.emoji.name === letterL) {
                            choice = letterL;
                        } else {
                            choice = letterF;
                        }
                        if (currentCards.indexOf(choice) > -1) {
                            user.send("`You have selected to discard `" + choice);
                            directmsg = alivePlayers[selectedId];
                            currentCards.splice(currentCards.indexOf(choice), 1);
                            // Chancelor
                            alivePlayers[selectedId].createDM();
                            currentmsg.edit("Vote Passed: " + alivePlayers[selectedId] + " is finalising policy");
                            alivePlayers[selectedId].send("CCardChoose");
                        }
                    });
                }
            }
            if (roundStage === 4) {
                reactFilter(react, alivePlayers[selectedId].id, function () {
                    var choice = '';
                    if (react.emoji.name === letterL) {
                        choice = letterL;
                    } else {
                        choice = letterF;
                    }
                    if (currentCards.indexOf(choice) > -1) {
                        // Policy
                        policy = choice;
                        user.send("`You have selected to enact `" + choice);
                        currentmsg.edit("Vote Passed:  " + alivePlayers[turn] + " and " + alivePlayers[selectedId] + " have selected a policy:");
                        currentmsg.channel.send("PolicyResult");
                    }
                });
            }
            if (roundStage === 5) {
                // qwerty
                if (fascistPolicies === 1) {
                    if (user.id === alivePlayers[turn].id) {
                        var investigateID = -1
                        if (react.emoji.name === numbers[0] || react.emoji.name === numbers[1] || react.emoji.name === numbers[2] || react.emoji.name === numbers[3] ||
                            react.emoji.name === numbers[4] || react.emoji.name === numbers[5] || react.emoji.name === numbers[6] || react.emoji.name === numbers[7] ||
                            react.emoji.name === numbers[8] || react.emoji.name === numbers[9]) {
                            investigateID = parseInt(react.emoji.name);
                            if (investigateID > -1 && investigateID < alivePlayers.length /*&& selectedId !== turn*/) {
                                var Role = idRoles[alivePlayers[investigateID].id];
                                if (Role === "Hitler") {
                                    Role = "Fascist";
                                }
                                user.send(`You have investigated ${alivePlayers[investigateID].username} and found they were ${Role}`);
                                currentmsg.edit(`__\`${alivePlayers[turn].username}\`__ \` investigated \` __\`${alivePlayers[investigateID].username}\`__ `);
                                currentmsg.channel.send("Next Round!");
                            }
                        }
                    }
                    if (fascistPolicies === 4) {
                        if (user.id === alivePlayers[turn].id) {
                            var killID = -1
                            if (react.emoji.name === numbers[0] || react.emoji.name === numbers[1] || react.emoji.name === numbers[2] || react.emoji.name === numbers[3] ||
                                react.emoji.name === numbers[4] || react.emoji.name === numbers[5] || react.emoji.name === numbers[6] || react.emoji.name === numbers[7] ||
                                react.emoji.name === numbers[8] || react.emoji.name === numbers[9]) {
                                killID = parseInt(react.emoji.name);
                                if (killID > -1 && killID < alivePlayers.length /*&& selectedId !== turn*/) {
                                    var Role = idRoles[alivePlayers[killID].id];
                                    alivePlayers.splice(killID, 1)
                                    if (killID === turn) {
                                        currentmsg.channel.send(`${alivePlayers[turn].username} couldn't take the pressure and killed themselves`);
                                        currentmsg.channel.send("Next Round!");
                                    }
                                    if (alivePlayers.length === 0) {
                                        stopGame = true;
                                        currentmsg.channel.send("Somehow everyone died?");
                                    }
                                    if (Role === "Hitler") {
                                        // GAME OVER
                                        stopGame = true;
                                        currentmsg.channel.send(`\`You killed hitler... Game over
${alivePlayers.map(function (obj) { return obj.username + " : " + idRoles[obj.id]; }).join('\n')}\``);
                                    }
                                    if (Role !== "Hitler") {
                                        user.send(`You have killed ${alivePlayers[investigateID].username}`);
                                        currentmsg.edit(`__\`${alivePlayers[turn].username}\`__ \` killed \` __\`${alivePlayers[investigateID].username}\`__ `);
                                        currentmsg.channel.send("Next Round!");
                                    }
                                }
                            }
                        }
                    }
                }
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
            // END
        }
    });
    function preGamePrint(react, callback) {
        players = react.users.array();
        players = players.filter(function (obj) { return obj.id !== myID });
        var readyText = 'An Error Occured';
        var stats = '';
        if (players.length > 4 && players.length < 11) {
            calculateRoles(players.length, function (f, l) {
                stats = `\n_______________________________________________________________
There will be ${ l} Liberals, ${f} Fascists and a Secret Hitler.
`;
            });
            readyText = owner.username + ' type ready when everyone has joined.'
        } else {
            readyText = 'Not enough players, need atleast 5...'
        }
        callback(
            `\`\`\`md
# Welcome to SecretHitler :)
Current Players: /* ${players.map(function (obj) { return obj.username }).join(', ')} *

React [${heart}] to join.
${readyText}${stats}
\`\`\``);
    }
    function inGamePrint(callback) {
        var outlist = [];
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
\`\`\``);
    }
    function AssignRoles(callback) {
        var roles = [];
        hitler = '';
        liberals = [];
        fascists = [];
        calculateRoles(alivePlayers.length, function (f, l) {
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
    var hitlerName = '';
    function ChainRoles(callback) {
        AssignRoles(function (roles) {
            console.log('Generating Roles: ');
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
                    hitlerName = p.username;
                }
                if (roles[r] == "Liberal") {
                    liberals.push(p.username);
                }
                if (roles[r] == "Fascist") {
                    fascists.push(p.username);
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
            cards.push(letterL);
        }
        for (var i = 0; i < fdecksize; i++) {
            cards.push(letterF);
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