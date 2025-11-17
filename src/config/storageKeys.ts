export const keys = {
  interestPoints: "interest-points",
} as const

export type Keys = (typeof keys)[keyof typeof keys]
