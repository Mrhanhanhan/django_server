class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
            <p>你好</p>
            </div>
        `);
        this.root.$ac_game.append(this.$menu);
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