class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div>单人模式</div>
        `);

        this.start();
    }

    start() {
        ;
    }

    hide() {
        this.$playground.hide();
    }

    show() {
        this.$playground.show();
    }
}