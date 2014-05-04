/** @jsx React.DOM */

(function() {

var Cell = React.createClass({
    render: function() {
        if (this.props.number === 0) {
            return <div className="cell empty"></div>;
        }
        return <div className="cell"><div>{this.props.number}</div></div>;
    }
});

var Board = React.createClass({
    getInitialState : function() {
        return { cells : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0] };
    },
    flip : function(i, j) {
        console.log("flip " + i + " and " + j);
        var cells = this.state.cells;
        var prev = cells[i];
        cells[i] = cells[j];
        cells[j] = prev;
        this.setState({ cells: cells});
    },
    directions : {
        up : {
            can : function(zeroIndex) {
                return zeroIndex - 4 >= 0;
            },
            newIndex : function(zeroIndex) {
                return zeroIndex - 4;
            }
        },
        down : {
            can : function(zeroIndex) {
                return zeroIndex + 4 < 16;
            },
            newIndex : function(zeroIndex) {
                return zeroIndex + 4;
            }
        },
        left : {
            can : function(zeroIndex) {
                return zeroIndex % 4 != 0;
            },
            newIndex : function(zeroIndex) {
                return zeroIndex - 1;
            }
        },
        right : {
            can : function(zeroIndex) {
                return (zeroIndex + 1) % 4 != 0;
            },
            newIndex : function(zeroIndex) {
                return zeroIndex + 1;
            }
        }
    },
    move : function(direction) {
        console.log("try to move " + direction);
        var cells = this.state.cells;
        var zeroIndex = cells.indexOf(0);
        if (this.directions[direction].can(zeroIndex)) {
            this.flip(zeroIndex, this.directions[direction].newIndex(zeroIndex));
        }
        return this.directions[direction].can(zeroIndex);
    },
    keyDown : function(event) {
        console.log("key down with code " + event.keyCode);
        if (event.keyCode == 37) {
            this.move("right");
        }
        if (event.keyCode == 38) {
            this.move("down");
        }
        if (event.keyCode == 39) {
            this.move("left");
        }
        if (event.keyCode == 40) {
            this.move("up");
        }
    },
    init: function() {
        var count = parseInt(this.props.steps);
        console.log("init game with " + count + " steps");
        var dirs = [ "up", "down", "left", "right" ];
        var dirIndex = 0;
        while (count > 0) {
            dirIndex = Math.floor(Math.random() * 4);
            if (this.move(dirs[dirIndex])) {
                count--;
            }
        }
    },
    render : function() {
        var cells = this.state.cells;
        return (
            <div className="fifteen-board">
                {cells.map(function(number, key){
                    return <Cell key={key} number={number} />;
                })}
            </div>
        );
    }
});

var board = React.renderComponent(<Board steps="100" />, document.body, function() {
    this.init();
});

window.onkeydown = board.keyDown;

})();