
export function scrollIntoview(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function setListener(eventType: string, callback: any) {
  document.addEventListener(eventType, callback, false);
}

export function removeClassFromHtml(className: string) {
  document.documentElement.classList.remove(className);
}

export function addClassToHtml(className: string) {
  document.documentElement.classList.add(className);
}