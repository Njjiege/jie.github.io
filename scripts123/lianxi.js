//头部的点击-------------------------------------------
window.location = "http://server.imflash.com.cn:1241";
let headerUl = document.querySelectorAll(".headerUl");

document.addEventListener("pointerover",function(event){
  let target = event.target;//鼠标移动到的元素
  let relatedTarget = event.relatedTarget;//鼠标离开的元素
 
  //headerUl li 
  function headerUlLi(){
    let Prtarget = target.closest(".headerUl li");
    if(!Prtarget)return;
  
    if(Prtarget.contains(relatedTarget)) return;
    //如果父target 是离开的元素的父元素，那就证明over进的元素和离开的元素同是一个父级。
    Prtarget.style.backgroundColor = "rgba(46,46,46,0.6)";
  }
  headerUlLi(); 

})


document.addEventListener("pointerout",function(event){
  let target = event.target;//鼠标离开的元素
  let relatedTarget = event.relatedTarget;//鼠标移动到的元素
  
  //headerUl li
  function headerUlLi(){
    let Prtarget = target.closest(".headerUl li");
    if(!Prtarget)return;
    if( Prtarget.contains(relatedTarget))return;//如果离开的元素包含out到的元素证明out到了同一父级。
    Prtarget.style.backgroundColor = "";


  }
  headerUlLi();

})
//-----------------------------------------------------



let dimian = document.querySelector("#dimian");
let guangy = document.querySelector("#guangy");
let musicPage = document.querySelector("#musicPage");
let shoubing = document.querySelector("#shoubing");
let musicMessage = "王力宏: 爱的就是你 专辑: 大马 Music Man 纪念精选辑";
let musicMessageContainer = document.querySelector(".musicMessage");




  function rotate(elem,deg){  
    elem.style.transform = `rotate(${deg}deg)`;
  }
  
  let CWdeg = 0;//顺时针
  setTimeout(function set(){//磁盘  rotate  deg设置多少他都是按小数转，转到设置的deg
    rotate(dimian,CWdeg);
    CWdeg += 0.5;
   
    if(CWdeg >= 360){CWdeg = 0;}
    setTimeout(set,30);
  },30)

  setTimeout(function set(){//音乐封面
    rotate(musicPage,CWdeg);
    CWdeg += 0.4;
    if(CWdeg >= 360)CWdeg = 0;
    setTimeout(set,30);
  },30)

  
  
 let CCWdeg = 0;//逆时针

  setTimeout(function set(){//磁盘光影
    rotate(guangy,CCWdeg);
    CCWdeg = CCWdeg - 0.4;
    if(CCWdeg <= -360)CCWdeg = 0;
    setTimeout(set,45);
  },100)


  let deg = 8;
  setTimeout(function set(){//磁盘手柄
    if(deg == 8 || deg == 7){
      deg = 9;
    }else {
      deg = 7;
    }
    rotate(shoubing,deg);
    setTimeout(set,1500);
  },0)


  musicMessageContainer.innerHTML = `${musicMessage}`;

  setTimeout(function set(){
    if(musicMessageContainer.scrollTop + musicMessageContainer.clientHeight >= musicMessageContainer.scrollHeight){
      setTimeout(()=>{//让滚动条滚动到最后延迟1秒回到开头，在运行set迭代。
        musicMessageContainer.scrollTop = 0;   
        setTimeout(set,500);
      },1000);
      return;
    }
  musicMessageContainer.scrollTop += 1; 
  setTimeout(set,40);
  },40)









//歌词滚动变化------------------------------------------------
  let lyricsArea = document.querySelectorAll(".lyricsArea");
  let lyricsArea1 = lyricsArea[0];
  let lyricsArea2 = lyricsArea[1];
  let music = {"爱的就是你":
  `无论我走到哪里都不能停止想你,亲爱的在我心底没人比你更美丽轻轻唱Do re mi,为你谱下一段旋律,让星星解开童话故事中的谜底,
  Oh my god,我已经爱上她,
  真实的表达,像喝了奇怪药水中了魔法,
  街上溜溜达达还是不想回家, 一个人看着电影嘴里嚼着爆米花,
  噢每分每秒都想和你通电话,  飞到巴黎铁塔下自在喝奶咖`}


  let arr = sliceSection(music,"爱的就是你");
  let i = 0;
  let length = 0; 
  let letterSpacing;
  let fontSize;
  let TotalWidth;
  let speed;
  addlyrics(lyricsArea1);//一开始立马运行一次




  setTimeout(function set(){//测量并重启动画
    if( parseInt(getComputedStyle(lyricsArea1).width) == TotalWidth ){
      i++;
      lyricsArea1.style.animation = "";//重置动画，重新开始动画
      if(i == arr.length)i=0;
      addlyrics(lyricsArea1);
    }
    setTimeout(set,1000);
  })



  function addlyrics(lyricsArea){//实现歌词翻滚的动画函数-------------------------------------
    //每次的计算-----------
    letterSpacing = getComputedStyle(lyricsArea).letterSpacing;//已经乘2的字间距宽度
    fontSize = getComputedStyle(lyricsArea).fontSize;
    let alphabet = 0;
    let spacelength = 0;
   for(let char of arr[i]){
    let code = char.codePointAt(0);

    if(code == 32){//字符是空格的话
  
      spacelength++;//空格的数量
    }

    if(code >= 65 && code <= 220){
      alphabet++;//字母的数量
      
    }
   }

   //操作---------------

    length = arr[i].length;
    length = length - (alphabet * 0.4) - (spacelength * 0.8);//正常的个数 - 字母的一半 - 空格的0.8（空格的宽度是正常的0.2倍应该）。

    TotalWidth = length* parseInt(fontSize) + (parseInt(letterSpacing)* arr[i].length-1);//一段歌词的长度,

    speed = arr[i].length/2; 
    lyricsArea.style.width = `${TotalWidth}px`;//实时添加宽度
    lyricsArea.style.animation = `typing ${speed}s steps(${arr[i].length * 10}),blink 1s ${speed}`;//添加动画
    lyricsArea.innerHTML = arr[i];

    

  }

function sliceSection(musicObj,name){//根据逗号提取歌词，并去除前后空格，返回歌词数组
  let arr = [];
  for(let i of musicObj[name].split(",")){
    arr.push(i.trim());
  }
  return arr;
}

let lyricsAreaContainer = document.querySelector(".lyricsAreaContainer");

document.addEventListener("click",function(event){//增加歌词行数
  let target = event.target;
  
  //musicButton---------------------------------------------------
  if(target.matches(`.lyricsAreaContainer .musicButton .toggleLine`)){
    
    let lyricsAreaArr = document.querySelectorAll(".lyricsArea");
    let lastLyricsArea = lyricsAreaArr[lyricsAreaArr.length - 1];//每次都获取最后一个
    
    if(lyricsAreaArr.length < 2 ){
      lyricsAreaContainer.style.height = "4em";
      lastLyricsArea.insertAdjacentHTML("afterend",`<div class = "lyricsArea"></div>`);
      
    }else {
      lastLyricsArea.remove();
      lyricsAreaContainer.style.height = "";
    }
    



  }

  //----------------------------------------------------
})
















    



