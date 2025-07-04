import type { Model } from '../language/generated/ast.js';
import type { SemiformalWebAppsServices } from '../language/semiformal-web-apps-module.js';

export function generateJSON(model: Model, filePath: string, destination: string | undefined, services: SemiformalWebAppsServices): string {
    const json = services.serializer.JsonSerializer.serialize(model, {
        comments: true,
        space: 4
    });
    return json;
}
