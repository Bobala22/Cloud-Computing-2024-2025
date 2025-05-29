class Maintenance {
    constructor({ car_id, date, type, cost, description, next_scheduled }) {
      this.car_id = car_id;
      this.date = new Date(date);
      this.type = type;
      this.cost = cost;
      this.description = description;
      this.next_scheduled = next_scheduled ? new Date(next_scheduled) : null;
    }
  }
  
  module.exports = Maintenance;