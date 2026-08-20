// конструктор 
function Plant(name, description, frequency) {
  this.name = name;                 // название 
  this.description = description;   // описание
  this.frequency = frequency;       // полив в днях
  this.lastWatered = new Date();    // дата последнего полива
}

// полив
Plant.prototype.water = function () {
  this.lastWatered = new Date();
};

window.Plant = Plant;
