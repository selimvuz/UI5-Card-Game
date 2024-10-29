sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.MainView", {
        onInit: function() {
            // LocalStorage'da kullanıcı adı kontrolü
            var username = localStorage.getItem("username");
            if (username) {
                this.byId("usernameInput").setValue(username);
            }
        },

        onStartGame: function() {
            // Kullanıcı adını ve zorluk seviyesini al
            var username = this.byId("usernameInput").getValue();
            var difficulty = this.byId("difficultySelect").getSelectedKey();

            if (username) {
                // Kullanıcı adını localStorage'a kaydet
                localStorage.setItem("username", username);

                // Zorluk seviyesine göre oyuna başla
                // Oyun ayarlarını başlatan bir fonksiyonu çağırabilirsin
                this.startGame(difficulty);
            } else {
                sap.m.MessageToast.show("Lütfen kullanıcı adınızı girin.");
            }
        },

        startGame: function(difficulty) {
            // Zorluk seviyesine göre gerekli ayarlamaları yap ve oyunu başlat
            // Örneğin kartları yerleştirme, timer başlatma vb. işlemler burada olabilir
        }
    });
});
