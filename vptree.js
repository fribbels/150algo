class VPNode {
    constructor(elems, parent) {
        var vp = elems[Math.floor(Math.random()*elems.length)];
        // var vp = elems[0];
        var distances = new Array(elems.length);
        var leftList = [];
        var rightList = [];


        for (var i = 0; i < elems.length; i++) {
            distances[i] = vp.dist(elems[i]);
        }

        var mu = select(distances, Math.floor(distances.length/2));

        this.elems = elems;
        this.vp = vp;
        this.mu = mu;
        this.parent = parent;

        for (var i = 0; i < elems.length; i++) {
            if (vp.dist(elems[i]) < mu)
                leftList.push(elems[i]);
            else
                rightList.push(elems[i]);
        }

        if (leftList.length != 0 && rightList.length != 0) {
            this.left = new VPNode(leftList, this);
            this.right = new VPNode(rightList, this);
        }
    }
}

class Data {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    dist(other) {
        var a = this.x-other.x;
        var b = this.y-other.y;
        return Math.sqrt(a*a + b*b); 
    }
}

class Timer {
    constructor() {
        this.start = window.performance.now();
    }

    tick() {
        var end = window.performance.now();
        return end - this.start;
    }
}

class DistanceQueue {
    constructor(query, n) {
        this.query = query;
        this.arr = new Array(n);
        this.distances = new Array(n);
        this.n = n;
    }

    all() {
        return this.arr;
    }

    last() {
        for (var i = this.n-1; i >= 0; i--) {
            if (this.arr[i] != undefined)
                return this.arr[i];
        }

        return undefined;
    }

    push(elem) {
        var dist = this.query.dist(elem);
        var i;
        var tempDist;
        var tempElem;
        for (i = 0; i < this.n; i++) {
            if (this.distances[i] == undefined || dist < this.distances[i]) {
                tempDist = this.distances[i];
                tempElem = this.arr[i];
                this.distances[i] = dist;
                this.arr[i] = elem;
                break;
            }
        }

        var j;
        for (j = i+1; j < this.n; j++) {
            if (this.arr[j] == undefined) {
                this.arr[j] = tempElem;
                this.distances[j] = tempDist;
                break;
            }
            var tD = this.distances[j];
            var tE = this.arr[j];
            this.distances[j] = tempDist;
            this.arr[j] = tempElem;
            tempDist = tD;
            tempElem = tE;
        }
    }
}

// var size = 100;
// var dataset = new Array(size);

// var timer = new Timer();
// for (var i = 0; i < size; i++) {
//     dataset[i] = new Data(Math.random(), Math.random());
// }
// console.log(timer.tick());

// timer = new Timer();
// var root = new VPNode(dataset);
// var q = new Data(0, 0);
// console.log(timer.tick());

// timer = new Timer();
// var nearest = knn(root, 2, q);
// console.log(timer.tick());
// console.log(nearest[0]);

function knn (root, k, query) {
    var count = 0;
    var trash = 0;
    var tau = Infinity;
    var nodesToVisit = [root];

    var distanceQueue = new DistanceQueue(query, k);

    while(nodesToVisit.length > 0) {
        var currentNode = nodesToVisit.splice(0, 1)[0]; // Remove first element
        if (currentNode == undefined) {
            trash++;
            continue;
        }

        count++;
        var dist = query.dist(currentNode.vp);

        if (dist < tau) {

            distanceQueue.push(currentNode.vp);
            var farthest = distanceQueue.last();
            tau = query.dist(farthest);
        }

        if (dist < currentNode.mu) {
            if (dist < currentNode.mu + tau) 
                nodesToVisit.push(currentNode.left);
            if (dist >= currentNode.mu - tau)
                nodesToVisit.push(currentNode.right);
        } else {
            if (dist < currentNode.mu + tau)
                nodesToVisit.push(currentNode.left);
            if (dist >= currentNode.mu - tau)
                nodesToVisit.push(currentNode.right);
        }
    }
    console.log("iterations: " + count);
    console.log("trash: " + trash);
    return distanceQueue.all();
}
