sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.MainView", {
        onInit: function() {
            this.menuMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound1.mp3"));
            this.gameMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound2.mp3"));
        
            this.menuMusic.loop = true;
            this.menuMusic.volume = 0.4;
            this.menuMusic.play(); 

            this.gameMusic.loop = true;
            this.gameMusic.volume = 0.5;
            
            var username = localStorage.getItem("username");
            if (username) {
                this.byId("usernameInput").setValue(username);
            }
        },

        onStartGame: function() {
            var username = this.byId("usernameInput").getValue();
            var difficulty = this.byId("difficultySelect").getSelectedKey();

            this.menuMusic.pause();
            this.gameMusic.play();
            
            if (username) {
                localStorage.setItem("username", username);
                localStorage.setItem("difficulty", difficulty);
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("game", {}, true);
            } else {
                sap.m.MessageToast.show("Lütfen kullanıcı adınızı girin.");
            }
        }
    });
});
