class Piece {
    // color is 0 for black, 1 for red.
    constructor(color, coords, cellWidth) {
        this.color = color;
        this.location = coords;
        this.cellWidth = cellWidth;
        this.isKing = false;
    }

    set color(color) {
        if (color != 0 && color != 1) {
            throw 'Color must be 0 or 1!';
        }
        this._color = color;
    }

    get color() {
        return this._color;
    }

    /**
     * Coords are col first then row due to the difference between
     * 2D array indexing and cartesian coordinates.
     */
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
        if (this.color == 0) {
            fill(0);
            stroke(0);
        } else {
            fill(255, 0, 0);
            stroke(255, 0, 0);
        }

        // Convert board coordinates to pixel coordaintes.
        let pixelCoords = this.location.map(c => (c + .5) * this.cellWidth);
        circle(...pixelCoords, this.cellWidth * .8);
    }
}

export { Piece };