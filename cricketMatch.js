const prompt = require('prompt-sync')();
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question, callback) {
    rl.question(question + ' ', (answer) => {
        callback(answer);
    });
}

function askMultipleQuestions(questions, index, answers) {
    if (index < questions.length) {
        askQuestion(questions[index], (answer) => {
            answers.push(answer);
            askMultipleQuestions(questions, index + 1, answers);
        });
    } else {
        rl.close();
    }
}

const questions = ['Number of Overs:', 'Team-1 Name:', 'Players count of team1:', 'Team-2 Name:', 'Players count of team2:', 'Wide ball extra runs:', 'No ball extra runs:', 'Toss won team:', 'Elected to bat/field:', 'Start an innings/End an innings:'];
const shortCut = ['overs', 'team1Name', 'team1Count', 'team2Name', 'team2Count', 'wdExtra', 'nExtra', 'toss', 'batOrField', 'startOrEnd'];

const answers = [];
const extraRuns = { 'WD': 2, 'N': 0 };



askMultipleQuestions(questions, 0, answers);

rl.on('close', () => {

    let dict = {};
    for (let id in shortCut) {
        dict[shortCut[id]] = answers[id];
    }
    extraRuns['WD'] = Number(dict['wdExtra']);
    extraRuns['N'] = Number(dict['nExtra']);

    let flag = 0;
    (typeof (Number(dict['overs'])) === 'number') ? flag = 1 : flag = 0;
    validation();
    (dict['team1Name'] != dict['team2Name']) ? flag = 1 : flag = 0;
    validation();
    (dict['team1Count'] === dict['team2Count']) && ((dict['team1Count'] >= 5 && dict['team1Count'] <= 11) || (dict['team2Count'] >= 5 && dict['team2Count'] <= 11)) ? flag = 1 : flag = 0;
    validation();
    (dict['toss'] == dict['team1Name'] || dict['toss'] == dict['team2Name']) ? flag = 1 : flag = 0;
    validation();
    (dict['batOrField'] == 'bat' || dict['batOrField'] == 'field') ? flag = 1 : flag = 0;
    validation();
    (dict['startOrEnd'] == 'Start' || dict['startOrEnd'] == 'End') ? flag = 1 : flag = 0;
    validation();

    function validation() {
        if (flag === 0) {
            console.log("You have entered Invalid input!!");
            process.exit();
        }
    }

    class Ball {

        constructor() {
            this.ballType = "";
            this.runs = 0;
            this.extraRuns = 0;
            // this.ballDetails1=[];
        }
    }

    class Constants {
        static WICKET = "W";
        static VALID = "Valid";
        static WIDE = "WD";
        static NOBALL = "N";
        static UNDO = "UN";
        static EXIT = "E";
        static RUNRATE = "RR";
        static RUNRATEVALIDBALL = "RRVB";
        static RUN = "R";
        static DISPLAY = "D";
    }

    Object.freeze(Constants);

    class Over {
        constructor() {
            this.totalRuns = 0;
            this.balls = [];
            this.validBalls = ["0", "1", "2", "3", "4", "6"];
            this.nonValidBalls = [Constants.WIDE, Constants.NOBALL];
            this.inputChange = {
                "WICKET": Constants.WICKET,
                "W": Constants.WICKET,
                "WIDE": Constants.WIDE,
                "WD": Constants.WIDE,
                "NO BALL": Constants.NOBALL,
                "N": Constants.NOBALL,
                "NO": Constants.NOBALL,
                "UNDO": Constants.UNDO,
                "UN": Constants.UNDO,
                "EXIT": Constants.EXIT,
                "E": Constants.EXIT
            };
            this.extra_runs = { [Constants.WIDE]: 2, [Constants.NOBALL]: 1 };
            this.ballsDetails1 = [];
            this.wicky = [Constants.WICKET, Constants.WICKET, "Wicket"];
            this.wide = [Constants.WIDE, "Wide", "WD"];
            this.noball = [Constants.NOBALL, "No ball", "N"];
            this.wickets = 0;
            this.runsCount = 0;
            this.extraRunsCount = 0;
            this.validBallsBowled = 0;
            this.totalBallsBowled = 0;
        }

        divideNumStr(ball) {
            let arr = [];
            let numberPart = parseInt(ball);
            let stringPart = ball.substr(1, ball.length);
            arr.push(numberPart, stringPart);
            return arr;
        }

        handleInput(ball) {
            switch (ball) {
                case Constants.WICKET:

                    //console.log(ball)
                    this.balls.push(ball);
                    let key = this.inputChange[ball.toUpperCase()] || ball.toUpperCase();
                    let result = this.ballDetails(key);
                    //ballObj.ballType = Constants.WICKET;
                    this.ballsDetails1.push({ "Ball Type": result[0], "runs": result[1], "extra": result[2] });
                    break;
                case Constants.NOBALL || Constants.WIDE:
                    this.balls.push(ball);
                    key = this.inputChange[ball.toUpperCase()] || ball.toUpperCase();
                    result = this.ballDetails(key);
                    this.ballsDetails1.push({ "Ball Type": result[0], "runs": result[1], "extra": result[2] });
                    break;
                case Constants.EXIT:
                    if (this.balls.length === 6) {
                        console.log("Over completed. Exiting.");
                        process.exit();
                    } else {
                        console.log("Over is not completed yet. Cannot exit.");
                    }
                    break;
                case Constants.DISPLAY:
                    this.displayOver();
                    break;
                case Constants.UNDO:
                    this.undoLastBall();
                    break;
                case Constants.RUNRATEVALIDBALL:
                    this.getRunRateForValidBalls();
                    break;
                case Constants.RUNRATE:
                    this.getOverallRunRate();
                    break;
                case Constants.RUN:
                    this.getRuns();
                    break;
                default:
                    if (this.balls.length < 6 + this.invalidLength()) {
                        this.balls.push(ball);
                        let key = this.inputChange[ball.toUpperCase()] || ball.toUpperCase();
                        let result = this.ballDetails(key);
                        this.ballsDetails1.push({ "Ball Type": result[0], "runs": result[1], "extra": result[2] });
                    } else {
                        console.log("Over is already completed. Cannot add more balls.");
                    }
            }
        }

        getRunRateForValidBalls = () => {
            let validballs = [];
            let balls = [];
            for (let input of this.balls) {
                input = input.toUpperCase();
                if (input in this.inputChange) {
                    input = this.inputChange[input];
                    balls.push(input);
                }
                else {
                    balls.push(input);
                }
            }
            for (let i of balls) {
                if (this.validBalls.includes(i) || i == Constants.WICKET) {
                    validballs.push(i);
                }
            }

            let runs = this.getRuns();
            let runRate = runs / validballs.length;
            return runRate;
        }

        getRuns = () => {
            let totalRuns = 0;
            let tempRes = 0;
            let balls = [];
            for (let input of this.balls) {
                input = input.toUpperCase();
                if (input in this.inputChange) {
                    input = this.inputChange[input];
                    balls.push(input);
                }
                else {
                    balls.push(input);
                }
            }
            for (let index of balls) {
                if (this.validBalls.includes(index)) {
                    totalRuns += Number(index);
                }
                else if (index == Constants.WIDE || index == Constants.NOBALL) {
                    totalRuns += this.extra_runs[index];
                }
                else if (index == Constants.WICKET) {
                    totalRuns += 0;
                }
                else {
                    let total;
                    let temp = parseInt(index);
                    let res = index.substr(1, index.length);

                    if (res in this.inputChange) {
                        index = this.inputChange[res];
                        if (index == Constants.WIDE || index == Constants.NOBALL) {
                            tempRes = this.extra_runs[index];
                        }
                    }

                    total = (temp + tempRes);
                    totalRuns += total;
                }
            }

            return totalRuns;
        }

        getOverallRunRate = () => {
            let runs = this.getRuns();
            let runRate = runs / this.balls.length;
            return runRate;
        }

        ballDetails(ball) {
            let runsScored = 0;
            let extras = 0;
            let ballType = "";
            if (this.validBalls.includes(ball)) {
                this.validBallsBowled += 1;
                this.totalBallsBowled += 1;
                runsScored += parseInt(ball);
                ballType = Constants.VALID;
            }
            else if (ball === Constants.WICKET) {
                this.validBallsBowled += 1;
                this.totalBallsBowled += 1;
                ballType = Constants.WICKET;
            }
            else {
                if (this.nonValidBalls.includes(ball)) {
                    this.totalBallsBowled += 1;
                    extras += this.extra_runs[ball];
                    if (ball == Constants.WIDE) {
                        ballType = Constants.WIDE;
                    }
                    else {
                        ballType = Constants.NOBALL;
                    }
                }
                else {
                    const result = [...this.divideNumStr(ball)];
                    let temp = ball.substr(1, ball.length);
                    if (this.nonValidBalls.includes(result[1])) {
                        if (temp == Constants.WIDE) {
                            ballType = Constants.WIDE;
                        }
                        else {
                            ballType = Constants.NOBALL;
                        }
                        extras += this.extra_runs[temp];
                    }
                    runsScored += result[0];
                    this.totalBallsBowled += 1;
                }
            }

            let ballObj = new Ball();
            ballObj.ballType = ballType;
            ballObj.runs = runsScored;
            ballObj.extraRuns += extras;

            return ballObj;
        }

        getOver = () => {
            return this.balls;
        }

        invalidLength() {
            let invalid = [];
            let validballs = [];
            let balls = [];
            for (let input of this.balls) {
                input = input.toUpperCase();
                if (input in this.inputChange) {
                    input = this.inputChange[input];
                    balls.push(input);
                }
                else {
                    balls.push(input);
                }
            }
            for (let i of balls) {
                if (this.validBalls.includes(i) || i == Constants.WICKET) {
                    validballs.push(i);
                }
                else {
                    invalid.push(i);
                }
            }
            let invalid_length = invalid.length;
            return invalid_length;
        }

        undoLastBall() {
            if (this.balls.length > 0) {
                this.balls.pop();
                this.ballsDetails.pop();
                console.log("Undone last ball.");
            } else {
                console.log("No balls to undo.");
            }
        }

        displayOver = () => {
            console.log("Balls in the over: " + this.balls.join(" "));
            console.log("Runs in the over: " + this.getRuns());
            console.log("Run rate for valid balls: " + this.getRunRateForValidBalls());
            console.log("Overall run rate: " + this.getOverallRunRate());
        }

        print() {
            console.log(this.ballsDetails);
        }
    }

    class Innings {
        constructor(teamDetails, matchOvers, teamName) {
            this.teamDetails = teamDetails;
            this.matchOvers = matchOvers;
            this.teamName = teamName;
        }

        playInnings() {
            let oversBowled = 0;
            let overDetails = [];

            while (oversBowled < this.matchOvers && this.teamDetails.wickets < this.teamDetails.playersCount - 1) {
                const over = new Over();

                for (let i = 0; i < 6 + over.invalidLength(); i++) {
                    console.log(`Enter ball ${i + 1} details for ${this.teamName} innings:`);
                    const ballInput = prompt(`${i + 1}th ball:`);

                    if (ballInput == 'W') {
                        this.teamDetails.wickets += 1;
                    }

                    let changedBallInput = ballInput.toUpperCase();
                    let extractArray = over.ballDetails(changedBallInput);
                    let extractExtras = extractArray[2];
                    this.teamDetails.extras += extractExtras;
                    over.handleInput(ballInput);
                }

                const runs = over.getRuns();
                this.teamDetails.runs += runs;
                this.teamDetails.overs += 1;
                let runRate = this.teamDetails.runs / (dict.overs * 6);
                this.teamDetails.runRate = runRate;
                console.log(this.teamDetails);
                overDetails.push(this.teamDetails);
                oversBowled++;
            }
            console.log(overDetails);
        }
    }

    class Match {
        constructor() {
            this.team1Details = {};
            this.team2Details = {};
            this.matchOvers = 0;
            this.currentInnings = 1;
            this.matchStatus = 'Match Not Started';
            this.winningTeam = null;
            this.firstInnings;
            this.secondInnings;
        }

        setTeam() {
            this.team1Details = {
                "teamName": dict["team1Name"],
                "playersCount": dict["team1Count"],
                "runs": 0,
                "overs": 0,
                "wickets": 0,
                "extras": 0,
                "runRate": 0,
            };

            this.team2Details = {
                "teamName": dict["team2Name"],
                "playersCount": dict["team2Count"],
                "runs": 0,
                "overs": 0,
                "wickets": 0,
                "extras": 0,
                "runRate": 0,
            };

        }

        initialize() {
            this.matchOvers = dict['overs'];
            this.playInnings();
            this.displayMatchStatus();
        }

        playInnings() {
            this.setTeam();

            while (this.currentInnings <= 2) {
                console.log(`Start Innings ${this.currentInnings}`);
                const currentTeamDetails = this.currentInnings === 1 ? this.team1Details : this.team2Details;
                let innings;

                if (this.currentInnings === 1) {
                    this.firstInnings = new Innings(currentTeamDetails, this.matchOvers, currentTeamDetails.teamName);
                    innings = this.firstInnings;
                } else if (this.currentInnings === 2) {
                    this.secondInnings = new Innings(currentTeamDetails, this.matchOvers, currentTeamDetails.teamName);
                    innings = this.secondInnings;
                }

                innings.playInnings();

                console.log(`End of Innings ${this.currentInnings}`);
                this.currentInnings++;
            }


            console.log(this.firstInnings);
            console.log(this.secondInnings);

            if (this.firstInnings.teamDetails.runs > this.secondInnings.teamDetails.runs) {
                let runs = this.firstInnings.teamDetails.runs - this.secondInnings.teamDetails.runs;
                console.log(`${this.team1Details.teamName} Won the Match by ${runs} runs`);
            } else {
                let remWickets = dict.team2Count - this.team2Details.wickets;
                console.log(`${this.team2Details.teamName} Won the Match by ${remWickets} wickets`);
            }
        }

        displayMatchStatus() {
            if (this.currentInnings === 1) {
                console.log('1st innings completed');
                this.matchStatus = '1st innings completed';
            } else {
                console.log('Match over..Result declared!!');
                this.matchStatus = 'Match over..Result declared!!';
            }
        }
    }

    const match = new Match();
    match.initialize();

});