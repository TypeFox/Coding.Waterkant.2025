import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { SemiformalWebAppsAstType, Model } from './generated/ast.js';
import type { SemiformalWebAppsServices } from './semiformal-web-apps-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SemiformalWebAppsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SemiformalWebAppsValidator;
    const checks: ValidationChecks<SemiformalWebAppsAstType> = {
        Model: validator.checkTechStack
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SemiformalWebAppsValidator {

    checkTechStack(model: Model, accept: ValidationAcceptor): void {
        if (model.techstack) {
            const { techstack } = model;
            techstack.forEach(tech => {
                if (tech === '') {
                    accept('warning', 'A tech stack definitioncannot be empty.', { node: model, property: 'techstack' });
                }
            });
        }
    }

}
