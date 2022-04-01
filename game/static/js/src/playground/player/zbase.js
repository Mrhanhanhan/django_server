class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {//初始坐标x， y， 半径， 颜色， 移动速度（高度百分比）
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.is_me = is_me;
        this.eps = 0.1;//误差在0.1内算0

        this.vx = 0;//x方向的速度
        this.vy = 0;

    }

    start() {
        if (this.is_me) {
            this.add_listening_evens();
        }

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;
        this.render();
    }

    add_listening_evens() {
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });

        let outer = this;
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            }
        })

    }

    move_to(tx, ty) {
        console.log("move to", tx, ty);
    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);//false是否顺时针

        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}

