export const extractFormData = <T extends Record<string, any>>(form: HTMLFormElement): T => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()) as T;
  return data;
};