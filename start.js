var W,H;
var ctx,canvas;
var X = 0;
var Y = 0;
var Widget;
var square;
var keys = [];
var mortalite = 10;
var action = 400;
var planetSize;
var v = 1000;
var object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:3.7,y:300,s:30},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:6.4,y:50,s:18},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:2.7,y:240,s:25},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.5,y:10,s:18},{r:3.7,y:240,s:45}];
var fleur = [{n:0,r:2},{n:10,r:5},{n:5,r:0},{n:7,r:0.5},{n:8,r:4.2},{n:13,r:3.8},{n:11,r:5},{n:12,r:2.2}];;
var scrollX = 0;
var t2 = 0;
var t3 = 0;
var vaisseau = new Image();
vaisseau.src = "images/boxe.png";
var imgFleur = new Image();
imgFleur.src = "images/fleur0.png";
var mouse = [0,0];
var dead = 0;
var gravite = -9;
var init = 1;
var ready = 0;
var scaleFactor = 1;
var record = JSON.parse(window.localStorage.getItem("record"));

// programme

function rnd(max){
    return Math.floor(Math.floor(Math.random()*max));
}

function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.setAttribute("width",W);
    canvas.setAttribute("height",H);
    planetSize = W - 1000;
    if (planetSize < 0) planetSize = 10;
    if (H < 400){
        scaleFactor = H/800;
    }
}

function start(){
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
    resize();
    Widget = require("wdg");
    square = new Widget({id: "square"});
    document.addEventListener(
        "keydown",
        function (event){
            touching();
            
        }
    );
    document.addEventListener(
        "touchstart",
        function (event){
            touching();
            
        }
    );
    mouse[1] = W/2;
    mouse[0] = H/2;
    animation();
}

function touching(){
    if (dead == 0){
        gravite = -9;
    }
    else {
        if (ready == 0){
            disalert();
            dead = 0;
            t3 = 0;
            v = 1000;
            mouse[0] = H/2;
            scrollX = 0;
            init = 0;
            gravite = -9;
            object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:3.7,y:300,s:30},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:6.4,y:50,s:18},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:2.7,y:240,s:25},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.5,y:10,s:18},{r:3.7,y:240,s:45}];
            fleur = [{n:0,r:2},{n:10,r:5},{n:5,r:0},{n:7,r:0.5},{n:8,r:4.2},{n:13,r:3.8},{n:11,r:5},{n:12,r:2.2}];
        }
    }
}

function animation(){
    var f = function(t) {
        if (dead == 0)paint(t);
        else if (dead == 1){
            if (ready > 0)ready -= 1;
            draw(t);
        }
        //resize();
        window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
}

function paint(t){
    if (init == 0){
        t2 = t;
        init = 1;
    }
    object.forEach(
        function(e){
            if ((e.r - scrollX)%(Math.PI*2) < -3 && (e.r - scrollX)%(Math.PI*2) > -3.4){
                e.s = rnd(H/15) + 10;
                e.y = rnd(H);
            }            
        }
    );
    scrollX += (t-t2)/v;
    t3 += t-t2;
    v -= (t-t2)/700;
    mouse[0] += gravite;
    gravite += 0.05 * (t-t2);
    draw(t);
    collision(t3);
}

function draw(t) {
    t2 = t;
    drawFond();
    if (dead == 0){
        ctx.save();
        ctx.translate(mouse[1],mouse[0]);
        ctx.rotate(Math.atan((mouse[1] - W/2)/(H - mouse[0])));
        ctx.scale(scaleFactor,scaleFactor);
        ctx.drawImage(vaisseau,- vaisseau.width/2, - vaisseau.height/2);
        ctx.restore();
    }

//    if (dead == 0) ctx.drawImage(vaisseau,mouse[1]  - vaisseau.width/2,mouse[0] - vaisseau.height/2);
    ctx.fillStyle = "rgb(40,40,40)";
    ctx.beginPath();
    ctx.arc(W/2,H,planetSize,-Math.PI,Math.PI);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();
    object.forEach(
        function(e){
            ctx.save();
            ctx.translate(W/2,H);
            ctx.rotate(e.r - scrollX);
            ctx.beginPath();
            ctx.arc(0,-e.y - planetSize,e.s,-Math.PI,Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    );
    fleur.forEach(
        function(e){
            var x = (object[e.n].y+planetSize) * Math.sin((object[e.n].r - scrollX)%(Math.PI*2)) + W/2;
            var y = H - ((object[e.n].y+planetSize) * Math.cos((object[e.n].r - scrollX)%(Math.PI*2)));
            ctx.save();
            ctx.translate(x,y);
            ctx.rotate(e.r - scrollX);
            ctx.drawImage(imgFleur,- 25,- 45 - object[e.n].s);
            ctx.restore();
        }
    );
}

function drawFond() {
    ctx.fillStyle = "rgb(28,134,182)";
    ctx.fillRect(0,0,W,H);
}

function collision(t) {
    if (Math.hypot(mouse[0] - H,mouse[1] - W/2) < planetSize + 20*scaleFactor) mort(t);
//    ctx.fillStyle = "rgb(255,255,255)";
    object.forEach(
        function(e){
            var x = (e.y+planetSize) * Math.sin((e.r - scrollX)%(Math.PI*2)) + W/2;
            var y = H - ((e.y+planetSize) * Math.cos((e.r - scrollX)%(Math.PI*2)));
            //ctx.fillRect(x,y,5,5);
            if (Math.hypot(mouse[0] - y,mouse[1] - x) < e.s + 20*scaleFactor) mort(t);
        }
    );
}

function mort(t){
    dead = 1;
    if (Math.round(t/1000) >= record){
        record = Math.round(t/1000);
        window.localStorage.setItem("record",JSON.stringify(Math.round(t/1000)));
        score = "Vous avez tenu " + Math.round(t/1000) + " secondes. C'est un nouveau record !!!";
    }
    else {
        score = "Vous avez tenu " + Math.round(t/1000) + " secondes. Votre record est de " + record + " secondes.";
    }
    alert(score);
    ready = 50;
    for (var iii = 0; iii < 10; iii++) {
        var taille = rnd(100) + 100;
        newExplosion(mouse[1] - 40 + rnd(20) + "px",mouse[0] - 95 + rnd(20)  + "px",mouse[1] - 150 + rnd(200) + "px",mouse[0] - 205 + rnd(200)+ "px", taille + "px",0,1);
    }
}
