describe('AngularJS assignment test list', function()	{
	var numOne = element(by.model('numOne'));
	var operator = element(by.model('numOperator'));
	var numTwo = element(by.model('numTwo'));
	var btnEqual = element(by.name('btnEqual'));
	var result = element(by.binding('result'));
	
	var OPERATOR_INPUTS = {
			'+':	{	'inputs': ['100', '10.75'], 'output': '110.75'	},
			'-':	{	'inputs': ['23.95', '0.22'], 'output': 	'23.73'},
			'*':	{	'inputs': ['1.74', '2'], 'output': 	'3.48'},
			'/':	{	'inputs': ['9.66', '3.00'], 'output': 	'3.22'},
			'^':	{	'inputs': ['2', '8'], 'output': 	'256'},			
			'SR':	{	'inputs': ['9'], 'output': 	'3'},
	};
	
	beforeEach(function()	{
		browser.get('http://localhost:9000');
	});
	
	Object.keys(OPERATOR_INPUTS).forEach(function(iptOper)	{
		it('Operation Test[' + iptOper + ']', function()	{
			numOne.sendKeys(OPERATOR_INPUTS[iptOper].inputs[0]);
			operator.sendKeys(iptOper);			
			
			if (OPERATOR_INPUTS[iptOper].inputs.length > 1)	{
				numTwo.sendKeys(OPERATOR_INPUTS[iptOper].inputs[1]);
			}
			
			btnEqual.click();
			
			expect(result.getText()).toEqual(OPERATOR_INPUTS[iptOper].output);		
		});		
	});
});