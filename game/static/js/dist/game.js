class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
           
            </div>
        `);
        this.root.$ac_game.append(this.$menu);


        start();

    }

    start() {
        hide();
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}

class AcGame {
    constructor(id) {//构造函数
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        console.log("create acgame")
    }
}