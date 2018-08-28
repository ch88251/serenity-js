import { Path } from '@serenity-js/core/lib/io';

import { FeatureFileMap } from './FeatureFileMap';
import { FeatureFileMapper } from './FeatureFileMapper';
import { FeatureFileParser } from './FeatureFileParser';

export class FeatureFileLoader {
    constructor(
        private readonly parser: FeatureFileParser,
        private readonly mapper: FeatureFileMapper,
        private readonly cache: WeakMap<Path, FeatureFileMap> = new WeakMap(),
    ) {
    }

    load(path: Path): Promise<FeatureFileMap> {
        if (this.cache.has(path)) {
            return Promise.resolve(this.cache.get(path));
        }

        return this.parser.parse(path)
            .then(document => this.mapper.map(document, path))
            .then(map => {
                this.cache.set(path, map);
                return this.cache.get(path);
            });
    }
}