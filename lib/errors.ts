/** Maps Postgres exception messages raised by our RPCs to customer-friendly copy. */
export function friendlyError(message: string | undefined): string {
  const m = message ?? ''
  if (m.includes('not_authenticated')) return 'Please sign in to continue.'
  if (m.includes('insufficient_stock')) return `Sorry — ${m.split('insufficient_stock:')[1]?.trim() || 'an item'} doesn't have enough stock left.`
  if (m.includes('unavailable:')) return `${m.split('unavailable:')[1]?.trim() || 'An item'} is no longer available.`
  if (m.includes('address_required')) return 'A delivery address is required for delivery orders.'
  if (m.includes('contact_required')) return 'Please add your name and phone number.'
  if (m.includes('empty_cart')) return 'Your cart is empty.'
  if (m.includes('slot_taken')) return 'That time was just taken. Please pick another slot.'
  if (m.includes('slot_in_past')) return 'That time has already passed.'
  if (m.includes('service_unavailable')) return 'That service is not available right now.'
  if (m.includes('staff_unavailable')) return 'That artist is not available right now.'
  if (m.includes('cannot_cancel')) return 'This appointment can no longer be cancelled.'
  return 'Something went wrong. Please try again.'
}
