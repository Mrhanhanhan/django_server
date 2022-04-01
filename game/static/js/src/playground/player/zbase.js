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

    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);//false是否顺时针

        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}

