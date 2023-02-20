"use strict"



let isDragging = false;

document.addEventListener("mousedown",function(event){
    let dragElement = event.target.closest(".draggable");
    if(!dragElement)return;
    event.preventDefault();//禁止掉mousedown的默认行为

    dragElement.ondragstart = function(){ //禁止掉dragstart的默认行为
        return false;
    }


    let coords,shiftX,shiftY;//让所有函数都可以调用。
    startDrag(dragElement,event.clientX,event.clientY);//down之后先执行一次startDrag。

    function startDrag(element,clientX,clientY){
        if(isDragging){
            return;
        }//防止没有执行up就二次生成了move，up事件处理,每次执行down，内部创建的函数不同，新的作用域。
        isDragging = true;
      
        
        document.addEventListener("mousemove",onMouseMove);//开启move事件处理程序
        element.addEventListener("mouseup",onMouseUp);//开启up事件处理程序。
        shiftX = clientX - element.getBoundingClientRect().left;//为了让图片每次都跟第一次down的与鼠标的位置，计算它与鼠标的距离，再减去。
        shiftY = clientY - element.getBoundingClientRect().top;
        element.style.position = "fixed";//设置为0，现在style.坐标都会变成相对于窗口的坐标。
        moveAt(clientX,clientY);//让初始的坐标运行一次moveAt。  



    }


    function moveAt(clientX,clientY) {
        //如果没有执行move，而鼠标超出了窗口但是一直停留原地的话，就不会滚动了，这可能要添加异步函数。
                                                              
        let newX = clientX - shiftX; //把鼠标的相对窗口坐标- 偏移值，成为图片的坐标。 
        let newY = clientY - shiftY;

        let newBottom = newY + dragElement.offsetHeight;//每次移动，图片的窗口bottom。
        if(newBottom > document.documentElement.clientHeight){
            //如果图片的窗口bottom > 窗口的高度
            let docBottom = document.documentElement.getBoundingClientRect().bottom;
            //docBottom = 文档底部相对于窗口顶部的距离。也就是等于文档高度scrollHeight减去 - 文档scrollTop。
            let scrollY = Math.min(docBottom - newBottom,10);
            //docBottom - newBottom 是docBottom减去图片相对于窗口的距离剩下的文档距离。
            //scrollY = 剩下的文档距离，和10 相比，谁最小，取谁。
            if(scrollY < 0)scrollY = 0; 
            //如果剩下的文档距离小于0，也就是说newBottom,move的clientY滑出了窗口外了，
            //而docBottom最小也是窗口的高度，所以如果newBottom大于docBottom，
            //docBottom - newBottom  就会出现负数，这个负数是图片bottom坐标超出窗口的距离。
            //设置scrollY < 0 时scrollY为0；
            window.scrollBy(0,scrollY);
            //让文档相对于自身滚动scrollY距离。负数就是向上滚动。
            newY = Math.min(newY,document.documentElement.clientHeight - dragElement.offsetHeight);
            //如果newY鼠标移动让图片坐标超出了文档外，就和图片在文档底部的最大坐标来比。
            //超出了，就选择图片的最大的坐标。
            //这只是对图片一直靠在窗口底部的限制罢了。
            
        }

        if(newY < 0){
            let scrollY = Math.min(-newY,10);
            //如果newY小于0，也就是在窗口上面，把它转为正数，跟10比较，看哪个更小。
            window.scrollBy(0,-scrollY);//scrollY转为负数来向上滚动
            newY = Math.max(newY,0); //限制图片坐标一直在窗口最小值。

        }
        
        if(newX < 0) newX = 0;
        if(newX > document.documentElement.clientWidth - dragElement.offsetWidth){
            newX = document.documentElement.clientWidth - dragElement.offsetWidth;
        }


        



        dragElement.style.left = newX + "px";
        dragElement.style.top = newY + "px";
        


    }



    function onMouseMove(event){
        moveAt(event.clientX,event.clientY);
    }

    function onMouseUp(event){
        
        finishDrag();//up时运行finishDrag函数。
    }

    function finishDrag(){
        if(!isDragging)return;
        isDragging = false;
        dragElement.style.position = "absolute";
        dragElement.style.top = parseInt(dragElement.style.top) + globalThis.scrollY + "px"; //window.scrollY/pageYoffset在最新浏览器已经失效。
        //把本来的窗口坐标转成了文档坐标。
        
   

        document.removeEventListener("mousemove",onMouseMove);
        dragElement.removeEventListener("mouseup",onMouseUp);
    }
    

})


