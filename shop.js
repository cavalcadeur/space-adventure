function drawShop(){
    drawFond();
    if (shop == 1){
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.strokeRect(W/8,H/4,W/4,H/2);
        ctx.strokeRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(W/8,H/4,W/4,H/2);
        ctx.fillRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 1;
        if (H/2 >= 200 && W/4 >= 200){
            ctx.drawImage(img["boxe"+vaisseau],W/4-50,H/2-50,100,100);
            ctx.drawImage(img.equip,W/4*3-50,H/2-50,100,100);
        }
        else{
            ctx.drawImage(img["boxe"+vaisseau],W/4-25,H/2-25);
            ctx.drawImage(img.equip,W/4*3-25,H/2-25);
        }
    }
    else if (shop == 2){
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.strokeRect(W/8,H/4,W/4,H/2);
        ctx.strokeRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 0.7;
        ctx.fillRect(W/8,H/4,W/4,H/2);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 1;
        if (H/2 >= 200 && W/4 >= 200){
            ctx.drawImage(img["boxe"+vaisseau],W/4-50,H/2-50,100,100);
            ctx.drawImage(img.equip,W/4*3-50,H/2-50,100,100);
        }
        else{
            ctx.drawImage(img["boxe"+vaisseau],W/4-25,H/2-25);
            ctx.drawImage(img.equip,W/4*3-25,H/2-25);
        }
    }
    else if (shop == 3){
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.strokeRect(W/8,H/4,W/4,H/2);
        ctx.strokeRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(W/8,H/4,W/4,H/2);
        ctx.globalAlpha = 0.7;
        ctx.fillRect(W/8+W/2,H/4,W/4,H/2);
        ctx.globalAlpha = 1;
        if (H/2 >= 200 && W/4 >= 200){
            ctx.drawImage(img["boxe"+vaisseau],W/4-50,H/2-50,100,100);
            ctx.drawImage(img.equip,W/4*3-50,H/2-50,100,100);
        }
        else{
            ctx.drawImage(img["boxe"+vaisseau],W/4-25,H/2-25);
            ctx.drawImage(img.equip,W/4*3-25,H/2-25);
        }
    }
    else if (shop == 4){
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(W/8,H/2);
        ctx.lineTo(W/4,H/2 + W/8);
        ctx.lineTo(W/4,H/2 - W/8);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(W-W/8,H/2);
        ctx.lineTo(W-W/4,H/2 + W/8);
        ctx.lineTo(W-W/4,H/2 - W/8);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        if (ships[shopData.n][1] == 1){
            ctx.drawImage(img.play,W/2-W/8,H-H/8,W/4,H/8);
        }
        else ctx.drawImage(img.buy,W/2-W/8,H-H/8,W/4,H/8);
        ctx.drawImage(img["boxe"+shopData.n],W/2-25,H/2-25);
    }
}

function analyseShop(x,y){
    if (shop <= 3){
        if (x > W/8 && x < W/8+W/4 && y > H/4 && y < H/4*3){
            shop = 2;
            alert("Acheter un vaisseau.");
        }
        else if (x > W/8+W/2 && x < W/8+W/2+W/4 && y > H/4 && y < H/4*3){
            shop = 3;
            alert("Ameliorer vos vaisseaux.");
        }
        else {
            shop = 1;
            alert("Bienvenue au magasin. Vous possédez actuellement "+argent+ " engrenages. Mais croyez moi cela ne va pas durer.");
        }
    }
}
