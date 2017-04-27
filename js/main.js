'use strict';

var puzzle = angular.module('puzzle', []);

puzzle.controller('PuzzlePlay', function ($scope, $interval) {
	// variables initialization
	$scope.stepCount = 0;
	$scope.timer = 0;
	$scope.puzzle_style = 16;
	$scope.numbers = new Array;
	var numbersArray = new Array,
		tt = 0,
		eq = Math.sqrt($scope.puzzle_style);
	
	// Timer object
	var timeFunction = {
		start : function (){
			tt = $interval(function(){
				$scope.timer++ 
			}, 1000)
		}, // start time
		reset : function () {
			$scope.timer = 0;
		}, // reset time 
		stop : function () {
			$interval.cancel(tt);
		} // stop time
	}

	// array Generation
	arrayGeneration ();

	// Get square of number
	$scope.getSqrt = function (number) {
		eq = Math.sqrt(number);
		return Math.sqrt(number);
	}

	// Get line of number
	$scope.getY = function (number) {
		return Math.ceil( (number)/Math.sqrt($scope.puzzle_style));
	}

	// Function of moving numbers by click
	$scope.clickStep = function (val) {
		var y,
			x = $scope.numbers[val].num, // Current number
			left = $scope.numbers.hasOwnProperty(val - 1) && $scope.numbers[val - 1].num == $scope.puzzle_style,
			right = $scope.numbers.hasOwnProperty(val + 1) && $scope.numbers[val + 1].num == $scope.puzzle_style,
			top = $scope.numbers.hasOwnProperty(val + eq) && $scope.numbers[val + eq].num == $scope.puzzle_style,
			bottom = $scope.numbers.hasOwnProperty(val - eq) && $scope.numbers[val - eq].num == $scope.puzzle_style;

		// Check on the moving side
		switch (true) {
			case left:
				y = $scope.numbers[val - 1].num;
				$scope.numbers[val - 1].num = x;
				$scope.numbers[val].num = y;
				break;
			case right:
				y = $scope.numbers[val + 1].num;
				$scope.numbers[val + 1].num = x;
				$scope.numbers[val].num = y;
				break;
			case top:
				y = $scope.numbers[val + eq].num;
				$scope.numbers[val + eq].num = x;
				$scope.numbers[val].num = y;
				break;
			case bottom:
				y = $scope.numbers[val - eq].num;
				$scope.numbers[val - eq].num = x;
				$scope.numbers[val].num = y;
				break;
			default:
				return;
		}

		$scope.stepCount += 1; // Added step
		finish(); // Check pls, may be i won?
	}

	// Reset Style of Puzzle by select box
	$scope.resetStyle = function () {
		$scope.numbers = new Array;
		numbersArray = new Array;

		// array Generation
		arrayGeneration ();

		$scope.stepCount = 0; // Reset step to 0
		timeFunction.stop(); // Stop Timer
		timeFunction.reset(); // Reset timer to 0
	}

	// Start new game
	$scope.reset = function () {
		var key = 0,
			index;
		
		$scope.resetStyle(); // reset style of puzzle
		$scope.stepCount = 0; // reset step to 0
		timeFunction.start(); // start timer

		// Randomizer of numbers
		while (numbersArray.length !== 0) {
			index = Math.floor(Math.random() * numbersArray.length);
		    $scope.numbers[key].num = numbersArray.splice(index, 1)[0]
		    key = ++key;
		}

		if ( ! checkCombination($scope.numbers) ) $scope.reset(); // Check combination, if it's fake, start randomizer again
	}

	// Check finish function
	function finish () {
		for (var i = 0; i < $scope.numbers.length; i++) {
			if ($scope.numbers[i].num !== i + 1) {
				return;
			}
		}
		timeFunction.stop(); // stop timer if won
		alert("Congratulations! You Won! Your time: "+$scope.timer+" sec; Steps: "+$scope.stepCount)+";";
	}

	// Function array generation
	function arrayGeneration () {
		for (var x = 0; x < $scope.puzzle_style; x++) {
			numbersArray.push(x + 1);
		}
		for (var i = 0; i < $scope.puzzle_style; i++) {
			$scope.numbers[i] = {'num' : i + 1};
		}
	}
})

// Check to fake combination
function checkCombination (combination) {
	var g, result,
		sum = 0;

	for (var i = 0; i < combination.length; i++) {
		g = 0;
		for (var j = i; j < combination.length; j++) {
			if(combination[j].num !== combination.length && (combination[i].num > combination[j].num)) {
				g++;
			}
		}
		if (combination[i].num === combination.length ) {
			g += Math.ceil(i/4) - 1;
		}
		sum += g;
	}
	return sum % 2 !== 1;
}