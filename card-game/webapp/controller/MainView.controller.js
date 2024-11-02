sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.MainView", {
        onInit: function() {
            window.menuMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound1.mp3"));
            window.menuMusic.loop = true;
            window.menuMusic.volume = 0.5;
            window.menuMusic.play(); 

            window.gameMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound2.mp3"));
            window.gameMusic.loop = true;
            window.gameMusic.volume = 0.5;
            
            var username = localStorage.getItem("username");
            if (username) {
                this.byId("usernameInput").setValue(username);
            }
        },

        onStartGame: function() {
            var username = this.byId("usernameInput").getValue();
            var difficulty = this.byId("difficultySelect").getSelectedKey();

            window.menuMusic.pause();
            window.gameMusic.play();
            
            if (username) {
                localStorage.setItem("username", username);
                localStorage.setItem("difficulty", difficulty);
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("game", {}, true);
            } else {
                sap.m.MessageToast.show("Lütfen kullanıcı adınızı girin.");
            }
        },

        onShowScores: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("scores");
        }        
    });
});
