import { Character } from "./Character";
import type { Weapon } from "./Weapon";

export class Warrior extends Character {

    public static readonly RAGE_MULTIPLIER:number = 1.5;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number){
        super(name, health, baseAttack, baseDefense);
    }

    public isEnraged():boolean{
        return this.health < (this.maxHealth/2 )
    }

    public override getAttack(): number {
        let attack = this.baseAttack + this.getWeaponAttackBonus();
        if(this.isEnraged()){
            attack = attack * Warrior.RAGE_MULTIPLIER
        }
        return Math.floor(attack);
    }

    public override canEquip(weapon: Weapon): boolean {
        return (weapon.kind === "staff")?(false):(true);
    }

    public override describe(): string {
        const string ="[Warrior] "+super.describe()  + (this.isEnraged()?" - enraged":'')
        return string;
    }
}