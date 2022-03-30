class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        多人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);

        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('ac-game-menu-field-item-single-mode')
        this.$multi_mode = this.$menu.find('ac-game-menu-field-item-multi-mode')
        this.$settings = this.$menu.find('ac-game-menu-field-item-settings')



        this.start();

    }

    start() {
        this.add_listening_evens();
    }

    add_listening_evens() {
        let outter = this;  //let 创建变量
        this.$single_mode.click(function () {
            console.log("single");
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

class AcGame {
    constructor(id) {//构造函数
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        console.log("create acgame")
    }
}