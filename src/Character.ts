import type { Weapon } from "./Weapon";

export abstract class Character{

    public readonly name:string;
    public readonly maxHealth:number;
    public readonly baseAttack:number;
    public readonly baseDefense:number;

    private _health:number;
    private _weapon:Weapon | null;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number){
        if(health <= 0){
            throw new Error(`The health of ${name} must be strictly positive.`);
        }

        this.name = name;
        this.maxHealth = health;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;

        this._health = this.maxHealth;
        this._weapon = null;
    }

    public get health():number{
        return this._health;
    }

    public abstract getAttack():number;
    public abstract canEquip(weapon: Weapon):boolean;

    protected getWeaponAttackBonus():number{
        if(this._weapon === null){
            return 0;
        }
        return this._weapon.attackBonus;
    }

    public isAlive():boolean{
        return this._health > 0;
    }

    public describe():string{
        const weapon = (this._weapon === null)?("none"):(this._weapon.name)
        const attack = this.getAttack();
        return `${this.name} - health ${this._health}/${this.maxHealth} - attack ${attack} - defense ${this.baseDefense} - weapon: ${weapon}`;
    }

    public equip(weapon: Weapon): void{
        if(!this.canEquip(weapon)){
            throw new Error(`${this.name} cannot equip ${weapon.name}`);
        }

        this._weapon = weapon;
    }

    public takeDamage(amount:number):void{
        // this._health = Math.min(this._health - amount, 0);
        this._health -=amount;
        if(this._health <0)this._health = 0
    }

    public heal(amount:number):void{
        // this._health = Math.max(this._health + amount, this.maxHealth);
        this._health +=amount;
        if(this._health > this.maxHealth)this._health = this.maxHealth
    }

    protected computeDamage(target:Character):number{
        const attack = this.getAttack();
        const damage = (attack - target.baseDefense < 0)?(0):(attack - target.baseDefense)
        // return Math.min(0, this.baseAttack - target.baseDefense)
        return damage;

    }

    public attack(target:Character){
        if(this === target){
            throw new Error(`${this.name} cannot attack themselves.`);
        }

        if(!this.isAlive()){
            throw new Error(`${this.name} is KO and cannot attack.`);
        }

        if(!target.isAlive()){
            throw new Error(`${target.name} is already KO.`);
        }

        const damage = this.computeDamage(target);
        target.takeDamage(damage);

        console.log(`${this.name} hits ${target.name} for ${damage} damage (${target.name}: ${target._health}/${target.maxHealth}).`)

        if(!target.isAlive()){
            console.log(`${target.name} is KO!`);
        }

        return damage;
    }
}