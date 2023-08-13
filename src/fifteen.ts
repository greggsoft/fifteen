import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js'

const app = new Application({ antialias: true, resizeTo: window, backgroundAlpha: 0 })
const screenWidth = app.screen.width
const screenHeight = app.screen.height
const screenMinSize = screenHeight > screenWidth ? screenWidth : screenHeight
const center = { x: screenWidth / 2, y: screenHeight / 2 }
const tileSize = Math.floor(screenMinSize * 0.8 * 0.25 / 2) * 2

console.log('tile size: ' + tileSize)

document.body.appendChild(app.view as unknown as Node)

const axes = new Graphics()
axes.beginFill(0xff0000, 1)
axes.lineStyle(1, 0xff0000)
axes.moveTo(0, screenHeight / 2)
axes.lineTo(screenWidth, screenHeight / 2)
axes.moveTo(screenWidth / 2, 0)
axes.lineTo(screenWidth / 2, screenHeight)
axes.endFill()

const board = new Container()
board.x = center.x
board.y = center.y

app.stage.addChild(board)
app.stage.addChild(axes)

for (let i = 0; i < 15; i++) {
    const num = i + 1
    const tile = createTile(num)
    tile.x = (i % 4) * tileSize
    tile.y = Math.floor(i / 4) * tileSize

    board.addChild(tile)
}

const emptyTilePosition = { x: 3 * tileSize, y: 3 * tileSize }

// board.pivot.x = board.width / 2
// board.pivot.y = board.height / 2
board.pivot.x = tileSize * 2
board.pivot.y = tileSize * 2

console.log('board height: ' + board.height)
console.log('board width: ' + board.width)

// board.pivot.x = tileSize * 2
// board.pivot.y = tileSize * 2

function createTile(num: number) {
    const container = new Container()
    const graphics = new Graphics()

    // draw a rounded rectangle
    graphics.lineStyle(8, 0xFF00FF, 1)
    graphics.beginFill(0x650A5A, 1)
    graphics.drawRoundedRect(10, 10, tileSize - 20, tileSize - 20, 16)
    graphics.endFill()

    container.addChild(graphics)

    const label = new Text(num + '', new TextStyle({ fill: '#ffffff', fontSize: Math.floor(tileSize / 2) + 'px' }))
    label.anchor.set(0.5)
    label.x = tileSize / 2
    label.y = tileSize / 2

    container.addChild(label)

    container.cursor = 'pointer'
    container.eventMode = 'static'
    container.on('pointerdown', onTileClick)

    // container.pivot.x = tileSize / 2
    // container.pivot.y = tileSize / 2

    return container
}

function onTileClick(this: Container) {
    const tile = this
    const destSqr = (tile.x - emptyTilePosition.x) ** 2 + (tile.y - emptyTilePosition.y) ** 2
    console.log('DEST: ' + destSqr)
    console.log('tileSizeSqr: ' + (tileSize ** 2))
    if (destSqr === tileSize ** 2) {
        const tilePosition = { x: tile.x, y: tile.y }
        tile.x = emptyTilePosition.x
        tile.y = emptyTilePosition.y
        emptyTilePosition.x = tilePosition.x
        emptyTilePosition.y = tilePosition.y
    }
}
