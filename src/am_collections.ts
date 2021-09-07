import { Int, Modulus } from './am_types'

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
    public Level: number;

    constructor (parent: TreeNode<T> = null, value: T) {
        if (!(parent == null)) {
            this.Parent = parent;
            this.Parent.Children.push(this);
            this.Level = parent.Level + 1;
        } else {this.Level = 0};
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

    public Degree(): number {
        return this.Children.length;
    }

    public HasSubchild(subchild: TreeNode<T>): boolean {
        this.ForEach((node) => {
            if (node == subchild) {
                return true;
            }
        })
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
    public Degree(): number {
        let degree: number = 0;
        this.Root.ForEach(function (i) {i.Degree() > degree ? degree = i.Degree() : () => {}});
        return degree;
    }

    public Height(): number {
        let height: number = 0
        this.Root.ForEach(function (i) {i.Level > height ? height = i.Level : () => {}});
        return height;
    }
}

export { amArray, Stack, Queue, CircularBuffer, TreeNode, Tree }