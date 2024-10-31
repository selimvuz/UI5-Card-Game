sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.MainView", {
        onInit: function() {
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

                this.startGame(difficulty);
            } else {
                sap.m.MessageToast.show("Lütfen kullanıcı adınızı girin.");
            }
        },

        startGame: function(difficulty) {

        }
    });
});
