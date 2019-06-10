import { Expectation, ExpectationMet } from '@serenity-js/assertions';
import { Answerable, AnswersQuestions, Duration, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { BrowseTheWeb } from '../abilities';

export class Wait {
    static Default_Timeout = Duration.ofSeconds(5);

    static for(duration: Answerable<Duration>): Interaction {
        return new WaitFor(duration);
    }

    static upTo(duration: Duration) {
        return {    // esdoc doesn't understand the fat arrow notation with generics, hence this 'function' here
            until: function until<Actual>(actual: Answerable<Actual>, expectation: Expectation<any, Actual>): Interaction {
                return new WaitUntil(actual, expectation, duration);
            },
        };
    }

    static until<Actual>(actual: Answerable<Actual>, expectation: Expectation<any, Actual>): Interaction {
        return new WaitUntil(actual, expectation, Wait.Default_Timeout);
    }
}

/**
 * @package
 */
class WaitFor extends Interaction {
    constructor(private readonly duration: Answerable<Duration>) {
        super();
    }

    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        return actor.answer(this.duration).then(duration => BrowseTheWeb.as(actor).sleep(duration.inMilliseconds()));
    }

    toString(): string {
        return formatted`#actor waits for ${ this.duration }`;
    }
}

/**
 * @package
 */
class WaitUntil<Actual> extends Interaction {
    constructor(
        private readonly actual: Answerable<Actual>,
        private readonly expectation: Expectation<any, Actual>,
        private readonly timeout: Duration,
    ) {
        super();
    }

    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        const
            actual = this.actual,
            expectation = this.expectation.answeredBy(actor);

        return BrowseTheWeb.as(actor).wait(function () {
                return actor.answer(actual)
                    .then(act => {
                        return expectation(act).then(outcome => outcome instanceof ExpectationMet);
                    });
            },
            this.timeout.inMilliseconds(),
        ).then(_ => void 0);
    }

    toString(): string {
        return formatted`#actor waits up to ${ this.timeout } until ${ this.actual } does ${ this.expectation }`;
    }
}