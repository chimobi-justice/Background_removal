import { Header } from './components/header';
import { Footer } from './components/footer';
import { BackgroundRemover } from './components/RemoveBackground';

function App() {
  return (
    <div className="app">
      <Header />
      <BackgroundRemover />
      <Footer />
    </div>
  )

}

export default App;
