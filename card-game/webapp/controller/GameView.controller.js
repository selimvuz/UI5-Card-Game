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
            this.time = 0;
            this.isPaused = false;
            this.startGame();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("game").attachMatched(this.onRouteMatched, this);

            this.getOwnerComponent().getService("ShellUIService").then(function(oShellService) {
                oShellService.setBackNavigation(function() {
                    window.gameMusic.pause();
                    
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

        onPauseGame: function () {
            if (!this.isPaused) {
                clearInterval(this.timerInterval);
                this.disableAllCards();
                this.isPaused = true;
            } else {
                this.startTimer();
                this.enableAllCards();
                this.isPaused = false;
            }
        },

        disableAllCards: function () {
            var gameArea = this.byId("gameArea");
            var cardElements = gameArea.$().find(".pokemon-card");
            cardElements.addClass("disabled");
        },

        enableAllCards: function () {
            var gameArea = this.byId("gameArea");
            var cardElements = gameArea.$().find(".pokemon-card");
            cardElements.removeClass("disabled");
        },

        startGame: function () {
            this.currentScore = 0;
            this.time = 0;
            this.updateScoreDisplay();

            clearTimeout(this.timerInterval);

            if (window.gameMusic !== undefined) {
                window.gameMusic.play();
            }
            
            var difficulty = localStorage.getItem("difficulty");
            var gameArea = this.byId("gameArea");
            gameArea.removeAllItems();

            var timerDisplay = this.byId("timerDisplay");
            var oModel = this.getView().getModel("i18n");
            if (oModel) {
                var oBundle = oModel.getResourceBundle();
                var loadingMessage = oBundle.getText("label.loadingCards");
                timerDisplay.setText(loadingMessage);
            } else {
                console.error("i18n modeli yüklenmedi.");
            }

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
            
            var allPokemonImages = [];
            for (var i = 1; i <= 31; i++) {
                allPokemonImages.push(i);
            }

            var selectedPokemons = [];
            while (selectedPokemons.length < pokemonCount) {
                var randomIndex = Math.floor(Math.random() * allPokemonImages.length);
                var selectedPokemon = allPokemonImages[randomIndex];

                if (!selectedPokemons.includes(selectedPokemon)) {
                    selectedPokemons.push(selectedPokemon);
                }
            }

            var pokemonList = [];
            for (var i = 0; i < selectedPokemons.length; i++) {
                pokemonList.push(selectedPokemons[i]);
                pokemonList.push(selectedPokemons[i]);
            }

            pokemonList = this.shuffleArray(pokemonList);

            var grid = new Grid({
                defaultSpan: gridSettings.defaultSpan
            });

            gameArea.addItem(grid);

            pokemonList.forEach(function (pokemon, index) {
                var cardHTML = new sap.ui.core.HTML({
                    content: `
                        <div class="pokemon-card" id="card-${index}" data-card-id="${pokemon}" onclick="sap.ui.getCore().byId('${this.getView().getId()}').getController().onCardClick(this)">
                            <div class="pokemon-card-inner">
                                <div class="pokemon-card-front">
                                    <img src="../assets/pokemon-back.png" width="100px" height="150px" />
                                </div>
                                <div class="pokemon-card-back">
                                    <img src="../assets/pokemons/pokemon${pokemon}.jpg" width="100px" height="150px" />
                                </div>
                            </div>
                        </div>
                    `,
                    afterRendering: function() {
                        setTimeout(function() {
                            var cardElement = document.getElementById(`card-${index}`);
                            if (cardElement) {
                                cardElement.classList.add("deal");

                                setTimeout(function() {
                                    cardElement.classList.remove("deal");
                                    cardElement.classList.add("nodeal");
                                }, 500);

                                if (window.cardFlip !== undefined) {
                                    window.cardFlip.currentTime = 0;
                                    window.cardFlip.play();
                                }
                            }
                        }, index * 400);
                    }
                });

                grid.addContent(cardHTML);

            }.bind(this));

            var delay;
            switch (difficulty) {
                case "easy":
                    delay = 3200;
                    break;
                case "medium":
                    delay = 4800;
                    break;
                case "hard":
                    delay = 6400;
                    break;
            }

            setTimeout(() => {
                this.startTimer();
            }, delay);
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
            // this.time = 0;
            var showOnlyOnce = true;

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        
            this.timerInterval = setInterval(function () {
                this.time++;
                
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var timeText = oBundle.getText("label.time", [this.time]);
                var scoreText = oBundle.getText("label.score", [this.currentScore]);
                var sStartMessage = oBundle.getText("startMessage");

                if (showOnlyOnce) {
                    MessageToast.show(sStartMessage);
                    showOnlyOnce = false;
                }
                
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
            var i18nModel = this.getView().getModel("i18n");
            var oBundle = i18nModel.getResourceBundle();

            var sMessage = oBundle.getText("winMessage", [this.currentScore]);

            MessageToast.show(sMessage);

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

            if (window.flipSound) {
                do {
                    window.flipSound.pause();
                } while ( window.flipSound.paused )
            }
        
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main", {}, false);

            this.isPaused = false;
        }        
    });
});