sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("cardgame.cardgame.controller.ScoresView", {
        onInit: function () {
            this.displayScores();
        },

        displayScores: function () {
            var scores = JSON.parse(localStorage.getItem("scores")) || {};
            
            var sortedScores = Object.keys(scores).map(function (key) {
                return { 
                    username: key, 
                    score: scores[key].score, 
                    time: scores[key].time
                };
            }).sort(function (a, b) {
                return b.score - a.score;
            });
        
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ scores: sortedScores });
            
            this.getView().setModel(oModel);
        },

        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main", {}, true);
        }
    });
});