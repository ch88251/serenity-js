import { Tag } from '../Tag';

export class ManualTag extends Tag {
    static readonly Type = 'External Tests';

    constructor(name: string = 'Manual') {  // parametrised constructor to make all tag constructors compatible
        super(name, ManualTag.Type);
    }
}