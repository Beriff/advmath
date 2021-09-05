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

    public ToFloat(): Float {
        return new Float(this.value)
    }

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

    public ToFloat(): Float {
        return this
    }

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

class Imaginary {
    protected readonly value: number;

    constructor(val: number) {
        this.value = val;
    }

    public static readonly Unit = new Imaginary(1);

    public ToString(): string {
        return `${this.value}i`;
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

class Complex {

    protected readonly real: Int | Float;
    protected readonly imaginary: Imaginary;

    public ToString(): string {
        return `${this.real.ToString()} + ${this.imaginary.ToString()}`;
    }

    constructor(real: Int | Float, img: Imaginary) {
        this.real = real;
        this.imaginary = img;
    }

    public AddC(other: Complex): Complex {
        return new Complex(this.real.Add(new Float(other.real.GetValue())), this.imaginary.AddImaginary(other.imaginary));
    }

    public SubtractC(other: Complex): Complex {
        return new Complex(this.real.Subtract(new Float(other.real.GetValue())), this.imaginary.SubtractImaginary(other.imaginary));
    }

    public GetConjugate(): Complex {
        return new Complex(this.real, this.imaginary.Negate())
    }

    public MultiplyC(other: Complex): Complex {
        return new Complex(
            this.real.Multiply(new Float(other.real.GetValue())).Add(this.imaginary.MultiplyImaginary(other.imaginary)),
            this.imaginary.MultiplyS(other.real.ToFloat()).AddImaginary(other.imaginary.MultiplyS(this.real.ToFloat()))
            );
    }

    public ToFloat(): Float {
        if (this.imaginary.ToFloat().IsEqual(new Int(0))) {
            return new Float(this.real.GetValue())
        } else {
            throw new TypeError("Attempt to convert a complex number with non-zero imaginary part to float.")
        }
    }

    public DivideS(other: Float): Complex {
        return new Complex(this.real.Divide(other.Int()), this.imaginary.DivideS(other))
    }

    public DivideC(other: Complex): Complex {
        let numerator = this.MultiplyC(other.GetConjugate())
        let denominator = other.MultiplyC(other.GetConjugate()).ToFloat()
        return numerator.DivideS(denominator)
    }
    
}

class Modulus {
    public ModulusValue: Int;

    constructor (modulus: Int) {
        this.ModulusValue = modulus;
    }

    public ValueOf(num: Int): Int {
        return new Int(num.GetValue() % this.ModulusValue.GetValue())
    }

    public Add(num1: Int, num2: Int): Int {
        return new Int(num1.Add(num2).GetValue() % this.ModulusValue.GetValue());
    }

    public Subtract(num1: Int, num2: Int): Int {
        return new Int(num1.Subtract(num2).GetValue() % this.ModulusValue.GetValue());
    }

    public Multiply(num1: Int, num2: Int): Int {
        return new Int(num1.Multiply(num2).GetValue() % this.ModulusValue.GetValue());
    }

    public Divide(num1: Int, num2: Int): Int {
        return new Int(num1.Divide(num2).GetValue() % this.ModulusValue.GetValue());
    }
}

class Stream<T> {
    private Conveyor: T[];
    private Buffer: StreamBuffer<T>
    public Feed(data: T): void {
        this.Conveyor.push(data);
        this.Buffer.Sink(this.Get());
    }
    public Get(): T {
        while (this.Conveyor.length == 0) {};
        let to_return: T = this.Conveyor[0];
        this.Conveyor.shift();
        return to_return;
    }
    public GetBuffer(): StreamBuffer<T> {
        return this.Buffer;
    }
    public NewBuffer(buffer: StreamBuffer<T>): void {
        this.Buffer = buffer;
    }
}

class StreamBuffer<T> {
    private Buffer: T[];
    public Sink(data: T): void {
        this.Buffer.push(data);
    }
    public ReadBuffer(): T[] {
        return this.Buffer;
    }
}

interface amCollection<T> {
    GetLength(): Int;
    ShallowCopyTo(array: T[], index: Int): void;
}

type cstring = amArray<string>

class amArray<T> implements amCollection<T> {
    private array: T[];
    constructor (arr: T[]) {
        this.array = arr;
    } 
    GetLength(): Int {
        return new Int(this.array.length);
    }
    ShallowCopyTo(array: T[], index: Int): void {
        let ind: number = index.GetValue();
        for(let i of this.array) {
            array[ind] = i;
            ind++;
        }
    }
    public static FromArray<T>(arr: T[]): amArray<T> {
        return new amArray<T>(arr);
    }
    public static FromSeq<T>(...seq: T[]): amArray<T> {
        let array: T[] = [];
        for (let e of seq) {
            array.push(e);
        }
        return new amArray<T>(array);
    }
    public static FromString(str: string): cstring {
        return new amArray<string>([...str]);
    }

    public Get(index: Int): T {
        return this.array[index.GetValue()]
    }

    public GetN(index: number): T {
        return this.array[index];
    }

    public Set(index: Int, value: T): void {
        this.array[index.GetValue()] = value;
    }

    public SetN(index: number, value: T): void {
        this.array[index] = value;
    }

    public ForEach(f: (i: T) => void) {
        for (let j of this.array) {
            f(j);
        }
    }

    public IndexOf(element: T): number {
        return this.array.indexOf(element);
    }

    public Pop(): T {
        return this.array.pop();
    }

    public RemoveAt(index: Int): void {
        this.array.splice(index.GetValue(), 1);
    }

    public Splice(at: Int, count: Int) {
        this.array.splice(at.GetValue(), count.GetValue());
    }

    public Reverse(): amArray<T> {
        let new_arr: T[] = [];
        for (let i = this.array.length; i > 0; --i) {
            new_arr.push(this.array[i]);
        }
        return new amArray(new_arr);
    }

    public Interval(from: Int = new Int(0), to: Int = this.GetLength()): amArray<T> {
        let f: number = from.GetValue()
        let t: number = to.GetValue()
        let arr: T[] = [];
        for (let i = f; i < t; ++i) {
            arr.push(this.array[i]);
        }

        return new amArray(arr);
    }

    public Filter(f: (a: T) => boolean): amArray<T> {
        let new_arr: T[] = [];
        for (let e of this.array) {
            if(f(e)) {
                new_arr.push(e);
            }
        }
        return new amArray<T>(new_arr);
    }

    public Add(e: T): void {
        this.array.push(e);
    }
}

class Stack<T> implements amCollection<T> {
    private Container: T[];
    public Add(data: T) {
        this.Container.push(data);
    }
    public Pop(): T {
        if (this.Container.length > 0) {
            return this.Container.pop();
        } else {
            throw new Error("Cannot pop from stack: stack is empty")
        }
    }
    public Peek(): T {
        if (this.Container.length >= 2) {
            return this.Container[this.Container.length - 2];
        } else {
            throw new Error("Cannot peek at stack: stack's length less than 2");
        }
    }
    public Get(): T {
        if (this.Container.length > 0) {
            return this.Container[this.Container.length - 1];
        } else {
            throw new Error("Cannot pop from stack: stack is empty")
        }
    }
    public GetLength(): Int {
        return new Int(this.Container.length);
    }

    public ShallowCopyTo(array: T[], index: Int = new Int(1)): void {
        let ind: number = index.GetValue();
        for(let i of this.Container) {
            array[ind] = i;
            ind++;
        }
    }
}

class Queue<T> implements amCollection<T> {
    private Container: T[];

    public Enqueue(data: T): void {
        this.Container.push(data);
    }
    public Pop(): T {
        let to_return = this.Container[0];
        this.Container.shift();
        return to_return;
    }
    public GetLength(): Int {
        return new Int(this.Container.length);
    }
    public ShallowCopyTo(array: T[], index: Int = new Int(1)): void {
        let ind: number = index.GetValue();
        for(let i of this.Container) {
            array[ind] = i;
            ind++;
        }
    }
}

class CircularBuffer<T> implements amCollection<T> {
    private length: Int;
    private Container: T[];
    private Module: Modulus

    private read_index: number = 0;
    private write_index: number = 0;

    public GetLength(): Int {
        return this.length;
    }

    constructor(size: Int) {
        this.length = size;
        this.Module = new Modulus(size);
    }

    public Write(data: T): void {
        this.Container[this.write_index] = data;
        this.write_index = this.Module.Add(new Int(this.write_index), new Int(1)).GetValue();
        
    }

    public ReadNext(): T {
        let data: T = this.Container[this.read_index];
        this.write_index = this.Module.Add(new Int(this.write_index), new Int(1)).GetValue();
        return data;
    }

    public ShallowCopyTo(array: T[], index: Int = new Int(1)): void {
        let ind: number = index.GetValue();
        for(let i of this.Container) {
            array[ind] = i;
            ind++;
        }
    }

}

class TreeError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, TreeError.prototype);
    }
}

class TreeNode<T> {
    public Parent: TreeNode<T>;
    public Children: TreeNode<T>[] = [];
    public Value: T;

    constructor (parent: TreeNode<T> = null, value: T) {
        if (!(parent == null)) {
            this.Parent = parent;
            this.Parent.Children.push(this);
        };
        this.Value = value;
        
    }

    public AddChild(child: TreeNode<T>): void {
        this.Children.push(child);
        child.Parent = this;
    }

    public SetParent(parent: TreeNode<T>) {
        this.Parent = parent;
        parent.Children.push(this);
    }

    public Prune(): void {
        let arr = this.Parent.Children;
        arr.splice(arr.indexOf(this), 1);
        this.Parent = null;
    }

    public Graft(section: Tree<T>): void {
        section.Root.SetParent(this);
    }

    public ForEach(f: (i: TreeNode<T>) => void) {
        for (let node of this.Children) {
            f(node);
            node.ForEach(f);
        }
    }

    public IsInternal(): boolean {
        if (this.Children.length > 0) {
            return true;
        }
        return false;
    }
}

class Tree<T> {
    public Root: TreeNode<T>;
    constructor (root: TreeNode<T>) {
        if (root.Parent == null) {
            this.Root = root;
        } else {
            throw new TreeError("Provided root node has parent.")
        }
    }
    public Size(): number {
        let size: number = 1
        this.Root.ForEach(function (_) {size++});
        return size;
    }
}


export { Int, Float, Fraction, CompositeFraction, Imaginary, Complex, 
    Numeric, Formattable, BoolConvertible, amNumber, 
    Stream, StreamBuffer, Stack, Queue, CircularBuffer, TreeNode, Tree }
