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
var object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:3.7,y:300,s:30},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:1.4,y:50,s:18},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:2.7,y:240,s:25},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.5,y:10,s:18},{r:3.7,y:240,s:45}];
var fleur = [{n:0,r:2,t:1},{n:1,r:5,t:0},{n:2,r:0,t:2},{n:3,r:0.5,t:0},{n:4,r:4.2,t:0},{n:5,r:3.8,t:2},{n:6,r:5,t:1},{n:7,r:2.2,t:0},{n:8,r:0.2,t:0},{n:9,r:3.2,t:0},{n:10,r:2.8,t:0},{n:11,r:5,t:0},{n:12,r:0,t:1},{n:13,r:1,t:1},{n:14,r:4.7,t:2},{n:8,r:4.7,t:1},{n:12,r:4.3,t:0},{n:-1,r:5,t:0},{n:-1,r:0,t:1},{n:-1,r:1,t:1},{n:-1,r:4,t:2},{n:-1,r:4.7,t:1},{n:-1,r:-1.2,t:0},{n:-1,r:10.2,t:1},{n:-1,r:8.5,t:0}];
var engre = [{r:1,y:300,s:0,p:0},{r:2,y:150,s:0,p:0},{r:3,y:400,s:0,p:0},{r:4,y:100,s:9,p:0},{r:5,y:300,s:0,p:0},{r:6,y:400,s:0,p:0},{r:7,y:100,s:0,p:0}];
var bonus = {r:2.4,y:200,t:0,on:1};
var etoiles = [];
var scrollX = 0;
var t2 = 0;
var t3 = 0;
var vaisseau = 0;
var imgBonus = [new Image()];
imgBonus[0].src = "images/bonus0.png";
var eng = new Image();
eng.src = "images/engre.png";
var img = {};
var imgLoad = ["shop","equip","boxe0","boxe1","boxe2","boxe3","boxe4","boxe5","boxe6","boxe7","boxe8","boxe9","boxe10","play","buy","fleur0","fleur1","fleur2","fleur3","fleur4","fleur5","fleur6","fleur7","fleur8","fleur9","fleur10","fleur11","bonus0","bonus1","bonus2","bonus3"];
imgLoad.forEach(
    function(e,i){
        img[e] = new Image();
        img[e].src = "images/"+e+".png";
    }
);
var joueur = JSON.parse(window.localStorage.getItem("joueur"));
if (joueur == undefined) joueur = {"lightSpeed":0,"worlds":[1,0,0,0,0],"vaisseau":0,"twoPlayer":0,"version":1};
var mouse = [0,0];
var dead = 0;
var gravite = -9;
var graviteB = -9;
var init = 1;
var ready = 0;
var scaleFactor = 1;
var record = JSON.parse(window.localStorage.getItem("record"));
var sens = 1;
var shop = 0;
var son = new Audio("music.ogg");
var mode = 0;
var argent = JSON.parse(window.localStorage.getItem("argent"));
var ships = JSON.parse(window.localStorage.getItem("ships"));
if (ships == undefined) ships = [[0,1],[100,0],[200,0],[500,0],[1000,0],[1500,0],[1600,0],[1700,0],[2000,0],[2500,0],[5000,0]];
var shopData = {n:0};
var travel = 0;
var lim = 100;
var VX = 0;
var colorA = "rgb(28,134,182)";
var colorB = "rgb(255,255,250)";
var colorC = "rgb(40,40,40)";
var nImg = 0;

// programme

function rnd(max){
    return Math.floor(Math.floor(Math.random()*max));
}

function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.setAttribute("width",W);
    canvas.setAttribute("height",H);
    planetSize = H/4;
    if (planetSize < 10) planetSize = 10;
    scaleFactor = H/800;
}

function start(){
    son.loop = true;
    son.play();
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
            event.stopPropagation();
            event.preventDefault();
            event = event.changedTouches[0];
            var x = event.clientX;
            var y = event.clientY;
            //resize();
            if (mode == 0) smartPhoneMode();
            touching(x,y);
            
        },
        false
    );
    document.addEventListener(
        "mousedown",
        function (event){
            if (mode > 0) return;
            var x = event.clientX;
            var y = event.clientY;
            touching(x,y,1);            
        }
    );
    document.addEventListener(
        "mousemove",
        function (event){
            if (shop > 0){
                var x = event.clientX;
                var y = event.clientY;
                analyseShop(x,y);
            }
        }
    );
    mouse[1] = W/2;
    mouse[0] = H/2;
    vaisseau = joueur.vaisseau;
    if (argent == undefined) argent = 0;
    for (var i = 0;i < 20;i++){
        etoiles.push({x:rnd(W),y:rnd(H),n:rnd(3)});
    }
    console.log(etoiles);
    dead = 1;
    alert("Bienvenue. Appuyer sur la barre espace ou l'écran de votre smartPhone pour faire voler votre vaisseau spatial. Le but du jeu est de survivre le plus longtemps possible en évitant les obstacles.");
    animation();
}

function touching(x,y,z){
    if (x == undefined) {x = -9000;y=-9000;}
    if (dead == 0){
        if (joueur.twoPlayer == 2){
            if (mode == 1){
                if (x < W/2) {
                    if (mouse[2] > 0 )graviteB = -9;
                }
                else if (mouse[0] > 0 )gravite = -9;
            }
            else {
                if (z == 1){
                    if (mouse[2] > 0 )graviteB = -9;
                }
                else if (mouse[0] > 0 )gravite = -9;
            }
        }
        else{
            if (mouse[0] > 0 )gravite = -9;
        }
    }
    else {
        if (shop == 0){
            if ((x-W/2)*(x-W/2) + (y-H)*(y-H) < planetSize*planetSize){
                //if (record == 1883){
                    alert("Bienvenue au magasin. Vous possédez actuellement "+argent+ " engrenages. Mais croyez moi cela ne va pas durer.");
                    shop = 1;
               // }
                //else alert("Cette fonctionnalité est en cours de developpement. En attendant vous pouvez toujours faire des dons. A 5€, il est prévu que sorte la version deluxe du jeu.");
            }
            else if (ready == 0){
                disalert();
                dead = 0;
                lim = 30;
                t3 = 0;
                travel = 0;
                v = 1000;
                sens = 1;
                mouse[1] = W/2;
                mouse[0] = H/2;
                if (joueur.twoPlayer == 2){
                    mouse[1] += 25;
                    mouse[2] = H/2;
                    mouse[3] = W/2 - 25;
                }
                else {
                    mouse[2] = 0;
                    mouse[3] = 0;
                }
                scrollX = 0;
                init = 0;
                gravite = -9;
                if (mode == 0){
                    object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:3.7,y:300,s:30},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:1.4,y:50,s:18},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:2.7,y:240,s:25},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.5,y:10,s:18},{r:3.7,y:240,s:45}];
                }
                else {
                    object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.7,y:240,s:45}];
                }
                engre = [{r:1,y:300,s:0},{r:2,y:150,s:0},{r:3,y:400,s:0},{r:4,y:100,s:0},{r:5,y:300,s:0},{r:6,y:400,s:0},{r:7,y:100,s:0}];
            }
        }
        else {
            if (shop == 1){
                if (x > W/8 && x < W/8+W/4 && y > H/4 && y < H/4*3){
                    shop = 4;
                }
                else if (x > W/8+W/2 && x < W/8+W/2+W/4 && y > H/4 && y < H/4*3){
                    shop = 5;
                }
            }
            else if (shop == 2){
                vaisseau.src = "";
                shop = 4;
                shopData.n = 0;
                alert("Vous possedez "+argent+" engrenages. Cet engin est déjà à vous.");
            }
            else if (shop == 3){
                shop = 5;
            }
            else if (shop == 4){
                if (x <= W/4){
                    shopData.n = (-1+shopData.n+ships.length)%ships.length;
                    if (ships[shopData.n][1] == 1) alert("Vous possedez "+argent+" engrenages. Cet engin est déjà à vous.");
                    else alert("Vous possedez "+argent+" engrenages. Ce vaisseau coûte " + ships[shopData.n][0] + " engrenages.");
                }
                else if (x >= W-W/4){
                    shopData.n = (1+shopData.n)%ships.length;
                    if (ships[shopData.n][1] == 1) alert("Vous possedez "+argent+" engrenages. Cet engin est déjà à vous.");
                    else alert("Vous possedez "+argent+" engrenages. Ce vaisseau coûte " + ships[shopData.n][0] + " engrenages.");
                }
                else if (y > H/4*3){
                    if (ships[shopData.n][1] == 1){
                        shop = 0;
                        disalert();
                        vaisseau = shopData.n;
                    }
                    else if (argent >= ships[shopData.n][0]){
                        ships[shopData.n][1] = 1;
                        argent -= ships[shopData.n][0];
                        window.localStorage.setItem("argent",JSON.stringify(argent));
                        window.localStorage.setItem("ships",JSON.stringify(ships));
                    }
                }
            }
            else if (shop == 5){
                if (x <= W/4){
                    shop = 7;
                }
                else if (x >= W-W/4){
                    shop = 6;
                }
                else if (y > H/4*3){
                    if (joueur.lightSpeed == 1){
                        shop = 0;
                        disalert();
                        //vaisseau = shopData.n;
                    }
                    else if (argent >= 1000){
                        joueur.lightSpeed = 1;
                        argent -= 1000;
                        window.localStorage.setItem("argent",JSON.stringify(argent));
                        window.localStorage.setItem("joueur",JSON.stringify(joueur));
                    }
                }
            }
            else if (shop == 6){
                if (x <= W/4){
                    shop = 5;
                }
                else if (x >= W-W/4){
                    shop = 7;
                }
                else if (y > H/4*3){
                    if (joueur.twoPlayer >= 1){
                        shop = 0;
                        disalert();
                        //vaisseau = shopData.n;
                    }
                    else if (argent >= 1500){
                        joueur.twoPlayer = 2;
                        argent -= 1500;
                        window.localStorage.setItem("argent",JSON.stringify(argent));
                        window.localStorage.setItem("joueur",JSON.stringify(joueur));
                    }
                }
                else {
                    if (joueur.twoPlayer == 1) joueur.twoPlayer = 2;
                    else if (joueur.twoPlayer == 2) joueur.twoPlayer = 1;
                }
            }
            else if (shop == 7){
                if (x <= W/4){
                    shop = 6;
                }
                else if (x >= W-W/4){
                    shop = 5;
                }
                else{
                    shop = 0;
                    window.localStorage.setItem("joueur",JSON.stringify(joueur));
                    disalert();
                    //vaisseau = shopData.n;
                }
            }
        }
    }
}

function animation(){
    var f = function(t) {
        if (shop == 0){
            if (dead == 0)paint(t);
            else if (dead == 1){
                if (ready > 0)ready -= 1;
                draw(t);
            }
        }
        else {
            drawShop(t);
        }
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
            if (((e.r - scrollX)*sens)%(Math.PI*2) < -3 && ((e.r - scrollX)*sens)%(Math.PI*2) > -3.4){
                e.s = rnd(H/15) + 10;
                e.y = rnd(H);
            }            
        }
    );
    if (((bonus.r - scrollX)*sens)%(Math.PI*2) < -3 && ((bonus.r - scrollX)*sens)%(Math.PI*2) > -3.4){
        bonus.on = 1;
        bonus.y = rnd(H);
    }
    if (travel == 0){
        scrollX += (t-t2)/v * sens;
        t3 += t-t2;
        v -= (t-t2)/700;
        mouse[0] += gravite;
        gravite += 0.05 * (t-t2);
        if (gravite > 12) gravite = 12;
        mouse[2] += graviteB;
        graviteB += 0.05 * (t-t2);
        if (graviteB > 12) graviteB = 12;
        draw(t);
        collision(t3);
        if (joueur.lightSpeed == 1){
            if (t3/1000 > lim){
                gravite = 0;
                travel = 4000;
                lim += 30;
                VX = 0;
            }
        }
    }
    else {
        if (travel > 0){
            scrollX += (t-t2)/v * sens;
            t3 += t-t2;
            v -= (t-t2)/700;
            travel -= t-t2;
            t2 = t;
            drawTravel(travel);
        }
        else {
            if (mode == 0){
                    object = [{r:3.7,y:rnd(H),s:30},{r:2,y:rnd(H),s:50},{r:2.1,y:rnd(H),s:15},{r:3.4,y:rnd(H),s:9},{r:3.7,y:rnd(H),s:30},{r:2.5,y:rnd(H),s:70},{r:4.1,y:rnd(H),s:5},{r:1.4,y:rnd(H),s:18},{r:5.7,y:rnd(H),s:25},{r:5.5,y:rnd(H),s:18},{r:2.7,y:rnd(H),s:25},{r:1.4,y:rnd(H),s:18},{r:-1.5,y:rnd(H),s:14},{r:3.5,y:rnd(H),s:18},{r:3.7,y:rnd(H),s:45}];
            }
            else {
                object = [{r:3.7,y:rnd(H),s:10},{r:2,y:rnd(H),s:20},{r:2.1,y:rnd(H),s:15},{r:3.4,y:rnd(H),s:9},{r:2.5,y:rnd(H),s:32},{r:4.1,y:rnd(H),s:5},{r:5.7,y:rnd(H),s:25},{r:5.5,y:rnd(H),s:18},{r:1.4,y:rnd(H),s:18},{r:-1.5,y:rnd(H),s:14},{r:3.7,y:rnd(H),s:5}];
            }
            scrollX = 0;
            travel = 0;
            //var h = rnd(3);
            var h = 3;
            if (h == 0){
                colorA = "rgb(0,0,30)";
                colorB = "rgb(250,250,50)";
                colorC = "rgb(100,70,70)";
                nImg = 1;
            }
            else if (h == 1){
                colorA = "rgb(28,134,182)";
                colorB = "rgb(255,255,250)";
                colorC = "rgb(40,40,40)";
                nImg = 0;
            }
            else if (h == 2){
                colorA = "rgb(200,200,200)";
                colorB = "rgb(0,0,0)";
                colorC = "rgb(0,0,0)";
                nImg = 2;
            }
            else if (h == 3){
                colorA = "rgb(40,40,40)";
                colorB = "rgb(0,0,0)";
                colorC = "rgb(28,134,182)";
                nImg = 3;
            }
            joueur.worlds[nImg] = 1;
        }
    }
}

function draw(t) {
    t2 = t;
    drawFond();
    if (joueur.twoPlayer == 2){
        engre.forEach(
            function(e){
                if (e.s == 0){
                    ctx.save();
                    ctx.translate(W/2,H);
                    ctx.rotate(e.r - scrollX);
                    ctx.drawImage(eng,0,-e.y - planetSize);
                    ctx.restore();
                    var x = (e.y+planetSize) * Math.sin((e.r - scrollX)%(Math.PI*2)) + W/2;
                    var y = H - ((e.y+planetSize) * Math.cos((e.r - scrollX)%(Math.PI*2)));
                    if (Math.hypot(mouse[0] - y,mouse[1] - x) < 20 + 20*scaleFactor){argent += 1;e.s = 1;}
                    else if (Math.hypot(mouse[2] - y,mouse[3] - x) < 20 + 20*scaleFactor){argent += 1;e.s = 1;}
                }
                else {
                    if (((e.r - scrollX)*sens)%(Math.PI*2) < -3 && ((e.r - scrollX)*sens)%(Math.PI*2) > -3.4){
                        e.s = 0;
                    }  
                }
            }
        );
    }
    else {
        engre.forEach(
            function(e){
                if (e.s == 0){
                    ctx.save();
                    ctx.translate(W/2,H);
                    ctx.rotate(e.r - scrollX);
                    ctx.drawImage(eng,0,-e.y - planetSize);
                    ctx.restore();
                    var x = (e.y+planetSize) * Math.sin((e.r - scrollX)%(Math.PI*2)) + W/2;
                    var y = H - ((e.y+planetSize) * Math.cos((e.r - scrollX)%(Math.PI*2)));
                    if (Math.hypot(mouse[0] - y,mouse[1] - x) < 20 + 20*scaleFactor){argent += 1;e.s = 1;}
                }
                else {
                    if (((e.r - scrollX)*sens)%(Math.PI*2) < -3 && ((e.r - scrollX)*sens)%(Math.PI*2) > -3.4){
                        e.s = 0;
                    }  
                }
            }
        );
    }
    if (dead == 0){
        ctx.save();
        ctx.translate(mouse[1],mouse[0]);
        ctx.rotate(Math.atan((mouse[1] - W/2)/(H - mouse[0])));
        ctx.scale(scaleFactor*sens,scaleFactor);
        ctx.drawImage(img["boxe"+vaisseau],- img["boxe"+vaisseau].width/2, - img["boxe"+vaisseau].height/2);
        ctx.restore();
        if (joueur.twoPlayer == 2){
            ctx.save();
            ctx.translate(mouse[3],mouse[2]);
            ctx.rotate(Math.atan((mouse[3] - W/2)/(H - mouse[2])));
            ctx.scale(scaleFactor*sens,scaleFactor);
            ctx.drawImage(img["boxe"+vaisseau],- img["boxe"+vaisseau].width/2, - img["boxe"+vaisseau].height/2);
            ctx.restore();
        }
    }

//    if (dead == 0) ctx.drawImage(vaisseau,mouse[1]  - vaisseau.width/2,mouse[0] - vaisseau.height/2);
    if (bonus.on == 1){
        ctx.save();
        ctx.translate(W/2,H);
        ctx.rotate(bonus.r - scrollX);
        ctx.drawImage(img["bonus"+nImg],0,-bonus.y - img["bonus"+nImg].height/2 - planetSize);
        ctx.restore();        
    }
    ctx.fillStyle = colorC;
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
            if (e.n == -1){
                var x = W/2;
                var y = H;
                var s = planetSize;
            }
            else{
                var x = (object[e.n].y+planetSize) * Math.sin((object[e.n].r - scrollX)%(Math.PI*2)) + W/2;
                var y = H - ((object[e.n].y+planetSize) * Math.cos((object[e.n].r - scrollX)%(Math.PI*2)));
                var s = object[e.n].s;
            }
            ctx.save();
            ctx.translate(x,y);
            ctx.rotate(e.r - scrollX);
            ctx.drawImage(img["fleur" + (e.t+nImg*3)],- 25,- 45 - s);
            ctx.restore();
        }
    );
    ctx.beginPath();
    ctx.arc(W/2,H,planetSize,-Math.PI,Math.PI);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();
    
    if (dead == 1){
        ctx.drawImage(img.shop,W/2-planetSize,H-planetSize,planetSize*2,planetSize);
    }
}

function drawTravel(t){
    var at = 4000-t;
    ctx.fillStyle = colorA;
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = colorB;
    if (t >= 1000 && t < 3000){
        VX += 200*sens;
        etoiles.forEach(
            function (e){
                var y = e.y;
                var x = W+100 - (e.x+VX+100*W+20000)%(W+200);
                drawRayon(x,y);
            }
        );
    }
    else if (t >= 3000){
        VX += at/5*sens;
        etoiles.forEach(
            function (e){
                var y = e.y;
                var x = W+100 - (e.x+VX+100*W+20000)%(W+200);
                drawRayon(x,y);
            }
        );
    }
    else if (t < 1000){
        VX += t/5*sens;
        etoiles.forEach(
            function (e){
                var y = e.y;
                var x =  W+100 - (e.x+VX+100*W+20000)%(W+200);
                drawRayon(x,y);
            }
        );
    }
    ctx.save();
    ctx.translate(mouse[1],mouse[0]);
    ctx.rotate(Math.atan((mouse[1] - W/2)/(H - mouse[0])));
    ctx.scale(scaleFactor*sens,scaleFactor);
    ctx.drawImage(img["boxe"+vaisseau],- img["boxe"+vaisseau].width/2, - img["boxe"+vaisseau].height/2);
    ctx.restore();
}

function drawRayon(x,y){

    ctx.beginPath();
    ctx.moveTo(x,y-2);
    ctx.lineTo(x-100,y);
    ctx.lineTo(x,y+2);
    ctx.lineTo(x+100,y);
    ctx.closePath();
     ctx.fill();

    //ctx.fillRect(x-50,y-2,100,4);
}

function drawFond() {
    ctx.fillStyle = colorA;
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = colorB;
    //ctx.globalAlpha = 0.4;
    etoiles.forEach(
        function(e){
            if (e.n == 0 | e.n == 2) ctx.fillRect(e.x,e.y,3,3);
            else if (e.n == 1){
                ctx.beginPath();
                ctx.moveTo(e.x - 2,e.y - 2);
                ctx.lineTo(e.x,e.y - 10);
                ctx.lineTo(e.x + 2,e.y - 2);
                ctx.lineTo(e.x + 10,e.y);
                ctx.lineTo(e.x + 2,e.y + 2);
                ctx.lineTo(e.x,e.y + 10);
                ctx.lineTo(e.x - 2,e.y + 2);
                ctx.lineTo(e.x - 10,e.y);
                ctx.closePath();
                ctx.fill();
            }
        }
    );
    //ctx.globalAlpha = 1;
}

function collision(t) {
    if (bonus.on == 1){
        var x = (bonus.y+planetSize) * Math.sin((bonus.r - scrollX)%(Math.PI*2)) + W/2;
        var y = H - ((bonus.y+planetSize) * Math.cos((bonus.r - scrollX)%(Math.PI*2)));
        if (Math.hypot(mouse[0] - y,mouse[1] - x) < img["bonus"+nImg].height/2 + 20*scaleFactor){
            bonus.on = 0;
            if (nImg == 0) sens = sens*-1;
            else if (nImg == 1) argent += 10;
            else if (nImg == 2) bonus.on = 1;
            else if (nImg == 3) {
                object.forEach(
                    function(e){
                        e.s = e.s/2;
                    }
                );
            }
        }
        if (joueur.twoPlayer == 2){
            if (Math.hypot(mouse[2] - y,mouse[3] - x) < img["bonus"+nImg].height/2 + 20*scaleFactor){
                bonus.on = 0;
                if (nImg == 0) sens = sens*-1;
                else if (nImg == 1) argent += 10;
                else if (nImg == 2) bonus.on = 1;
                else if (nImg == 3) {
                    object.forEach(
                        function(e){
                            e.s = e.s/2;
                        }
                    );
                }
            }
        }
        if (nImg == 2){
            var poids = 20/(H/15+10);
            if (mouse[0] < y) mouse[0] += poids;
            else mouse[0] -= poids;
            if (mouse[1] < x) mouse[1] += poids;
            else mouse[1] -= poids;
            if (mouse[2] < y) mouse[2] += poids;
            else mouse[2] -= poids;
            if (mouse[3] < x) mouse[3] += poids;
            else mouse[3] -= poids;
        }
    }
    //    ctx.fillStyle = "rgb(255,255,255)";
    if (joueur.twoPlayer == 2){
        if (Math.hypot(mouse[0] - H,mouse[1] - W/2) < planetSize + 20*scaleFactor) mort(t,0);
        else if (Math.hypot(mouse[2] - H,mouse[3] - W/2) < planetSize + 20*scaleFactor) mort(t,1);
        object.forEach(
            function(e){
                var x = (e.y+planetSize) * Math.sin((e.r - scrollX)%(Math.PI*2)) + W/2;
                var y = H - ((e.y+planetSize) * Math.cos((e.r - scrollX)%(Math.PI*2)));
                //ctx.fillRect(x,y,5,5);
                if (Math.hypot(mouse[0] - y,mouse[1] - x) < e.s + 20*scaleFactor) mort(t,0);
                else if (Math.hypot(mouse[2] - y,mouse[3] - x) < e.s + 20*scaleFactor) mort(t,1);
            }
        );
    }
    else {
        if (Math.hypot(mouse[0] - H,mouse[1] - W/2) < planetSize + 20*scaleFactor) mort(t,0);
        object.forEach(
            function(e){
                var x = (e.y+planetSize) * Math.sin((e.r - scrollX)%(Math.PI*2)) + W/2;
                var y = H - ((e.y+planetSize) * Math.cos((e.r - scrollX)%(Math.PI*2)));
                //ctx.fillRect(x,y,5,5);
                if (Math.hypot(mouse[0] - y,mouse[1] - x) < e.s + 20*scaleFactor) mort(t,0);
            }
        );
    }
}

function mort(t,NN){
    window.localStorage.setItem("argent",JSON.stringify(argent));
    dead = 1;
    if (Math.round(t/1000) == 1) var pluriel = "";
    else var pluriel = "s";
    if (record == 1) var pluriel2 = "";
    else var pluriel2 = "s";
    if (Math.round(t/1000) > record){
        record = Math.round(t/1000);
        window.localStorage.setItem("record",JSON.stringify(Math.round(t/1000)));
        score = "Vous avez tenu " + Math.round(t/1000) + " seconde"+pluriel+". C'est un nouveau record !!! Vous avez "+ argent+" engrenages.";
    }
    else {
        score = "Vous avez tenu " + Math.round(t/1000) + " seconde"+pluriel+". Votre record est de " + record + " seconde"+pluriel2+". Vous avez "+ argent+" engrenages.";
    }
    window.localStorage.setItem("joueur",JSON.stringify(joueur));
    alert(score);
    ready = 20;
    for (var iii = 0; iii < 10; iii++) {
        var taille = rnd(100) + 100;
        newExplosion(mouse[1+2*NN] - 40 + rnd(20) + "px",mouse[0+2*NN] - 95 + rnd(20)  + "px",mouse[1+2*NN] - 150 + rnd(200) + "px",mouse[0+2*NN] - 205 + rnd(200)+ "px", taille + "px",0,1);
    }
}

function smartPhoneMode(){
    mode = 1;
    object = [{r:3.7,y:300,s:30},{r:2,y:150,s:50},{r:2.1,y:400,s:15},{r:3.4,y:100,s:9},{r:2.5,y:150,s:70},{r:4.1,y:100,s:5},{r:5.7,y:240,s:25},{r:5.5,y:10,s:18},{r:1.4,y:50,s:18},{r:-1.5,y:240,s:14},{r:3.7,y:240,s:45}];
    fleur = [{n:0,r:2,t:1},{n:1,r:5,t:0},{n:2,r:0,t:2},{n:3,r:0.5,t:0},{n:4,r:4.2,t:0},{n:5,r:3.8,t:2},{n:6,r:5,t:1},{n:7,r:2.2,t:0},{n:8,r:0.2,t:0}];
}
