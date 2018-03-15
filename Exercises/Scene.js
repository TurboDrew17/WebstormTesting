var canvas;
var gl;

var NumVertices  = 36;
var RotationMatrix = [0,0,0];

var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;

var modelViewMatrix, projectionMatrix, rotationMatrix;
var offsetVector = vec4(0.0,1.0,0.0,0.0);
var modelViewMatrixLoc, projectionMatrixLoc, rotationMatrixLoc, offsetVectorLoc;
var upvector = vec4(0.0,1.0,0.0, 0.0);
var eye = vec3(0.0, 1.0, -50.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.8, 0.8, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    NumVertices = 0;
    var allpoints = [];
    var allcolors = [];
    var allmovable = [];

    var i = 0;

    //Bottom bound
    var boxpoints = box_base_size([0.0,-5.0,0.0], 2.0, 10.0, 10.0);
    var boxcolors = box_color_scheme(vec4(1.0,0.0,0.0,1.0), vec4(0.9,0.0,0.0,1.0));
    for(i = 0; i < boxpoints.length; i++) {
        allpoints.push(boxpoints[i]);
        allcolors.push(boxcolors[i]);
        allmovable.push(false);
    }

    //Top bound
    boxpoints = box_base_size([0.0,5.0,0.0], 2.0, 10.0, 10.0);
    boxcolors = box_color_scheme(vec4(1.0,0.0,0.0,1.0), vec4(0.9,0.0,0.0,1.0));
    for(i = 0; i < boxpoints.length; i++) {
        allpoints.push(boxpoints[i]);
        allcolors.push(boxcolors[i]);
        allmovable.push(false);
    }

    //Movable in between
    boxpoints = box_base_size([0.0,0.0,0.0], 2.0, 10.0, 10.0);
    boxcolors = box_color_scheme(vec4(0.0,0.0,1.0,1.0), vec4(0.0,0.0,0.9,1.0));
    for(i = 0; i < boxpoints.length; i++) {
        allpoints.push(boxpoints[i]);
        allcolors.push(boxcolors[i]);
        allmovable.push(true);
    }

    //Pole in between
    var cylinderpoints = cylinder_base_size(60, [0.0,-5.0,0.0], 10.0, 1.0);
    var cylindercolors = cylinder_colors(60, vec4(0.0,1.0,0.0,1.0), vec4(0.0,0.9,0.0,1.0));
    for(i = 0; i < cylinderpoints.length; i++)
    {
        allpoints.push(cylinderpoints[i]);
        allcolors.push(cylindercolors[i]);
        allmovable.push(false);
    }

    NumVertices = allpoints.length;

    //buffer to say if vertices are movable
    var mBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allmovable), gl.STATIC_DRAW );

    var vMove = gl.getAttribLocation( program, "movable" );
    gl.vertexAttribPointer( vMove, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vMove);

    //Buffer for color
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allcolors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    //Buffer for positions
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allpoints), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    rotationMatrixLoc = gl.getUniformLocation( program, "rotationMatrix");
    offsetVectorLoc = gl.getUniformLocation(program, "vOffset");
// sliders for rotation parameters

    document.getElementById("RotationX").oninput = function(event) {
        RotationMatrix[0] = event.target.value;
    };

    document.getElementById("RotationY").oninput = function(event) {
        RotationMatrix[1] = event.target.value;
    };

    document.getElementById("RotationZ").oninput = function(event) {
        RotationMatrix[2] = event.target.value;
    };

    render();
};


var vel = 0, acc = 0, pos = 0;

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(-12, 12, -12, 12, 0, 100);

    rotationMatrix = rotateX(RotationMatrix[0]);
    rotationMatrix = mult(rotationMatrix, rotateY(RotationMatrix[1]));
    rotationMatrix = mult(rotationMatrix, rotateZ(RotationMatrix[2]));


    var localUp = mult(rotationMatrix, upvector);

    //use the dot product of the localup compared to the global up to determine acceleration
    acc = -dot(normalize(upvector), normalize(localUp));
    //vel += acc
    //pos += vel
    vel += acc * .1;
    pos += vel * .03;
    //restrict position to bounds
    if(pos < -3)
    {
        pos = -3;
        vel = 0;
    }
    else if (pos > 3)
    {
        pos = 3;
        vel = 0;
    }

    //set offset to the pos
    offsetVector[1] = pos;

    gl.uniformMatrix4fv( rotationMatrixLoc, false, flatten(rotationMatrix) );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniform4fv(offsetVectorLoc, flatten(offsetVector));

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    requestAnimFrame(render);
};