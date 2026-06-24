class PolygonSubdivision extends PlanarGraph {

    nPolygon = 0;

    constructor() {
        super();
    }

    get nIntersections() {
        return this.vertices.length - this.nPolygon;
    }

    updateLabels() {
        let polyLabs = Utils.stdRange1(this.nPolygon), interLabs = Utils.stdRange1(this.nIntersections);
        polyLabs = polyLabs.map(n => { return 'p' + n; });
        interLabs = interLabs.map(n => { return 'i' + n; });

        this.labels = polyLabs.concat(interLabs);
    }

    // class is meant to be static and only updated via fromPolygon
    fromPolygon(poly) {
        // ensure polygon data is accurate
        poly.updateLabels();
        poly.updateEdges();

        let startTime = Date.now();

        // add polygon vertices
        this.nPolygon = poly.length;
        this.clearVertices();
        this.vertices.push(...poly);
        let polyVertexTime = Date.now();

        // find intersections
        let edgeIntersections = poly.edges.map(() => []);
        for (let i = 0; i < poly.nSides; i++) {
            for (let j = i+2; j < poly.nSides; j++) {
                // exclude edge pairs that share one or more vertices
                if (poly.edges[i].includes(poly.edges[j][0]) || poly.edges[i].includes(poly.edges[j][1])) continue;

                let intersect = Geometry1.lineSegIntersection(poly[poly.edges[i][0]], poly[poly.edges[i][1]], poly[poly.edges[j][0]], poly[poly.edges[j][1]]);

                if (intersect !== null) {
                    let intersectCoords = intersect.X;
                    let index = this.vertices.length;
                    
                    this.vertices.push(new Point(intersectCoords.x, intersectCoords.y));
                    edgeIntersections[i].push({i:index, t:intersect.t});
                    edgeIntersections[j].push({i:index, t:intersect.u});

                    console.log("intersection " + JSON.stringify(intersectCoords));
                }
            }
        }
        let intersectionTime = Date.now();

        // find edges
        let splitEdges = edgeIntersections.map((data,i) => {
            // insertion sort my good friend insertion sort
            let sorted = [];
            unsortedLoop: for (let i = 0; i < data.length; i++) {
                sortedLoop: for (let j = 0; j < sorted.length; j++) {
                    if (data[i].t < sorted[j].t) {
                        sorted.splice(j,0,data[i]);
                        continue unsortedLoop;
                    }
                }
                sorted.push(data[i]);
            }

            let e = poly.edges[i];
            let indices = sorted.map(d => d.i);
            indices.splice(0,0,e[0]);
            indices.push(e[1]);
            return indices;
        });
        let splitEdgesTime = Date.now();

        let debug = "split edges:";
        for (let i = 0; i < splitEdges.length; i++) {
            debug += " " + splitEdges[i];
        }
        console.log(debug);

        // add edges
        for (let i = 0; i < splitEdges.length; i++) {
            let edges = splitEdges[i];
            for (let j = 0; j < edges.length - 1; j++) {
                this.addEdge(edges[j], edges[j+1], false);
            }
        }
        console.log(this.edges);
        let addEdgesTime = Date.now();

        this.updateLabels();
        this.updateFaces();
        let updateFacesTime = Date.now();

        console.log(`--- Time taken by task ---
Add polygon vertices: ${polyVertexTime - startTime}
Find intersections: ${intersectionTime - polyVertexTime}
Split edges: ${splitEdgesTime - intersectionTime}
Add edges: ${addEdgesTime - splitEdgesTime}
Update faces: ${updateFacesTime - addEdgesTime}
Total: ${updateFacesTime - startTime}`);

        // starts hitting significant lag spikes around 5 intersections!!
        // updateFaces() appears to be the worst offender in here but something OUTSIDE of this function is also causing it to spike??
        // oh dear lord running generate random with 10 points took 1.6 seconds. running it with 15 points TIMED OUT THE PAGE
        // trying to run it with 9 points this time exceeded the maximum call stack size on line 265 of graphE (cycles.push(...cyclesInGroup)) oh noooo
    }
    fromPoints(pts) {
        this.nPolygon = pts.length;


    }

    // draw
    drawPolygonVertices(ctx, labeled = true, color = THEMEINDIGO, size = POINTSIZE) {
        let labs = labeled ? this.labels.slice(0, this.nPolygon) : [];
        for (let i = 0; i < this.nPolygon; i++) {
            this.vertices[i].draw(ctx, labs[i], color, size);
        }
    }
    drawIntersections(ctx, labeled = true, color = THEMESCARLET, size = POINTSIZE) {
        let labs = labeled ? this.labels : [];
        for (let i = this.nPolygon; i < this.nVertices; i++) {
            this.vertices[i].draw(ctx, labs[i], color, size);
        }
    }
    drawVertices(ctx, labeled = true, polyColor = POINTCOLOR, intersectColor = POINTCOLOR, size = POINTSIZE) {
        this.drawPolygonVertices(this.graphics, labeled, polyColor, size);
        this.drawIntersections(this.graphics, labeled, intersectColor, size);
    }

}