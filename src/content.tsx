import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Content } from './content/index'

console.log(`text`)

const appContainer = document.createElement('div');
appContainer.id = 'my-extension-root';
document.body.appendChild(appContainer);

createRoot(appContainer!).render(
  <StrictMode>
    <Content />
  </StrictMode>,
)
