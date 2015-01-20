/** @jsx React.DOM */

(function() {

var ReactTransitionGroup = React.addons.TransitionGroup;
    
var mergeStyles = function() {
    var resultStyle = {};
    for (var i=0;i < arguments.length;i++) {
        if (arguments[i]) {
            for (var attr in arguments[i]) {
                resultStyle[attr] = arguments[i][attr];
            }
        }
    }
    return resultStyle;
}

var Cell = React.createClass({
    getInitialState : function() {
        var state = {};
        state.position = this.props.oldPosition;
        return state;
    },
    componentDidMount : function() {
        var state = {};
        state.position = this.props.newPosition;
        this.setState(state.position);
    },
    render: function() {
        if (this.props.number === 0) {
            var emptyCellStyle = {
                borderColor: "transparent",
                display: "block",
            };
            return <div className="cell empty" style={mergeStyles(this.props.style, emptyCellStyle, this.state.position)}></div>;
        }
        var innerDivStyle = {
                display: "table-cell",
                verticalAlign: "middle",
        };
        return <div className="cell" style={mergeStyles(this.props.style, this.state.position)}><div style={innerDivStyle}>{this.props.number}</div></div>;
    }
});

var Board = React.createClass({
    getInitialState : function() {
        var state = {};
        
        state.cellSize = 40;
        state.cellBorderSize = 1;
        state.cellMarginSize = 5;
        state.cellOuterSize = state.cellSize + 2 * state.cellBorderSize + 2 * state.cellMarginSize;
        state.cellBorderRadius = 8;

        state.boardSize = 4 * state.cellOuterSize;
        state.boardBorderSize = 1;
        state.boardPaddingSize = 10;
        state.boardBorderRadius = 2 * state.cellBorderRadius;
        state.boardBorderRadius = 2 * state.cellBorderRadius;

        return state;
    },
    getStyle : function() {
        return {
            height:   this.state.boardSize,
            width:    this.state.boardSize,
            border:   "solid black",
            borderWidth: this.state.boardBorderSize,
            padding:  this.state.boardPaddingSize,
            overflow: "hidden",
            borderRadius: this.state.boardBorderRadius,
        };
    },
    getCellStyle : function() {
        return {
            width: this.state.cellSize,
            height: this.state.cellSize,
            borderStyle: "solid",
            borderColor: "black",
            borderWidth: this.state.cellBorderSize,
            borderRadius: this.state.cellBorderRadius,
            margin: this.state.cellMarginSize,
            display: "table",
            textAlign: "center",
            position: "absolute",
            transition: "0.3s",
        };
    },
    getCellPosition : function(coords) {
        var position = {};
        position.left = coords.x * this.state.cellOuterSize + this.state.boardPaddingSize + this.state.cellMarginSize;
        position.top  = coords.y * this.state.cellOuterSize + this.state.boardPaddingSize + this.state.cellMarginSize;
        return position;
    },
    getOldCoords : function(coords) {
        return {
            up : function() {
                return {
                    x : coords.x,
                    y : coords.y + 1,
                };
            },
            down : function() {
                return {
                    x : coords.x,
                    y : coords.y - 1,
                };
            },
            left : function() {
                return {
                    x : coords.x + 1,
                    y : coords.y,
                };
            },
            right : function() {
                return {
                    x : coords.x - 1,
                    y : coords.y,
                };
            },
        }[this.props.direction]();
    },
    render : function() {
        return (
            <div className="fifteen-board" style={this.getStyle()}>
                {this.props.cells.map(function(number, pos){
                    var oldCellCoords = {}, newCellCoords = {};
                    newCellCoords.x = pos % 4;
                    newCellCoords.y = (pos - newCellCoords.x) / 4;
                    if (this.props.move == number) {
                        oldCellCoords = this.getOldCoords(newCellCoords);
                    } else {
                        oldCellCoords = newCellCoords;
                    }
                    return <Cell key={number} number={number} style={this.getCellStyle()} oldPosition={this.getCellPosition(oldCellCoords)} newPosition={this.getCellPosition(newCellCoords)} />;
                }.bind(this))}
            </div>
        );
    }    
});

var Game = React.createClass({
    getInitialState : function() {
        return { cells : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0] };
    },
    flip : function(i, j) {
        console.log("flip " + i + " and " + j);
        var cells = this.state.cells;
        var prev = cells[i];
        cells[i] = cells[j];
        cells[j] = prev;
        console.log(cells);
        this.setState({ cells: cells, steps: this.state.steps + 1, move: Math.max(cells[i], cells[j])});
        setInterval(this.ummove, 1000);
    },
    unmove: function() {
        this.setState({move: undefined});
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
        console.log("zero index is " + zeroIndex);
        if (this.directions[direction].can(zeroIndex)) {
            this.setState({direction: direction});
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
        if (this.oldKeyDownHandler !== null) {
            this.oldKeyDownHandler(event);
        }
    },
    win : function() {
        return this.state.cells.filter(function(number, index) {return number === index + 1;}).length === 15;
    },
    click : function(event) {
        var number = parseInt(event.target.textContent);
        var numberIndex = this.state.cells.indexOf(number);
        console.log("Clicked number " + number + " with index " + numberIndex);
        var zeroIndex = this.state.cells.indexOf(0);
        var dirs = [ "up", "down", "left", "right" ];
        for (var i = 0; i<4; i++) {
            var dir = this.directions[dirs[i]];
            if (dir.newIndex(zeroIndex) === numberIndex) {
                this.setState({ direction: dirs[i] });
                this.flip(zeroIndex, numberIndex);
                break;
            }
        }
    },
    componentDidMount: function() {
        this.init();
        this.setKeyDownHandler();
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
                console.log("remaining " + count + " steps");
            }
        }
        this.setState({steps: 0});
    },
    setKeyDownHandler : function() {
        this.oldKeyDownHandler = window.onkeydown;
        window.onkeydown = this.keyDown;
    },
    componentWillUnmount : function() {
        window.onkeydown = this.oldKeyDownHandler;
    },
    render : function() {
        return (
            <div className="fifteen-game" onClick={this.click}>
                <Board cells={this.state.cells} move={this.state.move} direction={this.state.direction} />
                <div className="message">
                    {this.win() ? "Вы победили" : ""}
                </div>
                <div className="steps">Ходов: {this.state.steps}</div>
                {this.win() ? <button onClick={this.init}>Новая игра</button> : "" }
            </div>
        );
    }
});

React.renderComponent(<Game steps="100" />, document.body);
// React.renderComponent(<Board cells={[1, 3, 2, 4, 5, 8, 6, 7, 9, 10, 11, 12, 0, 13, 15, 14]} move={13} direction="right" />, document.body);

})();