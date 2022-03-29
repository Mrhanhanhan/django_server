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

