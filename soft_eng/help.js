//set main namespace
goog.provide('soft_eng.Help');

soft_eng.Help = function() {
	var scene = new lime.Scene();
	var layer = new lime.Layer();
    var self = this;
	layer.setPosition(0, 0);
	scene.appendChild(layer);
	
	backgroundSprite = new lime.Sprite().setSize(soft_eng.WIDTH, soft_eng.HEIGHT).setFill('#000000').setAnchorPoint(0,0);
	layer.appendChild(backgroundSprite);
	
	// add Back button
	var backButton = soft_eng.makeButton('Back').setPosition(soft_eng.WIDTH / 2, 50);
	goog.events.listen(backButton, 'click', function() {
		// load the main menu scene
		soft_eng.loadMainMenu();
	});
	layer.appendChild(backButton);
	
	var txt1 = new lime.Label().setFontSize(28).setSize(soft_eng.WIDTH, 50).setPosition(soft_eng.WIDTH / 2, 170).setAlign('center').setFontColor('#ffffff');
	txt1.setText('Game Instructions');
	layer.appendChild(txt1);
	
	var txt2 = new lime.Label().setFontSize(18).setSize(soft_eng.WIDTH * 0.80, 100).setPosition(soft_eng.WIDTH / 2, 250).setAlign('center').setFontColor('#ffffff');
	txt2.setText('Align the phone horizontally, then control the red ball by tilting the phone until it reaches the green goal. Avoid black traps.');
	layer.appendChild(txt2);
	
	
	
	
	
	
	this.getScene = function() { return scene; };
}