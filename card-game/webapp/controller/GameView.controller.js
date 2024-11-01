sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/layout/Grid"
], function (Controller, Grid) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.GameView", {
        onInit: function () {
            this.selectedCards = [];
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
                    break;
                case "medium":
                    pokemonCount = 6;
                    gridSettings = {defaultSpan: "L4 M6 S12"};
                    break;
                case "hard":
                    pokemonCount = 8;
                    gridSettings = {defaultSpan: "L3 M6 S12"};
                    break;
            }

            var pokemonList = [];
            for (var i = 0; i < pokemonCount; i++) {
                pokemonList.push(i + 1);
                pokemonList.push(i + 1);
            }

            pokemonList = this.shuffleArray(pokemonList);

            var grid = new Grid({
                defaultSpan: gridSettings.defaultSpan
            });

            for (var j = 0; j < pokemonList.length; j++) {
                var cardHTML = new sap.ui.core.HTML({
                    content: `
                        <div class="pokemon-card" id="card-${j}" data-card-id="${pokemonList[j]}" onclick="sap.ui.getCore().byId('${this.getView().getId()}').getController().onCardClick(this)">
                            <div class="pokemon-card-inner">
                                <div class="pokemon-card-front">
                                    <img src="../assets/pokemon-back.png" width="100px" height="150px" />
                                </div>
                                <div class="pokemon-card-back">
                                    <img src="../assets/pokemon${pokemonList[j]}.jpg" width="100px" height="150px" />
                                </div>
                            </div>
                        </div>
                    `
                });

                grid.addContent(cardHTML);
            }

            gameArea.addItem(grid);

            this.startTimer();
        },

        shuffleArray: function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        startTimer: function () {
            var timerDisplay = this.byId("timerDisplay");
            var time = 0;

            this.timerInterval = setInterval(function () {
                time++;
                timerDisplay.setText("Zaman: " + time + " saniye");
            }, 1000);
        },

        checkForMatch: function () {
            var card1 = this.selectedCards[0];
            var card2 = this.selectedCards[1];
        
            if (card1.dataset.cardId === card2.dataset.cardId) {
                this.selectedCards = [];
            } else {
                setTimeout(function () {
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                    this.selectedCards = [];
                }.bind(this), 1000);
            }
        },

        onCardClick: function (cardElement) {
            if (!cardElement.classList.contains("flipped")) {
                cardElement.classList.add("flipped");
                this.selectedCards.push(cardElement);

                if (this.selectedCards.length === 2) {
                    this.checkForMatch();
                }
            }
        }        
    });
});
