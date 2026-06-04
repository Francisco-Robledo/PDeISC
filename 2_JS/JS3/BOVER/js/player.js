class Player {
    constructor(id, name, team, startX, startY, controls) {
        this.id = id;
        this.name = name;
        this.team = team;
        
        this.x = startX;
        this.y = startY;
        this.radius = 8; 
        
        this.speed = 2; 
        
        this.dirX = 0;
        this.dirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;
        
        this.score = 0;
        this.controls = controls;

        if (this.team === "boca") {
            this.color1 = "#003b7b";
            this.color2 = "#fecb00";
        } else {
            this.color1 = "#ffffff";
            this.color2 = "#ed1c24";
        }
    }

    setIntent(direction) {
        switch (direction) {
            case 'UP':    this.nextDirX = 0; this.nextDirY = -1; break;
            case 'DOWN':  this.nextDirX = 0; this.nextDirY = 1; break;
            case 'LEFT':  this.nextDirX = -1; this.nextDirY = 0; break;
            case 'RIGHT': this.nextDirX = 1; this.nextDirY = 0; break;
            case 'STOP':  this.nextDirX = 0; this.nextDirY = 0; break;
        }
    }

    update(canvasWidth, canvasHeight, map, tileSize) {
        if (this.x < -tileSize / 2) this.x = canvasWidth + tileSize / 2;
        if (this.x > canvasWidth + tileSize / 2) this.x = -tileSize / 2;

        const modX = ((this.x % tileSize) + tileSize) % tileSize;
        const modY = ((this.y % tileSize) + tileSize) % tileSize;
        const isCenteredX = Math.abs(modX - tileSize / 2) < 0.1;
        const isCenteredY = Math.abs(modY - tileSize / 2) < 0.1;

        if (isCenteredX && isCenteredY) {
            this.x = Math.floor(this.x / tileSize) * tileSize + tileSize / 2;
            this.y = Math.floor(this.y / tileSize) * tileSize + tileSize / 2;

            const col = Math.floor(this.x / tileSize);
            const row = Math.floor(this.y / tileSize);

            if (this.nextDirX !== 0 || this.nextDirY !== 0) {
                if (this.canMove(col + this.nextDirX, row + this.nextDirY, map)) {
                    this.dirX = this.nextDirX;
                    this.dirY = this.nextDirY;
                }
            }

            if (!this.canMove(col + this.dirX, row + this.dirY, map)) {
                this.dirX = 0;
                this.dirY = 0;
            }
        } else {
            if (this.nextDirX === -this.dirX && this.nextDirX !== 0) {
                this.dirX = this.nextDirX; this.nextDirX = 0;
            }
            if (this.nextDirY === -this.dirY && this.nextDirY !== 0) {
                this.dirY = this.nextDirY; this.nextDirY = 0;
            }
        }

        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
    }

    canMove(c, r, map) {
        if (c < 0 || c >= map[0].length) return true;
        if (r < 0 || r >= map.length) return false;
        return map[r][c] !== 1; 
    }

    draw(ctx) {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color1; ctx.fill(); ctx.closePath();

        ctx.beginPath();
        if (this.team === "boca") {
            ctx.rect(this.x - this.radius, this.y - 2, this.radius * 2, 4);
        } else {
            ctx.moveTo(this.x - this.radius + 2, this.y - this.radius);
            ctx.lineTo(this.x + this.radius, this.y + this.radius - 2);
            ctx.lineTo(this.x + this.radius - 2, this.y + this.radius);
            ctx.lineTo(this.x - this.radius, this.y - this.radius + 2);
        }
        ctx.fillStyle = this.color2; ctx.fill(); ctx.closePath();

        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke(); ctx.closePath();
    }
}
