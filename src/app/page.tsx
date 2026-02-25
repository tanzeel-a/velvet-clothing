import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Collection from '@/components/Collection';
import About from '@/components/About';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Collection />
      <About />
      <Newsletter />
      <Footer />
    </main>
  );
}
