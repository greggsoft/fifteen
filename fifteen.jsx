/** @jsx React.DOM */

(function() {

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
    render: function() {
        if (this.props.number === 0) {
            var emptyCellStyle = {
                borderColor: "transparent",
                display: "block",
            };
            return <div className="cell empty" style={mergeStyles(this.props.style, emptyCellStyle)}></div>;
        }
        var innerDivStyle = {
                display: "table-cell",
                verticalAlign: "middle",
        };
        return <div className="cell" style={this.props.style}><div style={innerDivStyle}>{this.props.number}</div></div>;
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
    render : function() {
        return (
            <div className="fifteen-board" style={this.getStyle()}>
                {this.props.cells.map(function(number, position){
                    var cellPosition = {};
                    var x = position % 4, y = (position - x) / 4;
                    cellPosition.left = x * this.state.cellOuterSize + this.state.boardPaddingSize + 2 * this.state.cellMarginSize;
                    cellPosition.top = y * this.state.cellOuterSize + this.state.boardPaddingSize + 2 * this.state.cellMarginSize;
                    return <Cell key={number} number={number} style={mergeStyles(this.getCellStyle(), cellPosition)} />;
                }.bind(this))}
            </div>
        );
    }    
});

var Game = React.createClass({
    getInitialState : function() {
        return { cells : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], started : false, lastDirIndex: 4 };
    },
    flip : function(i, j) {
        console.log("flip " + i + " and " + j);
        var cells = this.state.cells;
        var prev = cells[i];
        cells[i] = cells[j];
        cells[j] = prev;
        this.setState({ cells: cells, steps: this.state.steps + 1, move: Math.max(cells[i], cells[j])});
        setTimeout(this.ummove, 1000);
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
       setTimeout(this.init, 100);
    },
    dirs : [ "up", "down", "left", "right" ],
    oppositeDirIndex : [ 1, 0, 3, 2, 4],
    init: function() {
        var count = parseInt(this.props.steps);
        console.log("init game with " + count + " steps");
        this.setState({initialStepCount : count});
        var initTimerID = setInterval(this.initStep, 60);
        this.setState({initTimer : initTimerID});
    },
    initStep : function() {
        if (this.state.initialStepCount <= 0) return this.initEnd();
        var dirIndex = Math.floor(Math.random() * 4);
        if (dirIndex != this.oppositeDirIndex[this.state.lastDirIndex] && this.move(this.dirs[dirIndex])) {
            var newCount = this.state.initialStepCount - 1;
            this.setState({initialStepCount : newCount, lastDirIndex: dirIndex});
            console.log("remaining " + newCount + " steps");
        }
    },
    initEnd : function() {
        clearInterval(this.state.initTimer);
        this.setState({steps: 0, started: true});
        this.setKeyDownHandler();
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
            <div className="fifteen-game" onClick={this.state.started ? this.click : ""}>
                <Board cells={this.state.cells} move={this.state.move} direction={this.state.direction} />
                {this.win() ? <div className="message">Вы победили</div> : ""}
                {this.state.started ? <div className="steps">Ходов: {this.state.steps}</div> : ""}
                {this.win() ? <button onClick={this.init}>Новая игра</button> : "" }
            </div>
        );
    }
});

React.renderComponent(<Game steps="100" />, document.body);

})();