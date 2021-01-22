import styled from 'styled-components'

const DealerCards = styled.img.attrs(props => ({
    className: props.className,
}))`
   & .test {
        border: 5px solid black;
    }

    width: 100px;
    height: 100%;
    opacity: 0;
    &:first-child{
        opacity: 1
    }
    
    

`

export default DealerCards