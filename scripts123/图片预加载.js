"use strict"

function isVisible(elem) {

    let coords = elem.getBoundingClientRect();

    let windowHeight = document.documentElement.clientHeight;

    // top elem edge is visible OR bottom elem edge is visible
    let topVisible = coords.top > 0 && coords.top < windowHeight;
    let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

    return topVisible || bottomVisible;
  }

  /**
  A variant of the test that considers the element visible if it's no more than
  one page after/behind the current screen.

  function isVisible(elem) {

    let coords = elem.getBoundingClientRect();

    let windowHeight = document.documentElement.clientHeight;

    let extendedTop = -windowHeight;
    let extendedBottom = 2 * windowHeight;

    // top visible || bottom visible
    let topVisible = coords.top > extendedTop && coords.top < extendedBottom;
    let bottomVisible = coords.bottom < extendedBottom && coords.bottom > extendedTop;

    return topVisible || bottomVisible;
  }
  */
let imgs = document.querySelectorAll('img');
let record = new Set(imgs);
  function showVisible() {
    
    
    for (let i = 0 ;i < imgs.length; i++) {
      let realSrc = imgs[i].dataset.src;
      let realSrc1;
      let realSrc2;
      if(i > 0){
         realSrc1 = imgs[i-1].dataset.src;
      }
      if(i != imgs.length -1){
        
         realSrc2 = imgs[i+1].dataset.src;
         
      }
      

      if(!record.has(imgs[i])) continue;
      
      if (isVisible(imgs[i])) { //进来发现可以看到它，判断是否曾经上下加载过
      //没有加载执行当前图片，删除记录，下一次不会进来。启用上下图片加载，其他循环都因为没有看到而不能进去。
      //第二张图片，可以看到，但datasrc是空的，删除记录，启用上下图片，启用过的不允许。
      //
        if(realSrc){
           realSrc += '?nocache=' + Math.random();
           imgs[i].src = realSrc;
           imgs[i].dataset.src = '';
          
        }
        record.delete(imgs[i]);
        console.log("1");

           if ( realSrc1) {
               realSrc1 += '?nocache=' + Math.random();
               imgs[i-1].src = realSrc1;
               imgs[i-1].dataset.src = '';
              
          }
         
          if ( realSrc2 ) {
            console.log("ss");
              realSrc2 += '?nocache=' + Math.random();
              imgs[i+1].src = realSrc2;
              imgs[i+1].dataset.src = '';
          }


      }
    
     





    }

  }

  window.addEventListener('scroll', showVisible);
  showVisible();