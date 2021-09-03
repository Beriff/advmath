import { amNumber } from './am_types'

abstract class Set<Type extends amNumber> {
    protected list: Type[]
    protected rule: (elem: Type) => boolean
    public abstract IsIn(element: Type): boolean
}

class InfiniteSet<Type extends amNumber> extends Set<Type> {
    public IsIn(element: Type): boolean {
        throw new Error('Method not implemented.')
    }
    
}

class FiniteSet<Type extends amNumber> extends Set<Type> {

    constructor(r: (elem: Type) => boolean, higher_order_set: InfiniteSet<Type> | FiniteSet<Type>) {
        super()
        this.rule = r
    }

    public IsIn(element: Type): boolean {
        throw new Error('Method not implemented.')
    }

}