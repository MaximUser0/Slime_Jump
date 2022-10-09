/*----- Глобальные константы и переменные -----*/

const center = document.getElementById("center");
let pArX = [0,0,0,0,0,0,0], pArY = [0,0,0,0,0,0,0], pArzX = [0,0,0,0,0,0,0], pArzY = [0,0,0,0,0,0,0];//Координаты платформ
let Ischez = [0,1,2,0,0,1,0], IschezZ = [0,0,0,0,0,0,0];//Типы платформ
let StartWindow=1,KadrOne=1,zoomR,zoom,dooble=0,GenProver=0,stopError=0,stopInt=0;//Служебные переменные(исправляют ошибки)
let cenX=46,cenY,cenHeight,platfWidth,kolvoPlatform = 14,Metrag=0;//Параметры объектов
let n=0, NapravNosa=0,AutoJamp=0,sh,k;//Информация о прыжке
let StopJump,stopKadr,hr;//Функции и объекты

const StopSdvig = setInterval(Sdvig,100);//Движение платформ и низкочастотные проверки
const StopRotation = setInterval(RotationMobile,100);//Проверка наклона

/*----- Обработчики событий -----*/

//Экранные кнопки

document.querySelector('.StartGame').onclick = Start;

document.querySelector('.error button').onclick = Reset;

document.querySelector('.StopGame').onclick = function() {//Пауза
    if(stopError==0){
    if(stopInt==0){
    clearTimeout(stopKadr);KadrOne=1;
    stopInt=1;}
    else {
        if(KadrOne==1){KadrOne=2;stopKadr = setInterval(Kadr,20);}
        stopInt=0;
    }}
}; 

document.getElementById('NOjump').onclick = function() {//Настройки автопрыжка
    if(AutoJamp == 1){AutoJamp = 0;
    document.getElementById('NOjump').textContent = "Включить автопрыжок";
    document.getElementById('NOjump').style.backgroundColor = "rgb(27, 118, 106)";
    clearTimeout(StopJump);
    }   else{
        AutoJamp = 1;
        document.getElementById('NOjump').textContent = "Выключить автопрыжок";
        document.getElementById('NOjump').style.backgroundColor = "rgb(27, 118, 46)";
        jumpNew();
    }
}; 

//Клавиатура

document.addEventListener("keydown", function(event){//Обработчик нажатия
    if (event.keyCode == 32||event.keyCode == 38){
        if (dooble == 0 && AutoJamp == 0)jumpNew();
    }
    if (event.keyCode == 39){
        n = 1;
        center.classList.remove("transform");
        NapravNosa = 0;
    }
    if (event.keyCode == 37){
        n = -1;
        center.classList.add("transform");
        NapravNosa = 1;
        if(zoom==1)NapravNosa = 2;
    }
});

document.addEventListener("keyup", function(event){//Обработчик отпускания
    if (event.keyCode == 39){
        n = 0;
    }
    if (event.keyCode == 37){
        n = 0;
    }
});

/*----- Функции -----*/

//Движение и проверки

function Start(){//Пуск игры
    AutoJamp = 1,cenX = 46,cenY,kolvoPlatform = 14, Metrag = 0,GenProver=-1,StartWindow=0;
    document.querySelector(".SchotP").textContent = 0;
    if(zoom==0){cenY = 46;hr=47;cenHeight=5;platfWidth=7;} 
    if(zoom==1){cenY = (window.screen.height*0.94)/(window.screen.width/100);
    hr=(window.screen.height*0.96)/(window.screen.width/100);cenHeight=10;platfWidth=12;} 
    document.querySelector('.StartGame').style.visibility = "hidden";
    document.querySelector('.zalivka').style.visibility = "hidden";
    document.querySelector('.zagolovok').style.visibility = "hidden";
    document.querySelector('.StopGame').style.visibility = "visible";
    document.querySelector('.Schot').style.visibility = "visible";
    document.querySelector('.hr').style.visibility= "visible";
    center.style.visibility= "visible";
    GeneratsiaBlokov(pArY,pArX,1);
    jumpNew();
    if (Metrag<1 && zoom==0){
        document.querySelector('.hr').style.top = 47 + Metrag + "vw";
    } else if (Metrag<1 && zoom==1){
        document.querySelector('.hr').style.top = hr + "vw";
    }
}

function GameOver(){//Смерть
    clearInterval(stopKadr);KadrOne=1;StartWindow=1;
    dooble = 0;
    pArzX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0], pArzY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(zoom==1)pArzX = [-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35]
    platformLocate(pArzY,pArzX,IschezZ,0,0,"z");
    pArX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0], pArY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(zoom==1)pArX = [-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35]
    platformLocate(pArY,pArX,Ischez,0,0,"");
    center.style.visibility = "hidden";
    document.querySelector('.StartGame').style.visibility = "visible";
    if(zoom==0)document.querySelector('.zalivka').style.visibility = "visible";
    document.querySelector('.StopGame').style.visibility = "hidden";
    document.querySelector('.Schot').style.visibility = "hidden";
    document.querySelector('.zagolovok').style.visibility = "visible";
    document.querySelector('.zagolovok').textContent = "Game over!";
}

function jumpNew (){//Запускает прыжок
    if (dooble == 0){
    dooble = 1;
    sh = -4,k = 1;
    if(KadrOne==1){KadrOne=2;stopKadr = setInterval(Kadr,20);} 
}};

function Kadr(){//Управляет движением персонажа, изменением платформ после прыжка  
    cenX = cenX+((cenHeight/10)*n);
    center.style.left = cenX + "vw";
    cenY = cenY-(sh*sh*k*cenHeight/50);
    center.style.top = cenY + "vw";
    if (sh>=0){k=-1;}
    for (let i=0;i<kolvoPlatform;i++){
       if (sh>=0&&cenX>=pArX[i]-((platfWidth/2)+NapravNosa)&&cenX<=pArX[i]+((platfWidth)-NapravNosa)&&cenY+cenHeight>=pArY[i]&&cenY+cenHeight<=pArY[i]+2+zoom){
        center.style.top = pArY[i]-cenHeight+"vw";
        clearInterval(stopKadr); KadrOne=1;
        dooble = 0;
        if(Ischez[i]==1){ let platforma = document.getElementById('platforma'+(i+1));
        platforma.style.top = "0 vw";
        platforma.style.left = "0 vw";
        platforma.style.visibility = "hidden";
        pArX[i] = -35; pArY[i] = 0;
        };
        if (AutoJamp==1) jumpNew();}
        if (sh>=0&&cenX>=pArzX[i]-((platfWidth/(2))+NapravNosa)&&cenX<=pArzX[i]+((platfWidth)-NapravNosa)&&cenY+cenHeight>=pArzY[i]&&cenY+cenHeight<=pArzY[i]+2+zoom){
        center.style.top = pArzY[i]-cenHeight+"vw";
        clearInterval(stopKadr); KadrOne=1;
        dooble = 0;
        if(IschezZ[i]==1){ let platforma = document.getElementById('platforma'+(i+1)+'z');
        platforma.style.top = '0 vw';
        platforma.style.left = '0 vw';
        platforma.style.visibility = "hidden";
        pArzX[i] = -35; pArzY[i] = 0; 
        };
        if (AutoJamp==1) jumpNew();
        }
    };  
    MobileWight();
    if(zoom==0){
        if (cenX<20) cenX=75;
        if (cenX>75) cenX=20;}
    if(zoom==1){
        if (cenX<-5) cenX=94;
        if (cenX>95) cenX=-4;}
    if (cenY<15&&zoom==0) Prokrutka();
    if (cenY<(hr/3)&&zoom==1) Prokrutka();
    if (pArY[kolvoPlatform-1]>0&&GenProver==0) GeneratsiaBlokov(pArzY,pArzX,0);
    if (pArzY[kolvoPlatform-1]>0&&GenProver==1) GeneratsiaBlokov(pArY,pArX,1);
    if (sh>=0&&cenY+cenHeight>=hr&&Metrag<1){clearInterval(stopKadr);KadrOne=1;
    dooble = 0;
    center.style.top = (hr-cenHeight)+"vw";
    if (AutoJamp==1) jumpNew();
    }
    if (cenY>hr&&Metrag>1){
        GameOver();
    }
    if (sh<=4) sh+=0.2;
}

function MobileWight(){
if(cenX>90&&cenX<99&&zoom==1){
        if(NapravNosa>0){
            document.querySelector(".center").classList.remove("left");
            document.querySelector(".center").classList.add("right");
        }
        if(NapravNosa==0){
            document.querySelector(".center").classList.remove("right");
            document.querySelector(".center").classList.add("left");
        }
        document.querySelector(".center").style.width = cenHeight+(90-cenX)+"vw";
    }
if(cenX<=90)document.querySelector(".center").style.width = 10+"vw";
}

function RotationMobile(){
    if(zoom==1){
    window.addEventListener("deviceorientation",function(event) {//Наклон устройства
    let rotation = event.gamma;
    if(rotation>4){
    center.classList.remove("transform");
    NapravNosa = 0;}
    if(rotation<-4){
    center.classList.add("transform");
    NapravNosa = 1;
    if(zoom==1)NapravNosa = 2;}
    n=rotation/10;
    if(rotation<4&&rotation>-4)n=0;
    if(rotation>26&&rotation<-26)n=2.5;
},true)}} 

function Sdvig(){
    //Адаптив
if (window.screen.width>440) zoom = 0;
else zoom = 1;
if(zoomR==null) zoomR = zoom;
if(zoomR!=zoom&&StartWindow==0){
    stopError=1;
    clearTimeout(stopKadr);KadrOne=1;
    document.querySelector('.error').style.visibility = "visible";
    if(zoom==1)document.querySelector('.error p').textContent = "Для продолжения верните компьтерную версию или перезагрузите игру (Внимание прогресс будет потерян!).";
    if(zoom==0)document.querySelector('.error p').textContent = "Для продолжения верните мобильную версию или перезагрузите игру (Внимание прогресс будет потерян!).";
} 
if(zoomR==zoom&&stopError==1){
    document.querySelector('.error').style.visibility = "hidden";
    if(KadrOne==1){KadrOne=2;stopKadr = setInterval(Kadr,20);}
    stopError=0;
}
if(stopError==0)zoomR = zoom;

TPplatform(pArX);
TPplatform(pArzX);

    for (let i=0;i<kolvoPlatform;i++){
        //Исчезновение опустившихся платформ
            if(pArY[i]>hr){
            PlatfUpralenie = 'platforma' + (i+1);
            let platforma = document.getElementById(PlatfUpralenie);
            pArY[i]=0;
            pArX[i]=-35;
            platforma.style.top = 0 +"vw";
            platforma.style.left = 0 +"vw";
            platforma.style.visibility = "hidden";}
            if(pArzY[i]>hr){
            PlatfUpralenie = 'platforma' + (i+1) +'z';
            let platforma = document.getElementById(PlatfUpralenie);
            pArzY[i]=0;
            pArzX[i]=-35;
            platforma.style.top = 0 +"vw";
            platforma.style.left = 0 +"vw";
            platforma.style.visibility = "hidden";}
        //Двигующиеся платформы   
        /*
            for (let i=0;i<kolvoPlatform;i++){
            if(Ischez[i]==2){
                if(Ischez[i+kolvoPlatform] == null) Ischez[i+kolvoPlatform] = (Math.random() * (50 - (-50)) + (-50));
                if(Ischez[i+kolvoPlatform]<500&&Ischez[i+kolvoPlatform]>=0) {pArX[i]+=0.02;}
                if(Ischez[i+kolvoPlatform]>500) {Ischez[i+kolvoPlatform]=-500;}
                if(Ischez[i+kolvoPlatform]<0&&Ischez[i+kolvoPlatform]>=-500) {pArX[i]-=0.02;}
                Ischez[i+kolvoPlatform]++;
                if (pArX[i]<22) pArX[i]+=56;
                if (pArX[i]>70) pArX[i]-=48;
                document.getElementById('platforma'+(i+1)).style.left = pArX[i]+'vw';
            }
        };
        for (let i=0;i<kolvoPlatform;i++){
            if(IschezZ[i]==2){
                if(IschezZ[i+kolvoPlatform] == null) IschezZ[i+kolvoPlatform] = (Math.random() * (50 - (-50)) + (-50));
                if(IschezZ[i+kolvoPlatform]<500&&IschezZ[i+kolvoPlatform]>=0) pArzX[i]+=0.02; 
                if(IschezZ[i+kolvoPlatform]>500) IschezZ[i+kolvoPlatform]=-500;
                if(IschezZ[i+kolvoPlatform]<0&&IschezZ[i+kolvoPlatform]>=-500) pArzX[i]-=0.02; 
                IschezZ[i+kolvoPlatform]++; 
                if (pArzX[i]<22) pArX[i]+=56;
                if (pArzX[i]>70) pArX[i]-=48;
                document.getElementById('platforma'+(i+1)+'z').style.left = pArzX[i]+'vw';
            }
        };*/ 
    }
};
function Reset() {//Перезагрузка
        if (window.screen.width>440) zoom = 0;
        else zoom = 1;
        pArzX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0], pArzY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        if(zoom==1)pArzX = [-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35];
        platformLocate(pArzY,pArzX,IschezZ,0,0,"z");
        pArX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0], pArY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        if(zoom==1)pArX = [-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35,-35];
        platformLocate(pArzY,pArzX,Ischez,0,0,"");
        document.querySelector('.error').style.visibility = "hidden";
        zoomR = zoom;
        if(zoom==0){cenY = 46;hr=47;cenHeight=5;platfWidth=7;} 
        if(zoom==1){hr=(window.screen.height*0.96)/(window.screen.width/100);
        cenY = (window.screen.height*0.94)/(window.screen.width/100);
        cenHeight=10;platfWidth=12;} 
        center.style.top = cenY+"vw";
        cenX=46;
        center.style.left = cenX+"vw";
        document.querySelector('.hr').style.visibility  = "visible";
        document.querySelector('.hr').style.top = hr + "vw";
        Metrag=0; document.querySelector(".SchotP").textContent = 0;
        GenProver=-1; GeneratsiaBlokov(pArY,pArX,1);
        jumpNew();
}

function Prokrutka(){//Прокрутка платформ, исчезновение пола, счёт
    let e;
    if(zoom==0)e=0.3;
    if(zoom==1)e=0.6;
    if(cenY<5){e*=2;Metrag += 0.3;}
    for (let i=0;i<kolvoPlatform;i++){
        pArY[i]+=e;
        pArzY[i]+=e;
    }
    platformLocate(pArY,pArX,null,1,0,"");
    platformLocate(pArzY,pArzX,null,1,0,"z");
    cenY+=e;
    if (Metrag>1){
        document.querySelector('.hr').style.visibility="hidden";
    }
    Metrag += 0.3;
    document.querySelector(".SchotP").textContent = Math.floor(Metrag);
};

//Рандомная генерация

function TPplatform(X){
    for (let i=0;i<kolvoPlatform;i++){
        if(zoom==0){
            if (X[i]<22) {X[i]+=56;}
            else{if (X[i]>70) X[i]-=48;}} else{
        if(zoom==1){
            if (X[i]<0&&X[i]!=-35){X[i]+=87;}
            else{if (X[i]>88) X[i]-=87;}}else alert(1);}
    }
}

function GeneratsiaBlokov(Y,X,t){//Генерация блоков
    if(GenProver>0) GenProver=-1;
    GenProver-=7;
    RandomArr(Y,X,t);
    TPplatform(X);
    if (t==0) { RandomType(IschezZ); platformLocate(Y,X,IschezZ,0,1,"z"); } 
    else {if (t==1) RandomType(Ischez); platformLocate(Y,X,Ischez,0,1,"");}
    GenProver+=8;
};

function platformLocate(Y,X,Z,u,v,l){//Расставка пратформ
    for (let i=1;i<kolvoPlatform+1;i++){
        PlatfUpralenie = 'platforma' + i + l;
        let platforma = document.getElementById(PlatfUpralenie);
        if (u==0){
        platforma.style.backgroundColor = "rgb(33, 189, 67)";
        if(Z[i-1]==1) platforma.style.backgroundColor = "rgb(74, 253, 113)";
        if(Z[i-1]==2) platforma.style.backgroundColor = "rgb(84, 293, 253)";
        };
        platforma.style.top = Y[i-1]+"vw";
        platforma.style.left = X[i-1]+"vw";
        if(v==1)platforma.style.visibility = "visible";
     };
};

function RandomArr(Y,X,t){//Рандомные координаты платформ
    let maxX = 15,minX = -15,maxY = cenY,minY = maxY-6, koef;
    if(zoom==1) maxX = 30,minX = -30;
    if (Metrag<1 && t==1){
    Y[0] = Math.random() * (maxY - minY) + minY;
    if(zoom==0) X[0] = Math.random() * (65 - 25) + 25;
    if(zoom==1) X[0] = Math.random() * (92 - 1) + 1;
    }
    else {
        if (t==1){
        X[0] = pArzX[kolvoPlatform-1] + (Math.random() * (maxX - minX) + minX);
        koef = (maxX-(Math.abs(pArzX[kolvoPlatform-1]-X[0])))/maxX;
        if(zoom==0) Y[0] = pArzY[kolvoPlatform-1] - 10*koef;
        if(zoom==1) {Y[0] = pArzY[kolvoPlatform-1] - 20*koef;}
        };
        if (t==0){
        X[0] = pArX[kolvoPlatform-1] + (Math.random() * (maxX - minX) + minX);
        koef = (maxX-(Math.abs(pArX[kolvoPlatform-1]-X[0])))/maxX;
        if(zoom==0) Y[0] = pArY[kolvoPlatform-1] - 10*koef;
        if(zoom==1) {Y[0] = pArY[kolvoPlatform-1] - 20*koef;}
        };
        }
    for (let i=1;i<kolvoPlatform;i++){
        X[i] = X[i-1] + (Math.random() * (maxX - minX) + minX);
        koef = (maxX-(Math.abs(X[i-1]-X[i])))/maxX;
        Y[i] = Y[i-1] - 10*koef;
        if(zoom==0) Y[i] = Y[i-1] - 10*koef;
        if(zoom==1) {Y[i] = Y[i-1] - 20*koef;}
     };
};

function RandomType(Is){//Рандомные типы платформ
    for (let i=0;i<kolvoPlatform;i++){
        let Ran = 0, MRan = Math.random() * 10; 
        Ran += 10 - 10/Metrag;
        Ran = MRan * Ran;
        Is[i] = 0;
        if (Ran>70&&Ran<=100) Is[i] = 1;
        if (Ran>40&&Ran<=70) Is[i] = 2;
    }
};

//Вылезающие платформы
//Двигающиеся платформы

