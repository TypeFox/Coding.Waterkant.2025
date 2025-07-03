import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { SemiformalWebAppsAstType, Person } from './generated/ast.js';
import type { SemiformalWebAppsServices } from './semiformal-web-apps-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SemiformalWebAppsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SemiformalWebAppsValidator;
    const checks: ValidationChecks<SemiformalWebAppsAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SemiformalWebAppsValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
