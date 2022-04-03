class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);

        this.root.$ac_game.append(this.$menu);
        //把类当id用
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode')
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode')
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings')
        //类前加. id前加#?


        this.start();

    }

    start() {
        this.add_listening_evens();
    }

    add_listening_evens() {//如果listening_evens 加入this参数应该可以不用创建outer
        let outer = this;  //let 创建变量

        console.log("DEBUG");

        this.$single_mode.click(function () {
            console.log("single");
            outer.$menu.hide();
            outer.root.playground.show();//playground前不能加$会报错
        });

        this.$multi_mode.click(function () {
            console.log("multi");
        });

        this.$settings.click(function () {
            console.log("setting");
        });

    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}

let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;//记录是否执行过start函数

        this.timedelta = 0;//当前帧距离上一帧的时间间隔
    }


    start() { //只在最开始执行

    }

    update() { //每一帧都会执行

    }

    on_destroy() {//删除前执行一次

    }

    destroy() {//删掉该物体

        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }



}


let last_timestamp;

let AC_GAME_ANIMATION = function (timestamp) {//无限递归

    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);//开始时递归



class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');//第一个canvas块？
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {//自写渲染函数，将canvas填充背景
        this.ctx.fillStyle = "rgba(0,0,0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}


class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;


        this.friction = 0.9;
        this.eps = 1;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        this.x += this.vx * this.speed * this.timedelta / 1000;
        this.y += this.vy * this.speed * this.timedelta / 1000;

        this.speed *= this.friction;

        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
    }

}


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
                //player.x player.y 是相对坐标 clientX, clientY是屏幕坐标
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    //判断玩家是否还存活，存活可以发射火球
                    for (let i = 0; i < outer.playground.players.length; i++) {
                        if (outer.playground.players[i] === outer) {
                            outer.shoot_fireball(e.clientX, e.clientY);
                        }
                    }


                    //outer.shoot_fireball(e.clientX, e.clientY);

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
        console.log(this.playground.players.length);
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

class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;//忘了声明，无法完成画布
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        //擦边不算
        if (distance < this.radius + player.radius) {
            return true;
        } else {
            return false;
        }

    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="ac-game-playground">

            </div>
        `);

        //this.hide();

        this.root.$ac_game.append(this.$playground);

        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.game_map = new GameMap(this);

        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        //创建敌人
        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_radom_color(), this.height * 0.15, false));
        }

        this.start();
    }

    get_radom_color() {
        let colors = ["blue", "red", "pink", "green", "grey"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {
    }

    hide() {
        this.$playground.hide();
    }

    show() {
        this.$playground.show();
    }
}


export class AcGame {
    constructor(id) {//构造函数
        this.id = id;
        this.$ac_game = $('#' + id);
        //this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);


        this.start();
    }

    start() {

    }
}

