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

    var drawKnockback = function(game){

        var lines = game.knockBackLayer;
        if(!lines.length){
            return;
        }
        var renderer = game.renderer;
        var tileSize = renderer.tileSize;
        var halfTileSize = Math.floor(tileSize * 0.5);
        var ctx = game.renderer.bufferCtx;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            var start = line.start;
            var end = line.end;
            var distance = line.distance;

            start.x = (start.x - renderer.originX) * tileSize + halfTileSize;
            start.y = (start.y - renderer.originY) * tileSize + halfTileSize;

            end.x = (end.x - renderer.originX) * tileSize + halfTileSize;
            end.y = (end.y - renderer.originY) * tileSize + halfTileSize;

            var dx = end.x - start.x;
            var dy = end.y - start.y;

            var rad = Math.atan2(dy, dx);

            ctx.strokeStyle = 'green';

            // ctx.beginPath();
            // ctx.moveTo(start.x, start.y);
            // ctx.lineTo(end.x, end.y);
            // ctx.stroke();

            ctx.save();
            ctx.textAlign = 'left';
            ctx.translate(start.x, start.y);
            ctx.rotate(rad);

            var dashes = '-';
            if(distance > 4){
                dashes = (new Array( distance - 3 ).join('-'));
            }

            var str = ' ' + dashes + ')}';

            ctx.fillStyle = 'rgba(255, 255, 200, 0.45)';
            ctx.fillText(
                str,
                0,
                0
            );
            ctx.restore();
        }

        // game.knockBackLayer = [];
    };

    var draw = RL.Renderer.prototype.draw;
    RL.Renderer.prototype.draw = function(){
        draw.call(this);
        drawKnockback(this.game);

    };


}(this));
