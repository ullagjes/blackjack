import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box; 
    }

    html,
    body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-size: 16px;
        font-family: sans-serif;
    }
`

export default GlobalStyle