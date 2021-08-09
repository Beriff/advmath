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
            throw new TypeError("Passed number type is not integer, please use New(string)");
        }
        
    }

    public GetValue(): number {
        return this.value;
    };

    public static IsInt(suspect: false | Int): suspect is Int {
        return !!suspect;
    }

    public static New (to_parse: string): Int | false {
        if(!Number.isNaN(Number.parseInt(to_parse))) {
            return new Int(Number.parseInt(to_parse));
        } else { return false; };
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

    public static New (to_parse: string): Float | false {
        if(!Number.isNaN(Number.parseInt(to_parse))) {
            return new Float(Number.parseInt(to_parse));
        } else { return false; };
    };

    public ToString(): string {
        return `${this.value}`
    }

}

class Fraction extends amNumber {

    protected value: number[];

    ToString(): string {
        throw new Error("Method not implemented.");
    }

    constructor (value1: Int, value2: Int) {
        super([value1.GetValue(), value2.GetValue()])
    }

    public static New(to_parse: string): false | Numeric {
        if (to_parse.includes("/")) {
            let sides: [Int, Int];
            let parse_strings: string[] = to_parse.split("/");
            if (parse_strings.length == 2) {

                let opt1: false | Int = Int.New(parse_strings[0]);
                let opt2: false | Int = Int.New(parse_strings[1]);

                if ( Int.IsInt(opt1) && Int.IsInt(opt2) ) {
                    sides[0] = opt1;
                    sides[1] = opt2;
                };
            };

        } else {
            return false;
        };
    }
    public GetValue(): number[] {
        throw new Error("Method not implemented.");
    }

}

console.log(new Int(5).GetValue());

