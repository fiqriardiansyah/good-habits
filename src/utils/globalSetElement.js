import Styled from 'styled-components';

const StyleBasic = (element) => {
    const Container = Styled(element)`
        width: ${props => props.width};
        height: ${props => props.height};
        max-width: ${props => props.maxWidth};
        max-height: ${props => props.maxHeight};
        min-width: ${props => props.minWidth};
        min-height: ${props => props.minHeight};
        position: ${props => props.position};
        left: ${props => props.left};
        top: ${props => props.top};
        right: ${props => props.right};
        bottom: ${props => props.bottom};
        background-color: ${props => props.bgColor};
        border: ${props => props.border};
        border-radius: ${props => props.borderRadius};
        margin: ${props => props.margin};
        padding: ${props => props.padding};
        color: ${props => props.color};
        font-size: ${props => props.fontSize};
        opacity: ${props => props.opacity};
        box-shadow: ${props => props.boxShadow};
        transition: ${props => props.transition};
        background-image: ${props => props.bgImage};
        font-family: ${props => props.fontFamily};
        overflow-x: ${props => props.overflowX};
        overflow-y: ${props => props.overflowY};
        cursor: ${props =>props.cursor};
        text-align: ${props => props.textAlign};
        background-image: ${props => `url('${props.bgImage}')`};
        background-position: ${props => props.bgPosition};
        background-attachment: ${props => props.bgAttachment};
        background-size: ${props => props.bgSize};
        backdrop-filter: ${props => props.backdropFilter};
        transform: ${props => props.transform};
        z-index: ${props => props.zIndex};
        border-left: ${props => props.borderLeft};
        border-right: ${props => props.borderRight};
        border-top: ${props => props.borderTop};
        border-bottom: ${props => props.borderBottom};
        pointer-events: ${props => props.pointerEvents};
        border: ${props => props.border};

        display: ${props => props.display};
        justify-content: ${props => props.justifyContent};
        align-items: ${props => props.alignItems};
        flex-direction: ${props => props.flexDirection};
        flex: ${props => props.flex};
        justify-self: ${props => props.justifySelf};
        align-self: ${props => props.alignSelf};
        flex-basis: ${props => props.flexBasis};

        grid-template-rows: ${props => props.gridTemplateRows};
        grid-template-columns: ${props => props.gridTemplateColumns};
        grid-gap: ${props => props.gridGap};
        grid-row: ${props => props.gridRow};
        grid-column: ${props => props.gridColumn};

        filter: ${props => props.filter};

        ${props => props.mediaQueries };

        :hover{
            background-color: ${props => props.hoverBgColor};
            color: ${props => props.hoverColor};
            opacity: ${props => props.hoverOpacity};
        }
    `

    return Container;
}
// grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

export {
    StyleBasic
}