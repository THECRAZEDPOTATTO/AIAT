let a = 1;
let model;
(function() {
    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('webcam');
    
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    navigator.getMedia({
        video: true,
        audio: false
    }, function(stream){
        video.srcObject = stream;
        video.play();
    }, function(error){
    });
    
    video.addEventListener('play',function() {
        draw(this, context, 640, 480);
    }, false);
    
    async function draw(video, context, width, height) {
        context.drawImage(video, 0, 0, width, height);
        if(!model) model = await blazeface.load();
        const returnTensors = false;
        const predictions = await model.estimateFaces(video, returnTensors);
        if (predictions.length > 0) {
            console.log(predictions);
            for (let i = 0; i < predictions.length; i++) {
                const start = predictions[i].topLeft;
                const end = predictions[i].bottomRight;
                var probability = predictions[i].probability;
                const size = [end[0] - start[0], end[1] - start[1]];
              
                context.beginPath();
                context.strokeStyle="black";
                context.lineWidth = "4";
                context.rect(start[0], start[1],size[0], size[1]);
                context.stroke();
                var prob = (probability[0]*100).toPrecision(5).toString();
               if (prob < 99.7) {
      document.getElementById("uniqid").innerHTML = ++a;
  }
                var text = prob+"++";
                context.fillStyle = "white";
                context.font = "14pt sans-serif";
             
           context.fillText(text,start[0]+5,start[1]+20);
            }
        }
        setTimeout(draw,250,video,context,width,height);
    }
})();
