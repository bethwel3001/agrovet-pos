import Nav from './components/Nav'
import Hero from './components/Hero'
import Conversation from './components/Conversation'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Compliance from './components/Compliance'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import Closer from './components/Closer'
import Footer from './components/Footer'
import Toast from './components/Toast'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Conversation />
        <Problem />
        <HowItWorks />
        <Features />
        <Compliance />
        <Pricing />
        <Faq />
        <Closer />
      </main>
      <Footer />
      <Toast />
    </>
  )
}
