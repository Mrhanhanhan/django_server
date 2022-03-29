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

