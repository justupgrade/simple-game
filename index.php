<!DOCTYPE html>
<html>
<head>
    <title>Pathfinder Test</title>
    <script type="text/javascript" src='Include.js'></script>
    <script type="text/javascript">
        include("./AI/StateMachine.js");
        include("./AI/MoveTowardsEnemy.js");
        include("./AI/Attack.js");
        include("./AI/Agent.js");
        include("./AI/Idle.js");
        include("./AI/Scout.js");
        include("UnitSelector.js");
        include('Point.js');
        include('Tile.js');
        include('Unit.js');
        include('Grid.js');
        include('Pathfinder.js');
        include('Main.js');

        window.onload = function() {
            game = Main.getInstance();
        }

        function onTileClick(clickedTile) {
            game.onTileClick(clickedTile);
        }

        
    </script>
</head>
<body>
    <div style='margin: 5px'> 
        <input id='initBtn' style='display: none; background: green; font-weight: bold; color: white; border: solid 5px black' type='button' value='INIT' />
        <input id='startBtn' style='background: green; font-weight: bold; color: white; border: solid 5px black' type='button' value='START' onclick='game.onStartBtn()' />
        <input id='nextTurnBtn' style='display: none; background: orange; font-weight: bold; color: black; border: solid 5px black' type='button' value='NEXT TURN' onclick='game.onNextTurnBtn()'/>
    </div>
    <div style='background: black; color: white; padding: 2px 5px; margin: 5px; border: 2px gray solid'>
    <label id='movement_left'></label>
    </div>
    <div style='background: black; color: white; padding: 2px 5px; margin: 5px; border: 2px gray solid'>
        <label id='hp'></label>
    </div>
    <div id='player_group' style='float: left;'></div>
    <div style='float: left; margin: 5px' id='grid'></div>
    <div id='enemy_group' style='float: left;'></div>
</body>
</html>