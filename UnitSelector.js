function UnitSelector(height, id) {
	this.height = height;
	this.id = id;
	this.units = [];
}

UnitSelector.prototype.build = function() {
	var i;
	var out = "<table>";
	for(i = 0; i < this.height; i++) {
		out += "<tr>";
		out += "<td id='"+ this.generateTDID(i) +"' style='"+this.getStyle()+"'>"; 
		out += "</td>"
		out += "</tr>";
	}
	out += "</table>";

	return out;
}

UnitSelector.prototype.removeUnit = function(idx) {
	var td = document.getElementById(this.generateTDID(idx));
	td.innerHTML = "";
}

UnitSelector.prototype.removeUnits = function() {
	var i;
	var td;
	for(i = 0; i < this.units.length; i++) {
		td = document.getElementById(this.generateTDID(i));
		td.innerHTML = "";
	}
}

UnitSelector.prototype.getStyle = function() {
	var style = '';
	if(this.id === 0) style = "background: #7DE389; width: 50px; height: 50px; border: 2px solid #3A693F";
	else if(this.id === 1) {
		style = "background: #FFCC00; width: 50px; height: 50px; border: 2px solid #FF9F21";
	}

	return style;
}

UnitSelector.prototype.generateTDID = function(idx) {
	return ("unit_selector_" + this.id + "_" + idx);
}

UnitSelector.prototype.showUnitsOnGrid = function() {
	var i;
	var td;
	for(i=0;i<this.units.length;i++) {
		//add unit image to the grid
		td = document.getElementById(this.generateTDID(i));
		td.innerHTML = "<img id='unit_img_"+this.id+"_" + i + "' src='" + this.units[i].src + "'/>";
	}
}