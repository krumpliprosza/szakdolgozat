import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from "./components/ui/color-mode"
import { BrowserRouter } from 'react-router-dom'
/*
export const Usage = () => {
  const { locale, dir } = useLocaleContext()
  return <pre>{JSON.stringify({ locale, dir }, null, 2)}</pre>
}
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        {/* <LocaleProvider locale="hu-HU"> */}
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        {/* </LocaleProvider> */}
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
