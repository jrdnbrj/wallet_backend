import fs from "fs";

export function loadEmailTemplate(
  filePath: string,
  variables: Record<string, string>
): string {
  try {
    let template = fs.readFileSync(filePath, "utf8");

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, variables[key]);
    });

    return template;
  } catch (error) {
    console.error("Error loading email template:", error);
    throw new Error("Failed to load email template");
  }
}
