export const MIN_PASSWORD_LENGTH = 8

export interface PasswordChecks {
  length: boolean
  mixedCase: boolean
  number: boolean
  symbol: boolean
}

export function checkPassword(pw: string) {
  const checks: PasswordChecks = {
    length: pw.length >= MIN_PASSWORD_LENGTH,
    mixedCase: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  }
  const extras = [checks.mixedCase, checks.number, checks.symbol].filter(Boolean).length

  let score = 0
  if (pw.length > 0) score = 1
  if (checks.length) score = Math.min(4, 1 + extras + (pw.length >= 12 ? 1 : 0))

  const label = !pw ? '' : !checks.length ? 'Too short' : ['', 'Weak', 'Fair', 'Good', 'Strong'][score]
  const acceptable = checks.length && score >= 3
  return { checks, score, label, acceptable }
}

export const PASSWORD_RULE_TEXT =
  'Use 8+ characters with at least two of: upper & lower case, a number, a symbol.'
