export const showFormAlert = (success: boolean, message: string): HTMLElement => {
  const alert = document.createElement('form-alert');
  alert.setAttribute('alertType', success ? 'success' : 'error');
  alert.setAttribute('alertMessage', message);
  return alert;
}