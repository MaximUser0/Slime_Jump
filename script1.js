/*----- Глобальные константы и переменные -----*/

const center = document.getElementById("center");
const monster = document.getElementById("Monster");
//centerArr = [0 = [X,Y,Type,Name], 2...];
let centerArr = [[0,0,0,0]];//Координаты платформ
let DeletedBool = false,StartWindow=1,KadrOne=1,zoomR,zoom,dooble=0,stopError=0,stopInt=0,SceneNow = "start";//Служебные переменные(исправляют ошибки)
let SpaunMoney=-1,MoneyInWindowBool = false,MoneyPlayer=0,cenX=46,cenY,monsterX=-35,monsterY=0,monsterFace=3,cenHeight,platfWidth,Metrag=0;//Параметры объектов
let n=0, NapravNosa=0,AutoJamp=0,sh,k;//Информация о прыжке
let StopJump,stopKadr,hr;//Функции и объекты
Sdvig();
RotationMobile();
//const StopSdvig = setInterval(Sdvig,100);//Движение платформ и низкочастотные проверки
//const StopRotation = setInterval(RotationMobile,100);//Проверка наклона

/*----- Обработчики событий -----*/

//Экранные кнопки

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

document.getElementById('NOjump').onclick = function(){//Настройки автопрыжка
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
    if (event.keyCode == 38){
        if (dooble == 0 && AutoJamp == 0)jumpNew();
    }
    if (event.keyCode == 39){
        n = 1;
        NapravNosa = 0;
    }
    if (event.keyCode == 37){
        n = -1;
        NapravNosa = 1;
        if(zoom==1)NapravNosa = 2;
    }
    if (event.keyCode == 32&&SceneNow == "die"){
        if (dooble == 0 && AutoJamp == 0)jumpNew();
        Start();
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
//1. Менеджеры Сцен

function Start(){//Пуск игры
    AutoJamp = 1,cenX = 46,cenY, Metrag = 0;
    document.querySelector(".SchotP").textContent = 0;
    if(zoom==0){cenY = (window.screen.height*0.94)/(window.screen.width/100);hr=(window.screen.height*0.96)/(window.screen.width/100);cenHeight=5;platfWidth=8;} 
    if(zoom==1){cenY = (window.screen.height*0.94)/(window.screen.width/100);
    hr=(window.screen.height*0.96)/(window.screen.width/100);cenHeight=10;platfWidth=12;} 
    /**/document.querySelector('.SceneGame').style.display = "block";
    /**/document.querySelector('.SceneHome').style.display = "none";
    /**/document.querySelector('.SceneDie').style.display = "none";
    if(zoom==0){
    document.querySelector('.LeftTree').style.visibility = "visible";
    document.querySelector('.RightTree').style.visibility = "visible";
    document.querySelector('.HomeButton').style.visibility = "hidden";
    }
    center.classList.remove('MonsterKill');
    
    if (zoom==0){
        document.querySelector('.hr').style.top = 93.5 + "vh";
    } else if (zoom==1){
        document.querySelector('.hr').style.top = hr + "vw";
    }
    SceneNow = "game";
    SpaunPlatformFirst();
    SpaunPlatform();
    jumpNew();
}

function GameOver(){//Смерть
    if(SceneNow!="die"){
    clearInterval(stopKadr);KadrOne=1;
    SceneNow = "die";
    dooble = 0;
    DespaunAllPlatform(centerArr);
    /**/document.querySelector('.SceneGame').style.display = "none";
    /**/document.querySelector('.SceneHome').style.display = "none";
    /**/document.querySelector('.SceneDie').style.display = "block";
    document.querySelector('.LeftTree').style.visibility = "hidden";
    document.querySelector('.RightTree').style.visibility = "hidden";
    document.querySelector('.HomeButton').style.visibility = "visible";
    document.querySelector('.hr').style.visibility = "visible";
    monsterX=-35;
    monsterY=0;
    monsterFace=3;
    monster.style.left="-35vw";}
}

function Reset() {//Перезагрузка
    if (window.screen.width>440) zoom = 0;
    else zoom = 1;
    DespaunAllPlatform(centerArr);
    document.querySelector('.error').style.visibility = "hidden";
    zoomR = zoom;
    if(zoom==0){cenY = (window.screen.height*0.94)/(window.screen.width/100);hr=(window.screen.height*0.96)/(window.screen.width/100);cenHeight=5;platfWidth=8;
        center.style.width = "5vw";
        document.querySelector('.hr').style.top = hr + "vh";
    } 
    if(zoom==1){hr=(window.screen.height*0.96)/(window.screen.width/100);
    cenY = (window.screen.height*0.94)/(window.screen.width/100);
    cenHeight=10;platfWidth=12;
    document.querySelector('.hr').style.top = hr + "vw";} 
    center.style.top = cenY+"vw";
    cenX=46;
    center.style.left = cenX+"vw";
    document.querySelector('.hr').style.visibility  = "visible";
    Metrag=0; document.querySelector(".SchotP").textContent = 0;
    SpaunPlatformFirst();
    SpaunPlatform();
    jumpNew();
}

function BackToMenu(){
    /**/document.querySelector('.SceneGame').style.display = "none";
    /**/document.querySelector('.SceneHome').style.display = "block";
    /**/document.querySelector('.SceneDie').style.display = "none";
}

//2. Движение и проверки, управление кадром

function jumpNew (){//Запускает кадр
    if (dooble == 0){
    dooble = 1;
    sh = -4,k = 1;
    if(KadrOne==1){KadrOne=2;stopKadr = setInterval(Kadr,25);} 
}};

function Kadr(){//Управляет движением персонажа, изменением платформ после прыжка - Контроллер кадра
    JumpPhysics();//Управляет физикой прыжка
    JumpOffTheBlock();//Отслеживает касание блока и запускает отскок
    MobileWight();//Отслеживает размер экрана
    Monster();//Управляет движением монстра
    DieSlime();//Управляет смертью игрока
    TPSlime();//Управляет перемещением между стенами и сдвигом фона
    DvigFona();//Управляет сдвигом фона и запускает спаун платформы (запускается Kadr)
}

//2.1 Движение

function JumpPhysics(){ //Управляет физикой прыжка (запускается Kadr)

    cenX = cenX+((cenHeight/10)*n);
    center.style.left = cenX + "vw";
    cenY = cenY-(sh*sh*k*cenHeight/47);
    center.style.top = cenY + "vw";
    if (sh>=0){k=-1;}
    if (sh<=4) sh+=0.2;
}

function JumpOffTheBlock(){ //Отслеживает касание блока и запускает отскок (запускается Kadr)
    for (let i=0;i<centerArr.length;i++){
        if (sh>=0&&cenX>=centerArr[i][0]-(cenHeight*0.8)&&cenX<=centerArr[i][0]+platfWidth-cenHeight/2.5&&cenY+cenHeight>=centerArr[i][1]&&cenY+cenHeight<=centerArr[i][1]+2+zoom){ //Платформы
         center.style.top = centerArr[i][1]-cenHeight+"vw";
         if(zoom==0){center.classList.add('animate');
         setTimeout(function(){center.classList.remove('animate'); },250);}
         if(zoom==1&&center.style.width>=cenHeight){center.classList.add('animateM');
         setTimeout(function(){center.classList.remove('animateM'); },250);}
         clearInterval(stopKadr); KadrOne=1;
         dooble = 0;
         if(centerArr[i][2]==1){ 
            let array = DespaunPlatform(i,centerArr);
            centerArr.length = 0;
            centerArr.push.apply(centerArr, array);
            i--;}
         if (AutoJamp==1) jumpNew();
        }
         if (sh>=0&&cenY+cenHeight>=hr-5&&Metrag<1){clearInterval(stopKadr);KadrOne=1; //Пол
            center.style.top = (hr-5-cenHeight)+"vw";
            if(zoom==0){center.classList.add('animate');
                setTimeout(function(){center.classList.remove('animate'); },250);}
            if(zoom==1&&center.style.width>=cenHeight){center.classList.add('animateM');
                setTimeout(function(){center.classList.remove('animateM'); },250);}
            dooble = 0;
            if (AutoJamp==1) jumpNew();
        }
     };  
}

function TPSlime(){//Управляет перемещением между стенами(запускается Kadr)
    if(zoom==0){
        if (cenX<13) cenX=81;
        if (cenX>82) cenX=14;}
    if(zoom==1){
        if (cenX<-12) cenX=95;
        if (cenX>96) cenX=-11;}
    
}
function DvigFona(){//Управляет сдвигом фона и запускает спаун платформы (запускается Kadr)
    if (cenY<15&&zoom==0) Prokrutka();
    if (cenY<(hr/3)&&zoom==1) Prokrutka();
    if(centerArr[centerArr.length-1][1]>0){
        SpaunPlatform();
    }
}
function DieSlime(){//Управляет смертью игрока (запускается Kadr)
    if (cenY>hr&&Metrag>1){ 
        setTimeout(GameOver,500);
    }
    if(cenX>monsterX-cenHeight&&cenX<monsterX+5&&cenY>monsterY-cenHeight&&cenY<monsterY+5){
        clearInterval(stopKadr);
        setTimeout(GameOver,1000);
        center.classList.add('MonsterKill');
    }
}

function SpaunMonster(){//Спаунит монстра
    if(monsterX==-35){
    monsterX = Math.random() * (80 - 40) + 40;
    monsterY=-20;
    monsterFace = 0;
    }
}

function Monster(){ //Управляет движением монстра (запускается Kadr)
    if(monsterY>hr){monsterY=0;monsterX=-35;monsterFace==3;monster.style.left="-35vw";}
    monster.style.top=monsterY+"vw";
    if(zoom==0&&monsterFace<3){
        if(monsterX<80&&monsterFace==0) {monsterX+=0.5; monster.style.left=monsterX+"vw";}
        if(monsterX>=80) {monsterFace=1;}
        if(monsterX>15&&monsterFace==1) {monsterX-=0.5; monster.style.left=monsterX+"vw";}
        if(monsterX<=15&&monsterX!=-35) {monsterFace=0;}
    }
}

function Sdvig(){//Движение платформ и низкочастотные проверки - Контроллер кадра(низкочастотный)
    //Адаптив
if (window.screen.width>440) zoom = 0;
else zoom = 1;
if(zoomR==null) zoomR = zoom;
if(zoomR!=zoom&&!SceneNow=="start"){
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
};

function Prokrutka(){//Прокрутка платформ, исчезновение пола, счёт
    let e;
    if(zoom==0)e=0.3;
    if(zoom==1)e=0.6;
    if(cenY<5){e*=2;Metrag += 0.3;}
    for (let i=0;i<centerArr.length;i++){
        centerArr[i][1] += e;
        if(centerArr[i][1]>hr){
            let array = DespaunPlatform(i,centerArr);
            centerArr.length = 0;
            centerArr.push.apply(centerArr, array);
            i--;
        } else {
            const platf = document.getElementById(centerArr[i][3]);
        platf.style.top = centerArr[i][1]+"vw";
        } 
    }
    monsterY+=e;
    cenY+=e;
    if (Metrag>1){
        document.querySelector('.hr').style.visibility="hidden";
    }
    Metrag += 0.3;
    document.querySelector(".SchotP").textContent = Math.floor(Metrag);
};
//2.2 Проверки

function MobileWight(){//Отслеживает размер экрана (запускается Kadr)
    if(cenX>90&&cenX<99&&zoom==1){
            if(NapravNosa==0){
                center.classList.remove("right");
                center.classList.add("left");
            }
            center.style.width = 10+(90-cenX)+"vw";
        }
        else if(center.style.width != "15vw"&&zoom==1) {center.style.width = "10vw";}
    }
    
    function RotationMobile(){
        if(zoom==1){
        window.addEventListener("deviceorientation",function(event) {//Наклон устройства
        let rotation = event.gamma;
        if(rotation>4){
        NapravNosa = 0;}
        if(rotation<-4){
        NapravNosa = 1;
        if(zoom==1)NapravNosa = 2;}
        n=rotation/10;
        if(rotation<4&&rotation>-4)n=0;
        if(rotation>26&&rotation<-26)n=2.5;
    },true)}} 
    
//3. Рандомная генерация блоков и монстров

//Update: Normal_Code
function SpaunPlatform(){
    let maxX = 25,minX = -25,maxY = cenY-1, koef,type = 0;
    if(zoom==1){maxX = 30,minX = -30;}
    const num = centerArr.length - 1;
    const X = centerArr[num][0] + (Math.random() * (maxX - minX) + minX);
    koef = (maxX-(Math.abs(centerArr[num][0]-X)))/maxX;
    if(zoom==0){Y = centerArr[num][1] - 10*koef;}
    if(zoom==1){Y = centerArr[num][1] - 20*koef;}
    const name = centerArr[num][3]+1;
    let style = RandomStyle(document.getElementById(name));
    if(style==3){type=1;style=0;}
    centerArr[num+1] = [X,Y,style,name];
    TPplatform(num+1);
    PlatformLocate(centerArr[num+1],type);
}
function SpaunPlatformFirst(){
    let maxX = 25,minX = -25,maxY = cenY-1,minY = maxY-5;
    if(zoom==1){maxX = 30,minX = -30;}
    centerArr[0][1] = Math.random() * (maxY - minY) + minY;
    if(zoom==0){centerArr[0][0] = Math.random() * (65 - 25) + 25;}
    if(zoom==1){centerArr[0][0] = Math.random() * (92 - 1) + 1;}
    centerArr[0][2] = 0;
    centerArr[0][3] = 0;

    PlatformLocate(centerArr[0],0);
}
function PlatformLocate(array,type){
    var newDiv = document.createElement("div");
    newDiv.classList.add("platforma");
    newDiv.id = array[3];
    document.getElementById('SceneGame').appendChild(newDiv);
    const platf = document.getElementById(array[3]);
    platf.style.top = array[1]+"vw";
    platf.style.left = array[0]+"vw";
    platf.style.visibility = "visible";
    if(type==1){SpaunMoneyInWindow(platf);}
}
function TPplatform(i){
    if(zoom==0)
    {
        if (centerArr[i][0]<13){
        centerArr[i][0]+=68;
        } else if (centerArr[i][0]>82){centerArr[i][0]-=68;}
    } else{
    if(zoom==1){
        if (centerArr[i][0]<0&&centerArr[i][0]!=-35){
        centerArr[i][0]+=87;
        }else if (centerArr[i][0]>88){centerArr[i][0]-=87;}} 
    else alert(1);}
}
function RandomStyle(){//Рандомные типы платформ
        let Ran = 0, MRan = Math.random() * 10; 
        Ran += 10 - 10/Metrag;
        Ran = MRan * Ran;
        let Is = 0;
        if (Ran>70&&Ran<=100){Is = 1;}
        if (Ran>40&&Ran<=70){Is = 2;}
        if(Ran<100&&Ran>90){SpaunMonster();}
        if(Ran<80&&Ran>60){Is = 3;}
        return Is;
};
function DespaunPlatform(n,array){
    const name = array[n][3];
    var elem = document.getElementById(name);
    document.getElementById('SceneGame').removeChild(elem);/* .parentNode */
    let arrayB = [[0,0,0,0],[0,0,0,0]];
    for(let i=0;i<n;i++){
        arrayB[i] = [array[i][0],array[i][1],array[i][2],array[i][3]]; 
    }
    for(let i=n+1;i<array.length;i++){
        arrayB[i-1] = [array[i][0],array[i][1],array[i][2],array[i][3]];
    }
    return arrayB; 
}
function DespaunAllPlatform(array){
    for(let i=centerArr.length-1;i>=0;i--){
        let arrayB = DespaunPlatform(i,array);
        centerArr.length = 0;
        centerArr.push.apply(array, arrayB);
    }
    centerArr.length = 0;
    centerArr.push.apply(centerArr, [[0,0,0,0]]);
}
//Update: Money

async function SpaunMoneyInWindow(elem){//Спаунит монетку
    if(MoneyInWindowBool == false){
        MoneyInWindowBool = true;
        console.log(elem);
        elem.innerHTML = '<img class="MoneyGame" src="img/money.png">';
        //elem.insertAdjacentHTML('afterbegin','<img class="MoneyGame" src="img/money.png">');
    }
}
function DespaunMoney(){//Удаляет монетку
    SpaunMoney = -1;
    MoneyInWindowBool = true;
    const elem = document.querySelector(".MoneyGame");
    document.querySelector('.SceneGame').parentNode.removeChild(elem);
}

//Вылезающие платформы

//Двигающиеся платформы

/*function DvigPlatform(){//Движущиеся платформы     
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
        };
}*/

