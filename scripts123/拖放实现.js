"use strict"


button.onmousedown = function(event){
    button.style.position = "absolute";
    button.style.zIndex = 1000;
    let shiftX = event.clientX - button.getBoundingClientRect().left; //写在append前面，不然top值不对。
    let shiftY = event.clientY - button.getBoundingClientRect().top;
    document.body.append(button);
    moveAt(event.pageX,event.pageY);//down未移动时不会有move，所以先处理一次，不然添加到body会移动位置。

    function moveAt(pageX,pageY){
        button.style.left = pageX - shiftX + "px";  
        button.style.top = pageY - shiftY + "px";
    }

  
    let currentDroppable = null;

    function onMouseMove(event){       //因为闭包，可以记住创建的作用域，所以可以访问target。
        moveAt(event.pageX,event.pageY);
        button.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX,event.clientY);
        button.hidden = false;

        if(elemBelow == null)return;//如果鼠标移动到窗口外，
        let droppableBelow = elemBelow.closest(".droppable");

        if(currentDroppable != droppableBelow){ //当curr为null，drop也为null时，不处理程序，因为没有遇到带有标记的元素。
                                                //当curr为null，drop是带有标记的元素，进入处理。
            if(currentDroppable) { //当curr为标记元素，而drop为null时，也就是为不是标记的元素时，进入这个if，处理飞出标记元素的程序。
                                    //当curr为null时，drop为标记时，不进入。
                leaveDroppable(currentDroppable);
            }
            currentDroppable = droppableBelow;// curr = drop,这个决定了下面的if的处理。如果在drop为null时，curr也为null，不执行下面的，因为drop为null，那
                                              // curr之前一定为标记元素，执行了上面的飞出程序，不会执行下面的飞入程序了。
                                              //如果drop为标记元素，那么curr一定为null，因为之前的程序，已经把curr变为null了，
                                              //此时curr被重赋值为标记元素，恰合它的名字，当前元素，执行飞入程序。
            if(currentDroppable) {    //
                enterDroppable(currentDroppable);
            }

    }





   document.addEventListener("mousemove",onMouseMove);

    button.onmouseup = function(){//可能会移动到窗口，而光标在窗口放开，不会生成button的mouseup事件。
        document.removeEventListener("mousemove",onMouseMove);
        button.onmouseUp = null;
    }




}


button.ondragstart = function(){
    return false;
}

}

