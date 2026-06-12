class Face extends Points {

    constructor(...pts) {
        super();
        pts.forEach(p => this.push(p));
    }

    draw(ctx, color = FACECOLOR) {
        if (this.length >= 3) {
            let f = Utils.stdRange(this.length);
            Draw.face(ctx, this, f, color);
        }
    }

	isBetween(...pts) {
		if (pts.length !== this.length) return false;
        for (let i = 0; i < pts.length; i++) {
            if (!this.includes(pts[i])) return false;
        }
        return true;
	}

    containsPoint(P) {
        return Geometry1.pointInPolygon(P, this);
    }

    printable() {
        let s = "";
        for (let i = 0; i < this.length; i++) {
            if (i !== 0) s += ",";
            s += JSON.stringify(this[i]);
        }
        return s;
    }

}