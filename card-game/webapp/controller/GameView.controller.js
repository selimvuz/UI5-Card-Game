sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/layout/Grid"
], function (Controller, Grid) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.GameView", {
        onInit: function () {
            this.startGame();
        },

        startGame: function () {
            var difficulty = localStorage.getItem("difficulty");
            var gameArea = this.byId("gameArea");
            gameArea.removeAllItems();

            var pokemonCount;
            var gridSettings;

            switch (difficulty) {
                case "easy":
                    pokemonCount = 4;
                    gridSettings = {defaultSpan: "L3 M6 S12"};
                case "medium":
                    pokemonCount = 6;
                    gridSettings = {defaultSpan: "L4 M6 S12"};
                    break;
                case "hard":
                    pokemonCount = 8;
                    gridSettings = {defaultSpan: "L3 M6 S12"};
                    break;
            }

            var grid = new Grid({
                defaultSpan: gridSettings.defaultSpan
            });

            for (var i = 0; i < pokemonCount; i++) {
                var card = new sap.m.Panel({
                    content: [
                        new sap.m.Image({
                            src: "../assets/pokemon" + (i + 1) + ".jpg",
                            width: "100px",
                            height: "140px"
                        })
                    ],
                    headerText: "Pokemon " + (i + 1),
                    width: "100%",
                    height: "auto",
                    addStyleClass: "pokemon-card"
                });

                grid.addContent(card);
            }

            gameArea.addItem(grid);

            this.startTimer();
        },

        startTimer: function () {
            var timerDisplay = this.byId("timerDisplay");
            var time = 0;

            this.timerInterval = setInterval(function () {
                time++;
                timerDisplay.setText("Zaman: " + time + " saniye");
            }, 1000);
        }
    });
});