class HoverIntent {//接口说明：elem:相对移动的元素，sensitivity:灵敏度,速度小于灵敏度，元素出现。 interval：速度测算时间，在元素上待的时间小于它，元素也不出现。
    constructor({sensitivity = 0.1, interval = 100,
                 elem, over, out}){
                    this.sensitivity = sensitivity;
                    this.interval = interval;
                    this.elem = elem;
                    this.over = over;
                    this.out = out;
                    this.onMouseMove = this.onMouseMove.bind(this);
                    this.onMouseOver = this.onMouseOver.bind(this);
                    this.onMouseOut = this.onMouseOut.bind(this);
                    this.trackSpeed = this.trackSpeed.bind(this);
                    
                    elem.addEventListener("mouseover",this.onMouseOver);
                    elem.addEventListener("mouseout",this.onMouseOut);
                 }

    onMouseOver(event) {
        if(this.isOverElement) {//isOverElement为true时不执行Over。
            return;
        }
        this.isOverElement = true;//执行了一次Over之后剩下的子元素将不会执行mouseover处理。
        //更好的避免子元素触发的方法。
        
        this.prevX = event.pageX;
        this.prevY = event.pageY;
        this.prevTime = Date.now();
                    
        this.elem.addEventListener("mousemove",this.onMouseMove);
        //在处理了一次over事件后，记住over的坐标，开始处理move事件。
        this.checkSpeedInterval = setInterval(this.trackSpeed,this.interval);
        //如果你移动的非常快，同时直接移动出去了，连100ms都没有，out直接取消了setInterval，那你就不会测算速度，直接不执行out。
    }

    onMouseMove(event) {
        this.lastX = event.pageX;
        this.lastY = event.pageY;
        this.lastTime = Date.now();
    }

    trackSpeed() {
        let speed;
        if(!this.lastTime || this.lastTime == this.prevTime){ // 因为任何数除以0都是无穷大的，所以要用条件限制){
            //这个lastTime如果没有触发，也就是没有执行move的话，lasttime就为undefined。
            //或者光标over进来后，不移动，只触发了一次move，记录了时间，over和move是同时的，时间一样，
            //也没有新的move来重置时间了，100ms到后，比较开始，那prevtime和lastTime就相等了，speed就设置为0，因为不移动，速度就是0；
            //执行over处理，hidden置为true。
            speed = 0;
        }else {
            speed = Math.sqrt(
                Math.pow(this.prevX - this.lastX,2)
                +
                Math.pow(this.prevY - this.lastY,2)
                ) / (this.lastTime - this.prevTime);
        }

        if(speed < this.sensitivity) {
            clearInterval(this.checkSpeedInterval);//如果速度慢了，就停止计算，执行over。
            this.isHover = true;//意思是只有执行了over，才会执行Out哪里的out函数，防止
            //函数二次执行。可以不设置这个，但是为了完整，设置也行。
            this.over.call(this.elem);
        }else {
            this.prevX = this.lastX;
            this.prevY = this.lastY;
            this.prevTime = this.lastTime;
        //对这个else的解释： 
        //因为你有可能是在元素里移动速度很快，但不离开元素，这时候over
        //就不会执行，setInterval也没有停止，如果依然记得以前的prev坐标的
        //话，速度就会依然很快，或者其他，所以把以前的坐标重置为100ms之前的
        //最后的坐标，然后下一个100ms就拿着这个坐标，去跟下一个last坐标相减
        //来计算距离，如果速度小了，就执行over了，否则就一直计算，除非你是机器人
        //不然这个应该是可以了。
        }
    }

         
    onMouseOut(event){
        if(!event.relatedTarget || !this.elem.contains(event.relatedTarget)){
        //只有出去到elem外面或者related是null窗口，才能移除move处理，清除
        //setInertval，因为有可能速度快而没有清除set，所以出去了就清除set。
        //然后执行out。
            this.isOverElement = false;
            //只有在真正离开元素之后，才打开执行mouseover处理的大门。
            this.elem.removeEventListener("mousemove",this.onMouseMove);
            clearInterval(this.checkSpeedInterval);

            if(this.isHover){//如果isHover正确，也就是真的执行了小over函数，才会执行out，让div消失。
                this.out.call(this.elem,event);
                this.isHover = false;//执行完，置为false
            }
            
        }
    }

    
}







new HoverIntent({
    elem,
    over() {
      tooltip.style.left = elem.getBoundingClientRect().left + 5 + 'px';
      tooltip.style.top = elem.getBoundingClientRect().bottom + 5 + 'px';
      tooltip.hidden = false;
    },
    out() {
      tooltip.hidden = true;
    }
  });