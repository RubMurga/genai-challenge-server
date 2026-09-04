export function postLoginPath(searchParams: URLSearchParams) {
  const callbackUrl = searchParams.get("callbackUrl")
  return callbackUrl?.startsWith("/") ? callbackUrl : "/onboarding"
}

export function socialCallbackURL(searchParams: URLSearchParams) {
  return `${window.location.origin}${postLoginPath(searchParams)}`
}

export function socialErrorCallbackURL() {
  return `${window.location.origin}/`
}
