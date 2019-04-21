
export default function scrollIntoview(_elementId: string) {
  console.log('scrolling');
}

export function setListener(_eventType: string, _callback: () => {}) {
  console.log('adding listener');
}

export function removeClassFromHtml(className: string) {
  console.log('removing ', className);
}

export function addClassToHtml(className: string) {
  console.log('adding ', className);
}