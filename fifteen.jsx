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

var SlideCell = React.createClass({
    render: function() {
        classNameString = "slide " + this.props.direction;
        return (
            <div className={classNameString}>
                <Cell number={this.props.number} />
            </div>
        );
    }
});

var Board = React.createClass({
    render : function() {
        return (
            <div className="fifteen-board">
                {this.props.cells.map(function(number){
                    if (number === this.props.move) {
                        return <SlideCell key={number} number={number} direction={this.props.direction} />;
                    }
                    return <Cell key={number} number={number} />;
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
                <button onClick={this.init} disabled={!this.win()}>Новая игра</button>
            </div>
        );
    }
});

React.renderComponent(<Game steps="100" />, document.body);

})();