class QuadEdge {

    // everything is stored as indices for GraphQ

    // twin edge
    twin = -1;

    // vertices
    head = -1;
    tail = -1;

    // faces
    left = -1;
    right = -1;

    // next edges
    headEdge = -1;
    tailEdge = -1;
    leftEdge = -1;
    rightEdge = -1;

    constructor(twin, head, tail, left, right, headEdge, tailEdge, leftEdge, rightEdge) {
        this.twin = twin;

        this.head = head;
        this.tail = tail;
        this.left = left;
        this.right = right;

        this.headEdge = headEdge;
        this.tailEdge = tailEdge;
        this.leftEdge = leftEdge;
        this.rightEdge = rightEdge;
    }

    get vertices() {
        return [this.head, this.tail];
    }
    get isSecondTwin() {
        return twin % 2 === 0;
    }

	includes(i) {
		return (this.head === i) || (this.tail === i);
	}
	isBetween(i,j) {
		return this.includes(i) && this.includes(j);
	}
    
    bordersFace(i) {
        return (this.left === i) || (this.tail === i);
    }
    isBetweenFaces(i,j) {
        return this.bordersFace(i) && this.bordersFace(j);
    }

    // shift indices
    shiftIndicesForInsertVertex(index) {
        if (this.head >= index) this.head++;
        if (this.tail >= index) this.tail++;
    }
    shiftIndicesForDeleteVertex(deletedIndex) {
        if (this.head > deletedIndex) this.head--;
        if (this.tail > deletedIndex) this.tail--;
    }
    shiftIndicesForInsertEdgePair(index) {
        if (index % 2 === 1) { // index is second in a pair of twins
            index--; // use the first index in the pair instead
        }

        if (this.twin >= index) this.twin += 2;
        if (this.headEdge >= index) this.headEdge += 2;
        if (this.tailEdge >= index) this.tailEdge += 2;
        if (this.leftEdge >= index) this.leftEdge += 2;
        if (this.rightEdge >= index) this.rightEdge += 2;
    }
    shiftIndicesForDeleteEdgePair(deletedIndex) {
        if (deletedIndex % 2 === 1) { // index is second in a pair of twins
            deletedIndex--; // use the first index in the pair instead
        }
        
        if (this.twin > deletedIndex) this.twin -= 2;
        if (this.headEdge > deletedIndex) this.headEdge -= 2;
        if (this.tailEdge > deletedIndex) this.tailEdge -= 2;
        if (this.leftEdge > deletedIndex) this.leftEdge -= 2;
        if (this.rightEdge > deletedIndex) this.rightEdge -= 2;
    }

}