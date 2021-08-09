interface Numeric {
    GetValue(): Numeric | number | number[];
    SetValue?(new_val: Numeric): void;
};

interface Formattable {
    ToString(): string;
}

interface BoolConvertible {
    Bool(): boolean;
}

abstract class amNumber implements Numeric, Formattable, BoolConvertible {
    
    protected value: number | number[];

    constructor (val: number | number[]) {
        this.value = val;
    };

    //public static abstract New (to_parse: string): Numeric | false;
    public abstract GetValue(): Numeric | number | number[];

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

    protected value!: number;

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

}

class Fraction extends amNumber {

    protected value: number[];

    ToString(): string {
        return `(${this.value[0]}/${this.value[1]})`;
    }

    constructor (value1: Int, value2: Int) {
        super([value1.GetValue(), value2.GetValue()])
    }

    public Numerator(): Int {
        return new Int(this.value[1]);
    };

    public Denominator(): Int {
        return new Int(this.value[0])
    }

    public static New(to_parse: string): Fraction {
        if (to_parse.includes("/")) {
            let parse_strings: string[] = to_parse.split("/");
            if (parse_strings.length == 2) {

                let opt1: false | Int = Int.New(parse_strings[0]);
                let opt2: false | Int = Int.New(parse_strings[1]);

                if ( Int.IsInt(opt1) && Int.IsInt(opt2) ) {
                    if ( opt2.IsEqual( new Int(0) ) ) throw new Error("Fraction numerator cannot be zero.")
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

    public Percent(percentage: Int): Fraction {
        return new Fraction(percentage, new Int(100));
    }

    public static UnitFraction(numerator: Int): Fraction {
        return new Fraction(new Int(1), numerator);
    }

    public GetValue(): number {
        return this.value[0] / this.value[1];
    }



}

console.log(Fraction.New("1/2").Reciprocal().IsProper());

