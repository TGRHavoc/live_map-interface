class Coordinates {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class MarkerObject {
    constructor(reference, position, type, description, data) {
        this.reference = reference;
        this.position = position;
        this.type = type;
        this.description = description;
        this.data = data;
    }
}


export { Coordinates, MarkerObject };
