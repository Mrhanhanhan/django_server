class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
           
            </div>
        `);
        this.root.$ac_game.append(this.$menu);


        this.start();

    }

    start() {
        this.hide();
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}

