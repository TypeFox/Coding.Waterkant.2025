/**
 * Substitutes variables in a template with their corresponding values.
 * Variables are enclosed in double curly braces {{variable_name}}.
 * 
 * @param template - The template string to substitute variables in
 * @param data - An object containing the variable names and their corresponding values
 * @returns The template string with the variables substituted
 */
export function substituteVariables(template: string, data: Record<string, string>) {
  // naive implementation, only supports one level of nesting and no conditional logic
  return template.replace(/{{(.*?)}}/g, (_, p1) => data[p1] || '');
}
