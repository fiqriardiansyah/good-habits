export const breakPoints = {
    sm: 600,
    md: 900,
    lg: 1300
}

export const mediaQueries = key => {
    return style => `@media (max-width: ${breakPoints[key]}px){${style}}`
}