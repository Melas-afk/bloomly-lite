export function Plant(name, description, frequency) {
  this.name = name;                
  this.description = description;   
  this.frequency = frequency;       
  this.lastWatered = new Date();    
}

Plant.prototype.water = function () {
  this.lastWatered = new Date();
};

window.Plant = Plant;
