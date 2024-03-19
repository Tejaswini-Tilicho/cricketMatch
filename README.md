[❓#1] The Cricket Match
You need to implement a class Match which obeys following properties
You need to ask the user
Number of overs
Team-1 Name, players count of that team
Team-2 Name, players count of that team
Wide ball extra runs
No ball extra runs
Toss and elected to bat/field
Start an innings, End an innings
A Match has the following properties
winners
Should return a winning team with wining criteria like win by wicket or by runs
if win by wicket <Team Name> Won the match by <x> wickets
if win by runs <Team Name> Won the match by <x> runs
if match is not ended return MATCH IN PROGRESS >
exportStats
You need to write the match statistics to a file
No need to have tables
Save The data to Statistics.txt file
Match Statistics as follows
+----------------------------+
| Match statistics           |
+----------------------------+
|<Match Status>              |
+----------------------------+
| <Match Overs>              |
+----------------------------+
| <Team Name>                |
+----------+-----------------+
| Runs     | <Runs Scored>   |
+----------+-----------------+
| Over     | <Overs Played>  |
+----------+-----------------+
| Wickets  | <Wickets Lost>  |
+----------+-----------------+
| Extras   | <Extra for Inn> |
+----------+-----------------+
| Run Rate | <RR for Inn>    |
+----------+-----------------+
Example
Match statistics

Team INDIA Won the Match

5 overs match

Team INDIA

RUNS 50
OVERS 5
WICKETS 3
EXTRAS 4
RUN RATE 7.5

Team PAK

RUNS 47
OVERS 5
WICKETS 2
EXTRAS 2
RUN RATE 7
Constraints
Overs

You need use previously used Over class in Assignment 10
End of innings

If N-1 player's of a team out innings will be End
If Number of overs of matches completed innings will End
Players count

Players per team should min 5 and max 11
Both teams should have equal number of players
exportStats

Match status
When match completed - <Team Name> Won the match
When match not stated - Match Not Started
When 1st innings completed - 1st innings completed
When Innings in process - Match In Progress
If you don't have stats data, place value - as a value for that filed
You can alter the Over accordingly for your requirements
