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
    move : function(i, j) {
        console.log("flip " + i + " and " + j);
        var cells = this.state.cells;
        var prev = cells[i];
        cells[i] = cells[j];
        cells[j] = prev;
        this.setState({ cells: cells});
    },
    up : function() {
        console.log("try to move up");
        var cells = this.state.cells;
        var zeroIndex = cells.indexOf(0);
        if (zeroIndex - 4 >= 0) {
            this.move(zeroIndex, zeroIndex - 4);
        }
    },
    down : function() {
        console.log("try to move down");
        var cells = this.state.cells;
        var zeroIndex = cells.indexOf(0);
        if (zeroIndex + 4 < 16) {
            this.move(zeroIndex, zeroIndex + 4);
        }
    },
    left : function() {
        console.log("try to move left");
        var cells = this.state.cells;
        var zeroIndex = cells.indexOf(0);
        if (zeroIndex % 4 != 0) {
            this.move(zeroIndex, zeroIndex - 1);
        }
    },
    right : function() {
        console.log("try to move right");
        var cells = this.state.cells;
        var zeroIndex = cells.indexOf(0);
        if ((zeroIndex + 1) % 4 != 0) {
            this.move(zeroIndex, zeroIndex + 1);
        }
    },
    keyDown : function(event) {
        console.log("key down with code " + event.keyCode);
        if (event.keyCode == 37) {
            this.right();
        }
        if (event.keyCode == 38) {
            this.down();
        }
        if (event.keyCode == 39) {
            this.left();
        }
        if (event.keyCode == 40) {
            this.up();
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

var board = React.renderComponent(<Board />, document.body);

window.onkeydown = board.keyDown;

})();