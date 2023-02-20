"use strict"

document.addEventListener("mousedown",function(event){
    let target = event.target.closest(".dragElem");
    if(!target)return;
    let shiftX = event.clientX - target.getBoundingClientRect().left; 
    let shiftY = event.clientY - target.getBoundingClientRect().top;  //写在append前面和复制前面，不然top值不对，复制似乎会改变坐标。
    
    if(!target.isCopied){//不是原始元素不能复制。
        target = target.cloneNode(true);//复制后获取偏移不准确，在复制前面获取偏移值。
    }
       
    target.isCopied = true;//只让复制的元素有这个属性，只让原始的元素可以不断复制。

   
    target.style.position = "absolute";
    target.style.zIndex = 1000;
  
    document.body.append(target);
    moveAt(event);//down未移动时不会有move，所以先处理一次，不然添加到body会移动位置。

    function moveAt(event){
        target.style.left = event.pageX - shiftX + "px";
        target.style.top = event.pageY - shiftY + "px"; 
        
    }


    document.addEventListener("mousemove",onMoveMove)


    function enterDroppable(elem){
        elem.style.borderColor = "yellow";
        elem.append(target);
    }

    function leaveDroppable(elem){
        elem.style.borderColor = "";
        target.onmouseup = null;
        document.removeEventListener("mousemove",onMoveMove);
        target.remove();
      
       
    }


    let currentDropElem = null;
    function onMoveMove(event){//因为闭包，可以记住创建的作用域，所以可以访问target。
       
        target.hidden = true;
        let dropElem = document.elementFromPoint(event.clientX,event.clientY);
        target.hidden = false;
        moveAt(event);
        if(dropElem == null)return;
        let droppableBelow = dropElem.closest(".shoppingList");
        if(currentDropElem != droppableBelow){
            if(currentDropElem){
                leaveDroppable(currentDropElem);
            }
            currentDropElem = droppableBelow;
            if(currentDropElem){
                enterDroppable(currentDropElem);
            }
        }
        


    }


    target.onmouseup = function onMouseUp(event){
        document.removeEventListener("mousemove",onMoveMove);
        target.onmouseup = null;
    }





})


document.ondragstart = function(){
    return false;
}
