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

    deepCopy() {
        const copy = new Piece(this.color, this.location, this.cellWidth);
        copy.isKing = this.isKing;
        return copy;
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

        // Draw a star if this has been kinged.
        if (this.isKing) {
            fill(255, 221, 0);
            star(...pixelCoords, this.cellWidth *.3, this.cellWidth *.05, 3);
        }
    }
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

export { Piece };