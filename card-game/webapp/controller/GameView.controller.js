sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/layout/Grid",
    "sap/m/MessageToast"
], function (Controller, Grid, MessageToast) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.GameView", {
        onInit: function () {
            this.selectedCards = [];
            this.isCardFlipping = false;
            this.currentScore = 0;
            this.matchedPairs = 0;
            this.totalPairs = 0;
            this.startGame();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("game").attachMatched(this.onRouteMatched, this);

            this.getOwnerComponent().getService("ShellUIService").then(function(oShellService) {
                oShellService.setBackNavigation(function() {
                    window.gameMusic.pause();
                    
                    // CrossApplicationNavigation servisini kullanarak Shell-home'a yönlendiriyoruz
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                    
                    oCrossAppNavigator.toExternal({
                        target: {
                            shellHash: "#Shell-home"
                        }
                    });
                oShellService.set
                });
            });                    
        },

        onRouteMatched: function () {
            this.startGame();
        },

        startGame: function () {
            this.currentScore = 0;
            this.updateScoreDisplay();

            window.gameMusic.play();
            
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

            this.totalPairs = pokemonCount;
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
                
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var timeText = oBundle.getText("label.time", [time]);
                var scoreText = oBundle.getText("label.score", [this.currentScore]);
                
                timerDisplay.setText(timeText + " | " + scoreText);
            }.bind(this), 1000);
        },        

        checkForMatch: function () {
            var card1 = this.selectedCards[0];
            var card2 = this.selectedCards[1];

            if (card1.dataset.cardId === card2.dataset.cardId) {
                card1.classList.add("matched");
                card2.classList.add("matched");
                
                this.currentScore += 100;
                this.updateScoreDisplay();

                this.selectedCards = [];
                this.isCardFlipping = false;

                this.matchedPairs++;
                if (this.matchedPairs === this.totalPairs) {
                    this.onGameWon();
                }
            } else {
                setTimeout(function () {
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                    this.selectedCards = [];
                    this.isCardFlipping = false;
                }.bind(this), 500);
            }
        },

        updateScoreDisplay: function () {
            var timerDisplay = this.byId("timerDisplay");
            timerDisplay.setText("Zaman: " + timerDisplay.getText().split(" ")[1] + " | Puan: " + this.currentScore);
        },

        onCardClick: function (cardElement) {
            if (this.isCardFlipping || cardElement.classList.contains("flipped") || cardElement.classList.contains("matched")) {
                return;
            }
        
            var flipSound = new Audio(window.cardFlip.src);
            flipSound.play();
        
            cardElement.classList.add("flipped");
            this.selectedCards.push(cardElement);
        
            if (this.selectedCards.length === 2) {
                this.isCardFlipping = true;
                this.checkForMatch();
            }
        },        

        onGameWon: function () {
            clearInterval(this.timerInterval);
            winSound.play();
            MessageToast.show("Tebrikler, kazandınız! Puanınız: " + this.currentScore);

            this.saveScore();

            if (window.gameMusic !== undefined) {
                window.gameMusic.pause();
            }

            setTimeout(function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("main", {}, true);
                location.reload();
                window.menuMusic.play();
            }.bind(this), 3000);
        },

        saveScore: function () {
            var username = localStorage.getItem("username");
            var scores = JSON.parse(localStorage.getItem("scores")) || {};
        
            var time = parseInt(this.byId("timerDisplay").getText().split(" ")[1], 10);
            var previousScore = scores[username]?.score || 0;
            var previousTime = scores[username]?.time || Infinity;

            if (this.currentScore > previousScore || (this.currentScore === previousScore && time < previousTime)) {
                scores[username] = {
                    score: this.currentScore,
                    time: time
                };
            }
        
            localStorage.setItem("scores", JSON.stringify(scores));
        },
        
        onNavBack: function () {
            if (window.gameMusic && !window.gameMusic.paused) {
                window.gameMusic.pause();
            }
        
            if (window.menuMusic && window.menuMusic.paused) {
                window.menuMusic.play();
            }
        
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main", {}, false);
        }        
    });
});