class AcGame {
    constructor(id) {//构造函数
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        console.log("create acgame")
    }
}