(function(angular)	{
	'use strict';
	
	var assignApp = angular.module('assignApp', []);
	
	// Define constants
	assignApp.constant('OPERATORS', {
		'REQUIRED': ['+', '-', '*', '/'],
		'OPTIONAL':	{
						'^': 	Math.pow,
						'SR':	Math.sqrt
					}
		
	});
	
	// Define directives
	assignApp.directive('checkOperator', ['OPERATORS', (OPERATORS) =>	{
			return	{
				require: 'ngModel',
				link: function(scope, element, attr, ctrl)	{
					ctrl.$setValidity('charE', false);
					
					ctrl.$parsers.push((value) =>	{
						console.log('Operator Valid Check[' + value + ']', 
								(OPERATORS.REQUIRED.indexOf(value.toString()) >= 0) ||
								(Object.keys(OPERATORS.OPTIONAL).indexOf(value.toString()) >= 0)
								);
						
						ctrl.$setValidity('charE', 	(OPERATORS.REQUIRED.indexOf(value.toString()) >= 0) ||
													(Object.keys(OPERATORS.OPTIONAL).indexOf(value.toString()) >= 0));
						
						return value;
					});
				}				
			};
	}]);

	assignApp.directive('checkNumeric', () =>	{
		return	{
			require: 'ngModel',
			link: function(scope, element, attr, ctrl)	{
				
				
				ctrl.$parsers.push((value) =>	{
					var regex = new RegExp('^[0-9]+[.]?[0-9]*$');
					
					ctrl.$setValidity('charE', regex.test(value));
					
					return value;
				});
			}				
		};
	});

	
	// Define controllers
	assignApp.controller('assignCtrl', ['$scope', 'OPERATORS', ($scope, OPERATORS) =>	{
		$scope.operators = [].concat(OPERATORS.REQUIRED, Object.keys(OPERATORS.OPTIONAL));
		$scope.result = 0;

		// Validation Checks
		$scope.shows = {};
		$scope.shows.numOne = true;
		$scope.shows.operator = false;
		$scope.shows.numTwo = false;
		$scope.shows.btnAnswer = false;
		
		$scope.valid = {};
		$scope.valid.numOne = (valid) =>	{
			if (valid)	{
				$scope.shows.numOne = true;
				$scope.shows.operator = true;
			}	else	{
				$scope.shows.numOne = true;
				$scope.shows.operator = false;
			}
			
			$scope.shows.numTwo = false;
			$scope.shows.btnAnswer = false;
			
			if (valid && angular.isDefined($scope.numOperator) && $scope.operators.indexOf($scope.numOperator) >= 0)	{
				$scope.valid.operator(true);
				
			}
		};
		
		$scope.valid.operator = (valid) =>	{
			if (valid)	{
				$scope.shows.numOne = true;
				$scope.shows.operator = true;
				
				if (OPERATORS.REQUIRED.indexOf($scope.numOperator) < 0)	{
					console.log('OPTIONAL OPERATOR', $scope.numOperator);
					
					if (typeof(OPERATORS.OPTIONAL[$scope.numOperator]) == 'function')	{
						console.log('Number of parameters', OPERATORS.OPTIONAL[$scope.numOperator].length);
						
						if (OPERATORS.OPTIONAL[$scope.numOperator].length <= 1)	{
							$scope.shows.numTwo = false;
							$scope.shows.btnAnswer = true;
						}	else	{
							$scope.shows.numTwo = true;
							$scope.shows.btnAnswer = false;
						}
					}	else	{
						$scope.shows.numTwo = true;
						$scope.shows.btnAnswer = false;						
					}
				}	else	{
					$scope.shows.numTwo = true;
					$scope.shows.btnAnswer = false;
				}
				
				if (isNaN($scope.numTwo) == false && $scope.numTwo.length > 0)	{
					try	{
						Number.parseFloat($scope.numTwo);
						$scope.valid.numTwo(true);
					} catch(e)	{
						console.log('Error', e);	
						$scope.numTwo = 0;
					}					
				}
			}	else	{
				$scope.shows.numOne = true;
				$scope.shows.operator = true;
				$scope.shows.numTwo = false;
				$scope.shows.btnAnswer = false;
			}			
		};
		
		$scope.valid.numTwo = (valid) =>	{
			if (valid)	{
				$scope.shows.btnAnswer = true;
			}	else	{
				$scope.shows.btnAnswer = false;
			}			
		};

		$scope.$watch('form.iptNumOne.$valid', $scope.valid.numOne);
		$scope.$watch('form.iptOperator.$valid', $scope.valid.operator);		
		$scope.$watch('form.iptNumTwo.$valid', $scope.valid.numTwo);
		
		$scope.clickOperator = (obj, operator) =>	{
			$scope.numOperator = operator;
			$scope.valid.operator(true);
		};
		
		$scope.calculate = () =>	{
			if (OPERATORS.REQUIRED.indexOf($scope.numOperator) >= 0)	{
				$scope.result = eval([$scope.numOne, $scope.numOperator, $scope.numTwo].join(' '));
			}	else	{
				var func = OPERATORS.OPTIONAL[$scope.numOperator];
				
				if (func.length == 1)	{
					$scope.result = func($scope.numOne);
				}	else	{
					$scope.result = func($scope.numOne, $scope.numTwo);
				}
			}
			
			console.log('Calculated', $scope.result);			
		};
		
	}]);
})(window.angular);
