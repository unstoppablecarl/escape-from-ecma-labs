(function(root) {
    'use strict';

    var drawTileToCanvas = RL.Renderer.prototype.drawTileToCanvas;
    RL.Renderer.prototype.drawTileToCanvas = function(x, y, tileData, ctx){
        drawTileToCanvas.call(this, x, y, tileData, ctx);

        if(!tileData){
            return;
        }

        if(this.miniMap){
            if(tileData.color && tileData.char){
                tileData.bgColor = tileData.color;
                tileData.char = false;
            }
            this.miniMap.bufferCtx.globalAlpha = this.bufferCtx.globalAlpha;
            this.miniMap.drawTileToCanvas(x, y, tileData);
        }
    };

    var drawBufferToCanvas = RL.Renderer.prototype.drawBufferToCanvas;
    RL.Renderer.prototype.drawBufferToCanvas = function(){
        drawBufferToCanvas.call(this);
        if(this.miniMap){
            this.miniMap.drawBufferToCanvas();
        }
    };

}(this));
