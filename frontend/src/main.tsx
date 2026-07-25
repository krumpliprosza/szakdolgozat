import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from "./components/color-mode.tsx"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
