/**
 * Privacy-first telemetry shim.
 *
 * The upstream project posted persistent visitor identifiers, answers and
 * results to an external analytics endpoint. This customer-facing edition is
 * intentionally local-only: these exports preserve the existing call sites
 * while performing no storage or network activity.
 */

export function resetTelemetryQuizRun(..._args: unknown[]): void {}
export function trackPageView(..._args: unknown[]): void {}
export function beginQuizRun(..._args: unknown[]): void {}
export function trackQuizProgress(..._args: unknown[]): void {}
export function trackQuizComplete(..._args: unknown[]): void {}
export function trackResultView(..._args: unknown[]): void {}
export function trackShareImageOpen(..._args: unknown[]): void {}
export function trackExplainAiClick(..._args: unknown[]): void {}
