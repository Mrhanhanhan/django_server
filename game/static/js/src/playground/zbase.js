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


