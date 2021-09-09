/* 
Decided to create VectorN instead of Vector2 and Vector3 for better abstraction
and for the sake of not making `interface Vector` just for two classes.

Btw, no tensors because screw you.
*/

import { Int } from './am_types'
import { IClonable } from './datamodel'

class VectorError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, VectorError.prototype);
    }
}

// No Vector<T> for today sorry
class Vector implements IClonable<Vector> {
    private Values: number[] = [];
    public Dimensions: Int = new Int(1);

    constructor (dims: Int) {
        this.Dimensions = dims;
    }

    public X(): number {
        if (this.Dimensions.GetValue() <= 1) {
            return this.Values[0];
        }
    }

    public Y(): number {
        if (this.Dimensions.GetValue() <= 2) {
            return this.Values[1];
        }
    }

    public Z(): number {
        if (this.Dimensions.GetValue() <= 3) {
            return this.Values[2];
        }
    }

    public W(): number {
        if (this.Dimensions.GetValue() <= 4) {
            return this.Values[3];
        }
    }

    public Get(index: Int) {
        if (index.LessEqThan(this.Dimensions)) {
            return this.Values[index.GetValue()];
        } else {
            throw new VectorError("Vector value index is greater than vector's dimensions.")
        }
    }

    public Copy(): Vector {
        return Vector.FromArray(this.Values);
    }

    public static FromArray(arr: number[]): Vector {

        let vector = new Vector(new Int(arr.length));
        vector.Values = arr;
        return vector;
    }

    public static FromArgs(...args: number[]): Vector {
        return Vector.FromArray(args.splice(0, 0));
    }

    public LengthSq(): number {
        let res: number = 0;
        for (let i of this.Values) {
            res += i**2;
        }
        return res;
    }

    public Length(): number {
        return Math.sqrt(this.LengthSq());
    }
}

let vec1 = Vector.FromArray([2, 4, 5]);

export { Vector }