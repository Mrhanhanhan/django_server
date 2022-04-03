class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {//初始坐标x， y， 半径， 颜色， 移动速度（高度百分比）
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;//误差在0.1内算0

        this.vx = 0;//x方向的速度
        this.vy = 0;
        this.move_length = 0; //移动距离

        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;//摩檫力(后退速度减慢)

        this.spent_time = 0;

        this.cur_skill = null;

    }

    start() {
        if (this.is_me) {
            this.add_listening_evens();
        } else {
            //ai随机移动参数
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }

    }



    add_listening_evens() {
        //禁用右键菜单
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });

        let outer = this;//第一层不需要outer, 第二层需要outer, this指代本函数
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    //判断玩家是否还存活，存活可以发射火球
                    for (let i = 0; i < outer.playground.players.length; i++) {
                        if (outer.playground.players[i] === outer) {
                            outer.shoot_fireball(e.clientX, e.clientY);
                        }
                    }

                }

                // outer.cur_skill = "fireball";
                // outer.shoot_fireball(e.screenX, e.screenY);

                outer.cur_skill = null;
            }
        });


        $(window).keydown(function (e) {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        });

    }

    //移动相关函数
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {

        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);

        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

        //console.log("move to", tx, ty);
    }

    //火球相关函数
    shoot_fireball(tx, ty) {

        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        //console.log(tx, ty);

        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    is_attacked(angle, damage) {



        for (let i = 0; i < 20 + Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 5;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }


        this.radius -= damage;

        if (this.radius < 10) {//删除半径低于10的玩家
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;



    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);//false是否顺时针

        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        //console.log(this.playground.players[0]);
        this.spent_time += this.timedelta / 1000;

        if (!this.is_me && this.spent_time > 5 && Math.random() < 1 / 200.0) {//本人也会自动攻击
            let player = this.playground.players[0];
            this.shoot_fireball(player.x, player.y);
        }

        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
            //console.log(this.playground);
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                //console.log(moved, this.move_length, this.speed, this.timedelta);
                this.move_length -= moved;
            }
        }


        this.render();
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }



}

