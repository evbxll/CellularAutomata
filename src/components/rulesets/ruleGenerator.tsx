import assert from 'assert'

class TwoBitCellularAutomatonRuleSet {
    private readonly rule: number;
    private readonly ruleData: number[] = [];

    constructor(rule: number){
        assert(rule >= 0 && rule < 2**9)
        this.rule = rule;
    }

    public getChange(cells : number[] & { length: 9 }): number{
        //convert to binary, then index, then get output value
        return 0;
    }
}