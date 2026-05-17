export function opensContactTargetInCurrentTab(href: string) {
  return href.startsWith('mailto:') || href.startsWith('tel:')
}

export function getContactTargetWindowTarget(href: string) {
  return opensContactTargetInCurrentTab(href) ? '_self' : '_blank'
}
