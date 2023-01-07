import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ChakraProvider, extendTheme, theme as origTheme } from '@chakra-ui/react'

const chakraTheme = extendTheme({ 
  fonts: {
    heading: 'monospace'
  },
  components: {
    Alert: {
      variants: {
        solid: (props: any) => {
          const { colorScheme } = props
          if (colorScheme !== 'blue') {
            // @ts-expect-error niet zo piepen
            return origTheme.components.Alert.variants.solid(props)
          }
          return {
            container: {
              bg: 'purple.500',
            },
          }
        }
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={chakraTheme}>
      <App/>
    </ChakraProvider>    
  </React.StrictMode>
)
