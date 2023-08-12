/* global _ */

(function(){
    var body = document.getElementsByTagName('body')[0];
    
    var main = document.createElement('div');
    main.id = 'board';
    
    var getMinWindowSize = function() {
        return window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    };
    
    var getMainMargin = function() {
        return 10;
    };
    
    var getMainSize = function() {
        return getMinWindowSize() - 2 * getMainMargin();
    };
    
    var renderMain = function() {
        var margin = getMainMargin();
        var size = getMainSize();
        
        this.style.position = "absolute";
        this.style.left = this.style.top = margin + "px";
        this.style.width = this.style.height = size + "px";
        this.style.border = "black solid 1px";
        this.style["border-radius"] = "8px";

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].render();
        }
    };
    
    var rerender = function(el) {
        return function() { el.render(); };
    };
    
    var createCell = function(num, pos) {
        var el = document.createElement('div');
        var text = document.createElement('div');
        el.appendChild(text);
        el.num = num;
        el.pos = pos;
        el.text = text;
        el.render = renderCell;
        el.onclick = moveCell;
        return el;
    };
    
    var getZeroCell = function() {
        return _.find(this.children, {num: 0});
    };

    var moveCell = function() {
        var zeroCell = this.parentElement.zeroCell();
        var zeroPos = zeroCell.pos;
        var diff = Math.abs(this.pos - zeroPos);
        if (diff == 1 || diff == 4) {
            var zeroPosNew = this.pos;
            this.pos = zeroPos;
            zeroCell.pos = zeroPosNew;
            this.parentElement.render();
        }
    };
    
    var getCellMargin = function() {
        var step = 64;
        var windowSize = getMinWindowSize();
        var remain = windowSize % step;
        return (windowSize - remain) / step;
    };
    
    var getCellSize = function() {
        return getMainSize() / 4 - 2 * getCellMargin();
    };
    
    var getCellOuterSize = function() {
        return getCellSize() + 2 * getCellMargin();
    };
    
    var renderCell = function() {
        var x = this.pos % 4;
        var y = (this.pos - x) / 4;
        this.style.position = "absolute";
        this.style.width = this.style.height = getCellSize();
        this.style.left = getCellMargin() + x * getCellOuterSize();
        this.style.top = getCellMargin() + y * getCellOuterSize();

        if (this.num === 0) {
            this.text.style.color = "red";
            this.text.innerHTML = this.parentElement.isWin() ? "You<br/>win" : "";
            this.text.style['font-size'] = getCellSize() / 3;
            this.text.style['text-align'] = 'center';
        } else {
            this.style.border = "black solid 1px";
            this.style["border-radius"] = "8px";
            this.style.cursor = 'pointer';
            this.text.innerHTML = this.num;
            this.text.style['font-size'] = getCellSize() / 3 * 2;
        }
        
        this.text.style.position = "absolute";
        this.text.style.left = getCellSize() / 2 - this.text.clientWidth / 2;
        this.text.style.top = getCellSize() / 2 - this.text.clientHeight / 2;
        this.text.style.cursor = 'pointer';
    };
    
    main.render = renderMain;
    main.zeroCell = getZeroCell;
    main.isWin = function() {
        return _.all(this.children, function(cell) { return (cell.pos + 1) % 16 === cell.num; });
    };    
    
    var nums = _.shuffle(_.range(16));
    for (var i=0;i<16;i++) {
        main.appendChild(createCell(nums[i], i));
    }
    body.appendChild(main);
    
    main.render();
    
    window.onresize = function(){
        setTimeout(rerender(main), 100);
    };
})();
