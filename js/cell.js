const brown = [194, 156, 107];
const green = [170, 255, 79];

class Cell {
    constructor(coords, cellWidth) {
        this.cellWidth = cellWidth;
        this.location = coords;
        this.piece = undefined;
        this.isHighlighted = false;
    }

    set location(coords) {
        const [col, row] = coords;
        if (row > 7 || row < 0 || col > 7 || col < 0) {
            throw 'That position does not exist on a checkers board!'
        }
        this._location = coords;
    }

    get location() {
        return this._location;
    }

    draw() {
        if (this.isHighlighted) {
            fill(...green);
        } else {
            fill(...brown);
        }
        stroke(0);
        const [col, row] = this.location;

        square(col * this.cellWidth, row * this.cellWidth, this.cellWidth);
        // If there is a piece here, draw it.
        if (this.piece) {
          this.piece.draw();
        }
    }
}

export { Cell };