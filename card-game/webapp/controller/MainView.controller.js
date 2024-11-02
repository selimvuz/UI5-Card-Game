sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.MainView", {
        onInit: function() {
            this.getOwnerComponent().getService("ShellUIService").then(function(oShellService) {
                oShellService.setBackNavigation(function() {
                    window.menuMusic.pause();
                    
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                    
                    oCrossAppNavigator.toExternal({
                        target: {
                            shellHash: "#Shell-home"
                        }
                    });
                });
            });                

            window.menuMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound1.mp3"));
            window.menuMusic.loop = true;
            window.menuMusic.volume = 0.2;
            
            if (window.menuMusic && window.menuMusic.paused) {
                window.menuMusic.play();
            }            

            window.gameMusic = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/sound2.mp3"));
            window.gameMusic.loop = true;
            window.gameMusic.volume = 0.2;

            window.cardFlip = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/flip_sound.mp3"));
            window.cardFlip.loop = false;
            window.cardFlip.volume = 1;
            
            window.winSound = new Audio(sap.ui.require.toUrl("cardgame/cardgame/assets/sounds/rats_are_winning.mp3"));
            window.winSound.loop = false;
            window.winSound.volume = 1;

            var username = localStorage.getItem("username");
            if (username) {
                this.byId("usernameInput").setValue(username);
            }
        },

        onStartGame: function() {
            var username = this.byId("usernameInput").getValue();
            var difficulty = this.byId("difficultySelect").getSelectedKey();
            
            if (username) {
                localStorage.setItem("username", username);
                localStorage.setItem("difficulty", difficulty);

                if (window.menuMusic && !window.menuMusic.paused) {
                    window.menuMusic.pause();
                }
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("game", {}, true);
            } else {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sMessage = oBundle.getText("message.enterUsername");

                sap.m.MessageToast.show(sMessage);
            }
        },

        onShowScores: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("scores");
        },

        onNavBack: function () {    
            menuMusic.pause();

            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: "#Shell-home"
                }
            });      
        }
    });
});
