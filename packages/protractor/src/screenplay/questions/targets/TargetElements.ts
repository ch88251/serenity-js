import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { ElementArrayFinder, ElementFinder, Locator } from 'protractor';
import { BrowseTheWeb } from '../../abilities';
import { RelativeQuestion } from '../RelativeQuestion';
import { override } from './override';
import { TargetNestedElements } from './TargetNestedElements';

/**
 * @public
 */
export class TargetElements
    implements Question<ElementArrayFinder>, RelativeQuestion<Question<ElementFinder> | ElementFinder, ElementArrayFinder>
{
    constructor(
        private readonly description: string,
        private readonly locator: Locator,
    ) {
    }

    of(parent: Question<ElementFinder> | ElementFinder) {
        return new TargetNestedElements(parent, this);
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  answer this {@link @serenity-js/core/lib/screenplay~Question}.
     *
     * @param {AnswersQuestions & UsesAbilities} actor
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     */
    answeredBy(actor: AnswersQuestions & UsesAbilities): ElementArrayFinder {
        return override(
            BrowseTheWeb.as(actor).locateAll(this.locator),
            'toString',
            this.toString.bind(this),
        );
    }

    /**
     * Description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Question}.
     */
    toString() {
        return `the ${ this.description }`;
    }
}
