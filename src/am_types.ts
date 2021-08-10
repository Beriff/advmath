import { Algorithms } from "./am_algorithms"

interface Numeric {
    GetValue(): Numeric | number;
    SetValue?(new_val: Numeric): void;
};

interface Formattable {
    ToString(): string;
}

interface BoolConvertible {
    Bool(): boolean;
}

interface Comparable {
    LessThan(other: Numeric): boolean;
    GreaterThan(other: Numeric): boolean;
    LessEqThan(other: Numeric): boolean;
    GreaterEqThan(other: Numeric): boolean;
    IsEqual(other: Numeric): boolean;
}

abstract class amNumber implements Numeric, Formattable, BoolConvertible, Comparable {
    
    protected readonly value: number | number[];

    constructor (val: number | number[]) {
        this.value = val;
    };

    //public static abstract New (to_parse: string): Numeric | false;
    public abstract GetValue(): number;

    public CompareTo (to_compare: amNumber): Numeric {
        if (this.value < to_compare.value) {
            return new Int(-1);
        }
        else if (this.value == to_compare.value) {
            return new Int(0);
        } else {
            return new Int(1);
        }
    };

    public IsEqual (to_equal: amNumber): boolean {
        if (this.value == to_equal.value) { return true; };
        return false;
    };

    public abstract ToString(): string;

    public Bool(): boolean {
        return !!this.GetValue();
    }

    public Add(other: Int): Float;

    public Add(other: Float): Float;

    public Add(other: Fraction): Float;

    public Add(other: any): any {
        return new Float(this.GetValue() + other.GetValue());
    }

    public Subtract(other: Int): Float;

    public Subtract(other: Float): Float;

    public Subtract(other: Fraction): Float;

    public Subtract(other: any): any {
        return new Float(this.GetValue() - other.GetValue());
    }

    public Multiply(other: Int): Float;

    public Multiply(other: Float): Float;

    public Multiply(other: Fraction): Float;

    public Multiply(other: any): any {
        return new Float(this.GetValue() * other.GetValue());
    }

    public Divide(other: Int): Float;

    public Divide(other: Float): Float;

    public Divide(other: Fraction): Float;

    public Divide(other: any): any {
        return new Float(this.GetValue() / other.GetValue());
    }

    public LessThan(other: Numeric) {
        return this.GetValue() < other.GetValue();
    }

    public GreaterThan(other: Numeric) {
        return this.GetValue() > other.GetValue();
    }

    public LessEqThan(other: Numeric) {
        return this.GetValue() <= other.GetValue();
    }

    public GreaterEqThan(other: Numeric) {
        return this.GetValue() >= other.GetValue();
    }
    
};

class Int extends amNumber {

    protected value: number;

    constructor (val: number) {
        if (val % 1 == 0) {
            super(val);
        } else {
            throw new TypeError("Passed number type is not an integer, please use New(string)");
        }
        
    }

    public GetValue(): number {
        return this.value;
    };

    public Abs(): Int {
        if (this.GetValue() >= 0) {
            return this;
        } else {
            return new Int(this.GetValue() + this.GetValue() * 2);
        }
    }

    public static IsInt(suspect: false | Int): suspect is Int {
        return !!suspect;
    }

    public static New (to_parse: string): Int {
        if(!Number.isNaN(Number.parseInt(to_parse))) {
            return new Int(Number.parseInt(to_parse));
        } else { throw new TypeError("Int.New(): incorrect string") };
    };

    public ToString(): string {
        return `${this.value}`;
    };

}

class Float extends amNumber {

    protected value: number;

    public GetValue(): number {
        return this.value;
    };

    public AfterPoint(): Int {
        return new Int(this.value - Math.trunc(this.value))
    };

    public static New (to_parse: string): Float {
        if(!Number.isNaN(Number.parseInt(to_parse))) {
            return new Float(Number.parseInt(to_parse));
        } else { throw new TypeError("Float.New(): incorrect string") };
    };

    public ToString(): string {
        return `${this.value}`
    }

    public Int(): Int {
        return new Int(this.value);
    }

}

class Fraction extends amNumber {

    protected readonly value: number[];
    protected WholePart: Int;

    ToString(): string {
        return (this.WholePart.GetValue() == 0 ? "" : this.WholePart.GetValue()) + `(${this.value[0]}/${this.value[1]})`;
    }

    constructor (value1: Int, value2: Int, whole_part: Int = new Int(0)) {
        if (value1.GetValue() == 0) {
            value1 = new Int(1);
        }
        super([value1.GetValue(), value2.GetValue()])
        this.WholePart = whole_part;
    }

    public Numerator(): Int {
        return new Int(this.value[0]);
    };

    public Denominator(): Int {
        return new Int(this.value[1])
    }

    public static New(to_parse: string): Fraction {
        if (to_parse.includes("/")) {
            let parse_strings: string[] = to_parse.split("/");
            if (parse_strings.length == 2) {

                let opt1: false | Int = Int.New(parse_strings[0]);
                let opt2: false | Int = Int.New(parse_strings[1]);

                if ( Int.IsInt(opt1) && Int.IsInt(opt2) ) {
                    if ( opt2.IsEqual( new Int(0) ) ) throw new Error("Fraction denominator cannot be zero.")
                    return new Fraction(opt1, opt2);
                };
            };

        } else {
            throw new TypeError("Fraction.New(): Incorrect string; Right string format is x/y.")
        };
    }

    public Negate(): Fraction {
        this.value[0] = -this.value[0];
        return this;
    }

    public Reciprocal(): Fraction {
        return new Fraction(new Int(this.value[1]), new Int(this.value[0]));
    }

    public IsProper(): boolean {
        return this.Denominator().Abs().GetValue() < this.Numerator().GetValue();
    }

    public static Percent(percentage: Int): Fraction {
        return new Fraction(percentage, new Int(100));
    }

    public static UnitFraction(numerator: Int): Fraction {
        return new Fraction(new Int(1), numerator);
    }

    public GetValue(): number {
        return (this.value[0] / this.value[1]) + this.WholePart.GetValue();
    }

    public IsInt(): boolean {
        return (this.Numerator().IsEqual(new Int(1)));
    }

    public ToImproper(): Fraction {
        return new Fraction(new Int(this.value[0] + this.value[1] * this.WholePart.GetValue()), new Int(this.value[1]))
    }

    public Simplify(): Fraction {
        let gcd: number = Algorithms.gcd(this.Numerator().GetValue(), this.Denominator().GetValue())
        return new Fraction(new Int(this.value[0] / gcd), new Int(this.value[1] / gcd), this.WholePart)
    }

    /**
     * Add two fractions. Generally faster than Add(other: Fraction): Float
     * @param other other fraction to add
     */
    public AddF(other: Fraction): Fraction {
        if (this.Denominator().IsEqual(other.Denominator())) {
            return new Fraction(this.Numerator().Add(other.Numerator()).Int(), this.Denominator(), this.WholePart.Add(other.WholePart).Int());
        } else {
            let first_eq: Fraction = new Fraction(this.Numerator().Multiply(other.Denominator()).Int(), this.Denominator().Multiply(other.Denominator()).Int(), this.WholePart);
            let second_eq: Fraction = new Fraction(other.Numerator().Multiply(this.Denominator()).Int(), other.Denominator().Multiply(this.Denominator()).Int(), other.WholePart);
            return first_eq.AddF(second_eq);
        }
    }

    public WholePartNew(whole_part: Int): Fraction {
        return new Fraction(this.Numerator(), this.Denominator(), whole_part);
    }

    public SubtractF(other: Fraction): Fraction {
        return this.AddF(other.Negate())
    }

    public MultiplyF(other: Fraction): Fraction {
        let first_fr: Fraction = this.ToImproper();
        let second_fr: Fraction = other.ToImproper();

        return new Fraction(first_fr.Numerator().Multiply(second_fr.Numerator()).Int(), first_fr.Denominator().Multiply(second_fr.Denominator()).Int())
    }

    public DivideF(other: Fraction): Fraction {
        return this.MultiplyF(other.Reciprocal());
    }

}

class CompositeFraction<Type extends amNumber> extends amNumber {
    public readonly WholePart: Int;
    public readonly Numerator: Type;
    public readonly Denominator: Type;
    public GetValue(): number {
        return this.Numerator.GetValue() / this.Denominator.GetValue();
    }
    public ToString(): string {
        return (this.WholePart.GetValue() == 0 ? "" : this.WholePart.GetValue()) + `${this.Numerator.GetValue()}/${this.Denominator.GetValue()}`
    }

    constructor (value1: Type, value2: Type, whole_part: Int = new Int(0)) {
        super([value1.GetValue(), value2.GetValue()])
        this.Numerator = value1;
        this.Denominator = value2;
        this.WholePart = whole_part;
    }
    
}

class Imaginary extends amNumber {
    protected readonly value: number;

    constructor(val: number) {
        super(val);
        this.value = val;
    }

    public static readonly Unit = new Imaginary(1);

    public ToString(): string {
        return `${this.value}i`;
    }
    public GetValue(): number {
        throw TypeError("Attempt to convert imaginary/complex value to a non-complex value. Please use GetValueComplex() or ToFloat() instead.");
    }

    public Negate(): Imaginary {
        return new Imaginary(-this.value);
    }

    public ToFloat(): Float {
        return new Float(this.value);
    }

    public AddImaginary(other: Imaginary): Imaginary {
        return new Imaginary(this.value + other.value);
    }

    public SubtractImaginary(other: Imaginary): Imaginary {
        return this.AddImaginary(other.Negate());
    }

    public MultiplyImaginary(other: Imaginary): Float { // blame typescript creators for the lack of operator overloading
        return new Float((-this.value) * other.value);
    }

    public DivideImaginary(other: Imaginary): Float {
        return new Float(this.value / other.value);
    }

    public MultiplyS(other: Float): Imaginary {
        return new Imaginary(this.value * other.GetValue());
    }

    public DivideS(other: Float): Imaginary {
        return new Imaginary(this.value / other.GetValue())
    }
}

class Complex extends amNumber {

    protected readonly real: amNumber;
    protected readonly imaginary: Imaginary;

    public GetValue(): number {
        throw TypeError("Attempt to convert imaginary/complex value to a non-complex value. Please use GetValueComplex() or ToFloat() instead.");
    }
    public ToString(): string {
        return `${this.real.ToString()} + ${this.imaginary.ToString()}`;
    }

    constructor(real: Int | Float, img: Imaginary) {
        super(real.GetValue())
        this.real = real;
        this.imaginary = img;
    }

    public AddC(other: Complex): Complex {
        return new Complex(this.real.Add(new Float(other.real.GetValue())), this.imaginary.AddImaginary(other.imaginary));
    }
    
}

let myFraction = new CompositeFraction<Fraction>(
    new Fraction( new Int(1), new Int(2)),
    new Fraction( new Int(1), new Int(3)),
    new Int(2)
    );

console.log( myFraction.Add(new Float(2.5)) );
