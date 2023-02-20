


function preloadImages(sources,callback){//图片数组，回调函数
    let count = 0;//计数器
    
      function loaded(){
        count++;//计数器+1
        if(count == sources.length)callback();//最后加载好的图片运行callback，计数器等于图片数组的长度，所有图片都加载好才允许。
      }

      for(let source of sources){
        let img = document.createElement("img");
        img.src = source;//预加载
        img.onload = img.onerror = loaded;//加载成功失败都+1，都运行。
      }

  }


        
    
     

    
   

    // ---------- The test ----------

    let sources = [
      "https://en.js.cx/images-load/1.jpg",
      "https://en.js.cx/images-load/2.jpg",
      "https://en.js.cx/images-load/3.jpg"
    ];

    // add random characters to prevent browser caching
    for (let i = 0; i < sources.length; i++) {
      sources[i] += '?' + Math.random();
    }

    // for each image,
    // let's create another img with the same src and check that we have its width immediately
    function testLoaded() {
      let widthSum = 0;
      for (let i = 0; i < sources.length; i++) {
        let img = document.createElement('img');
        img.src = sources[i];
        widthSum += img.width;
      }
      alert(widthSum);
    }

    // every image is 100x100, the total width should be 300
    preloadImages(sources, testLoaded);
  </script>
