import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

piecesOnBoard = new Mongo.Collection('pieces');
gomokuWinner = new Mongo.Collection('winner');

Template.board.onCreated(function currentColorOnCreated() {
	this.color = new ReactiveVar("black");
});

Template.board.helpers({
	color() {
		var myColor = piecesOnBoard.find().count();
		if (myColor % 2 == 0 ){
			Template.instance().color.set("black");
		} else {
			Template.instance().color.set("white");
		}
		return Template.instance().color.get();
	},
});

Template.board.events({
	'click button'(event, instance) { 
		var myButton = event.currentTarget;
		if(myButton.innerHTML == " - "){
			var myRow = 0;
			var rowArray = document.getElementsByTagName("ul");
			for (var i = 0; i < rowArray.length; ++i) {
				if (rowArray[i] == myButton.parentNode){
					myRow = i + 1;
				}
			}

			var myCol = 0;
			var colArray = myButton.parentNode.getElementsByTagName("button");
			for (var i = 0; i < colArray.length; ++i) {
				if (colArray[i] == myButton){
					myCol = i + 1;
				}
			}

			piecesOnBoard.insert({ color: instance.color.get(), row: myRow, col: myCol });
		}
	},

	'click div'(event, instance) {
		var myResetButton = event.currentTarget;
		if(myResetButton.id == "resetPieces"){
			Meteor.apply('removeAllPieces');
		} 
		
		if(myResetButton.id == "hideMe"){
			Meteor.apply('removeAllPieces');
			document.getElementById("winnerScreen").style.display = "none";
		} 
	}
});

Meteor.setInterval(function(){
var allPieces = piecesOnBoard.find({}, {fields: {_id: 0}});
var myWinner = gomokuWinner.find({}, {fields: {_id: 0}});
	function drawArrayElements(element, index, array) {
		var myRowNumber = element.row;
		var myColNumber = element.col;
		var myColor = element.color;
		var rowArray = document.getElementsByTagName("ul");
		var myRow = rowArray[myRowNumber - 1].getElementsByTagName("button");
		var myPiece = myRow[myColNumber - 1];
		
		if(myPiece.innerHTML == " - "){
			myPiece.className += myColor;
			myPiece.innerHTML = myColor;
		}
	}

	function findMatches() {
		var rowArray = document.getElementsByTagName("ul");
		var myRow = 0;
		var myArray = [];
		
		for (var i = 0; i < 15; ++i) {
			myRow = rowArray[i].getElementsByTagName("button");
			myArray.push(myRow)
		}
		
		for (var i = 0; i < 15; ++i) {
			for (var j = 0; j < 15; ++j) {		
				if (gomokuWinner.find().count() > 0) {
					break;
				}
				else if (j < 11
				&& myArray[i][j].className != "" 
				&& myArray[i][j].className == myArray[i][j + 1].className
				&& myArray[i][j].className == myArray[i][j + 2].className
				&& myArray[i][j].className == myArray[i][j + 3].className
				&& myArray[i][j].className == myArray[i][j + 4].className
				) {
					gomokuWinner.insert({ winner: myArray[i][j].className});
				} else if (i < 11
				&& myArray[i][j].className != "" 
				&& myArray[i][j].className == myArray[i + 1][j].className
				&& myArray[i][j].className == myArray[i + 2][j].className
				&& myArray[i][j].className == myArray[i + 3][j].className
				&& myArray[i][j].className == myArray[i + 4][j].className
				) {
					gomokuWinner.insert({ winner: myArray[i][j].className});
				} else if (j < 11
				&& i < 11
				&& myArray[i][j].className != "" 
				&& myArray[i][j].className == myArray[i + 1][j + 1].className
				&& myArray[i][j].className == myArray[i + 2][j + 2].className
				&& myArray[i][j].className == myArray[i + 3][j + 3].className
				&& myArray[i][j].className == myArray[i + 4][j + 4].className
				) {
					gomokuWinner.insert({ winner: myArray[i][j].className});
				} else if (j < 11
				&& i > 3
				&& myArray[i][j].className != "" 
				&& myArray[i][j].className == myArray[i - 1][j + 1].className
				&& myArray[i][j].className == myArray[i - 2][j + 2].className
				&& myArray[i][j].className == myArray[i - 3][j + 3].className
				&& myArray[i][j].className == myArray[i - 4][j + 4].className
				) {
					gomokuWinner.insert({ winner: myArray[i][j].className});
				}
			}
		}
	}

	function getWinner(element, index, array) {
		if (element.winner == "black"){
			document.getElementById("winnerMessage").innerHTML = "black won!";
			document.getElementById("winnerScreen").style.display = "block";
		}

		if (element.winner == "white"){
			document.getElementById("winnerMessage").innerHTML = "white won!";
			document.getElementById("winnerScreen").style.display = "block";
		}
	}

	allPieces.map(drawArrayElements); 

	if (myWinner.count() < 1){
		findMatches();
	}

	if (myWinner.count() == 1){
		myWinner.map(getWinner);
		gomokuWinner.insert({ winner: "won"});
	}
	
	if (piecesOnBoard.find().count() == 0){
		var rowArray = document.getElementsByTagName("ul");
		for (var i = 0; i < rowArray.length; ++i) {
			var myRow = rowArray[i].getElementsByTagName("button");
			for (var j = 0; j < myRow.length; ++j) {
				myRow[j].className = "";
				myRow[j].innerHTML = " - ";
			}
		}
		Meteor.call('resetWinner');	
	}
}, 100);



		
		
		
		
		
