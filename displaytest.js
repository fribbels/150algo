paper.install(window);
window.onload = function() {
    // Setup directly from canvas id:

    var canvas = document.getElementById('myCanvas');
    var width = window.innerWidth;
    var height = window.innerHeight
    canvas.width = width;
    canvas.height = height;

    paper.setup('myCanvas');

    var arr = [];
    var n = 2;
    for (var i = 0; i < n; i++) {
        arr.push(new Data(Math.random()*width/2+width/4, Math.random()*height/2+height/4));
    }

    var circle1 = new Path.Circle(arr[0], 200);
    circle1.strokeColor = 'black';

    var dot1 = new Path.Circle(arr[0], 2);
    dot1.fillColor = 'black';


    var circle2 = new Path.Circle(arr[1], 200);

    var dot2 = new Path.Circle(arr[1], 2);
    dot2.fillColor = 'black';


    var result = circle1.intersect(circle2);
    result.strokeColor = 'blue';
    view.draw();
}